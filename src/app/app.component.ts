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
@Component({
  templateUrl: 'app.html',
  providers: [GeoProvider, Geolocation]
})
export class MyApp {
  rootPage: any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    authProvider: AuthProvider,
    pictureProvider: PictureProvider,
    public geoProvider: GeoProvider,
    public geolocation: Geolocation
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });


    authProvider.currentUserObservable.subscribe(auth => {
      this.rootPage = auth ? TabPage : LoginPage;
      if (auth) {
        this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((pos) => {
          this.geoProvider.currentUserPos.lat = pos.coords.latitude;
          this.geoProvider.currentUserPos.lng = pos.coords.longitude;
          this.geoProvider.getLocations(1, [pos.coords.latitude, pos.coords.longitude])
        });
      }
    }, () => this.rootPage = LoginPage);


  }
}

