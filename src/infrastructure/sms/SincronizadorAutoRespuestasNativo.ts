import { NativeModules } from 'react-native';
import { IRepositorioAutoRespuestas } from '../../domain/ports/IRepositorioAutoRespuestas';

/**
 * Sincroniza las reglas de auto-respuesta al modulo nativo Android
 * (SharedPreferences) para que el NotificationListenerService las aplique
 * sin necesidad del hilo JS de React Native.
 */
export class SincronizadorAutoRespuestasNativo {
  constructor(
    private readonly repositorio: IRepositorioAutoRespuestas,
  ) {}

  async sincronizar(): Promise<void> {
    const { AutoResponder } = NativeModules;
    if (!AutoResponder?.actualizarReglas) return;

    const reglas = await this.repositorio.obtenerTodas();
    AutoResponder.actualizarReglas(JSON.stringify(reglas));
  }

  verificarPermisoNotificaciones(): Promise<boolean> {
    const { AutoResponder } = NativeModules;
    if (!AutoResponder?.tienePermisoNotificaciones) return Promise.resolve(false);
    return AutoResponder.tienePermisoNotificaciones();
  }

  abrirConfiguracionPermisos(): void {
    const { AutoResponder } = NativeModules;
    AutoResponder?.abrirConfiguracionPermisos?.();
  }
}
