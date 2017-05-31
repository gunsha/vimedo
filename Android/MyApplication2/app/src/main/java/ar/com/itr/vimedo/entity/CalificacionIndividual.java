package ar.com.itr.vimedo.entity;

import com.google.gson.annotations.SerializedName;

/**
 * Created by pablo_rizzo on 02/01/2017.
 */

public class CalificacionIndividual extends Entity {

    @SerializedName(value="_id")
    private String id;
    @SerializedName(value="profesional")
    private Profesional profesional;
    @SerializedName(value="usuario")
    private Usuario usuario;
    @SerializedName(value="generalRating")
    private Float generalRating;
    @SerializedName(value="amabilidadRating")
    private Float amabilidadRating;
    @SerializedName(value="claridadRating")
    private Float claridadRating;
    @SerializedName(value="puntualidadRating")
    private Float puntualidadRating;
    @SerializedName(value="solicitudMedica")
    private SolicitudMedica solicitudMedica;

    public Profesional getProfesional() {
        return profesional;
    }

    public void setProfesional(Profesional profesional) {
        this.profesional = profesional;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Float getGeneralRating() {
        return generalRating;
    }

    public void setGeneralRating(Float generalRating) {
        this.generalRating = generalRating;
    }

    public Float getAmabilidadRating() {
        return amabilidadRating;
    }

    public void setAmabilidadRating(Float amabilidadRating) {
        this.amabilidadRating = amabilidadRating;
    }

    public Float getClaridadRating() {
        return claridadRating;
    }

    public void setClaridadRating(Float claridadRating) {
        this.claridadRating = claridadRating;
    }

    public Float getPuntualidadRating() {
        return puntualidadRating;
    }

    public void setPuntualidadRating(Float puntualidadRating) {
        this.puntualidadRating = puntualidadRating;
    }

    public SolicitudMedica getSolicitudMedica() {
        return solicitudMedica;
    }

    public void setSolicitudMedica(SolicitudMedica solicitudMedica) {
        this.solicitudMedica = solicitudMedica;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
