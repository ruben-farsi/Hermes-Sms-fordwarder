import { EvaluadorDeReglas } from '../../domain/services/EvaluadorDeReglas';
import { EvaluarYReenviarSms } from '../../application/EvaluarYReenviarSms';
import { GestionarReglas } from '../../application/GestionarReglas';
import { ConfigurarTelegram } from '../../application/ConfigurarTelegram';
import { ObtenerRegistroDeMensajes } from '../../application/ObtenerRegistroDeMensajes';
import { ControlarServicioSms } from '../../application/ControlarServicioSms';
import { GestionarAjustes } from '../../application/GestionarAjustes';
import { ProcesarColaPendientes } from '../../application/ProcesarColaPendientes';
import { ReintentarMensaje } from '../../application/ReintentarMensaje';
import { GestionarAutoRespuestas } from '../../application/GestionarAutoRespuestas';
import { RepositorioMensajesAsyncStorage } from '../persistence/RepositorioMensajesAsyncStorage';
import { RepositorioReglasAsyncStorage } from '../persistence/RepositorioReglasAsyncStorage';
import { RepositorioConfigTelegramSecureStore } from '../persistence/RepositorioConfigTelegramAsyncStorage';
import { RepositorioAjustesAsyncStorage } from '../persistence/RepositorioAjustesAsyncStorage';
import { RepositorioPendientesAsyncStorage } from '../persistence/RepositorioPendientesAsyncStorage';
import { RepositorioAutoRespuestasAsyncStorage } from '../persistence/RepositorioAutoRespuestasAsyncStorage';
import { EnviadorTelegramApi } from '../telegram/EnviadorTelegramApi';
import { ReceptorSmsNativo } from '../sms/ReceptorSmsNativo';
import { SincronizadorConfigNativa } from '../sms/SincronizadorConfigNativa';
import { SincronizadorAutoRespuestasNativo } from '../sms/SincronizadorAutoRespuestasNativo';
import { MonitorDeRedNetInfo } from '../network/MonitorDeRedNetInfo';
import { EnviadorWebhookHttp } from '../webhook/EnviadorWebhookHttp';
import { NotificadorExpo } from '../notifications/NotificadorExpo';

export class ContenedorDeDependencias {
  private static instancia: ContenedorDeDependencias;

  readonly evaluarYReenviarSms: EvaluarYReenviarSms;
  readonly gestionarReglas: GestionarReglas;
  readonly configurarTelegram: ConfigurarTelegram;
  readonly obtenerRegistroDeMensajes: ObtenerRegistroDeMensajes;
  readonly controlarServicioSms: ControlarServicioSms;
  readonly gestionarAjustes: GestionarAjustes;
  readonly procesarColaPendientes: ProcesarColaPendientes;
  readonly reintentarMensaje: ReintentarMensaje;
  readonly sincronizadorConfigNativa: SincronizadorConfigNativa;
  readonly gestionarAutoRespuestas: GestionarAutoRespuestas;
  readonly sincronizadorAutoRespuestasNativo: SincronizadorAutoRespuestasNativo;

  // @ts-expect-error stored for cleanup reference
  private cancelarMonitoreoRed: (() => void) | null = null;

  private constructor() {
    const repositorioMensajes = new RepositorioMensajesAsyncStorage();
    const repositorioReglas = new RepositorioReglasAsyncStorage();
    const repositorioConfig = new RepositorioConfigTelegramSecureStore();
    const repositorioAjustes = new RepositorioAjustesAsyncStorage();
    const repositorioPendientes = new RepositorioPendientesAsyncStorage();
    const enviadorTelegram = new EnviadorTelegramApi();
    const receptorSms = new ReceptorSmsNativo();
    const evaluadorDeReglas = new EvaluadorDeReglas();
    const monitorDeRed = new MonitorDeRedNetInfo();
    const enviadorWebhook = new EnviadorWebhookHttp();
    const notificador = new NotificadorExpo();
    const repositorioAutoRespuestas = new RepositorioAutoRespuestasAsyncStorage();

    this.evaluarYReenviarSms = new EvaluarYReenviarSms(
      repositorioReglas,
      repositorioMensajes,
      repositorioConfig,
      enviadorTelegram,
      evaluadorDeReglas,
      repositorioAjustes,
      repositorioPendientes,
      monitorDeRed,
      enviadorWebhook,
      notificador,
    );

    this.procesarColaPendientes = new ProcesarColaPendientes(
      repositorioPendientes,
      repositorioMensajes,
      repositorioConfig,
      enviadorTelegram,
      repositorioAjustes,
    );

    this.gestionarAjustes = new GestionarAjustes(repositorioAjustes);

    this.reintentarMensaje = new ReintentarMensaje(
      repositorioMensajes,
      repositorioConfig,
      enviadorTelegram,
      repositorioAjustes,
    );

    this.gestionarReglas = new GestionarReglas(repositorioReglas);

    this.configurarTelegram = new ConfigurarTelegram(
      repositorioConfig,
      enviadorTelegram,
    );

    this.obtenerRegistroDeMensajes = new ObtenerRegistroDeMensajes(
      repositorioMensajes,
    );

    this.controlarServicioSms = new ControlarServicioSms(
      receptorSms,
      this.evaluarYReenviarSms,
    );

    this.sincronizadorConfigNativa = new SincronizadorConfigNativa(
      repositorioConfig,
      repositorioReglas,
    );

    this.gestionarAutoRespuestas = new GestionarAutoRespuestas(repositorioAutoRespuestas);
    this.sincronizadorAutoRespuestasNativo = new SincronizadorAutoRespuestasNativo(repositorioAutoRespuestas);

    this.cancelarMonitoreoRed = monitorDeRed.alRecuperarConexion(() => {
      this.procesarColaPendientes.ejecutar().catch(() => {});
    });
  }

  static obtenerInstancia(): ContenedorDeDependencias {
    if (!ContenedorDeDependencias.instancia) {
      ContenedorDeDependencias.instancia = new ContenedorDeDependencias();
    }
    return ContenedorDeDependencias.instancia;
  }

  dispose(): void {
    if (this.cancelarMonitoreoRed) {
      this.cancelarMonitoreoRed();
      this.cancelarMonitoreoRed = null;
    }
  }
}
