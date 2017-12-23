import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { JwtHelper } from "angular2-jwt";
import { tokenNotExpired } from 'angular2-jwt';

import { APP_CONFIG, IAppConfig } from '../app/app.config';

@Injectable()
export class AuthService {
  error: string;
  jwtHelper = new JwtHelper();
  user: any = null;

  constructor( @Inject(APP_CONFIG) private config: IAppConfig, private http: Http) {
    this.user = JSON.parse(localStorage.getItem('profile'));
  }
  public login(credentials) {
    return new Promise((resolve, reject) => {
      var url = this.config.apiEndpoint + 'users/mobile/login';
      this.http.post(url, credentials)
        .map(res => res.json())
        .subscribe(data => {
          this.authSuccess(data.jwt);
          resolve();
        });
    });
  }
  public forgot(user) {
    return new Promise((resolve, reject) => {
      var url = this.config.apiEndpoint + 'users/forgot';
      /*
      this.http.post(url, user)
        .map(res => res.json())
        .subscribe(() => {
          resolve();
        });
      */
      resolve();
    });
  }

  public register(user) {
    return new Promise((resolve, reject) => {
      var url = this.config.apiEndpoint + 'users/register';
      this.http.post(url, user)
        .map(res => res.json())
        .subscribe(data => {
          this.authSuccess(data.jwt);
          resolve();
        });
    });
  }

  public updateProfile(user) {
    return new Promise((resolve, reject) => {
      var url = this.config.apiEndpoint + (this.isPro() ? 'profesionales' : 'afiliados');
      this.http.put(url, user)
        .map(res => res.json())
        .subscribe(data => {
          this.user.profile = user.personaFisica;
          this.user.password = null;
          this.user.email = user.usuario.email;
          localStorage.setItem('profile', JSON.stringify(this.user));
          resolve();
        });
    });
  }

  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    this.user = null;
  }

  public getUser() {
    return this.user;
  }

  public getProfileId() {
    if (this.isPro())
      return this.user.profesional._id
    else
      return this.user.afiliado._id
  }

  public isPro() {
    return this.user.afiliado ? false : true;
  }

  authSuccess(token) {
    this.error = null;
    localStorage.setItem('token', token);
    let decoded = this.jwtHelper.decodeToken(token);
    let user = decoded.sub.usuario;
    user.profile = this.extractProfile(user);
    user.password = null;
    this.user = user;
    localStorage.setItem('profile', JSON.stringify(this.user));
  }
  extractProfile(user) {
    if (user.admin) {
      return user.admin.personaFisica;
    } else if (user.profesional) {
      return user.profesional.personaFisica;
    } else {
      return user.afiliado.personaFisica;
    }
  }

  public static authenticated() {
    return tokenNotExpired('token');
  }
}