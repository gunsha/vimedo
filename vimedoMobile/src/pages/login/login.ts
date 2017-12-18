import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  registerCredentials: { email: string, password: string };
  
  typePassword: string = "password";

  constructor(private nav: NavController, private auth: AuthService) { 
      this.registerCredentials = {email : '', password : ''};
  }
 
  public createAccount() {
    this.nav.push(RegisterPage);
  }
 
  public login() {
    this.auth.login(this.registerCredentials).then(() => {
        this.nav.push(TabsPage,{},{animate:false});
    });
  }

  public viewPass(){
    this.typePassword = this.typePassword === "password" ? "text":"password";
  }
}