import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { ProfessionalService } from '../../providers/professional/professional';
import { SolicitudesPage } from '../solicitudes/solicitudes';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  solicitudes: any = [];
  pages: Array<any>;
  isPro: Boolean = this.auth.isPro();

  constructor(public navCtrl: NavController, private auth: AuthService, private pro: ProfessionalService) {
    if(this.isPro)
      this.getSolicitudesPro();
    this.pages = [
      SolicitudesPage
    ];
  }

  getSolicitudesPro(){
    return this.pro.solicitudes(this.auth.user.profesional._id).then((data)=>{
      this.solicitudes = data;
    });
  }

  openPage(page) {
    this.navCtrl.setRoot(this.pages[page]);
  }

  doRefresh(refresher){
    if(this.isPro)
     this.getSolicitudesPro().then( ()=> refresher.complete() )
    else
      refresher.complete();
  }

}
