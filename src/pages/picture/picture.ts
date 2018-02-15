import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, ModalController } from 'ionic-angular';
import { ToiletDetailsPage } from '../toilet-details/toilet-details';

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
    public menuCtrl: MenuController,
    public modalCtrl: ModalController
  ) {
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  showToiletDetails() {
    // do something
   const modal = this.modalCtrl.create(ToiletDetailsPage);
   modal.present();
  }

}
