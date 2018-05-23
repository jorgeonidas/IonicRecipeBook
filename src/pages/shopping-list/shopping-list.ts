import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, PopoverController, LoadingController, AlertController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import {ShoppingListService} from '../../services/shopping-list';
import { Ingredient } from '../../models/ingredient';
import { ManageIngredientPage } from '../manage-ingredient/manage-ingredient';
import { DatabaseOptionsPage } from '../database-options/database-options';
import { AuthService } from '../../services/auth';


@IonicPage()
@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage{
  
  
  items : Ingredient[];
  
  constructor(private slService: ShoppingListService,
              private modalCtrl: ModalController,
              private navParams: NavParams, 
              private popoverCtrl: PopoverController,
              private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController){}

  //cargar la lista antes de renderizar la pagina
  ionViewWillEnter(){
    this.loadItems();
  }

  onAddItem(form: NgForm){
    //console.log(form.value.ingredient+" "+form.value.ammount);
    this.slService.addIngredient(form.value.ingredient, form.value.ammount);
    form.reset();
    this.loadItems(); 
  }

  onCheckItem(index: number){
    console.log("click ");
    this.slService.removeIngredient(index);
    this.loadItems();
    //const modal = this.modalCtrl.create(ManageIngredientPage, this.items[index]);
    //modal.present();

  }

  //actualiza la lista de items
  private loadItems(){
    this.items = this.slService.getIngredientList();
    console.log(this.items); 
  }
  //necesitamos pasar el evcento para que la funcion present(ev: event) deduzca la posicion donde se debe ubicar el popover
  onShowOptions(event: MouseEvent){
    const loading = this.loadingCtrl.create({
      content: 'Please Waint...'
    });
    //PopoverControler solo recibe la pagina que vas a desplegar
    const popover = this.popoverCtrl.create(DatabaseOptionsPage);
    popover.present({ev: event});
    popover.onDidDismiss(data=>
      {
        if(!data){
          return;
        }
        if(data.action == 'load'){
          loading.present();
          this.authService.getActiveUser().getIdToken() //getIdToken() devuelve una promesa en caso de ser exitosa (then()) gardaremos la data (atributo: tipo)=>{cuerpo de la funcion}
              .then((token: string)=>{ 
                this.slService.fetchList(token)
                .subscribe(
                    (list: Ingredient[])=>{ //subscripcion exitosa
                      loading.dismiss();
                      if(list){
                        this.items = list; //reemplaza la lista en caso de que no este vacia
                      }else{
                        this.items = [];
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
                this.slService.storeList(token)
                .subscribe(
                    ()=>loading.dismiss(),
                  error =>{
                    loading.dismiss(); 
                    this.handleError(error.json().error);           
                  }
                );
              });
        }else{
          return;
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
