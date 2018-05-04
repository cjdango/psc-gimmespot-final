import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as mapboxgl from 'mapbox-gl';
import { MapProvider } from '../../providers/map/map';
import { Geolocation } from '@ionic-native/geolocation';

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
export class ToiletFormPage implements OnInit {
  title: string;
  toilet = {} as {
    name: string;
    cost: number;
    desc: string;
    owner: string;
  }

  mapComp = {} as {
    map: mapboxgl.Map;
    lat: number;
    lng: number;
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mapProvider: MapProvider,
    public geolocation: Geolocation
  ) {
    this.title = navParams.data;
  }

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    this.mapComp.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/cjdango/cjgnd8aab00362rq0q7jahcjd',
      zoom: 13
    });

    const callback = (res) => {
      this.mapComp.lat = res.coords.latitude;
      this.mapComp.lng = res.coords.longitude;
      this.mapComp.map.setCenter(
        [this.mapComp.lng, this.mapComp.lat]
      );
    }

    this.geolocation.getCurrentPosition()
      .then(callback)
      .catch(() => {
        navigator.geolocation.getCurrentPosition(callback);
      });

    this.placeMarker();
  }

  placeMarker() {
    var marker = new mapboxgl.Marker();

    this.mapComp.map.on('click', (event) => {
      const coordinates = [event.lngLat.lng, event.lngLat.lat]
      marker.setLngLat(coordinates);
    })

    this.mapComp.map.once('click', () => {
      marker.addTo(this.mapComp.map);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ToiletFormPage');
  }

}
