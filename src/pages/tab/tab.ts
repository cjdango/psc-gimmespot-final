import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ListPage } from '../list/list';
import { MapPage } from '../map/map';
import { PicturePage } from '../picture/picture';
import { ToiletCrudPage } from '../toilet-crud/toilet-crud';
import { ReservationsPage } from '../reservations/reservations';
import { AuthProvider } from '../../providers/auth/auth';
import { GeoProvider } from '../../providers/geo/geo';
import { Geolocation } from '@ionic-native/geolocation';
import { ProfilePage } from '../profile/profile';
import { MessagesPage } from '../messages/messages';

/**
 * Generated class for the TabPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tab',
  templateUrl: 'tab.html'
})
export class TabPage {
  displayName: string;
  photoURL: string = 'assets/imgs/logo.png';

  listRoot = ListPage
  mapRoot = MapPage
  pictureRoot = PicturePage


  constructor(
    public navCtrl: NavController,
    public authProvider: AuthProvider
  ) {
    this.authProvider.currentUserObservable.subscribe(auth => {
      if (auth) {
        this.displayName = auth.displayName;
        this.photoURL = auth.photoURL;
      }
    });

    
  }

  showToiletCrudPage() {
    this.navCtrl.push(ToiletCrudPage);
  }

  showReservations() {
    this.navCtrl.push(ReservationsPage);
  }

  showProfile() {
    this.navCtrl.push(ProfilePage);
  }

  showConvos() {
    this.navCtrl.push(MessagesPage);
  }


  signOut() {
    this.authProvider.signOut();
  }

}
