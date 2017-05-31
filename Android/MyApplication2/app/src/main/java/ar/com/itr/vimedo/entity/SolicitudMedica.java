package ar.com.itr.vimedo.entity;

import com.google.android.gms.maps.model.LatLng;
import com.google.gson.annotations.SerializedName;

import java.util.Date;
import java.util.List;

import ar.com.itr.vimedo.entity.map.RouteResponse;
import ar.com.itr.vimedo.entity.map.RutaProfesional;

/**
 * Created by pablo_rizzo on 02/12/2016.
 */

public class SolicitudMedica extends Entity {
    @SerializedName(value="_id")
    private String id;
    @SerializedName(value="usuario")
    private Usuario usuario;
    @SerializedName(value="afiliado")
    private Afiliado afiliado;
    @SerializedName(value="profesional")
    private Profesional profesional;
    @SerializedName(value="domicilio")
    private Domicilio domicilio;
    @SerializedName(value="fechaAlta")
    private Date fechaAlta;
    @SerializedName(value="fechaBaja")
    private Date fechaBaja;
    @SerializedName(value="latitud")
    private String latitud;
    @SerializedName(value="longitud")
    private String longitud;
    @SerializedName(value="sintomas")
    private String sintomas;
    @SerializedName(value="horasSintomas")
    private String horasSintomas;
    @SerializedName(value="minutosSintomas")
    private String minutosSintomas;
    @SerializedName(value="antecedentesMedicos")
    private List<Antecedente> antecedentesMedicos;
    @SerializedName(value="horarioEstimadoArrivo")
    private Date horarioEstimadoArrivo;
    @SerializedName(value="rutaViaje")
    private List<LatLng> rutaViaje;
    @SerializedName(value="tiempoViaje")
    private Date tiempoViaje ;
    @SerializedName(value="estado")
    private Integer estado ;

    private RouteResponse routeResponse;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public Profesional getProfesional() {
        return profesional;
    }

    public void setProfesional(Profesional profesional) {
        this.profesional = profesional;
    }

    public Domicilio getDomicilio() {
        return domicilio;
    }

    public void setDomicilio(Domicilio domicilio) {
        this.domicilio = domicilio;
    }

    public Date getFechaAlta() {
        return fechaAlta;
    }

    public void setFechaAlta(Date fechaAlta) {
        this.fechaAlta = fechaAlta;
    }

    public Date getFechaBaja() {
        return fechaBaja;
    }

    public void setFechaBaja(Date fechaBaja) {
        this.fechaBaja = fechaBaja;
    }

    public String getLatitud() {
        return latitud;
    }

    public void setLatitud(String latitud) {
        this.latitud = latitud;
    }

    public String getLongitud() {
        return longitud;
    }

    public void setLongitud(String longitud) {
        this.longitud = longitud;
    }

    public String getSintomas() {
        return sintomas;
    }

    public void setSintomas(String sintomas) {
        this.sintomas = sintomas;
    }

    public String getHorasSintomas() {
        return horasSintomas;
    }

    public void setHorasSintomas(String horasSintomas) {
        this.horasSintomas = horasSintomas;
    }

    public String getMinutosSintomas() {
        return minutosSintomas;
    }

    public void setMinutosSintomas(String minutosSintomas) {
        this.minutosSintomas = minutosSintomas;
    }

    public List<Antecedente> getAntecedentesMedicos() {
        return antecedentesMedicos;
    }

    public void setAntecedentesMedicos(List<Antecedente> antecedentesMedicos) {
        this.antecedentesMedicos = antecedentesMedicos;
    }

    public Date getHorarioEstimadoArrivo() {
        return horarioEstimadoArrivo;
    }

    public void setHorarioEstimadoArrivo(Date horarioEstimadoArrivo) {
        this.horarioEstimadoArrivo = horarioEstimadoArrivo;
    }

    public List<LatLng> getRutaViaje() {
        return rutaViaje;
    }

    public void setRutaViaje(List<LatLng> rutaViaje) {
        this.rutaViaje = rutaViaje;
    }

    public Date getTiempoViaje() {
        return tiempoViaje;
    }

    public void setTiempoViaje(Date tiempoViaje) {
        this.tiempoViaje = tiempoViaje;
    }

    public RouteResponse getRouteResponse() {
        return routeResponse;
    }

    public void setRouteResponse(RouteResponse routeResponse) {
        this.routeResponse = routeResponse;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    public String getAntecedentesMedicosString() {
        StringBuffer sb = new StringBuffer();
        if (antecedentesMedicos!=null && !antecedentesMedicos.isEmpty()) {
            int index = 1;
            for (Antecedente antecedente: antecedentesMedicos) {
                sb.append(antecedente.getNombre());
                if (index<antecedentesMedicos.size()) {
                    sb.append(",");
                }
                index++;
            }
        }
        return sb.toString();
    }
}
