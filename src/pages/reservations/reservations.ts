import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToiletProvider } from '../../providers/toilet/toilet';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AngularFireDatabase } from 'angularfire2/database';

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
    public db: AngularFireDatabase
  ) {
  }

  ionViewDidLoad() {
    this.reservationsObserver = this.toiletProvider.getUserToilets()
      .subscribe(toilets => {

        const mapToilets = toilets.map(t => {
          const reservation = { ...t };

          this.userObserver = this.db.object(`/users/${t.reserved_by}`)
            .valueChanges().subscribe((user: any) => {
              if (user) {
                reservation.guestPhotoURL = user.photoURL;
                reservation.guestName = user.name;
                console.log(user.name)
                // subscription.unsubscribe();
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

  scanQR(userKey) {
    this.barcodeScanner.scan().then(res => {
      if (userKey === res.text) {
        alert('User Confirmed');
      }
    }).catch(err => {
      console.log('Error', err);
    });
  }

}
