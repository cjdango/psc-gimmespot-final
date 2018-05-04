import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { TabPage } from '../tab/tab';

import { AuthProvider } from '../../providers/auth/auth';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  email: string;
  password: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authProvider: AuthProvider
  ) {

  }

  handleOnRegister() {
    this.navCtrl.push(RegisterPage);
  }

  emailLogin() {
    this.authProvider.emailLogin(this.email, this.password);
  }

  facebookLogin() {
    this.authProvider.facebookLogin();
  }

}
