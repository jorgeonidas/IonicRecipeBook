import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageIngredientPage } from './manage-ingredient';

@NgModule({
  declarations: [
    ManageIngredientPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageIngredientPage),
  ],
})
export class ManageIngredientPageModule {}
