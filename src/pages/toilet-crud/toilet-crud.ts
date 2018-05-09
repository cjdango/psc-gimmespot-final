import { Component } from '@angular/core';
import { ActionSheetController, Platform, NavController } from 'ionic-angular';
import { ToiletFormPage } from '../toilet-form/toilet-form';
import { ReviewsPage } from '../reviews/reviews';

import { Observable } from 'rxjs/Observable';
import { ToiletProvider } from '../../providers/toilet/toilet';
import { MapProvider } from '../../providers/map/map';

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
  myToilets: Observable<any[]>;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public navCtrl: NavController,
    public toiletProvider: ToiletProvider,
    public mapProvider: MapProvider
  ) {
    this.myToilets = toiletProvider.getUserToilets();
  }

  addToilet() {
    this.navCtrl.push(ToiletFormPage, { title: 'Add Toilet' });
  }

  updateToilet(key: string) {
    this.navCtrl.push(ToiletFormPage, { title: 'Edit Toilet', toiletKey: key });
  }

  deleteToilet(key: string){
    this.toiletProvider.deleteToilet(key);
    this.mapProvider.removeMarker(key);
  }

  viewReviews() {
    this.navCtrl.push(ReviewsPage)
  }

}