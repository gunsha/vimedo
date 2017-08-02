import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';

/**
 * Generated class for the NuevaSolicitudPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-nueva-solicitud',
  templateUrl: 'nueva-solicitud.html',
})
export class NuevaSolicitudPage {
  user: any;
  currLoc: any;
  constructor( private auth: AuthService,public navCtrl: NavController, public navParams: NavParams) {
    this.user = auth.getUser();
    this.currLoc = 0;
  }

  ionViewDidLoad() {
    console.log(this.user);
  }

}
