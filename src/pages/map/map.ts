import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { GeoProvider } from '../../providers/geo/geo';
import mapboxgl, { Marker } from 'mapbox-gl';
import { MapProvider } from '../../providers/map/map';

import MapboxCircle from 'mapbox-gl-circle'
import { Geolocation } from '@ionic-native/geolocation';
import GeoFire, { GeoQuery } from 'geofire';

import remove from 'lodash/remove';
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

  positionWatcher: any;
  subscription: any;

  hits: any;

  geoQuery: GeoQuery;

  markers = [] as { key: string, marker: mapboxgl.Marker }[];

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

    var myCircle = new MapboxCircle({ lat: this.geoProvider.currentUserPos.lat, lng: this.geoProvider.currentUserPos.lng }, 1000, {
      fillColor: '#29AB87'
    }).addTo(this.map);

    this.geoQuery = this.mapProvider.queryMarkers([this.geoProvider.currentUserPos.lat, this.geoProvider.currentUserPos.lng]);

    this.positionWatcher = this.geolocation.watchPosition({ enableHighAccuracy: true }).subscribe(pos => {
      myCircle.setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      this.mapProvider.updateQueryCrit(this.geoQuery, [pos.coords.latitude, pos.coords.longitude]);
    });
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
          if(m.key === key) 
            m.marker.setLngLat([location[1], location[0]]);
        });
      });
    })
  }


}
