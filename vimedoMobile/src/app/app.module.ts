import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { IonicStorageModule } from '@ionic/storage';

import { Vimedo } from './app.component';
import { HomePage } from '../pages/home/home';
import { PerfilPage } from '../pages/perfil/perfil';
import { MensajesPage } from '../pages/mensajes/mensajes';
import { HistorialPage } from '../pages/historial/historial';
import { SolicitudesPage } from '../pages/solicitudes/solicitudes';
import {SolicitudDetailPage} from '../pages/solicitud-detail/solicitud-detail';
import {SolicitudCerrarPage} from '../pages/solicitud-cerrar/solicitud-cerrar';
import { NuevaSolicitudPage } from '../pages/nueva-solicitud/nueva-solicitud';
import {SintomasModalPage} from '../pages/sintomas-modal/sintomas-modal';
import {ForgotPage} from '../pages/forgot/forgot';
import { ChatPage } from '../pages/chat/chat';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { RegisterStep2Page } from '../pages/register-step2/register-step2';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from './../providers/auth-service';
import { ProfessionalService } from '../providers/professional/professional';
import { APP_CONFIG, AppConfig } from './app.config';
import { MessagesProvider } from '../providers/messages/messages';
import { AgmCoreModule } from '@agm/core';
import { AfiliadoService } from '../providers/afiliado/afiliado';
import { SolicitudService } from '../providers/solicitud/solicitud';
import { HttpService } from '../providers/http-service/http-service';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { AlertController, LoadingController } from 'ionic-angular';
import { CardIO } from '@ionic-native/card-io';

export function httpInterceptor(backend: XHRBackend, options: RequestOptions,alert:AlertController, loading:LoadingController) {
        return new HttpService(backend, options,alert,loading);
}

@NgModule({
  declarations: [
    Vimedo,
    HomePage,
PerfilPage,
MensajesPage,
HistorialPage,
SolicitudesPage,
SolicitudDetailPage,
SolicitudCerrarPage,
NuevaSolicitudPage,
SintomasModalPage,
ChatPage,
LoginPage,
RegisterPage,
RegisterStep2Page,
ForgotPage,
TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(Vimedo,{
      backButtonText: '',
    backButtonIcon:'ios-arrow-dropleft'}),
    IonicStorageModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDoIklkBzmZOHP28l2znHtu3vxzjcaLqXI',
      libraries: ["places"]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Vimedo,
    HomePage,
PerfilPage,
MensajesPage,
HistorialPage,
SolicitudesPage,
SolicitudDetailPage,
SolicitudCerrarPage,
NuevaSolicitudPage,
SintomasModalPage,
ChatPage,
LoginPage,
RegisterPage,
RegisterStep2Page,
TabsPage,
ForgotPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    ProfessionalService,
    { provide: APP_CONFIG, useValue: AppConfig },
    MessagesProvider,
    AfiliadoService,
    SolicitudService,
    { provide: Http,
      useFactory: (httpInterceptor),
      deps: [XHRBackend, RequestOptions,AlertController, LoadingController]
    },
    CardIO
  ]
})
export class AppModule {}
