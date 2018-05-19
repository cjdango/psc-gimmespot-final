import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

import { ConvoPage } from '../convo/convo';
import { ReviewsPage } from '../reviews/reviews';
import { AuthProvider } from '../../providers/auth/auth';
import { ToiletProvider } from '../../providers/toilet/toilet';

import GeoFire from 'geofire';
import { AngularFireDatabase } from 'angularfire2/database';
import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the ToiletDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-toilet-details',
  templateUrl: 'toilet-details.html',
})
export class ToiletDetailsPage {
  rating: number = 4;
  toilet: any;
  photoURL: string = 'assets/imgs/logo.png';

  isReserved: boolean;

  isReservedObservable: any;

  posSubscriber: any;
  posObservable: any;

  geofire: GeoFire;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public authProvider: AuthProvider,
    public toiletProvider: ToiletProvider,
    public db: AngularFireDatabase,
    public geolocation: Geolocation,
    public alertCtrl: AlertController
  ) {
    this.toilet = navParams.get('hit').toilet;
    this.photoURL = navParams.get('hit').photoURL;

    this.isReservedObservable = toiletProvider
      .getToiletById(this.navParams.get('hit').key)
      .subscribe(t => {
        this.isReserved = !!t.reserved_by;
        console.log('isReserved:', this.isReserved)
      });

    this.geofire = new GeoFire(db.list('/running_men').query.ref);
  }

  ionViewWillLeave() {
    this.isReservedObservable.unsubscribe();
  }

  reserve() {
    // update db
    const toiletKey = this.navParams.get('hit').key;
    this.toiletProvider.updateToilet(toiletKey, {
      reserved_by: this.authProvider.currentUserId
    });

    this.presentConfirm();
  }

  private presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Share Distance?',
      message: 'The host will be notified when you are 30m away from the toilet',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Share',
          handler: () => {
            console.log(this.navParams.get('hit'))

            const toiletKey = this.navParams.get('hit').key;
            this.posObservable = this.geolocation.watchPosition({ enableHighAccuracy: true });

            this.posSubscriber = this.posObservable.subscribe(pos => {
              this.geofire.set(toiletKey, [pos.coords.latitude, pos.coords.longitude]);
            });

            const geoQuery = this.geofire.query({
              radius: .03,
              center: this.navParams.get('hit').location
            });
            geoQuery.on('key_entered', (key, location, distance) => {
              this.posSubscriber.unsubscribe();
              this.geofire.remove(key);
              geoQuery.cancel();

            });
          }
        }
      ]
    });
    alert.present();
  }

  onConvoPage() {
    this.navCtrl.push(ConvoPage);
  }

  onReviewsPage() {
    this.navCtrl.push(ReviewsPage);
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
