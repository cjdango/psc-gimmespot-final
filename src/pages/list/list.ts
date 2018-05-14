import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, MenuController, ModalController } from 'ionic-angular';
import { ToiletDetailsPage } from '../toilet-details/toilet-details';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GeoProvider } from '../../providers/geo/geo';
import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the ListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage implements OnDestroy {

  hits: any;
  subscription: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public modalCtrl: ModalController,
    public geoProvider: GeoProvider,
    public geolocation: Geolocation
  ) {

    
  }

  ionViewDidLoad() {
    this.subscription = this.geoProvider.hits.subscribe(hits => {
      this.hits = hits;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  showToiletDetails(hit) {
    // do something
    const modal = this.modalCtrl.create(ToiletDetailsPage, {hit});
    modal.present();
  }

}
