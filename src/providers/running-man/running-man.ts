import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation'; 4
import { AngularFireDatabase } from 'angularfire2/database';

import GeoFire from 'geofire';
import { ToiletProvider } from '../toilet/toilet';

/*
  Generated class for the RunningManProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RunningManProvider {
  posObservable: any;
  posSubscriber: any;

  geofire: GeoFire

  constructor(
    public alertCtrl: AlertController,
    public geolocation: Geolocation,
    public db: AngularFireDatabase,
    public toiletProvider: ToiletProvider
  ) {
    this.geofire = new GeoFire(db.list('/running_men').query.ref);
  }

  presentAlert(toiletKey: string, toiletPos: [number, number]) {
    let alert = this.alertCtrl.create({
      title: 'Share Distance?',
      message: 'The host will be notified when you are 30m away from the toilet',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Share',
          handler: () => {
            this.toiletProvider.updateToilet(toiletKey, {
              hasRunningMan: true
            });

            const runningManRef = this.db.object(`running_men/${toiletKey}/l`);

            this.posObservable = this.geolocation.watchPosition({ enableHighAccuracy: true });

            this.posSubscriber = this.posObservable.subscribe(pos => {
              const lat: number = pos.coords.latitude;
              const lng: number = pos.coords.longitude;
              const userPos: [number, number] = [lat, lng];
              const distance: number = GeoFire.distance(userPos, toiletPos);

              console.log(distance)

              runningManRef.set([lat, lng]);

              if (distance <= .015) {
                this.posSubscriber.unsubscribe();
                runningManRef.set([0, 0]);
                this.toiletProvider.updateToilet(toiletKey, {
                  hasRunningMan: false
                });
              }
            });
          }
        }
      ]
    });
    alert.present();
  }

}
