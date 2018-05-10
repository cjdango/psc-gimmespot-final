import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PictureProvider } from '../../providers/picture/picture';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  email: string;
  password: string;
  displayName: string;

  pictureData: string;

  constructor(
    public navCtrl: NavController,
    public authProvider: AuthProvider,
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    public pictureProvider: PictureProvider
  ) {

  }

  handleOnLogin() {
    this.navCtrl.pop();
  }

  async emailSignUp() {
    await this.authProvider
      .emailSignUp(this.email, this.password, this.displayName, this.navCtrl);

    const userId = this.authProvider.currentUserId;

    await this.pictureProvider.addPicture(`users/${userId}`, this.pictureData);

    this.pictureProvider.getDownloadURL(`users/${userId}`)
      .subscribe(photoURL => {
        if (photoURL) {
          this.authProvider.currentUser.updateProfile({
            photoURL,
            displayName: this.displayName
          }).then((a) => {
            this.authProvider.updateUserData();
            alert('Updated: displayName, photoURL');
          });
        }
      });
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Gallery',
          icon: 'images',
          handler: () => this.takePicture(0)
        },
        {
          text: 'Take a picture',
          icon: 'camera',
          handler: () => this.takePicture(1)
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  private takePicture(sourceType: number) {
    this.pictureProvider.takePicture(sourceType, 0)
      .then(() => this.pictureData = this.pictureProvider.captureDataUrl)
  }



}
