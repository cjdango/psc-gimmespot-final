import { Injectable } from '@angular/core';

import mapboxgl from 'mapbox-gl';
import GeoFire from 'geofire';
import { AngularFireDatabase } from 'angularfire2/database';

import { environment } from '../../environment';

/*
  Generated class for the MapProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapProvider {
  geoFire: GeoFire;

  constructor(public db: AngularFireDatabase) {
    mapboxgl.accessToken = environment.mapbox.accessToken;
    this.geoFire = new GeoFire(db.list('/markers').query.ref);
  }

  // getMarkers(): FirebaseListObservable<any> {
  //   return this.db.list('/markers')
  // }

  getMarkerById(key: string) {
    return this.geoFire.get(key);
  }

  createMarker(key: string, coords: GeoFire.Location) {
    return this.geoFire.set(key, [coords[1], coords[0]]);
  }

  removeMarker($key: string) {
    return this.geoFire.remove($key);
  }

}
