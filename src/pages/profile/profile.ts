import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  qrData: string;

  reviews: any;

  comment: string;

  isHost: boolean;

  rating: number = 5;

  profilePic: string = 'assets/imgs/logo.png';
  profileEmail: string;
  profileName: string;

  userReviewsRef: AngularFireList<{}>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public db: AngularFireDatabase
  ) {
    this.qrData = authProvider.currentUserId;

    if (navParams.get('from_toilet')) {
      this.isHost = navParams.get('host_id') === authProvider.currentUserId;
      this.userReviewsRef = db.list(`user_reviews/${navParams.get('host_id')}`);
      db.object(`users/${navParams.get('host_id')}`).valueChanges().subscribe((user: any) => {
        this.profilePic = user.photoURL;
        this.profileEmail = user.email;
        this.profileName = user.name;
      });
    } else {
      this.isHost = true;
      this.userReviewsRef = db.list(`user_reviews/${authProvider.currentUserId}`);
      this.profilePic = this.authProvider.authState.photoURL;
      this.profileEmail = this.authProvider.authState.email;
      this.profileName = this.authProvider.currentUserDisplayName;
    }

    this.reviews = this.listReviews();

  }

  private listReviews() {
    return this.userReviewsRef.valueChanges();
  }

  send() {
    this.userReviewsRef.push({
      from: {
        name: this.authProvider.currentUserDisplayName,
        photoURL: this.authProvider.authState.photoURL
      },
      date: new Date().toDateString(),
      comment: this.comment,
      rating: this.rating
    })
    this.comment = '';
  }

}
