import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { TabPage } from '../tab/tab';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.navCtrl.push(TabPage)
  }

}
