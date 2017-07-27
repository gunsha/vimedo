import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MessagesProvider } from '../../providers/messages/messages';
import { AuthService } from '../../providers/auth-service';
import { ChatPage } from '../chat/chat';

@Component({
  selector: 'page-mensajes',
  templateUrl: 'mensajes.html',
})
export class MensajesPage {

  chats: any = [];
  id: number = this.auth.getProfileId();
  task: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public msgs: MessagesProvider, public auth: AuthService) {
    this.getChats();
  }
  ionViewWillLeave(){
    clearInterval(this.task);
  }
  ionViewDidEnter() {
    this.task = setInterval(() => {
      this.getChats();
    }, 1200);
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
