import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from '../pages/signup/signup';
import firebase from 'firebase';
import { AuthService } from '../services/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;
  signinPage = SigninPage;
  signupPage = SignupPage;
  isAuthenticaded = false;

  @ViewChild('nav') nav: NavController;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private menuCtrl: MenuController, private authService: AuthService) {
    //Inicializa firebase backend
    firebase.initializeApp({
                            apiKey: "AIzaSyDakhPWDLcVBXz54Lhb7k3tIJpWlKG3gvs",
                            authDomain: "ionic-recibebook.firebaseapp.com"
                          });
    firebase.auth().onAuthStateChanged(user => {
      if(user){//autenticado
        this.isAuthenticaded = true;
        this.rootPage= TabsPage; //la raiz de nuestra Pila de navegacion
      }else{//sin autenticar
        this.isAuthenticaded = false;
        this.rootPage = SigninPage;
      }
    }); //Cuando el estado de autenticacion cambia
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  onLoad(page: any){
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }

  onLogout(){
    this.authService.logout();
    this.menuCtrl.close();
    this.nav.setRoot(SigninPage);
  }
}

