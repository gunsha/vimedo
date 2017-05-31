package ar.com.itr.vimedo.entity.map;

import com.google.android.gms.maps.model.LatLng;

import java.util.List;

import ar.com.itr.vimedo.entity.Entity;

/**
 * Created by pablo_rizzo on 20/12/2016.
 */

public class RutaSimple extends Entity {
    private LatLng inicio;
    private LatLng fin;
    private List<LatLng> ruta;
    private String distancia;
    private String duracion;

    public LatLng getInicio() {
        return inicio;
    }

    public void setInicio(LatLng inicio) {
        this.inicio = inicio;
    }

    public LatLng getFin() {
        return fin;
    }

    public void setFin(LatLng fin) {
        this.fin = fin;
    }

    public List<LatLng> getRuta() {
        return ruta;
    }

    public void setRuta(List<LatLng> ruta) {
        this.ruta = ruta;
    }

    public String getDistancia() {
        return distancia;
    }

    public void setDistancia(String distancia) {
        this.distancia = distancia;
    }

    public String getDuracion() {
        return duracion;
    }

    public void setDuracion(String duracion) {
        this.duracion = duracion;
    }
}
