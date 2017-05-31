package ar.com.itr.vimedo.entity;

import android.content.ContentValues;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

/**
 * Created by pablo_rizzo on 21/11/2016.
 */

public class Telefono extends Entity {

    @SerializedName(value="_id")
    private String id;
    @SerializedName(value="codigo")
    private String codigo;
    @SerializedName(value="numero")
    private String numero;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }
}
