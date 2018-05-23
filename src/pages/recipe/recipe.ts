import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Recipe } from '../../models/recipe';
import { EditRecipePage } from '../edit-recipe/edit-recipe';
import { ShoppingListPage } from '../shopping-list/shopping-list';
import { ShoppingListService } from '../../services/shopping-list';
import { RecipesService } from '../../services/recipes';

@IonicPage()
@Component({
  selector: 'page-recipe',
  templateUrl: 'recipe.html',
})
export class RecipePage implements OnInit {
  recipe: Recipe;
  index: number

  ngOnInit(){
    //usamos nav params para inicializar las variables pasandole la respectiva propiedad al metodo get('propiedad')
    this.recipe = this.navParams.get('recipe');
    //console.log("ingredients: "+this.recipe.ingredients);
    
    this.index = this.navParams.get('index');
  }
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private slService: ShoppingListService,
              private recipesService: RecipesService) {}

  onAddIngredients(){
    //this.navCtrl.push(ShoppingListPage,{ingredients: this.recipe.ingredients});
    this.slService.addIngredients(this.recipe.ingredients);
  }

  onEditRecipe(){
    //abro la ventana en modo edicion, la receta a modificar y su respectivo indice
    this.navCtrl.push(EditRecipePage, {mode:'Edit', recipe: this.recipe, index: this.index});
  }

  onDeleteRecipe(){
    this.recipesService.removeRecipe(this.index);
    this.navCtrl.popToRoot();
  }

}
