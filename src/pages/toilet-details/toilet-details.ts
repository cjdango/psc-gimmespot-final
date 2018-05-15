import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { ConvoPage } from '../convo/convo';
import { ReviewsPage } from '../reviews/reviews';
import { AuthProvider } from '../../providers/auth/auth';
import { ToiletProvider } from '../../providers/toilet/toilet';

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

  qrData: string;

  isReserved: boolean;

  isReservedObservable: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public authProvider: AuthProvider,
    public toiletProvider: ToiletProvider
  ) {
    this.toilet = navParams.get('hit').toilet;
    this.photoURL = navParams.get('hit').photoURL;
    this.qrData = authProvider.currentUserId;

    this.isReservedObservable = toiletProvider
      .getToiletById(this.navParams.get('hit').key)
      .subscribe(t => {
        this.isReserved = !!t.reserved_by;
      });
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
