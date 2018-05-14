import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { GeoProvider } from '../../providers/geo/geo';
import mapboxgl from 'mapbox-gl';
import { MapProvider } from '../../providers/map/map';
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

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public geoProvider: GeoProvider,
    public mapProvider: MapProvider
  ) {
    
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  ionViewDidEnter() {
    this.initializeMap();
  }

  private initializeMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      center: [this.geoProvider.currentUserPos.lng, this.geoProvider.currentUserPos.lat],
      zoom: 14,
      style: 'mapbox://styles/cjdango/cjgtegh4e000v2rpda91p4af2'
    });
  }

}
