import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import GeoFire from "geofire";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import remove from 'lodash/remove';
import { Geolocation } from '@ionic-native/geolocation';
/*
  Generated class for the GeoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GeoProvider {
  dbRef: AngularFireList<{}>;
  geoFire: any;

  hits = new BehaviorSubject([]);

  constructor(
    private db: AngularFireDatabase,
    private geolocation: Geolocation
  ) {
    /// Reference database location for GeoFire
    this.dbRef = this.db.list('/markers');
    this.geoFire = new GeoFire(this.dbRef.query.ref);
  }

  /// Adds GeoFire data to database
  setLocation(key: string, coords: Array<number>) {
    this.geoFire.set(key, coords)
      .then(_ => console.log('location updated'))
      .catch(err => console.log(err))
  }


  /// Queries database for nearby locations
  /// Maps results to the hits BehaviorSubject
  getLocations(radius: number, coords: Array<number>) {
    const geoQuery = this.geoFire.query({
      center: coords,
      radius: radius
    });

    geoQuery.on('key_entered', (key, location, distance) => {
      const toilet = this.db.object(`/toilets/${key}`).valueChanges();

      let hit = {
        key,
        location: location,
        distance: distance,
        toilet
      }

      let currentHits = this.hits.value
      currentHits.push(hit)
      this.hits.next(currentHits)
    });

    geoQuery.on('key_exited', (key, location, distance) => {

      let currentHits = remove(this.hits.value, hit => hit.key !== key);

      this.hits.next(currentHits)
    });

    this.geolocation.watchPosition({ enableHighAccuracy: true }).subscribe(pos => {
      geoQuery.updateCriteria({
        center: [pos.coords.latitude, pos.coords.longitude],
        radius: 1
      });
    })
  }
}
