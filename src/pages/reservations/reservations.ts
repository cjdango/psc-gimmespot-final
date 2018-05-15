import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToiletProvider } from '../../providers/toilet/toilet';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

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
  reservationsObservable: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toiletProvider: ToiletProvider,
    public barcodeScanner: BarcodeScanner
  ) {
  }

  ionViewDidLoad() {
    this.reservationsObservable =
      this.toiletProvider.getUserToilets().subscribe(toilets => {
        toilets.forEach(t => {
          if (t.reserved_by) {
            this.reservations.push(t.reserved_by);
          }
        });
      });
  }

  ionViewWillLeave() {
    this.reservationsObservable.unsubscribe();
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
