import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { RegisterStep2Page } from '../register-step2/register-step2';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  registerCredentials: { email: string, password: string, tos: boolean, isProfesional: boolean };
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.registerCredentials = {
      email: '',
      password: '',
      tos: false,
      isProfesional: false
    };
  }

  registerStep1() {
    if (this.registerCredentials.email != '' && this.registerCredentials.password != '' && this.registerCredentials.tos) {
      let alert = this.alertCtrl.create();
      alert.setTitle('Tipo de usuario');

      alert.addInput({
        type: 'radio',
        label: 'Profesional',
        value: '1'
      });
      alert.addInput({
        type: 'radio',
        label: 'Paciente',
        value: '0'
      });

      alert.addButton('Cancelar');
      alert.addButton({
        text: 'Aceptar',
        handler: data => {
          this.registerCredentials.isProfesional = data == '1';
          this.navCtrl.push(RegisterStep2Page, { item: this.registerCredentials })
        }
      });
      alert.present();
    }
  }

}
