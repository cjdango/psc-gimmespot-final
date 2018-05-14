import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { ConvoPage } from '../convo/convo';
import { ReviewsPage } from '../reviews/reviews';

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.toilet = navParams.get('hit').toilet;
    this.photoURL = navParams.get('hit').photoURL;
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
