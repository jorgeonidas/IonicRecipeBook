import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth';

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private authService: AuthService, private loadinCtrl: LoadingController, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SigninPage');
  }

  onSignin(form: NgForm){
    const loadingDialog = this.loadinCtrl.create({
      content: 'Signing You In!'
    });
    loadingDialog.present();//presento el loading hasta que pase algo
    console.log(form.value);
    this.authService.signin(form.value.email, form.value.password)
      .then(data => {
        loadingDialog.dismiss();
      })
      .catch(error => {
        loadingDialog.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Error!',
          message: error.message,
          buttons: ['ok']
        })
        alert.present();
      });
  }

}
