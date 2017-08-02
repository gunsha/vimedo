import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { ProfessionalService } from '../../providers/professional/professional';
import { AfiliadoService } from '../../providers/afiliado/afiliado';
import { SolicitudDetailPage } from '../solicitud-detail/solicitud-detail';

@Component({
  selector: 'page-historial',
  templateUrl: 'historial.html',
})
export class HistorialPage {

  solicitudes: any = [];
  orig: any = [];
  pages: Array<any>;

  constructor(public navCtrl: NavController, private auth: AuthService, private pro: ProfessionalService, private afil: AfiliadoService) {
    this.getHistorial();
  }

  getHistorial() {
    if (this.auth.isPro())
      return this.pro.historial(this.auth.getProfileId()).then((data) => {
        this.solicitudes = data;
        this.orig = data;
      });
    else
      return this.afil.historial(this.auth.getProfileId()).then((data) => {
        this.solicitudes = data;
        this.orig = data;
      });
  }

  openDetail(item) {
    this.navCtrl.push(SolicitudDetailPage, { item: item });
  }

  doRefresh(refresher) {
    this.getHistorial().then(() => refresher.complete())

  }

  onInput(ev: any) {

    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.solicitudes = this.orig.filter((item) => {
        if (this.auth.isPro())
          return (item.afiliado.personaFisica.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1
            || item.afiliado.personaFisica.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
        else
          if(item.profesional)
          return (item.profesional.personaFisica.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1
            || item.profesional.personaFisica.apellido.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  onCancel(ev: any) {
    this.solicitudes = [...this.orig];
  }

}
