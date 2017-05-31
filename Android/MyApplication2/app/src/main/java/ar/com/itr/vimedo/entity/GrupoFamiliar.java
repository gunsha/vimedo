package ar.com.itr.vimedo.entity;

import android.content.ContentValues;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.List;

/**
 * Created by pablo_rizzo on 21/11/2016.
 */

public class GrupoFamiliar extends Entity {

    @SerializedName(value="_id")
    private String id;
    @SerializedName(value="descripcion")
    private String descripcion;
    @SerializedName(value="afiliados")
    private List<Afiliado> afiliados;

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

    public List<Afiliado> getAfiliados() {
        return afiliados;
    }

    public void setAfiliados(List<Afiliado> afiliados) {
        this.afiliados = afiliados;
    }
}
