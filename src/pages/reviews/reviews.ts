import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the ReviewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-reviews',
  templateUrl: 'reviews.html',
})
export class ReviewsPage {
  reviewsRef: AngularFireList<{}>;

  reviews: any;

  comment: string;

  isHost: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    public authProvider: AuthProvider
  ) {
    
    const reviewType = navParams.get('review_type');

    let itemId;

    if (reviewType === 'user_reviews') {
      itemId = authProvider.currentUserId;
    } else {
      itemId = navParams.get('item_id');
      this.isHost = navParams.get('host_id') === authProvider.currentUserId;
    }
    console.log(this.isHost)

    this.reviewsRef = db.list(`${reviewType}/${itemId}`);

    this.reviews = this.listReviews();
  }

  private listReviews() {
    return this.reviewsRef.valueChanges();
  }

  send() {
    this.reviewsRef.push({
      from: {
        name: this.authProvider.currentUserDisplayName,
        photoURL: this.authProvider.authState.photoURL
      },
      date: new Date().toDateString(),
      comment: this.comment
    })
  }

}
