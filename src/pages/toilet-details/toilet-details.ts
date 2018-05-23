import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

import { ConvoPage } from '../convo/convo';
import { ReviewsPage } from '../reviews/reviews';
import { AuthProvider } from '../../providers/auth/auth';
import { ToiletProvider } from '../../providers/toilet/toilet';

import { Geolocation } from '@ionic-native/geolocation';
import { ProfilePage } from '../profile/profile';
import { RunningManProvider } from '../../providers/running-man/running-man';

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

  isAvailable: boolean;

  isReservedObservable: any;

  posSubscriber: any;
  posObservable: any;

  status: string;
  statusColor: string;

  isOwner: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public authProvider: AuthProvider,
    public toiletProvider: ToiletProvider,
    public geolocation: Geolocation,
    public alertCtrl: AlertController,
    public runningManProvider: RunningManProvider
  ) {
    this.toilet = navParams.get('hit').toilet;
    this.photoURL = navParams.get('hit').photoURL;

    this.isOwner = this.toilet.owner_id === authProvider.currentUserId;

    this.isReservedObservable = toiletProvider
      .getToiletById(this.navParams.get('hit').key)
      .subscribe(t => {
        this.isAvailable = t.status === 'Available';
        this.status = t.status;
        if (t.status === 'Available') {
          this.statusColor = '#00E640';
        } else if (t.status === 'Reserved') {
          this.statusColor = '#EB9532';
        } else if (t.status === 'Occupied') {
          this.statusColor = '#D91E18';
        }
      });

   
  }

  ionViewWillLeave() {
    this.isReservedObservable.unsubscribe();
  }

  reserve() {
    // update db
    const toiletKey = this.navParams.get('hit').key;
    const center = this.navParams.get('hit').location;

    this.toiletProvider.updateToilet(toiletKey, {
      reserved_by: this.authProvider.currentUserId,
      guestName: this.authProvider.currentUserDisplayName,
      status: 'Reserved'
    });

    this.runningManProvider.presentAlert(toiletKey, center);
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
