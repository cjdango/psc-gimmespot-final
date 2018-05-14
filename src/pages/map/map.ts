import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { GeoProvider } from '../../providers/geo/geo';
import mapboxgl, { Marker } from 'mapbox-gl';
import { MapProvider } from '../../providers/map/map';

import MapboxCircle from 'mapbox-gl-circle'
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import GeoFire, { GeoQuery } from 'geofire';

import remove from 'lodash/remove';

import {Observable} from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
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

  switchText: string = 'GPS';
  isManual: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public geoProvider: GeoProvider,
    public mapProvider: MapProvider,
    public geolocation: Geolocation
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
      const marker = new Marker();

      this.geoQuery.on('key_entered', (key, location, distance) => {
        const marker = new Marker()
          .setLngLat([location[1], location[0]])
          .addTo(this.map);

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
