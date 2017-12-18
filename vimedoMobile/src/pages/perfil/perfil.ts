import { Component } from '@angular/core';
import { App } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
  user: any = {};
  constructor(private _app: App,public navCtrl: NavController, public navParams: NavParams, private auth: AuthService) {
    this.user = auth.user;
    //console.log(this.user)
  }

  update(){
    let req = this.auth.isPro() ? this.user.profesional : this.user.afiliado;
    req.usuario = {_id:this.user._id,email:this.user.email,password:this.user.password};
    this.auth.updateProfile(req);
  }

  logout(){
    this.auth.logout();
    //const root = this._app.getRootNav();
    //root.popToRoot();
    this._app.getRootNavs()[0].setRoot(LoginPage);
  }

}
