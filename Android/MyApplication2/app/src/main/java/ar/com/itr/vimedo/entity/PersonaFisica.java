package ar.com.itr.vimedo.entity;

import android.content.ContentValues;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * Created by pablo_rizzo on 21/11/2016.
 */

public class PersonaFisica extends Entity {

    @SerializedName(value="_id")
    private String id;
    @SerializedName(value="nombre")
    private String nombre;
    @SerializedName(value="apellido")
    private String apellido;
    @SerializedName(value="sexo")
    private String sexo;
    @SerializedName(value="tipoDocumento")
    private String tipoDocumento;
    @SerializedName(value="nroDocumento")
    private Integer nroDocumento;
    @SerializedName(value="fechaNacimiento")
    private Date fechaNacimiento;
    @SerializedName(value="imagen")
    private Imagen imagen;
    @SerializedName(value="domicilios")
    private List<Domicilio> domicilios;
    @SerializedName(value="telefonos")
    private List<Telefono> telefonos;

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

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getSexo() { return sexo; }

    public void setSexo(String sexo) { this.sexo = sexo; }

    public String getTipoDocumento() {
        return tipoDocumento;
    }

    public void setTipoDocumento(String tipoDocumento) {
        this.tipoDocumento = tipoDocumento;
    }

    public Date getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(Date fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public Integer getNroDocumento() {
        return nroDocumento;
    }

    public void setNroDocumento(Integer nroDocumento) {
        this.nroDocumento = nroDocumento;
    }

    public Imagen getImagen() {
        return imagen;
    }

    public void setImagen(Imagen imagen) {
        this.imagen = imagen;
    }

    public List<Domicilio> getDomicilios() {
        return domicilios;
    }

    public void setDomicilios(List<Domicilio> domicilios) {
        this.domicilios = domicilios;
    }

    public List<Telefono> getTelefonos() {
        return telefonos;
    }

    public void setTelefonos(List<Telefono> telefonos) {
        this.telefonos = telefonos;
    }
}
