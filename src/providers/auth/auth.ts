import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/observable';
import { User } from '@firebase/auth-types';
import { NavController } from 'ionic-angular';
import { PictureProvider } from '../picture/picture';


/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  authState: User = null;

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    public pictureProvider: PictureProvider
  ) {

    this.afAuth.authState.subscribe((auth: User) => {
      this.authState = auth;
    });
  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  get currentUser(): User | null {
    return this.authenticated ? this.authState : null;
  }

  // Returns
  get currentUserObservable(): Observable<User> {
    return this.afAuth.authState;
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  // Anonymous User
  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false
  }

  // Returns current user display name or Guest
  get currentUserDisplayName(): string {
    if (!this.authState) { return 'Guest' }
    else if (this.currentUserAnonymous) { return 'Anonymous' }
    else { return this.authState['displayName'] || 'User without a Name' }
  }

  //// Social Auth ////
  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.socialSignIn(provider);
  }

  private socialSignIn(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.authState = credential.user
        this.updateUserData();
      })
      .catch(error => console.log(error));
  }

  //// Email/Password Auth ////
  emailSignUp(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((auth) => {
        this.authState = auth;
        // this.updateUserData();
      })
      .catch(error => console.log(error));
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((auth) => {
        this.authState = auth;
        // this.updateUserData();
      })
      .catch(error => console.log(error));
  }

  //// Sign Out ////
  signOut(): void {
    this.afAuth.auth.signOut();
    // this.authState = null;
  }

  //// Helpers ////
  updateUserData(photoURL = '', address='', landmark='', phone=''): void {
    // Writes user name and email to firestore
    // useful if your app displays information about users or for admin features
    let path = `users/${this.currentUserId}`; // Endpoint on firebase

    let data = {
      email: this.authState.email,
      name: this.authState.displayName,
      photoURL: photoURL ? photoURL : this.authState.photoURL,
      address, landmark, phone
    }

    this.db.object(path).update(data)
      .catch(error => console.log('help',error));

  }

}
