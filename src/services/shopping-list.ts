import { Ingredient } from "../models/ingredient"; //Clase que manipula el modelo
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth";
import 'rxjs/Rx'; //para usar la operacion map

@Injectable()
export class ShoppingListService{
    private ingredients: Ingredient[] = [];

    constructor(private http: HttpClient, private authService: AuthService ){}

    //nuevo ingrediente
    addIngredient(name: String, ammount: number){
        //console.log("Antes de push = nombre "+name+"; cantidad: "+ammount);
        
        this.ingredients.push(new Ingredient(name, ammount));
        //console.log(this.ingredients);  
    }
    //agregar ingredientes
    addIngredients(items: Ingredient[]){
        this.ingredients.push(...items); //desconstruye el array de items y hazle push de uno a uno 
    }

    //eliminar ingrediente
    removeIngredient(index: number){
        this.ingredients.splice(index,1);
    }

    //obtener una copia del array de ingredientes
    getIngredientList(){
        return this.ingredients.slice()//copia del array
    }

    storeList(token: string){
        const userId = this.authService.getActiveUser().uid;
        //sobreescribe el array de items (urlfirebase/+userid+/archivodatabase.json)    ?auth=token -> query parameter para validar el token
        return this.http.put<Array<Ingredient>>('https://ionic-recibebook.firebaseio.com/'+userId+'/shopping-list.json?auth='+token, this.ingredients);
           /* .map((response: Response) => { desde que se usa httpClien ya no se necesita usar map
                return response.json();
            }); */
    }

    fetchList(token: string){
        const userId = this.authService.getActiveUser().uid;
        return this.http.get<Array<Ingredient>>('https://ionic-recibebook.firebaseio.com/'+userId+'/shopping-list.json?auth='+token)
                        .do((ingredients: Ingredient[]) => {
                            if(ingredients){
                                this.ingredients = ingredients;
                            }else{
                                this.ingredients = [];
                            }                           
                        }); //la data obtenida sobreescribe la lista de ingredientes
    }
}