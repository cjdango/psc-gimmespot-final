import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFireStorage } from 'angularfire2/storage';
import { AuthProvider } from '../auth/auth';

import "rxjs/add/operator/map";

/*
  Generated class for the PictureProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PictureProvider {
  captureDataUrl: string;

  constructor(
    public camera: Camera,
    public afStorage: AngularFireStorage,
    // public authProvider: AuthProvider
  ) {
    console.log('Hello PictureProvider Provider');
  }

  async takePicture(sourceType: number, type: number) {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType,
      targetHeight: 600,
      targetWidth: 600
    }

    const imageData = await this.camera.getPicture(options);

    this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;
  }

  addPicture(path: string, dataURL: string) {
    return this.afStorage.ref(path).putString(dataURL, 'data_url');
  }

  getDownloadURL(path: string) {
    return this.afStorage.ref(path).getDownloadURL();
  }
}
