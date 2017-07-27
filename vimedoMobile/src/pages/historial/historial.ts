import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { ProfessionalService } from '../../providers/professional/professional';
import {SolicitudDetailPage} from '../solicitud-detail/solicitud-detail';

@Component({
  selector: 'page-historial',
  templateUrl: 'historial.html',
})
export class HistorialPage {

    solicitudes: any = [];
  pages: Array<any>;

  constructor(public navCtrl: NavController, private auth: AuthService, private pro: ProfessionalService) {
    this.getHistorial();
  }

  getHistorial(){
    return this.pro.historial(this.auth.user.profesional._id).then((data)=>{
      this.solicitudes = data;
    });
  }

  openDetail(item) {
    this.navCtrl.push(SolicitudDetailPage,{item:item});
  }

  doRefresh(refresher){
     this.getHistorial().then( ()=> refresher.complete() )
     
  }

}
