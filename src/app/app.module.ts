import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login'
import { RegisterPage } from '../pages/register/register';
import { TabPage } from '../pages/tab/tab';
import { MapPage } from '../pages/map/map';
import { ListPage } from '../pages/list/list';
import { PicturePage } from '../pages/picture/picture';
import { ToiletCrudPage } from '../pages/toilet-crud/toilet-crud';
import { ToiletDetailsPage } from '../pages/toilet-details/toilet-details';
import { ToiletFormPage } from '../pages/toilet-form/toilet-form';
import { ConvoPage } from '../pages/convo/convo';
import { ReviewsPage } from '../pages/reviews/reviews';

import { Ionic2RatingModule } from 'ionic2-rating';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { environment } from '../environment';
import { AuthProvider } from '../providers/auth/auth';

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
    ToiletDetailsPage,
    ToiletFormPage,
    ConvoPage,
    ReviewsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
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
    ToiletDetailsPage,
    ToiletFormPage,
    ConvoPage,
    ReviewsPage
  ],
  providers: [
    Geolocation,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider
  ]
})
export class AppModule { }
