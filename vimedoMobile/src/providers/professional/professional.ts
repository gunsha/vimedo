import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { APP_CONFIG, IAppConfig } from '../../app/app.config';

@Injectable()
export class ProfessionalService {

  constructor(@Inject(APP_CONFIG) private config: IAppConfig,public http: Http) {
    
  }

  solicitudes(id){
    return new Promise((resolve,reject) => {
     var url = this.config.apiEndpoint + 'solicitudesMedicas/profesional/'+id;
        this.http.get(url)
      .map(res => res.json())
      .subscribe(data => {
        resolve(data);
      },error=>{
          reject(JSON.parse(error._body).message);
      });
  });
  }
historial(id){
    return new Promise((resolve,reject) => {
     var url = this.config.apiEndpoint + 'solicitudesMedicas/profesional/'+id+'/historial';
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
