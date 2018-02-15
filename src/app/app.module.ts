import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login'
import { RegisterPage } from '../pages/register/register';
import { TabPage } from '../pages/tab/tab';
import { MapPage } from '../pages/map/map';
import { ListPage } from '../pages/list/list';
import { PicturePage } from '../pages/picture/picture';
import { ToiletCrudPage } from '../pages/toilet-crud/toilet-crud';
import { ToiletDetailsPage } from '../pages/toilet-details/toilet-details';

import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    RegisterPage,
    TabPage,
    MapPage,
    ListPage,
    PicturePage,
    ToiletCrudPage,
    ToiletDetailsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    Ionic2RatingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    RegisterPage,
    TabPage,
    MapPage,
    ListPage,
    PicturePage,
    ToiletCrudPage,
    ToiletDetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
