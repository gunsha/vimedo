package ar.com.itr.vimedo.common;

import java.io.Serializable;

/**
 * Created by pablo_rizzo on 22/11/2016.
 */

public class FormularioLogin implements Serializable {
    private String email;
    private String password;

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
}
