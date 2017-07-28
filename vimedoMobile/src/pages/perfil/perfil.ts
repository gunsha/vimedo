import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
  user: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService) {
    this.user = auth.user;
    console.log(this.user)
  }

  update(){
    let req = this.auth.isPro() ? this.user.profesional : this.user.afiliado;
    req.usuario = {_id:this.user._id,email:this.user.email,password:this.user.password};
    this.auth.updateProfile(req);
  }

}
