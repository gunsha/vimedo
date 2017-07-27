import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SolicitudDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-solicitud-detail',
  templateUrl: 'solicitud-detail.html',
})
export class SolicitudDetailPage {
  s: any = null;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.s = navParams.get('item');
    console.log(this.s);
  }

}
