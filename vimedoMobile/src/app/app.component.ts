import { Component } from '@angular/core';
import { Platform,Config } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthService } from '../providers/auth-service';

import { TabsPage } from '../pages/tabs/tabs';

import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})

export class Vimedo {

  rootPage: any = AuthService.authenticated() ? TabsPage:LoginPage ;

  pages: Array<{title: string, component: any}>;

  constructor(public config:Config,public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    //this.config.set('ios', 'statusbarPadding', false);
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
