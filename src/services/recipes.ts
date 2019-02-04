import {Recipe} from '../models/recipe';
import { Ingredient } from '../models/ingredient';
import { Injectable } from '@angular/core';
import { AuthService } from './auth';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';

@Injectable()
export class RecipesService{
    private recipes : Recipe[] = [];

    constructor(private http: HttpClient, 
                private authService: AuthService){}

    addRecipe(title: string, 
        description: string, 
        difficulty: string, 
        ingredients: Ingredient[])
    {
        this.recipes.push(new Recipe(title, description, difficulty, ingredients));
        console.log(this.recipes);
        
    }

    getRecipes(){
        return this.recipes.slice();
    }

    updateRecipe(index: number, title: string, description: string, difficulty: string, ingredients: Ingredient[]){
        this.recipes[index] = new Recipe(title, description, difficulty, ingredients);
        console.log(this.recipes);
    }

    removeRecipe(index: number){
        this.recipes.splice(index, 1);
    }

    storeList(token: string){
        const userId = this.authService.getActiveUser().uid;
        return this.http.put<Array<Recipe>>('https://ionic-recibebook.firebaseio.com/'+userId+'/recipes.json?auth='+token, this.recipes);
    }

    fetchList(token: string){
        const userId = this.authService.getActiveUser().uid;
        return this.http.get<Array<Recipe>>('https://ionic-recibebook.firebaseio.com/'+userId+'/recipes.json?auth='+token)
                        .do((recipes: Recipe[]) => {
                            if(recipes){
                                for (let item of recipes) { //voy de recenta en receta preguntando si tiene un arreglo de ingredientes
                                    if (!item.hasOwnProperty('ingredients')) { //si no lo tiene le agrego esa propiedad como un arreglo de ingredientes vacio
                                        item.ingredients = []
                                    }
                                }
                                this.recipes = recipes;//ahora si puedo retornar la el array de recetas con su array de ingredientes asi este vacio
                            }else{
                                this.recipes = [];
                            }
                        });
    }
}