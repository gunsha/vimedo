import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { MapsAPILoader } from '@agm/core';
import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';

declare var google: any;
@Component({
  selector: 'page-register-step2',
  templateUrl: 'register-step2.html',
})

export class RegisterStep2Page {
  registerCredentials: any;
  autocompleteService: any;
  placesService: any;
  query: string = '';
  tel: string = '';
  componentForm = {
    street_number: {
      type: 'short_name',
      name: 'numero'
    },
    route: {
      type: 'long_name',
      name: 'calle'
    },
    locality: {
      type: 'short_name',
      name: 'localidad'
    },
    administrative_area_level_1: {
      type: 'long_name',
      name: 'provincia'
    },
    country: {
      type: 'long_name',
      name: 'pais'
    },
    postal_code: {
      type: 'short_name',
      name: 'cp'
    }
  };
  constructor(public navCtrl: NavController, public navParams: NavParams, private mapsAPILoader: MapsAPILoader, public alertCtrl: AlertController, private auth: AuthService) {
    this.registerCredentials = navParams.get('item');
    this.registerCredentials.personaFisica = { domicilios: [], telefonosA: [] };
    this.mapsAPILoader.load().then(() => {
      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.placesService = new google.maps.places.PlacesService(window.document.createElement('div'));
    });
  }

  search() {
    if (this.query == '')
      return false;
    let opt = { componentRestrictions: { country: 'ar' }, types: ['geocode'], input: this.query };
    this.autocompleteService.getPlacePredictions(opt, (data) => {
      let alert = this.alertCtrl.create();
      alert.setTitle('Seleccione dirección');
      data.forEach(element => {
        alert.addInput({
          type: 'radio',
          label: element.description,
          value: element
        });
      });

      alert.addButton('Cancelar');
      alert.addButton({
        text: 'Aceptar',
        handler: data => {
          this.placesService.getDetails({ placeId: data.place_id }, (place) => {
            this.registerCredentials.personaFisica.domicilios.push(this.placeChanged(place));
          })
        }
      });
      alert.present();
    });
  }
  removeDom(index) {
    this.registerCredentials.personaFisica.domicilios.splice(index, 1);
  };

  addTel() {
    if (this.tel != '')
      this.registerCredentials.personaFisica.telefonosA.push(this.tel);
    this.tel = '';
  };
  removeTel(index) {
    this.registerCredentials.personaFisica.telefonosA.splice(index, 1);
  };
  placeChanged(place) {
    this.query = '';
    let direccion: any = {};
    for (var i = 0; i < place.address_components.length; i++) {
      var addressType = place.address_components[i].types[0];
      if (this.componentForm[addressType]) {
        var val = place.address_components[i][this.componentForm[addressType].type];
        direccion[this.componentForm[addressType].name] = val;
      }
    }
    direccion.latitud = place.geometry.location.lat();
    direccion.longitud = place.geometry.location.lng();
    direccion.coordenadas = place.geometry.location.lat() + ',' + place.geometry.location.lng();
    return direccion;
  }
  register = function () {
    if (this.validateSave()) {
      this.registerCredentials.personaFisica.telefonos = this.registerCredentials.personaFisica.telefonosA.toString();
        this.auth.register(this.registerCredentials).then(function () {
          let alert = this.alertCtrl.create({
            subTitle: 'Su usuario esta pendiente de activación!',
            buttons: [{
              text: 'Aceptar', handler: data => {
                this.navCtrl.setRoot(LoginPage)
              }
            }]
          });
          alert.present(prompt);
        })
    }
  };
  validateSave = function () {
    if (this.registerCredentials.personaFisica.telefonosA.length !== 0) {
      if (this.registerCredentials.personaFisica.domicilios.length !== 0) {
        return true;
      } else {
        this.showError("Ingrese al menos una direccion.");
      }
    } else {
      this.showError("Ingrese al menos un telefono.");
    }
    return false;
  }

  showError(text) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: text,
      buttons: ['Aceptar']
    });
    alert.present(prompt);
  }

}
