import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';

import mapboxgl from 'mapbox-gl';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFireDatabase } from 'angularfire2/database';

import { MapProvider } from '../../providers/map/map';
import { AuthProvider } from '../../providers/auth/auth';
import { ToiletProvider, Toilet } from '../../providers/toilet/toilet';
import { Subscription } from 'rxjs/Subscription';
import { PictureProvider } from '../../providers/picture/picture';

/**
 * Generated class for the ToiletFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-toilet-form',
  templateUrl: 'toilet-form.html',
})
export class ToiletFormPage implements OnInit, OnDestroy {
  title: string;
  toilet = {} as Toilet;

  toiletLocation: [number, number];

  map: mapboxgl.Map;

  toiletSubscription: Subscription;

  pictureData: string = 'assets/imgs/logo.png';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mapProvider: MapProvider,
    public geolocation: Geolocation,
    public db: AngularFireDatabase,
    public authProvider: AuthProvider,
    public toiletProvider: ToiletProvider,
    public pictureProvider: PictureProvider,
    public actionSheetCtrl: ActionSheetController
  ) { }

  async ngOnInit() {

    this.title = this.navParams.data.title;
    this.toilet.owner_id = this.authProvider.currentUserId;

    if (this.navParams.data.toiletKey) {
      this.toiletSubscription = this.toiletProvider.getToiletById(this.navParams.data.toiletKey)
        .subscribe((val: Toilet) => {
          this.toilet = val;
        })

      this.pictureProvider
        .getDownloadURL(`toilets/${this.navParams.data.toiletKey}/toiletPicture`)
        .subscribe(photoURL => {
          if (photoURL) this.pictureData = photoURL;
        })

      const val = await this.mapProvider.getMarkerById(this.navParams.data.toiletKey)
      // convert string to number
      const lng = Number(val[1]);
      const lat = Number(val[0]);

      this.toiletLocation = [lng, lat];
    } else {
      try {
        const geopos =
          await this.geolocation
            .getCurrentPosition({ enableHighAccuracy: true });

        this.toiletLocation = [geopos.coords.longitude, geopos.coords.latitude];
      } catch (err) {
        if (navigator.geolocation) {
          navigator.geolocation
            .getCurrentPosition((pos: Position) => {
              this.toiletLocation = [pos.coords.longitude, pos.coords.latitude];
            });
        }
      }
    }
    this.initializeMap();
    this.placeMarker();
  }

  ngOnDestroy() {
    try {
      this.toiletSubscription.unsubscribe();
    } catch (error) {
      console.log(error);
    }
  }

  private initializeMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      center: this.toiletLocation,
      zoom: 14,
      style: 'mapbox://styles/cjdango/cjgtegh4e000v2rpda91p4af2'
    });
  }

  private placeMarker() {
    const marker =
      new mapboxgl.Marker()
        .setLngLat(this.toiletLocation)
        .addTo(this.map);

    this.map.on('click', (e) => {
      const coords = [e.lngLat.lng, e.lngLat.lat]
      this.toiletLocation = coords as [number, number];
      marker.setLngLat(coords);
    });
  }

  async addToilet() {
    this.toilet.owner = this.authProvider.currentUserDisplayName;

    const key = this.db.list('/toilets')
      .push({ ...this.toilet, status: 'Available' }).key;

    this.db.object(`running_men/${key}/l`).set([0, 0]);

    try {
      await this.pictureProvider.addPicture(`toilets/${key}/toiletPicture`, this.pictureData)
    } catch (error) {
      console.log(error)
    }
    await this.mapProvider.createMarker(key, this.toiletLocation);
    await this.navCtrl.pop();
  }

  async updateToilet() {
    const key = this.navParams.data.toiletKey;
    this.toiletProvider.updateToilet(key, this.toilet);
    try {
      await this.pictureProvider.addPicture(`toilets/${key}/toiletPicture`, this.pictureData)
    } catch (error) {
      console.log(error)
    }
    await this.mapProvider.createMarker(key, this.toiletLocation); // update marker
    await this.navCtrl.pop();
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Gallery',
          icon: 'images',
          handler: () => this.takePicture(0)
        },
        {
          text: 'Take a picture',
          icon: 'camera',
          handler: () => this.takePicture(1)
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  private takePicture(sourceType: number) {
    this.pictureProvider.takePicture(sourceType, 0)
      .then(() => this.pictureData = this.pictureProvider.captureDataUrl)
  }


}
