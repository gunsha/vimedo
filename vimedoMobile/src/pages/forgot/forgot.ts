import { Component } from '@angular/core';
import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';
import { App } from 'ionic-angular';

@Component({
  selector: 'page-forgot',
  templateUrl: 'forgot.html',
})
export class ForgotPage {

  registerCredentials: { email: string};
  

  constructor(private _app: App, private auth: AuthService) { 
      this.registerCredentials = {email : ''};
  }

  sendForgot(){
    this._app.getRootNavs()[0].setRoot(LoginPage);
  }

  login(){
    this._app.getRootNavs()[0].setRoot(LoginPage);
  }
 
  
}