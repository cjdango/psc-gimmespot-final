import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, ModalController } from 'ionic-angular';
import { GeoProvider } from '../../providers/geo/geo';
import mapboxgl, { Marker, Popup } from 'mapbox-gl';
import Directions from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { MapProvider } from '../../providers/map/map';

import MapboxCircle from 'mapbox-gl-circle'
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import GeoFire, { GeoQuery } from 'geofire';

import remove from 'lodash/remove';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { greenPinSVG, redPinSVG, orangePinSVG } from './marker';
import { ToiletProvider } from '../../providers/toilet/toilet';
import { PictureProvider } from '../../providers/picture/picture';
import { ToiletDetailsPage } from '../toilet-details/toilet-details';
import { RunningManProvider } from '../../providers/running-man/running-man';
import { AuthProvider } from '../../providers/auth/auth';
import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  map: mapboxgl.Map

  positionObservable: Observable<Geoposition>;
  positionWatcher: Subscription;

  hits: any;

  geoQuery: GeoQuery;

  markers = [] as { key: string, marker: mapboxgl.Marker }[];

  myCircle = new MapboxCircle({ lat: 0, lng: 0 }, 1000, { fillColor: '#29AB87' });

  directions: Directions;
  switchText: string = 'GPS';
  isManual: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public geoProvider: GeoProvider,
    public mapProvider: MapProvider,
    public geolocation: Geolocation,
    public toiletProvider: ToiletProvider,
    public pictureProvider: PictureProvider,
    public modalCtrl: ModalController,
    public runningManProvider: RunningManProvider,
    public authProvider: AuthProvider,
    public db: AngularFireDatabase
  ) {

  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  ionViewDidLoad() {
    this.initializeMap();
    this.populateMap();
  }

  ionViewWillLeave() {
    this.positionWatcher.unsubscribe();
  }

  private initializeMap() {
    this.map = new mapboxgl.Map({
      container: 'map2',
      center: [this.geoProvider.currentUserPos.lng, this.geoProvider.currentUserPos.lat],
      zoom: 14,
      style: 'mapbox://styles/cjdango/cjgtegh4e000v2rpda91p4af2'
    });

    this.directions = new Directions({
      accessToken: mapboxgl.accessToken,
      controls: {
        instructions: false,
        inputs: false
      },
      interactive: false,
      profile: 'mapbox/walking'
    });

    this.map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserLocation: true
    }));

    this.map.addControl(this.directions);

    this.myCircle
      .setCenter({ lat: this.geoProvider.currentUserPos.lat, lng: this.geoProvider.currentUserPos.lng })
      .addTo(this.map);

    this.geoQuery = this.mapProvider.queryMarkers([this.geoProvider.currentUserPos.lat, this.geoProvider.currentUserPos.lng]);

    this.positionObservable = this.geolocation.watchPosition({ enableHighAccuracy: true });

    this.watchPos();

    console.log(this.myCircle)

  }

  private onClickListener = (e) => {
    this.myCircle.setCenter({ lat: e.lngLat.lat, lng: e.lngLat.lng });
    this.mapProvider.updateQueryCrit(this.geoQuery, [e.lngLat.lat, e.lngLat.lng]);
    this.mapProvider.updateQueryCrit(this.geoProvider.geoQueryToilets, [e.lngLat.lat, e.lngLat.lng]);
  }

  private watchPos() {
    this.positionWatcher = this.positionObservable.subscribe(pos => {
      this.myCircle.setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      this.mapProvider.updateQueryCrit(this.geoQuery, [pos.coords.latitude, pos.coords.longitude]);
      console.log('watch')
    });
  }

  manualOrGPS() {

    if (!this.isManual) {
      this.switchText = 'Manual';

      this.positionWatcher.unsubscribe();
      try {
        this.geoProvider.positionWatcher.unsubscribe();
      } catch (error) {
        console.log(error)
      }

      this.map.on('click', this.onClickListener);

    } else {
      this.watchPos();

      this.geoProvider.positionWatcher = this.geoProvider.positionObservable.subscribe(pos => {
        this.mapProvider.updateQueryCrit(this.geoProvider.geoQueryToilets, [pos.coords.latitude, pos.coords.longitude]);
      });

      this.map.off('click', this.onClickListener);
      this.switchText = 'GPS';
    }
    this.isManual = !this.isManual;
  }

  private populateMap() {
    this.map.on('load', () => {
      // const marker = new Marker();

      this.geoQuery.on('key_entered', (key, location, distance) => {

        // create the popup
        var popup = new mapboxgl.Popup({
          offset: {
            'top': [0, 0],
            'top-left': [0, 0],//[linearOffset, (markerHeight - markerRadius - linearOffset) * -1],
            'top-right': [0, 0],//[-linearOffset, (markerHeight - markerRadius - linearOffset) * -1],
            'bottom': [0, -50],
            'bottom-left': [0, -50],
            'bottom-right': [0, -50],
            'left': [20, -35],
            'right': [-20, -35]
          },
          closeButton: false
        });

        let hit = {
          key,
          location: location,
          distance: distance,
          toilet: {} as any,
        } as any;

        // create DOM element for the marker
        var el = document.createElement('div');
        el.id = 'marker';
        el.addEventListener('click', () => {
          this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(pos => {
            this.directions.setOrigin([pos.coords.longitude, pos.coords.latitude]);
          });
          this.directions.setDestination([location[1], location[0]]);
        });

        // el.addEventListener('click', (e) => {
        //   let profileModal = this.modalCtrl.create(ToiletDetailsPage, { hit });
        //   profileModal.present();
        // })

        // create DOM element for the popup
        const popupEl = document.createElement('div');
        const imgEl = document.createElement('img');
        const h6El = document.createElement('h6');
        const spanEl = document.createElement('span');
        const h4El = document.createElement('h4');
        const btnEl = document.createElement('button');

        popupEl.style.textAlign = 'center';

        imgEl.width = 120;
        imgEl.height = 120;
        imgEl.addEventListener('click', () => {
          let profileModal = this.modalCtrl.create(ToiletDetailsPage, { hit });
          profileModal.present();
        });

        h6El.align = 'center';
        h6El.style.margin = '10px 0';

        spanEl.style.color = '#488aff';

        h4El.align = 'center';
        h4El.style.textTransform = 'uppercase';
        h4El.style.margin = '10px 0';

        btnEl.innerText = 'RESERVE';
        btnEl.style.color = 'white';
        btnEl.style.background = '#488aff';
        btnEl.style.width = '100%';
        btnEl.style.padding = '10px 0';
        btnEl.style.borderRadius = '3px';
        btnEl.addEventListener('click', () => {
          this.toiletProvider.updateToilet(key, {
            reserved_by: this.authProvider.currentUserId,
            guestName: this.authProvider.currentUserDisplayName,
            status: 'Reserved'
          });

          this.db.list(`reserved_toilets/${hit.toilet.owner_id}`).set(key, {
            toiletName: hit.toilet.name,
            timestamp: Date.now() / 1000
          });

          this.runningManProvider.presentAlert(key, location);
        });

        popupEl.appendChild(imgEl);
        popupEl.appendChild(h6El);
        popupEl.appendChild(h4El);

        const marker = new Marker(el, {
          offset: [0, -25]
        })
          .setLngLat([location[1], location[0]])
          .setPopup(popup)
          .addTo(this.map);

        try {
          hit.photoURL = this.pictureProvider.getDownloadURL(`toilets/${key}/toiletPicture`);
          hit.photoURL.subscribe(photoURL => imgEl.src = photoURL);
        } catch (error) {
          console.log(error);
        }

        this.toiletProvider.getToiletById(key).subscribe(toilet => {
          btnEl.disabled = true;
          if (toilet.status === 'Available') {
            el.innerHTML = greenPinSVG;
            hit.statusColor = '#00E640';
            btnEl.disabled = false;
          } else if (toilet.status === 'Reserved') {
            el.innerHTML = orangePinSVG;
            hit.statusColor = '#EB9532';
          } else if (toilet.status === 'Occupied') {
            el.innerHTML = redPinSVG;
            hit.statusColor = '#D91E18';
          }

          if (toilet.owner_id !== this.authProvider.currentUserId) {
            popupEl.appendChild(btnEl);
          }

          h6El.innerText = toilet.name + ': ';
          spanEl.innerText = '₱' + toilet.cost;
          h4El.style.color = hit.statusColor;
          h4El.innerText = toilet.status;

          hit.toilet = toilet;

          h6El.appendChild(spanEl);
          popup.setDOMContent(popupEl);
        });



        this.markers.push({ key, marker });
      });

      this.geoQuery.on('key_exited', (key, location, distance) => {
        this.markers = remove(this.markers, m => {
          if (m.key === key) {
            m.marker.remove();
          }

          return m.key !== key;
        });
      });

      this.geoQuery.on('key_moved', (key, location, distance) => {
        this.markers.forEach(m => {
          if (m.key === key)
            m.marker.setLngLat([location[1], location[0]]);
        });
      });
    })
  }


}
