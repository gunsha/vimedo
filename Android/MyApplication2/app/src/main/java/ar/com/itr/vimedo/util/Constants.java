package ar.com.itr.vimedo.util;

/**
 * Created by pablo_rizzo on 14/11/2016.
 */

public class Constants {
    public static final String SCREEN_INIT = "init";
    public static final String SCREEN_REGISTER = "register";
    public static final String SCREEN_PROF_DESKTOP = "desktop";
    public static final String SCREEN_PAC_DESKTOP = "pacDesktop";
    public static final String SCREEN_FORGET_PASSWORD = "forgetPassword";
    public static final String SCREEN_SOLICITAR_MEDICO = "solicitarMedico";
    public static final String SCREEN_SOLICITAR_MEDICO_OK = "solicitarMedicoOk";
    public static final String SCREEN_PAC_VISITAS_PENDIENTES = "pacVisitasPendientes";
    public static final String SCREEN_PROF_VISITAS_PENDIENTES = "profVisitasPendientes";
    public static final String SCREEN_PROF_SOL_MED_DETAIL = "profSolMedDetail";
    public static final String SCREEN_PAC_CALIFICAR_PROFESIONAL = "calificarProfesional";

    public static final int SERVICE_OK = 1;
    public static final int GENERAL_FAILURE = 2;
    public static final int SERVICE_FAILURE = -1;

    public static final String TIPO_USUARIO_PACIENTE = "P";
    public static final String TIPO_USUARIO_MEDICO = "M";
    public static final String TIPO_USUARIO_UNDEFINED = "U";

    public static final int TYPE_CARGA_SOLICITUDES_MEDICAS = 1;
    public static final int TYPE_CARGA_RUTAS_SOLICITUDES_MEDICAS = 2;
    public static final int TYPE_SOLICITUD_FINALIZADA = 3;
    public static final int TYPE_CALIFICACION_OK = 4;

    public static final String MAP_PARAM_NAME_SOLICITUD_MEDICA = "solicitudMedica";
    
    public static final Integer SOLICITUD_MEDICA_ESTADO_PENDIENTE = 0;
    public static final Integer SOLICITUD_MEDICA_ESTADO_ASIGNADA = 1;
    public static final Integer SOLICITUD_MEDICA_ESTADO_FINALIZADA_X_MEDICO = 2;
    public static final Integer SOLICITUD_MEDICA_ESTADO_FINALIZADA_CALIFACADA = 2;
    
    public static final int MINUTES_ATENTION = 40;
}
