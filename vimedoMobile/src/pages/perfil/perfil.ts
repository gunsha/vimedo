import { Component } from '@angular/core';
import { App } from 'ionic-angular';
import { ActionSheetController, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';
import { CardIO } from '@ionic-native/card-io';

@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
  user: any = {};
  constructor(private _app: App,public navCtrl: NavController, public navParams: NavParams, private auth: AuthService,public actionSheetCtrl: ActionSheetController, private cardIO: CardIO) {
    this.user = auth.user;
    //console.log(this.user)
  }

  scanCard(){
    this.cardIO.canScan()
  .then(
    (res: boolean) => {
      if(res){
        let options = {
          requireExpiry: false,
          requireCVV: false,
          requirePostalCode: false
        };
        
        this.cardIO.scan(options).then((res: any) =>{
          console.log(res);
        });
      }
    }
  );
  }

  update(){
    let req = this.auth.isPro() ? this.user.profesional : this.user.afiliado;
    req.usuario = {_id:this.user._id,email:this.user.email,password:this.user.password};
    this.auth.updateProfile(req);
  }

  logout(){
    this.auth.logout();
    //const root = this._app.getRootNav();
    //root.popToRoot();
    this._app.getRootNavs()[0].setRoot(LoginPage);
  }
  presentActionSheet() {
    
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Cerrar Sesión',
          handler: () => {
            this.logout();
          }
        },{
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

}
