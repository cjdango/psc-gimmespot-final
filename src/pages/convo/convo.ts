import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AuthProvider } from '../../providers/auth/auth';
import { DataSnapshot } from '@firebase/database';

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
  other_uid: string;

  roomName: string;

  feed: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    public authProvider: AuthProvider
  ) {

    this.other_uid = navParams.get('other_uid');
    this.currUid = authProvider.currentUserId;

    if (navParams.get('roomName')) {
      this.roomName = navParams.get('roomName');
    } else {
      this.roomName = (this.currUid < this.other_uid ? `${this.currUid}_${this.other_uid}` : `${this.other_uid}_${this.currUid}`);
    }

    this.convoRef = db.list(`/convos/${this.roomName}/chats`);
    console.log(this.roomName)

    this.convoRef.query.ref.once('child_added').then((dataSnapshot: DataSnapshot) => {
      if (this.other_uid) {
        db.object(`/user_convos/${this.currUid}/${this.roomName}/members/0`).set(this.currUid);
        db.object(`/user_convos/${this.currUid}/${this.roomName}/members/1`).set(this.other_uid);
        db.object(`/user_convos/${this.other_uid}/${this.roomName}/members/0`).set(this.currUid);
        db.object(`/user_convos/${this.other_uid}/${this.roomName}/members/1`).set(this.other_uid);
      }
    });

    this.feed = this.listMessages();
  }

  send() {
    this.convoRef.push({
      context: this.message,
      from: this.authProvider.currentUserId
    });

    let user1, user2;

    if (this.navParams.get('users')) {
      user1 = this.navParams.get('users')[0];
      user2 = this.navParams.get('users')[1]
    } else {
      user1 = this.currUid;
      user1 = this.other_uid;
    }

    this.db.object(`/user_convos/${user1}/${this.roomName}/last_msg`).update({
      context: this.message,
      from: this.authProvider.currentUserId
    });

    this.db.object(`/user_convos/${user2}/${this.roomName}/last_msg`).update({
      context: this.message,
      from: this.authProvider.currentUserId
    });

    this.message = '';
  }

  private listMessages() {
    return this.convoRef.valueChanges();
  }

}
