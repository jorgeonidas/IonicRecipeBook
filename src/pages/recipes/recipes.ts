import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, PopoverController, AlertController } from 'ionic-angular';
import { EditRecipePage } from '../edit-recipe/edit-recipe';
import { Recipe } from '../../models/recipe';
import { RecipesService } from '../../services/recipes';
import { RecipePage } from '../recipe/recipe';
import { AuthService } from '../../services/auth';
import { DatabaseOptionsPage } from '../database-options/database-options';

@IonicPage()
@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage {

 
  recipesList: Recipe[];

  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public rcpService: RecipesService,
              private loadingCtrl: LoadingController,
              private popoverCtrl: PopoverController,
              private authService: AuthService,
              private alertCtrl: AlertController) {
  }

  ionViewWillEnter(){
    this.loadRecipes();
  }

  loadRecipes(): any {
    this.recipesList = this.rcpService.getRecipes();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecipesPage');
  }

  onNewRecipe(){
    this.navCtrl.push(EditRecipePage, {mode:'New'}); //Nueva receta
  }

  onShowRecipe(recipe: Recipe, index: number){
     console.log('click');
     //nav controler puede mandar varias propiedades a la vez en forma de objeto
     this.navCtrl.push(RecipePage,{recipe: recipe, index: index});
  }

  onShowOptions(event: MouseEvent){
    const loading = this.loadingCtrl.create({
      content: 'Please Waint...'
    });
    //PopoverControler solo recibe la pagina que vas a desplegar
    const popover = this.popoverCtrl.create(DatabaseOptionsPage);
    popover.present({ev: event});
    popover.onDidDismiss(data=>
      {
        //Si se hizo click fuera del popover
        if(!data){
          return;
        }
        if(data.action == 'load'){
          loading.present();
          this.authService.getActiveUser().getIdToken() //getIdToken() devuelve una promesa en caso de ser exitosa (then()) gardaremos la data (atributo: tipo)=>{cuerpo de la funcion}
              .then((token: string)=>{ 
                this.rcpService.fetchList(token)
                .subscribe(
                    (list: Recipe[])=>{ //subscripcion exitosa
                      loading.dismiss();
                      if(list){
                        this.recipesList = list; //reemplaza la lista en caso de que no este vacia
                      }else{
                        this.recipesList = [];
                      }
                    },
                  error =>{
                    loading.dismiss();
                    this.handleError(error.json().error); //tenemos que pasar el cuerpo del error                
                  }
                );
              });
        }else if(data.action == 'store'){
          loading.present();
          this.authService.getActiveUser().getIdToken() //getIdToken() devuelve una promesa en caso de ser exitosa (then()) gardaremos la data (atributo: tipo)=>{cuerpo de la funcion}
              .then((token: string)=>{
                this.rcpService.storeList(token)
                .subscribe(
                    ()=>loading.dismiss(),
                  error =>{
                    loading.dismiss(); 
                    this.handleError(error.json().error);           
                  }
                );
              });
        }
      }
      );
  }
  
  private handleError(errorMessage: string){
    const alert =  this.alertCtrl.create({
      title: 'Error Ocurred!', 
      message: errorMessage,
      buttons: ['ok']
    });
    alert.present();
  }

}
