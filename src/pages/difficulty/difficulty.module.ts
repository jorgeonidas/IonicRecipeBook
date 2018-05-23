import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DifficultyPage } from './difficulty';

@NgModule({
  declarations: [
    DifficultyPage,
  ],
  imports: [
    IonicPageModule.forChild(DifficultyPage),
  ],
})
export class DifficultyPageModule {}
