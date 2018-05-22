import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ToiletDetailsPage } from '../pages/toilet-details/toilet-details';
import { TabPage } from '../pages/tab/tab';
import { LoginPage } from '../pages/login/login';
import { AuthProvider } from '../providers/auth/auth';
import { PictureProvider } from '../providers/picture/picture';
import { Subscription } from 'rxjs/Subscription';


import { GeoProvider } from '../providers/geo/geo';
import { Geolocation } from '@ionic-native/geolocation';

import * as firebase from 'firebase'
import { ToiletProvider } from '../providers/toilet/toilet';

import remove from 'lodash/remove';
import GeoFire from 'geofire';
import { AngularFireDatabase } from 'angularfire2/database';
import { ToastController } from 'ionic-angular';

@Component({
  templateUrl: 'app.html',
  providers: [GeoProvider, Geolocation]
})
export class MyApp {
  rootPage: any;

  reservedToilets: Array<any>;
  reservedToiletsLoc: Array<any>;


  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    authProvider: AuthProvider,
    toiletProvider: ToiletProvider,
    public pictureProvider: PictureProvider,
    public geoProvider: GeoProvider,
    public geolocation: Geolocation,
    public db: AngularFireDatabase,
    public toastCtrl: ToastController

  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    firebase.auth().onAuthStateChanged(auth => {
      this.rootPage = auth ? TabPage : LoginPage;
      if (auth) {
        this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((pos) => {
          this.geoProvider.currentUserPos.lat = pos.coords.latitude;
          this.geoProvider.currentUserPos.lng = pos.coords.longitude;
          this.geoProvider.getLocations(1, [pos.coords.latitude, pos.coords.longitude])
        });

        toiletProvider.getUserToilets().subscribe(toilets => {
          this.reservedToilets = remove(toilets, t => !!t.reserved_by);
          
          this.reservedToilets.forEach(resToilet => {
            const runningManRef = db.list(`running_men`);
            const geofire = new GeoFire(runningManRef.query.ref);
            const geoQuery1 = geofire.query({
              radius: .03,
              center: resToilet.location
            });

            const geoQuery2 = geofire.query({
              radius: .015,
              center: resToilet.location
            });

            geoQuery1.on('key_entered', (key, location, distance) => {
              geoQuery1.cancel();
              if (distance > .015) {
                this.presentToast(`${resToilet.guestName} is ${Number(distance * 1000).toFixed(2)}m away from ${resToilet.name}`);
              }
            });

            geoQuery2.on('key_entered', (key, location, distance) => {
              geoQuery2.cancel();
              geofire.remove(key);
              this.presentToast(`${resToilet.guestName} is ${Number(distance * 1000).toFixed(2)}m away from ${resToilet.name}`);               
            });

          });
        });
      }
    }, () => this.rootPage = LoginPage);


  }

  presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message,
      duration: 3000,
      showCloseButton: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }


}

