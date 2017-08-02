import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { APP_CONFIG, IAppConfig } from '../../app/app.config';

@Injectable()
export class SolicitudService {

  constructor(@Inject(APP_CONFIG) private config: IAppConfig,public http: Http) {
    
  }

  create(obj){
    return new Promise((resolve,reject) => {
     var url = this.config.apiEndpoint + 'solicitudesMedicas/';
        this.http.post(url,obj)
      .map(res => res.json())
      .subscribe(data => {
        resolve(data);
      },error=>{
          reject(JSON.parse(error._body).message);
      });
  });
  }

}