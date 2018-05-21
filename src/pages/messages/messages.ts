import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AuthProvider } from '../../providers/auth/auth';
import "rxjs/add/operator/map";
import { ConvoPage } from '../convo/convo';

/**
 * Generated class for the MessagesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {
  userConvosRef: AngularFireList<{}>;
  currUid: string;

  convos: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    public authProvider: AuthProvider
  ) {
    this.currUid = authProvider.currentUserId;
    this.userConvosRef = db.list(`user_convos/${this.currUid}`);

    this.convos = this.listConvos();
  }

  private listConvos() {
    return this.userConvosRef.snapshotChanges()
      .map(changes => {

        return changes.map(c => {
          const from = this.db.object(`/users/${c.payload.val().last_msg.from}`)
            .snapshotChanges().map(c => ({ key: c.key, ...c.payload.val() }));

          const users = c.payload.val().members

          const roomName = (users[0] < users[1] ? `${users[0]}_${users[1]}` : `${users[1]}_${users[0]}`);

          return {
            context: c.payload.val().last_msg.context,
            from,
            roomName,
            users
          }
        })

      });
  }

  openConvo(roomName: string, users: any) {
    this.navCtrl.push(ConvoPage, { roomName, users })
  }

}
