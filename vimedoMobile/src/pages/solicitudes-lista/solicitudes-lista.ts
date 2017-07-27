import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { ProfessionalService } from '../../providers/professional/professional';
import {SolicitudDetailPage} from '../solicitud-detail/solicitud-detail';

@Component({
  selector: 'page-solicitudes-lista',
  templateUrl: 'solicitudes-lista.html',
})
export class SolicitudesListaPage {
  solicitudes: any = [];
  constructor(public navCtrl: NavController, private auth: AuthService, private pro: ProfessionalService) {
    this.getSolicitudesPro();
  }

    getSolicitudesPro(){
    return this.pro.solicitudes(this.auth.user.profesional._id).then((data)=>{
      this.solicitudes = data;
    });
  }

  openDetail(item) {
    this.navCtrl.push(SolicitudDetailPage,{item:item});
  }

  doRefresh(refresher){
     this.getSolicitudesPro().then( ()=> refresher.complete() )
     
  }

}
