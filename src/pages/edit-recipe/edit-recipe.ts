import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { RecipesService } from '../../services/recipes';
import { Recipe } from '../../models/recipe';
import { Ingredient } from '../../models/ingredient';

@IonicPage()
@Component({
  selector: 'page-edit-recipe',
  templateUrl: 'edit-recipe.html',
})
export class EditRecipePage implements OnInit{
  mode = 'New'; //atributo inicializado por defecto
  selectOptions = ['Easy', 'Medium','Hard']; 
  recipeForm : FormGroup; //Usaremos a la manera Reactiva ( React Approach) /propiedad que guarda el formulario
  //Atributos Modo edicion
  recipe : Recipe;
  index: number;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private recipesService: RecipesService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.mode = this.navParams.get('mode');//atributo pasado por RecipesPage
    if(this.mode== 'Edit'){
      this.recipe = this.navParams.get('recipe');
      //console.log("ingredientes para editar: "+this.recipe.ingredients);   
      this.index = this.navParams.get('index');
    }
    this.initializeForm(); //esta funcion crea el formulario, inicializa y valida
  }

  private initializeForm(){
    //valores en modo 'New'
    let title = null;
    let description = null;
    let difficulty = 'Medium';
    let ingredientsField = [];

    //si el modo es 'Edit' soberscribe los valores por defecto al formulario
    if(this.mode== 'Edit'){
      title = this.recipe.title;
      description = this.recipe.description;
      difficulty = this.recipe.difficulty;
      for(let ing of this.recipe.ingredients){
        //ojo por que no puedo ver otros parametros?
        ingredientsField.push(this.getIngredientFormGroup(ing)); //el formulario esta esperando un FormArrya para guardar los ingredientes
      }
    }
    console.log(ingredientsField);
    
    this.recipeForm = new FormGroup({
      //validaremos el formulario con FormControl(valorPorDecto, Validador)
      'title': new FormControl(title, Validators.required),
      'description': new FormControl(description, Validators.required),
      //aca inicializamos el dropdown basado en algun valor contenido en selectOption
      'difficulty': new FormControl(difficulty, Validators.required),
      //Guarda un arreglo de FormControl, se guardaran los ingredientes
      'ingredients': new FormArray(ingredientsField)
    });
  }

  //ya que una entidad ingrediente tiene sus propios atrubitos es un FormGroup
  private getIngredientFormGroup(ingredient: Ingredient): FormGroup{
    const formGroup = this.formBuilder.group({
      name: new FormControl(ingredient.name, Validators.required),
      ammount: new FormControl(ingredient.ammount, Validators.required)
    });

    return formGroup;
  }

  onManageIngredients(){
    const actionSheet = this.actionSheetCtrl.create({//le pasamos un objeto con las propiedades
      title: 'What do You Want to Do?',
      buttons:[
        {
          text: 'Add Ingredient',
          handler: ()=>{
            this.createNewIngredientAlert().present();
          }
        },
        {
          text: 'Remove All Ingredients',
          role: 'destructive',
          handler: ()=>{
            const fArray : FormArray = <FormArray>this.recipeForm.get('ingredients');
            const len = fArray.length;
            if(len > 0){
              for(let i = len -1 ; i >= 0 ; i--){
                fArray.removeAt(i);//remover cada ingrediente desde el final al comienzo
              }
              this.showToat('All Ingredients Deleted');
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel' //cierra el actionSheet
        }
      ]//nota todos los botones cierran el actionsheet pero ejecutan el handler de primero
    });
    actionSheet.present();
  }

  private createNewIngredientAlert(){
    return this.alertCtrl.create({
      title: 'Add Ingredient',
      inputs: [ //array de inputs con sus propiedades
        {
          name: 'name',
          placeholder: 'name'
        },
        {
          name: 'ammount',
          placeholder: 'ammount'
        }

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: data =>{//la data que el usuario envia por medio de este alert
            if((data.name.trim() == '' || data.name == null) && data.ammount < 1){ //caso fallido
              this.showToat('please enter a valid value and ammount');
              return;
            }
            //cast a FormArray
            //push un formGroup ya que un ingrediente tiene sus propios atrubitos
            (<FormArray>this.recipeForm.get('ingredients')).push(this.getIngredientFormGroup(new Ingredient(data.name, data.ammount)));
            console.log(this.recipeForm);
            this.showToat('Ingredient added!');
          }
        }
      ]
    });

  }
  //Toast!
  showToat(message: string){
    const toast = this.toastCtrl.create({ //toast, se crea pasando un objeto con sus propiedades
      message: message,
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }

  onSubmit(){
    //valores del formulario
    const value = this.recipeForm.value;

    if(this.mode == 'Edit' ){
      this.recipesService.updateRecipe(this.index, value.title, value.description, value.difficulty, value.ingredients); 
    }else{
      this.recipesService.addRecipe(value.title, value.description, value.difficulty, value.ingredients);
    }    
    this.recipeForm.reset();
    this.navCtrl.popToRoot();
  }
  
  debug(formGroup: FormGroup){
    console.log(formGroup['name'].value);
    console.log(formGroup.value);
  }

}
