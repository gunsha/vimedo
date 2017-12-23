import { Component } from '@angular/core';
import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';
import { App,AlertController } from 'ionic-angular';

@Component({
  selector: 'page-forgot',
  templateUrl: 'forgot.html',
})
export class ForgotPage {

  registerCredentials: { email: string};
  

  constructor(private _app: App,public alertCtrl: AlertController, private auth: AuthService) { 
      this.registerCredentials = {email : ''};
  }

  sendForgot(){
    let confirm = this.alertCtrl.create({
      title: 'Se han enviado instrucciones a su correo electrónico.',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this._app.getRootNavs()[0].setRoot(LoginPage);
          }
        }
      ]
    });
    this.auth.forgot(this.registerCredentials).then(()=>{
      confirm.present();
    })
  }

  login(){
    this._app.getRootNavs()[0].setRoot(LoginPage);
  }
 
  
}