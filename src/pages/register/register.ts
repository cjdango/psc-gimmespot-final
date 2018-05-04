import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  email: string;
  password: string;
  displayName: string;

  constructor(
    public navCtrl: NavController,
    public authProvider: AuthProvider
  ) {

  }

  handleOnLogin() {
    this.navCtrl.pop();
  }

  emailSignUp() {
    this.authProvider.emailSignUp(this.email, this.password, this.displayName, this.navCtrl);
  }

}
