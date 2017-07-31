import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { APP_CONFIG, IAppConfig } from '../../app/app.config';
import * as io from "socket.io-client";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MessagesProvider {
	socket: any;
	socketObserver: any;
	socketService: any;
	constructor( @Inject(APP_CONFIG) private config: IAppConfig, public http: Http) {
		this.socketService = Observable.create(observer => {
			this.socketObserver = observer;
		});
	}

	connect(id, idu,iduTo) {
		this.socket = io(this.config.apiEndpoint, { query: 'id=' + id + '&idu=' + idu +'&iduTo='+iduTo});
		let that = this;
		this.socket.on('connect', function () {
			that.enterChat();
		});
		this.socket.on('socket/mensajeria/receive', (msg) => {
			this.socketObserver.next({ category: 'message', message: msg });
		});
		this.socket.on('socket/mensajeria/sended', (msg) => {
			this.socketObserver.next({ category: 'sended', message: msg });
		});
		this.socket.on('socket/mensajeria/markRead', () => {
			this.socketObserver.next({ category: 'markRead'});
		});
	}
	enterChat(){
		this.socket.emit('socket/mensajeria/read');
	}
	disconnect() {
		this.socket.disconnect();
	}

	updateChat(id) {
		var url = this.config.apiEndpoint + 'mensajeria/' + id;
		return new Promise<any>((resolve, reject) => {
			this.http.get(url)
				.map(res => res.json())
				.subscribe(data => {
					resolve(data);
				}, error => {
					if (typeof error._body === 'string')
						reject(JSON.parse(error._body).message);
				});
		});
	}
	getChats(id, t) {
		var url = this.config.apiEndpoint + 'mensajeria/' + (t ? 'solicitudesPro' : 'solicitudesAfil') + '/' + id;
		return new Promise<any[]>((resolve, reject) => {
			this.http.get(url)
				.map(res => res.json())
				.subscribe(data => {
					resolve(data);
				}, error => {
					if (typeof error._body === 'string')
						reject(JSON.parse(error._body).message);
				});
		});
	}
	markAsRead(msgs) {
		var url = this.config.apiEndpoint + 'mensajeria/';
		return new Promise((resolve, reject) => {
			this.http.put(url, msgs)
				.map(res => res.json())
				.subscribe(() => {
					resolve();
				}, error => {
					if (typeof error._body === 'string')
						reject(JSON.parse(error._body).message);
				});
		});
	}

	sendMsg(msg, idTo, idFrom, idSol) {
		var data = {
			message: msg,
			to: idTo,
			from: idFrom,
			solicitud: idSol,
			send: new Date(),
			read: false
		};
		this.socket.emit('socket/mensajeria/send', data);
		return data;
		/*
		var url = this.config.apiEndpoint + 'mensajeria/';

		return new Promise((resolve, reject) => {
			this.http.post(url, data)
				.map(res => res.json())
				.subscribe(data => {
					resolve(data);
				}, error => {
					reject(JSON.parse(error._body).message);
				});
		});*/
	}

}
