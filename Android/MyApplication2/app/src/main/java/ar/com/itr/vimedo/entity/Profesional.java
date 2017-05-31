package ar.com.itr.vimedo.entity;

import android.content.ContentValues;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.List;

import ar.com.itr.vimedo.entity.map.RutaProfesional;

/**
 * Created by pablo_rizzo on 21/11/2016.
 */

public class Profesional extends Entity {

    @SerializedName(value="_id")
    private String id;
    @SerializedName(value="matricula")
    private String matriculaProvincial;
    @SerializedName(value="matriculaNac")
    private String matriculaNacional;
    @SerializedName(value="lugarEstudio")
    private String lugarEstudio;
    @SerializedName(value="perfil")
    private String perfil;
    @SerializedName(value="personaFisica")
    private PersonaFisica personaFisica;
    @SerializedName(value="prepagas")
    private List<Prepaga> prepagas;
    @SerializedName(value="especialidades")
    private List<Especialidad> especialidades;
    @SerializedName(value="generalRating")
    private Integer generalRating;
    @SerializedName(value="amabilidadRating")
    private Integer amabilidadRating;
    @SerializedName(value="claridadRating")
    private Integer claridadRating;
    @SerializedName(value="puntualidadRating")
    private Integer puntualidadRating;

    private RutaProfesional rutaProfesional;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMatriculaProvincial() {
        return matriculaProvincial;
    }

    public void setMatriculaProvincial(String matriculaProvincial) {
        this.matriculaProvincial = matriculaProvincial;
    }

    public String getMatriculaNacional() {
        return matriculaNacional;
    }

    public void setMatriculaNacional(String matriculaNacional) {
        this.matriculaNacional = matriculaNacional;
    }

    public PersonaFisica getPersonaFisica() {
        return personaFisica;
    }

    public void setPersonaFisica(PersonaFisica personaFisica) {
        this.personaFisica = personaFisica;
    }

    public List<Prepaga> getPrepagas() {
        return prepagas;
    }

    public void setPrepagas(List<Prepaga> prepagas) {
        this.prepagas = prepagas;
    }

    public String getLugarEstudio() {
        return lugarEstudio;
    }

    public void setLugarEstudio(String lugarEstudio) {
        this.lugarEstudio = lugarEstudio;
    }

    public String getPerfil() {
        return perfil;
    }

    public void setPerfil(String perfil) {
        this.perfil = perfil;
    }

    public List<Especialidad> getEspecialidades() {
        return especialidades;
    }

    public void setEspecialidades(List<Especialidad> especialidades) {
        this.especialidades = especialidades;
    }

    public Integer getGeneralRating() {
        return generalRating;
    }

    public void setGeneralRating(Integer generalRating) {
        this.generalRating = generalRating;
    }

    public Integer getAmabilidadRating() {
        return amabilidadRating;
    }

    public void setAmabilidadRating(Integer amabilidadRating) {
        this.amabilidadRating = amabilidadRating;
    }

    public Integer getClaridadRating() {
        return claridadRating;
    }

    public void setClaridadRating(Integer claridadRating) {
        this.claridadRating = claridadRating;
    }

    public Integer getPuntualidadRating() {
        return puntualidadRating;
    }

    public void setPuntualidadRating(Integer puntualidadRating) {
        this.puntualidadRating = puntualidadRating;
    }

    public RutaProfesional getRutaProfesional() {
        return rutaProfesional;
    }

    public void setRutaProfesional(RutaProfesional rutaProfesional) {
        this.rutaProfesional = rutaProfesional;
    }
}
