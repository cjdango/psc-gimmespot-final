import { environment } from '../../environment';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { GeoJson } from '../../class/map';
import * as mapboxgl from 'mapbox-gl';

/*
  Generated class for the MapProvider provider.

  See https://angular.io/guide/dependency-injection for more 
  +nfo on providers
  and Angular DI.
*/
@Injectable()
export class MapProvider {
  markersCollection: AngularFirestoreCollection<GeoJson>

  constructor(public db: AngularFirestore) {
    Object
      .getOwnPropertyDescriptor(mapboxgl, "accessToken")
      .set(environment.mapbox.accessToken);

    this.markersCollection = db.collection<GeoJson>('markers');
  }

  getMarkers(): Observable<any> {
    return this.markersCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as GeoJson;
        const id = a.payload.doc.id;
        return { $key: id, ...data };
      });
    });
  }

  createMarker(data: GeoJson) {
    return this.markersCollection.add(<GeoJson>data.getData());
  }

  removeMarker($key: string) {
    return this.markersCollection.doc($key).delete();
  }

}
