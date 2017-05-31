package ar.com.itr.vimedo.entity;

import com.google.gson.annotations.SerializedName;

/**
 * Created by pablo_rizzo on 05/12/2016.
 */

public class Coordenada extends Entity {
    @SerializedName(value="latitud")
    private String latitud;
    @SerializedName(value="longiotud")
    private String longiotud;

    public String getLatitud() {
        return latitud;
    }

    public void setLatitud(String latitud) {
        this.latitud = latitud;
    }

    public String getLongiotud() {
        return longiotud;
    }

    public void setLongiotud(String longiotud) {
        this.longiotud = longiotud;
    }
}
