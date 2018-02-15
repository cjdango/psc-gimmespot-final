import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';

/**
 * Generated class for the PicturePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-picture',
  templateUrl: 'picture.html',
})
export class PicturePage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl: MenuController
  ) {
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

}
