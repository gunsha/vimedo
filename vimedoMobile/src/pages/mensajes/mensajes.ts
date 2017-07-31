import { Inject } from '@angular/core';
import { APP_CONFIG, IAppConfig } from '../../app/app.config';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MessagesProvider } from '../../providers/messages/messages';
import { AuthService } from '../../providers/auth-service';
import { ChatPage } from '../chat/chat';
import * as io from "socket.io-client";

@Component({
  selector: 'page-mensajes',
  templateUrl: 'mensajes.html',
})
export class MensajesPage {

  chats: any = [];
  id: number = this.auth.getProfileId();
  task: any;
  socket: any;
  
  constructor(@Inject(APP_CONFIG) private config: IAppConfig,public navCtrl: NavController, public navParams: NavParams, public msgs: MessagesProvider, public auth: AuthService) {
    this.getChats();
  }
  ionViewWillLeave(){
  }
  ionViewDidEnter() {
    this.connect();
  }

  connect() {
		this.socket = io(this.config.apiEndpoint, { query: 'idu=' + this.id});
		this.socket.on('connect', function () {

		});
		this.socket.on('socket/mensajeria/newMsg', (msg) => {
      this.chats.forEach(element => {
        if(element._id === msg.solicitud){
          element.lastMsg = msg;
          element.msgs.push(msg);
        }
      });
		});
  }
  
  openChat(item) {
    clearInterval(this.task);
    this.navCtrl.push(ChatPage, { item: item });
  }

  getChats() {
    return this.msgs.getChats(this.id, this.auth.isPro()).then(data => {
      this.chats = data;
    })

  }

  doRefresh(refresher) {
    this.getChats().then(() => refresher.complete())
  }

}
