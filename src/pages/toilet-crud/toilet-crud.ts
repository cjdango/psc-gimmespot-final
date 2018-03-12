import { Component } from '@angular/core';
import { ActionSheetController, Platform, NavController } from 'ionic-angular';
import { ToiletFormPage } from '../toilet-form/toilet-form';

/**
 * Generated class for the ToiletCrudPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-toilet-crud',
  templateUrl: 'toilet-crud.html',
})
export class ToiletCrudPage {

  constructor(
    public actionSheetCtrl: ActionSheetController, 
    public platform: Platform,
    public navCtrl: NavController
  ) {
  }

  addToilet() {
    this.navCtrl.push(ToiletFormPage, 'Add Toilet');
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your toilets',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: 'Edit',
          icon: !this.platform.is('ios') ? 'create' : null,
          handler: () => {
            console.log('Archive clicked');
            this.navCtrl.push(ToiletFormPage, 'Edit Toilet')
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

}
