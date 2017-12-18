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
    this.msgs.socketService.subscribe(event => {
      if (event.category === 'markRead') {
        this.c.msgs = this.c.msgs.map((item) => { if (item.from == this.id) item.read = true; return item; })
      }
      if (event.category === 'sended') {
        let d = new Date(event.message.send);
        for (var i = this.c.msgs.length - 1; i >= 0; i--) {
          if (this.c.msgs[i].send.getTime() == d.getTime()) {
            this.c.msgs[i] = event.message;
            break;
          }
        }
      }
      if (event.category === 'message') {
        this.c.msgs.push(event.message);
        setTimeout(() => {
          this.content.scrollToBottom(300);
        });
      }
    });
  }

  ionViewWillLeave() {
      this.msgs.disconnect();
  }
  ionViewDidEnter() {
    this.content.scrollToBottom(300);
    let toId = this.c.afiliado._id === this.id ? (this.c.profesional ? this.c.profesional._id:0) : this.c.afiliado._id;
    if (this.c.estado != 2)
      this.msgs.connect(this.c._id, this.id, toId);
  }

  checkUnread() {
    for (let i = 0; i < this.c.msgs.length; i++) {
      if (!this.c.msgs[i].read && this.c.msgs[i].from !== this.id) {
        this.msgs.markAsRead(this.c.msgs.filter((item) => { if (!item.read && item.from !== this.id) return item; }));
        return true;
      }
    }
    return false;
  }

  send() {
    let toId = !this.auth.isPro() ? this.c.profesional._id : this.c.afiliado._id;
    if (this.chatBox !== '')

      this.c.msgs.push(this.msgs.sendMsg(this.chatBox, toId, this.id, this.c._id));
    this.chatBox = '';
    setTimeout(() => {
      this.content.scrollToBottom(300);
    });
  }

}
