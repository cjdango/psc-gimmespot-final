import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';

import * as mapboxgl from 'mapbox-gl';
import { MapProvider } from '../../providers/map/map';
import { GeoJson, FeatureCollection } from '../../class/map';

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
export class MapPage implements OnInit {

  /// default settings
  map: mapboxgl.Map;
  style = 'mapbox://styles/cjdango/cjgnd8aab00362rq0q7jahcjd';
  lat = 37.75;
  lng = -122.41;
  message = 'Hello World!';

  // data
  source: any;
  markers: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public mapProvider: MapProvider
  ) {
  }

  ngOnInit() {
    this.markers = this.mapProvider.getMarkers()
    this.initializeMap()
  }

  private initializeMap() {
    /// locate the user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.map.flyTo({
          center: [this.lng, this.lat]
        })
      });
    }

    // this.buildMap()

  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat]
    });


    /// Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());


    //// Add Marker on Click
    this.map.on('click', (event) => {
      const coordinates = [event.lngLat.lng, event.lngLat.lat]
      // const newMarker = new GeoJson(coordinates, { message: this.message })
      // this.mapProvider.createMarker(newMarker)
      var marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(this.map);
    })


    /// Add realtime firebase data on map load
    this.map.on('load', (event) => {

      /// register source
      this.map.addSource('firebase', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      /// get source
      this.source = this.map.getSource('firebase')

      /// subscribe to realtime database and set data source
      this.markers.subscribe(markers => {
        let data = new FeatureCollection(markers)
        this.source.setData(data)
      })

      /// create map layers with realtime data
      this.map.addLayer({
        id: 'firebase',
        source: 'firebase',
        type: 'symbol',
        layout: {
          'text-field': '{message}',
          'text-size': 24,
          'text-transform': 'uppercase',
          'icon-image': 'rocket-15',
          'text-offset': [0, 1.5]
        },
        paint: {
          'text-color': '#f16624',
          'text-halo-color': '#fff',
          'text-halo-width': 2
        }
      })

    })

  }


  /// Helpers

  removeMarker(marker) {
    this.mapProvider.removeMarker(marker.$key)
  }

  flyTo(data: GeoJson) {
    this.map.flyTo({
      center: data.geometry.coordinates
    })
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

}
