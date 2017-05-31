package ar.com.itr.vimedo.common;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

import ar.com.itr.vimedo.entity.Prepaga;

/**
 * Created by pablo_rizzo on 22/11/2016.
 */

public class FormularioRegistro implements Serializable {

    @SerializedName(value="isProfesional")
    private Boolean esProfesional;
    @SerializedName(value="prepaga")
    private Prepaga prepaga;
    @SerializedName(value="credencial")
    private String credencial;
    @SerializedName(value="matricula")
    private String mp;
    @SerializedName(value="email")
    private String email;
    @SerializedName(value="password")
    private String password;
    @SerializedName(value="repeatPassword")
    private String repeatPassword;


    public Boolean getEsProfesional() {
        return esProfesional;
    }

    public void setEsProfesional(Boolean esProfesional) {
        this.esProfesional = esProfesional;
    }

    public Prepaga getPrepaga() {
        return prepaga;
    }

    public void setPrepaga(Prepaga prepaga) {
        this.prepaga = prepaga;
    }

    public String getCredencial() {
        return credencial;
    }

    public void setCredencial(String credencial) {
        this.credencial = credencial;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRepeatPassword() {
        return repeatPassword;
    }

    public void setRepeatPassword(String repeatPassword) {
        this.repeatPassword = repeatPassword;
    }

    public String getMp() {
        return mp;
    }

    public void setMp(String mp) {
        this.mp = mp;
    }
}
