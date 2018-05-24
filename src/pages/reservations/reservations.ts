import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { ToiletProvider } from '../../providers/toilet/toilet';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AngularFireDatabase } from 'angularfire2/database';
import { ProfilePage } from '../profile/profile';
import { ToiletDetailsPage } from '../toilet-details/toilet-details';
import { PictureProvider } from '../../providers/picture/picture';

/**
 * Generated class for the ReservationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-reservations',
  templateUrl: 'reservations.html',
})
export class ReservationsPage {
  reservations = [];
  reservationsObserver: any;

  userObserver: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toiletProvider: ToiletProvider,
    public barcodeScanner: BarcodeScanner,
    public db: AngularFireDatabase,
    public modalCtrl: ModalController,
    public pictureProvider: PictureProvider
  ) {
  }

  ionViewDidLoad() {
    this.reservationsObserver = this.toiletProvider.getUserToilets()
      .subscribe(toilets => {
        this.reservations = [];

        const mapToilets = toilets.map(t => {
          const reservation = { ...t };

          this.userObserver = this.db.object(`/users/${t.reserved_by}`)
            .valueChanges().subscribe((user: any) => {
              if (user) {
                reservation.guestId = t.reserved_by;
                reservation.guestPhotoURL = user.photoURL;
                reservation.guestName = user.name;
                reservation.photoURL = this.pictureProvider.getDownloadURL(`toilets/${t.key}/toiletPicture`);
              }
            });

          return reservation;
        });


        mapToilets.forEach(t => {
          if (t.reserved_by) {
            this.reservations.push(t);
          }
        });

      });
  }

  ionViewWillLeave() {
    this.reservationsObserver.unsubscribe();
    this.userObserver.unsubscribe();
  }

  scanQR(userKey, reservation: any) {
    this.barcodeScanner.scan().then(res => {
      if (userKey === res.text) {
        this.toiletProvider.updateToilet(reservation.key, { isGuestVerified: true, status: 'Occupied' });
        console.log('userKey', userKey);
        console.log('reservationKey', reservation.key);
        this.db.object(`reserved_toilets/${reservation.owner_id}/${reservation.key}`).remove()
          .then(() => console.log(`removed`))
          .catch((err) => console.log(err));
      } else {
        alert('Stranger not verified!!!');
      }
    }).catch(err => {
      console.log(err);
    });
  }

  showProfile(host_id: string) { // guest_id jd ni siya
    this.navCtrl.push(ProfilePage, { host_id, from_toilet: true });
  }

  toiletDetails(reservation) {
    const hit = {
      key: reservation.key,
      toilet: reservation,
      photoURL: reservation.photoURL
    }
    const modal = this.modalCtrl.create(ToiletDetailsPage, { hit });
    modal.present();
  }

  close(reservation) {
    this.toiletProvider
      .updateToilet(reservation.key, { reserved_by: '', guestName: '', isGuestVerified: false, status: 'Available' });
  }


}
