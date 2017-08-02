import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { APP_CONFIG, IAppConfig } from '../../app/app.config';

@Component({
  selector: 'page-sintomas-modal',
  templateUrl: 'sintomas-modal.html',
})
export class SintomasModalPage {
  query: string = '';
  sintomas: any = [];
  constructor(@Inject(APP_CONFIG) private config: IAppConfig,public http: Http,public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
  }

  dismiss(s) {
   this.viewCtrl.dismiss(s);
 }
  onInput(ev: any) {
    let val = ev.target.value;
    if (val && val.trim() != '' && val.trim().length >= 3) {
      this.searchSintomas(val).then(data => {
        this.sintomas = data;
      });
    }
  }

  onCancel(ev: any) {
    this.query = '';
  }

  searchSintomas(q){
    return new Promise((resolve,reject) => {
     var url = this.config.apiEndpoint + 'antecedentesMedicos/cieautocomplete?term='+q;
        this.http.get(url)
      .map(res => res.json())
      .subscribe(data => {
        resolve(data);
      },error=>{
          reject(JSON.parse(error._body).message);
      });
  });
  }

}
