import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

/*
  Generated class for the ToiletProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ToiletProvider {

  constructor(public http: AngularFirestore) {
    console.log('Hello ToiletProvider Provider');
  }

}
