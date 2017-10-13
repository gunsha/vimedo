import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AlertController, LoadingController } from 'ionic-angular';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';
import 'rxjs/add/observable/throw';

import { Http, XHRBackend, RequestOptions,  RequestOptionsArgs, Response } from '@angular/http';

@Injectable()
export class HttpService extends Http {
  public pendingRequests: number = 0;
  public showLoading_: boolean = false;
  loading: any;
  errorMsg = 'Ocurrio un error inesperado.'

  constructor(backend: XHRBackend, defaultOptions: RequestOptions, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    super(backend, defaultOptions);
  }

  get(url: string, options?: RequestOptionsArgs){
    console.log(url)
    return this.intercept(super.get(url, options));
  }
    
  post(url: string, body: any, options?: RequestOptionsArgs){
    console.log(url)
    return this.intercept(super.post(url,body, options));
  }
  put(url: string, body: any, options?: RequestOptionsArgs){
    console.log(url)
    return this.intercept(super.put(url,body, options));
  }

  intercept(observable: Observable<Response>): Observable<Response> {
    this.pendingRequests++;
    this.turnOnModal();
    return observable.catch((err) => {
      this.showError(typeof err._body == 'string' ? JSON.parse(err._body).message : this.errorMsg);
      return Observable.throw(err.statusText);
    })
      .do((res: Response) => {
      }, (err: any) => {
        //this.showError(typeof err._body == 'string' ? JSON.parse(err._body).message : this.errorMsg);
      })
      .finally(() => {
        setTimeout(() => {
          this.turnOffModal();
        },500);
      });
  }
  private turnOnModal() {
    console.log('modal on')
    if (!this.showLoading_) {
      this.showLoading_ = true;
      this.showLoading();
    }
    this.showLoading_ = true;
  }

  private turnOffModal() {
    this.pendingRequests--;
    console.log(this.pendingRequests)
    if (this.pendingRequests <= 0) {
      if (this.showLoading_) {
        this.loading.dismiss();
        this.loading = null;
      }
      this.showLoading_ = false;
    }
  }

    showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Procesando...',
      dismissOnPageChange: true,
      duration: 6000
    });
    this.loading.present();
  }
 
  showError(text) {
    this.turnOffModal();
 
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: text,
      buttons: ['Aceptar']
    });
    alert.present(prompt);
  }

}
