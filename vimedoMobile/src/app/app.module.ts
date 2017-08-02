import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
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
import { ChatPage } from '../pages/chat/chat';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from './../providers/auth-service';
import { ProfessionalService } from '../providers/professional/professional';
import { APP_CONFIG, AppConfig } from './app.config';
import { MessagesProvider } from '../providers/messages/messages';
import { AgmCoreModule } from '@agm/core';
import { AfiliadoService } from '../providers/afiliado/afiliado';

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
ChatPage,
LoginPage,
RegisterPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(Vimedo,{
      backButtonText: 'Atras'}),
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
ChatPage,
LoginPage,
RegisterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    ProfessionalService,
    { provide: APP_CONFIG, useValue: AppConfig },
    MessagesProvider,
    AfiliadoService
  ]
})
export class AppModule {}
