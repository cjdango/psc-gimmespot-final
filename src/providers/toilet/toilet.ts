import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthProvider } from '../auth/auth';
import 'rxjs/add/operator/map';

export interface Toilet {
  name: string;
  cost: number;
  desc: string;
  owner: string;
  owner_id: string;
}

/*
  Generated class for the ToiletProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ToiletProvider {

  constructor(
    public db: AngularFireDatabase,
    public authProvider: AuthProvider
  ) {
  }

  getUserToilets() {
    const userId = this.authProvider.currentUserId;
    return this.db.list('/toilets', ref => ref.orderByChild('owner_id').equalTo(userId))
      .snapshotChanges().map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      });
  }

  getToiletById(key: string) {
    return this.db.object(`/toilets/${key}`).snapshotChanges()
      .map(c => ({ key: c.payload.key, ...c.payload.val() }))
  }

  deleteToilet(key: string) {
    this.db.object(`/running_men/${key}`).remove();
    return this.db.object(`/toilets/${key}`).remove();
  }

  updateToilet(key: string, data) {
    return this.db.object(`/toilets/${key}`).update(data);
  }

}
