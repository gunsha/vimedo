import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { MessagesProvider } from '../../providers/messages/messages';
import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
  c: any = {};
  chatBox: String = '';
  id: number = this.auth.getProfileId();
  task: any;

  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController, public navParams: NavParams, public msgs: MessagesProvider, public auth: AuthService) {
    this.c = navParams.get('item');
  }

  ionViewWillLeave() {
    if (this.task)
      clearInterval(this.task);
  }
  ionViewDidEnter() {
    this.content.scrollToBottom(300);
    if (this.c.estado != 2)
      this.task = setInterval(() => {
        if (this.c.estado == 2) {
          clearInterval(this.task);
        }
        if (this.checkUnread())
          this.msgs.markAsRead(this.c.msgs.filter((item) => { if (item.from !== this.id) return item; }));
        this.msgs.updateChat(this.c._id).then(data => {
          this.c.estado = data.s;
            this.c.msgs = data.msgs;
          if (this.c.msgs.length !== data.msgs.length) {
            this.content.scrollToBottom(300);
          }
        });
      }, 1200);
  }

  checkUnread() {
    for (let i = 0; i < this.c.msgs.length; i++) {
      if (!this.c.msgs[i].read && this.c.msgs[i].from !== this.id) {
        return true;
      }
    }
    return false;
  }

  send() {
    let toId = this.auth.isPro() ? this.c.profesional._id : this.c.afiliado._id;
    this.msgs.sendMsg(this.chatBox, toId, this.id, this.c._id).then((data) => {
      this.c.msgs.push(data);
      this.chatBox = '';
      setTimeout(() => {
        this.content.scrollToBottom(300);
      });
    })
  }

}
