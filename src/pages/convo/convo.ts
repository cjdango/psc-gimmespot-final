import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the ConvoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-convo',
  templateUrl: 'convo.html',
})
export class ConvoPage {
  message: string;
  convoRef: AngularFireList<{}>;

  currUid: string;

  roomName: string;

  feed: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    public authProvider: AuthProvider
  ) {

    const other_uid = navParams.get('other_uid');
    this.currUid = authProvider.currentUserId;
    this.roomName = (this.currUid < other_uid ? `${this.currUid}_${other_uid}` : `${other_uid}_${this.currUid}`);
    this.convoRef = db.list(`/convos/${this.roomName}`);

    this.feed = this.listMessages();
  }

  send() {
    this.convoRef.push({
      context: this.message,
      from: this.authProvider.currentUserId
    });

    this.db.object(`/user_convos/${this.currUid}/${this.roomName}/last_msg`).update({
      context: this.message,
      from: this.authProvider.currentUserId
    });

    this.message = '';
  }

  private listMessages() {
    return this.convoRef.valueChanges();
  }

}
