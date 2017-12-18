import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { PerfilPage } from '../perfil/perfil';
import { MensajesPage } from '../mensajes/mensajes';
import { HistorialPage } from '../historial/historial';
import { SolicitudesPage } from '../solicitudes/solicitudes';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tabRoot1 = HomePage;
  tabRoot2 = PerfilPage;
  tabRoot3 = MensajesPage;
  tabRoot4 = SolicitudesPage;
  tabRoot5 = HistorialPage;

  constructor() {

  }
}
