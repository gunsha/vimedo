package ar.com.itr.vimedo.entity;

import android.content.ContentValues;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.Date;

/**
 * Created by pablo_rizzo on 21/11/2016.
 */

public class Usuario extends Entity {
    @SerializedName(value="_id")
    private String id;
    @SerializedName(value="email")
    private String email;
    @SerializedName(value="password")
    private String password;
    @SerializedName(value="token")
    private String token;
    @SerializedName(value="fechaLogout")
    private Date fechaLogin;
    @SerializedName(value="fechaLogin")
    private Date fechaLogout;
    @SerializedName(value="fechaAlta")
    private Date fechaAlta;
    @SerializedName(value="afiliado")
    private Afiliado afiliado;
    @SerializedName(value="profesional")
    private Profesional profesional;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Date getFechaLogin() {
        return fechaLogin;
    }

    public void setFechaLogin(Date fechaLogin) {
        this.fechaLogin = fechaLogin;
    }

    public Date getFechaLogout() {
        return fechaLogout;
    }

    public void setFechaLogout(Date fechaLogout) {
        this.fechaLogout = fechaLogout;
    }

    public Date getFechaAlta() {
        return fechaAlta;
    }

    public void setFechaAlta(Date fechaAlta) {
        this.fechaAlta = fechaAlta;
    }

    public Afiliado getAfiliado() {
        return afiliado;
    }

    public void setAfiliado(Afiliado afiliado) {
        this.afiliado = afiliado;
    }

    public Profesional getProfesional() {
        return profesional;
    }

    public void setProfesional(Profesional profesional) {
        this.profesional = profesional;
    }
}
