package ar.com.itr.vimedo.entity;

import com.google.gson.annotations.SerializedName;

/**
 * Created by pablo_rizzo on 05/12/2016.
 */

public class Especialidad extends Entity {
    @SerializedName(value="id")
    private String id;
    @SerializedName(value="nombre")
    private String nombre;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}

