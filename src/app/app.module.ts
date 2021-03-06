import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { LocalNotifications } from '@ionic-native/local-notifications';

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
import { ReservationsPage } from '../pages/reservations/reservations';
import { ProfilePage } from '../pages/profile/profile';

import { Ionic2RatingModule } from 'ionic2-rating';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { environment } from '../environment';
import { AuthProvider } from '../providers/auth/auth';
import { MapProvider } from '../providers/map/map';
import { ToiletProvider } from '../providers/toilet/toilet';
import { PictureProvider } from '../providers/picture/picture';
import { GeoProvider } from '../providers/geo/geo';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { MessagesPage } from '../pages/messages/messages';
import { RunningManProvider } from '../providers/running-man/running-man';

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
    ReviewsPage,
    ReservationsPage,
    ProfilePage,
    MessagesPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    Ionic2RatingModule,
    NgxQRCodeModule
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
    ReviewsPage,
    ReservationsPage,
    ProfilePage,
    MessagesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Camera,
    BarcodeScanner,
    LocalNotifications,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    MapProvider,
    ToiletProvider,
    PictureProvider,
    GeoProvider,
    RunningManProvider
  ]
})
export class AppModule { }
