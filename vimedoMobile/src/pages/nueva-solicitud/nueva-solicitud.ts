import { Component } from '@angular/core';
import { NavController, AlertController, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { SintomasModalPage } from '../sintomas-modal/sintomas-modal';
import { SolicitudService } from '../../providers/solicitud/solicitud';
@Component({
  selector: 'page-nueva-solicitud',
  templateUrl: 'nueva-solicitud.html',
})
export class NuevaSolicitudPage {
  user: any;
  tiempoSintomas: any = '0:00';
  checkDom:any = [];
  solicitud: any = { domicilioSel:{},antecedentes: [], sintomas: [] };
  constructor(public modalCtrl: ModalController, public auth: AuthService, public navCtrl: NavController, public alertCtrl: AlertController, public service: SolicitudService) {
    this.user = auth.getUser();
    this.checkDom = this.user.profile.domicilios.map((item)=>{
      item.checked = false;
      return item;
    })
  }

  selectDom(dom){
    for(let i in this.checkDom){
      this.checkDom[i].checked = this.checkDom[i]._id == dom._id;
      this.solicitud.domicilioSel = this.checkDom[i]._id == dom._id ? dom : false;
    }
  }

  buscarSintoma(type) {
    let modal = this.modalCtrl.create(SintomasModalPage);
    modal.onDidDismiss(data => {
      if (data) {
        if (type) {
          this.solicitud.antecedentes.push(data.dec10 ? data : { dec10: data });
        } else {
          this.solicitud.sintomas.push(data.dec10 ? data : { dec10: data });
        }
      }
    });
    modal.present();
  }

  saveSol() {
    if (this.solicitud.domicilioSel) {
      if (this.solicitud.sintomas && this.solicitud.sintomas.length !== 0) {
        let sintomasCie = [];
        let sintomas = [];
        let antecedentesCie = [];
        let antecedentes = [];
        this.solicitud.sintomas.map(function (item) {
          if (item._id) {
            sintomasCie.push(item._id);
          } else {
            sintomas.push(item.dec10);
          }
        });
        this.solicitud.antecedentes.map(function (item) {
          if (item._id) {
            antecedentesCie.push(item._id);
          } else {
            antecedentes.push(item.dec10);
          }
        });
        let hora = this.tiempoSintomas.split(':');
        let req = {
          'sintomas': sintomas.toString(),
          'sintomasCie': sintomasCie,
          'horasSintomas': hora[0],
          'minutosSintomas': hora[1],
          'afiliado': this.auth.getProfileId(),
          'domicilio': this.solicitud.domicilioSel._id,
          'antecedentesCie': antecedentesCie,
          'antecedentes': antecedentes.toString()
        };
        let that = this;

        this.service.create(req).then(function () {
          let alert = that.alertCtrl.create({
            subTitle: 'Su solicitud esta siendo procesada.',
            buttons: [{
              text: 'Aceptar',
              handler: data => {
                that.navCtrl.goToRoot({});
              }
            }]
          });
          alert.present(prompt);
        });
      } else {
        this.showError('Seleccione por lo menos un sintoma.');
      }
    } else {
      this.showError('Seleccione por lo menos un domicilio.');
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
