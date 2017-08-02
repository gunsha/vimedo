import { Component, ViewChild } from '@angular/core';
import { Nav, Platform,Config } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthService } from '../providers/auth-service';

import { HomePage } from '../pages/home/home';
import { PerfilPage } from '../pages/perfil/perfil';
import { MensajesPage } from '../pages/mensajes/mensajes';
import { HistorialPage } from '../pages/historial/historial';
import { SolicitudesPage } from '../pages/solicitudes/solicitudes';

import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})

export class Vimedo {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = AuthService.authenticated() ? HomePage:LoginPage ;

  pages: Array<{title: string, component: any}>;

  constructor(public config:Config,public platform: Platform, private auth: AuthService, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.config.set('ios', 'statusbarPadding', false);
    this.initializeApp();

    this.pages = [
      { title: 'Inicio', component: HomePage },
      { title: 'Perfil', component: PerfilPage },
      { title: 'Mensajes', component: MensajesPage },
      { title: 'Solicitudes', component: SolicitudesPage },
      { title: 'Historial', component: HistorialPage }
    ];

  }

  logout(){
    this.auth.logout();
    this.nav.setRoot(LoginPage);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
