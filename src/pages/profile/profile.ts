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
  profileAddress: string;
  profileLandmark: string;
  profilePhone: string;

  userReviewsRef: AngularFireList<{}>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public db: AngularFireDatabase
  ) {
    this.qrData = authProvider.currentUserId;

    let userId;

    if (navParams.get('from_toilet')) {
      userId = navParams.get('host_id');      
    } else {
      userId = authProvider.currentUserId;
    }
    this.isHost = userId === authProvider.currentUserId;

    this.userReviewsRef = db.list(`user_reviews/${userId}`);

    db.object(`users/${userId}`).valueChanges().subscribe((user: any) => {
      this.profilePic = user.photoURL;
      this.profileEmail = user.email;
      this.profileName = user.name;
      this.profileAddress = user.address;
      this.profileLandmark = user.landmark;
      this.profilePhone = user.phone;
    });


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
