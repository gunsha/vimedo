package ar.com.itr.vimedo.common;

import com.google.gson.annotations.SerializedName;
import com.google.gson.internal.Streams;

import java.io.Serializable;
import java.util.List;

import ar.com.itr.vimedo.entity.Afiliado;
import ar.com.itr.vimedo.entity.Antecedente;
import ar.com.itr.vimedo.entity.Domicilio;
import ar.com.itr.vimedo.entity.Usuario;

/**
 * Created by pablo_rizzo on 01/12/2016.
 */

public class FormularioPedidoMedico implements Serializable {
    @SerializedName(value="sintomas")
    private String sintomas;
    @SerializedName(value="horasSintomas")
    private Integer horasSintomas;
    @SerializedName(value="minutosSintomas")
    private Integer minutosSintomas;
    @SerializedName(value="usuario")
    private Usuario usuario;
    @SerializedName(value="afiliado")
    private Afiliado afiliado;
    @SerializedName(value="domicilio")
    private Domicilio domicilio;
    @SerializedName(value="antecedentesMedicos")
    private List<Antecedente> antecedenteList;

    public String getSintomas() {
        return sintomas;
    }

    public void setSintomas(String sintomas) {
        this.sintomas = sintomas;
    }

    public Integer getHorasSintomas() {
        return horasSintomas;
    }

    public void setHorasSintomas(Integer horaSintomas) {
        this.horasSintomas = horaSintomas;
    }

    public Integer getMinutosSintomas() {
        return minutosSintomas;
    }

    public void setMinutosSintomas(Integer minutoSintomas) {
        this.minutosSintomas = minutoSintomas;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Afiliado getAfiliado() {
        return afiliado;
    }

    public void setAfiliado(Afiliado afiliado) {
        this.afiliado = afiliado;
    }

    public Domicilio getDomicilio() {
        return domicilio;
    }

    public void setDomicilio(Domicilio domicilio) {
        this.domicilio = domicilio;
    }

    public List<Antecedente> getAntecedenteList() {
        return antecedenteList;
    }

    public void setAntecedenteList(List<Antecedente> antecedenteList) {
        this.antecedenteList = antecedenteList;
    }
}
