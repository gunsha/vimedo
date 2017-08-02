import { Component } from '@angular/core';
import { NavController, NavParams,AlertController } from 'ionic-angular';
import {SolicitudCerrarPage} from '../solicitud-cerrar/solicitud-cerrar';

@Component({
  selector: 'page-solicitud-detail',
  templateUrl: 'solicitud-detail.html',
})
export class SolicitudDetailPage {
  s: any = null;
  isPro: boolean;
  constructor(public alertCtrl: AlertController,public navCtrl: NavController, public navParams: NavParams) {
    this.s = navParams.get('item');
    this.isPro = navParams.get('isPro');
    console.log(navParams);
  }

  confirmCloseSol(){
    let confirm = this.alertCtrl.create({
      title: 'Cerrar la solicitud?',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.navCtrl.push(SolicitudCerrarPage, { item: this.s });
          }
        }
      ]
    });
    confirm.present();
  }

}
