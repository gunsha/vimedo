package ar.com.itr.vimedo.interfaces;

import java.io.Serializable;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Method;
import java.util.List;

import ar.com.itr.vimedo.CustomFragment;
import ar.com.itr.vimedo.common.FormularioLogin;
import ar.com.itr.vimedo.common.FormularioPedidoMedico;
import ar.com.itr.vimedo.common.FormularioRegistro;
import ar.com.itr.vimedo.entity.Afiliado;
import ar.com.itr.vimedo.entity.Antecedente;
import ar.com.itr.vimedo.entity.CalificacionIndividual;
import ar.com.itr.vimedo.entity.Domicilio;
import ar.com.itr.vimedo.entity.Especialidad;
import ar.com.itr.vimedo.entity.Prepaga;
import ar.com.itr.vimedo.entity.Profesional;
import ar.com.itr.vimedo.entity.SolicitudMedica;
import ar.com.itr.vimedo.entity.Usuario;
import layout.Login;
import layout.PacCalificarMedico;
import layout.Registro;
import layout.SolicitarMedico;

/**
 * Created by pablo_rizzo on 21/11/2016.
 */

public interface ApplicationManagerInterface extends Serializable {

    public void initApplication();

    public List<String> getPrepagaNameList();

    public List<String> getAntecedenteNameList();

    public List<String> getHoraList();

    public List<String> getMinutoList();

    public Antecedente getAntecedenteById(String id);

    public Antecedente getAntecedenteByName(String name);

    public Especialidad getEspecialidadById (String id);

    public Especialidad getEspecialidadByName (String name);

    public Prepaga getPrepagaByName(String name);

    public void loadProfesionalRoutes(CustomFragment cf);

    public void loadSolicitudesMedicasRoute(CustomFragment cf);

    public void loadSolicitudesMedicasPaciente(CustomFragment cf);

    public void loadSolicitudesMedicasProfesional(CustomFragment cf);

    public void registerUser(FormularioRegistro fr, CustomFragment cf) throws UnsupportedEncodingException;

    public void solicitarMedico(FormularioPedidoMedico fpm, CustomFragment cf) throws UnsupportedEncodingException;

    public void loginUser(FormularioLogin fl, CustomFragment cf) throws UnsupportedEncodingException;

    public void finalizarSolicitudMedica(String solicitudMedicaId, CustomFragment cf);

    public String getTipoUsuario();

    public List<Domicilio> getDomiciliosGrupoFamiliar();

    public void loadDomiciliosUtilizados();

    public List<Domicilio> getDomiciliosUtilizados();

    public List<Afiliado> getAfiliadosGrupoFamiliar();

    public Usuario getUserLogued();

    public boolean isSolicitudesPendientes();

    public Profesional getProfesional();

    List<SolicitudMedica> getSolicitudesMedicasPendientesProfesional();

    SolicitudMedica getSolicitudMedicaPendientePaciente();

    List<Integer> getColorList();

    void deleteSolicitudMedicaProfesionalFromList(SolicitudMedica id);

    void calificarProfesional(CalificacionIndividual calificacion, CustomFragment cf) throws UnsupportedEncodingException;
}
