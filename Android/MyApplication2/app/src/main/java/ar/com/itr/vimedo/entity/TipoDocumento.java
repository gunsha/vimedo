package ar.com.itr.vimedo.entity;

import android.content.ContentValues;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

/**
 * Created by pablo_rizzo on 21/11/2016.
 */

public class TipoDocumento extends Entity {

    @SerializedName(value="_id")
    private String id;
    @SerializedName(value="descripcion")
    private String descripcion;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
