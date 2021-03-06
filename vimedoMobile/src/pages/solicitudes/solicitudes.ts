import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { ProfessionalService } from '../../providers/professional/professional';
import {AfiliadoService} from '../../providers/afiliado/afiliado';
import { SolicitudDetailPage } from '../solicitud-detail/solicitud-detail';
import { MapsAPILoader } from '@agm/core';

declare var google: any;
@Component({
  selector: 'page-solicitudes',
  templateUrl: 'solicitudes.html',
})
export class SolicitudesPage {

  solicitudes: any = [];
  pages: Array<any>;
  vista: String = 'lista';
  enableRefresh: boolean = true;
  map: any;
  wrapper: any;
  mapBounds: any;
  latitude: number;
  longitude: number;
  zoom: number;

  constructor(public navCtrl: NavController, private auth: AuthService, private pro: ProfessionalService, private mapsAPILoader: MapsAPILoader, private afil: AfiliadoService) {
    this.getSolicitudesPro();
    this.setCurrentPosition();
  }

  getSolicitudesPro() {
    if(this.auth.isPro())
    return this.pro.solicitudes(this.auth.getProfileId()).then((data)=>{
      this.solicitudes = data;
    });
    else
      return this.afil.solicitudes(this.auth.getProfileId()).then((data)=>{
      this.solicitudes = data;
    });
  }

  openDetail(item) {
    this.navCtrl.push(SolicitudDetailPage, { item: item, isPro: this.auth.isPro() });
  }

  doRefresh(refresher) {
    this.getSolicitudesPro().then(() => refresher.complete())

  }

  segmentChanged() {
    this.enableRefresh = this.vista === 'lista';
    this.mapsAPILoader.load().then(() => {
      this.onFitContents();

    });
  }

  private onFitContents() {
    let bounds = new google.maps.LatLngBounds();
    this.solicitudes.forEach(element => {
      bounds.extend(new google.maps.LatLng(element.domicilio.latitud, element.domicilio.longitud));
    });
    this.mapBounds = bounds;
    //console.log(bounds)
  }
  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }
}
