package ar.com.itr.vimedo.entity.map;

import com.google.android.gms.maps.model.LatLng;

import java.util.List;

import ar.com.itr.vimedo.entity.Entity;

/**
 * Created by pablo_rizzo on 20/12/2016.
 */

public class RutaProfesional extends Entity {
    private List<LatLng> marcadores;
    private List<RutaSimple> rutas;

    public List<LatLng> getMarcadores() {
        return marcadores;
    }

    public void setMarcadores(List<LatLng> marcadores) {
        this.marcadores = marcadores;
    }

    public List<RutaSimple> getRutas() {
        return rutas;
    }

    public void setRutas(List<RutaSimple> rutas) {
        this.rutas = rutas;
    }
}
