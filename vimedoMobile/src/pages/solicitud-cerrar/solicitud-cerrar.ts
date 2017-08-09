import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { SolicitudService } from '../../providers/solicitud/solicitud';
import { SolicitudesPage } from '../solicitudes/solicitudes';

@Component({
  selector: 'page-solicitud-cerrar',
  templateUrl: 'solicitud-cerrar.html',
})
export class SolicitudCerrarPage {
  solicitud: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private service: SolicitudService, private alertCtrl: AlertController) {
    this.solicitud = navParams.get('item');
  }
  finalizar(){
    if(this.solicitud.indicaciones != '' && this.solicitud.observaciones != ''){

    this.service.finalizar(this.solicitud).then((data)=>{
      this.navCtrl.setRoot(SolicitudesPage);
    });
    }else{
      this.showError('Complete los campos requeridos.')
    }
  }

    showError(text) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: text,
      buttons: ['Aceptar']
    });
    alert.present(prompt);
  }
}
