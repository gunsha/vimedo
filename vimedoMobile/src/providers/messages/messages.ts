import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { APP_CONFIG, IAppConfig } from '../../app/app.config';

@Injectable()
export class MessagesProvider {

	constructor( @Inject(APP_CONFIG) private config: IAppConfig, public http: Http) {
	}

	updateChat(id){
		var url = this.config.apiEndpoint + 'mensajeria/'+id;
		return new Promise<any>((resolve, reject) => {
			this.http.get(url)
				.map(res => res.json())
				.subscribe(data => {
					resolve(data);
				}, error => {
					reject(JSON.parse(error._body).message);
				});
		});
	}
	getChats(id,t){
		var url = this.config.apiEndpoint + 'mensajeria/'+(t?'solicitudesPro':'solicitudesAfil')+'/'+id;
		return new Promise<any[]>((resolve, reject) => {
			this.http.get(url)
				.map(res => res.json())
				.subscribe(data => {
					resolve(data);
				}, error => {
					reject(JSON.parse(error._body).message);
				});
		});
	}
	markAsRead(msgs){
		var url = this.config.apiEndpoint + 'mensajeria/';
		return new Promise((resolve, reject) => {
			this.http.put(url,msgs)
				.map(res => res.json())
				.subscribe(() => {
					resolve();
				}, error => {
					reject(JSON.parse(error._body).message);
				});
		});
	}


	sendMsg(msg, idTo, idFrom, idSol) {
		var data = {
			msg: msg,
			idTo: idTo,
			idFrom: idFrom,
			idSol: idSol
		};
		var url = this.config.apiEndpoint + 'mensajeria/';

		return new Promise((resolve, reject) => {
			this.http.post(url, data)
				.map(res => res.json())
				.subscribe(data => {
					resolve(data);
				}, error => {
					reject(JSON.parse(error._body).message);
				});
		});
	}

}
