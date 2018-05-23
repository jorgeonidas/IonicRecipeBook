import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthService, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  onSignup(form: NgForm){
    console.log(form.value);
    const loadingDialog = this.loadingCtrl.create({
      content: 'Signing You Up!'
    });
    loadingDialog.present();//presento el loading hasta que pase algo

    this.authService.signup(form.value.email, form.value.password)
        .then(data =>{ 
          loadingDialog.dismiss();
        })  //then, si el Promise fue exitoso
        .catch(error => {
          loadingDialog.dismiss();
          const alert = this.alertCtrl.create({
            title: 'Signup Failed!',
            message: error.message,
            buttons: ['Ok'] //solo un boton cuya accion por defecto es dissmis
          })
          alert.present();
        }); //si por alguna razon falla         
  }
}
