import { Injectable, Inject } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import {JwtHelper} from "angular2-jwt";
import {tokenNotExpired} from 'angular2-jwt';

import { APP_CONFIG, IAppConfig } from '../app/app.config';
 
@Injectable()
export class AuthService {
  error: string;
  jwtHelper = new JwtHelper();
  user: object = null;

  constructor(@Inject(APP_CONFIG) private config: IAppConfig,private http: Http) {


      this.user = JSON.parse(localStorage.getItem('profile'));

  }
  public login(credentials) {
        return new Promise((resolve,reject) => {
     var url = this.config.apiEndpoint + 'users/login';
        this.http.post(url,credentials)
      .map(res => res.json())
      .subscribe(data => {
        this.authSuccess(data.jwt);
        resolve();
      },error=>{
          reject(JSON.parse(error._body).message);
      });
  });
  }
 
  public logout() {
    localStorage.remove('token');
    localStorage.remove('profile');
    this.user = null;
  }

  authSuccess(token) {
    this.error = null;
    localStorage.setItem('token', token);
    let decoded = this.jwtHelper.decodeToken(token);
    let user = decoded.sub.usuario;
    if (user.admin) {
      user.profile = user.admin.personaFisica;
    } else if (user.profesional) {
      user.profile = user.profesional.personaFisica;
    } else {
      user.profile = user.afiliado.personaFisica;
    }
    console.log(user);
    this.user = user;
    localStorage.setItem('profile', JSON.stringify(this.user));
  }

  public static authenticated() {
    console.log(tokenNotExpired('token'))
    return tokenNotExpired('token');
  }
}