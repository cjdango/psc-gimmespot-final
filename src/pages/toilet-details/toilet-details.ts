import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

import { ConvoPage } from '../convo/convo';
import { ReviewsPage } from '../reviews/reviews';
import { AuthProvider } from '../../providers/auth/auth';
import { ToiletProvider } from '../../providers/toilet/toilet';

import GeoFire from 'geofire';
import { AngularFireDatabase } from 'angularfire2/database';
import { Geolocation } from '@ionic-native/geolocation';
import { ProfilePage } from '../profile/profile';

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

  status: string;

  geofire: GeoFire;

  isOwner: boolean;

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

    this.isOwner = this.toilet.owner_id === authProvider.currentUserId;

    this.isReservedObservable = toiletProvider
      .getToiletById(this.navParams.get('hit').key)
      .subscribe(t => {
        this.isReserved = !!t.reserved_by;
        this.status = t.status;
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
      reserved_by: this.authProvider.currentUserId,
      guestName: this.authProvider.currentUserDisplayName,
      status: 'Reserved'
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
              geoQuery.cancel();
            });
          }
        }
      ]
    });
    alert.present();
  }

  onConvoPage() {
    this.navCtrl.push(ConvoPage, { other_uid: this.toilet.owner_id, from_toilet: true });
  }

  onReviewsPage() {
    const toiletKey = this.navParams.get('hit').key;
    this.navCtrl.push(ReviewsPage, {
      review_type: 'toilet_reviews',
      item_id: toiletKey,
      host_id: this.navParams.get('hit').toilet.owner_id
    });
  }

  onProfilePage() {
    this.navCtrl.push(ProfilePage, {
      from_toilet: true,
      host_id: this.navParams.get('hit').toilet.owner_id
    });
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
