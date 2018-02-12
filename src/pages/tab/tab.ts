import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ListPage } from '../list/list';
import { MapPage } from '../map/map';
import { PicturePage } from '../picture/picture';

/**
 * Generated class for the TabPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tab',
  templateUrl: 'tab.html'
})
export class TabPage {

  listRoot = ListPage
  mapRoot = MapPage
  pictureRoot = PicturePage


  constructor(public navCtrl: NavController) {}

}
