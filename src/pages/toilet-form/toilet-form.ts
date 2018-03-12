import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ToiletFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-toilet-form',
  templateUrl: 'toilet-form.html',
})
export class ToiletFormPage {
  title: string;
  toilet = {} as {
    name: string;
    cost: number;
    desc: string;
    owner: string;
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.title = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ToiletFormPage');
  }

}
