package ar.com.itr.vimedo.entity;

import android.content.ContentValues;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

/**
 * Created by pablo_rizzo on 21/11/2016.
 */

public class Domicilio extends Entity {

    @SerializedName(value = "_id")
    private String id;
    @SerializedName(value = "calle")
    private String calle;
    @SerializedName(value = "numero")
    private String numero;
    @SerializedName(value = "localidad")
    private String localidad;
    @SerializedName(value = "provincia")
    private String provincia;
    @SerializedName(value = "entreCalles")
    private String entreCalles;
    @SerializedName(value = "coordenadas")
    private String coordenadas;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCalle() {
        return calle;
    }

    public void setCalle(String calle) {
        this.calle = calle;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getLocalidad() {
        return localidad;
    }

    public void setLocalidad(String localidad) {
        this.localidad = localidad;
    }

    public String getProvincia() {
        return provincia;
    }

    public void setProvincia(String provincia) {
        this.provincia = provincia;
    }

    public String getEntreCalles() {
        return entreCalles;
    }

    public void setEntreCalles(String entreCalles) {
        this.entreCalles = entreCalles;
    }

    public String getCoordenadas() {
        return coordenadas;
    }

    public void setCoordenadas(String coordenadas) {
        this.coordenadas = coordenadas;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Domicilio domicilio = (Domicilio) o;
        if (id==null || domicilio.id==null) return false;
        return id.equals(domicilio.id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }
}
