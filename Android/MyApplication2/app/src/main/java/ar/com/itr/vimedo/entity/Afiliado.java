package ar.com.itr.vimedo.entity;

import com.google.gson.annotations.SerializedName;

/**
 * Created by pablo_rizzo on 21/11/2016.
 */

public class Afiliado extends Entity {

    @SerializedName(value="_id")
    private String id;
    @SerializedName(value="credencial")
    private String credencial;
    @SerializedName(value="personaFisica")
    private PersonaFisica personaFisica;
    @SerializedName(value="prepaga")
    private Prepaga prepaga;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCredencial() {
        return credencial;
    }

    public void setCredencial(String credencial) {
        this.credencial = credencial;
    }

    public PersonaFisica getPersonaFisica() {
        return personaFisica;
    }

    public void setPersonaFisica(PersonaFisica personaFisica) { this.personaFisica = personaFisica; }

    public Prepaga getPrepaga() {
        return prepaga;
    }

    public void setPrepaga(Prepaga prepaga) {
        this.prepaga = prepaga;
    }
}
