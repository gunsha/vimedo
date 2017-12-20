import { Component } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { ProfessionalService } from '../../providers/professional/professional';
import { SolicitudesPage } from '../solicitudes/solicitudes';
import { NuevaSolicitudPage } from '../nueva-solicitud/nueva-solicitud';
import { MessagesProvider } from '../../providers/messages/messages';
import { MensajesPage } from '../mensajes/mensajes';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  solicitudes: any = [];
  pages: Array<any>;
  isPro: Boolean = this.auth.isPro();
  testRadioOpen: boolean;
  testRadioResult;
  id: number = this.auth.getProfileId();
  mensajes = 0;
  nombre: string = this.auth.getUser().profile.nombre;

  constructor(public navCtrl: NavController, private auth: AuthService, private pro: ProfessionalService,public alertCtrl: AlertController, public msgs: MessagesProvider) {
    this.pages = [
      SolicitudesPage,
      MensajesPage
    ];
  }

  ionViewDidEnter() {
    if(this.isPro)
      this.getSolicitudesPro();
    this.getChats();
  }

  getChats() {
    return this.msgs.getChats(this.id, this.isPro).then(data => {
      this.mensajes = 0;
      data.forEach(element => {
        if(element.lastMsg && !element.lastMsg.read && element.lastMsg.from != this.id)
          this.mensajes++;
      });
    })

  }

  getSolicitudesPro(){
    return this.pro.solicitudes(this.auth.user.profesional._id).then((data)=>{
      this.solicitudes = data;
    });
  }

  newSol(){
    let alert = this.alertCtrl.create();
    alert.setTitle('Tipo de solicitud');

    alert.addInput({
      type: 'radio',
      label: 'Particular',
      value: '0',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: 'Obra Social',
      value: '1'
    });

    alert.addButton('Cancelar');
    alert.addButton({
      text: 'Aceptar',
      handler: data => {
        this.testRadioOpen = false;
        this.testRadioResult = data;
        this.navCtrl.push(NuevaSolicitudPage,{item:data});
      }
    });
    alert.present();
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
