import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ToiletDetailsPage } from '../pages/toilet-details/toilet-details';
import { TabPage } from '../pages/tab/tab';
import { LoginPage } from '../pages/login/login';
import { AuthProvider } from '../providers/auth/auth';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    authProvider: AuthProvider
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    authProvider.currentUserObservable.subscribe(auth => {
      this.rootPage = auth ? TabPage : LoginPage;
      console.log(auth)
    });


  }
}

