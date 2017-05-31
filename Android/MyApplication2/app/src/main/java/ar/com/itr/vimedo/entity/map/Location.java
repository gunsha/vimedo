package ar.com.itr.vimedo.entity.map;

import com.google.gson.annotations.SerializedName;

import ar.com.itr.vimedo.entity.Entity;

/**
 * Created by pablo_rizzo on 07/12/2016.
 */

public class Location extends Entity {
    @SerializedName(value="lat")
    private Double latitud;
    @SerializedName(value="lng")
    private Double longitud;

    public Double getLatitud() {
        return latitud;
    }

    public void setLatitud(Double latitud) {
        this.latitud = latitud;
    }

    public Double getLongitud() {
        return longitud;
    }

    public void setLongitud(Double longitud) {
        this.longitud = longitud;
    }
}
