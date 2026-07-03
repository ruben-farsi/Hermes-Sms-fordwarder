import { MensajeSms, EstadoMensaje } from '../domain/entities/MensajeSms';
import { IRepositorioMensajes } from '../domain/ports/IRepositorioMensajes';
import { IReceptorSms } from '../domain/ports/IReceptorSms';

const LIMITE_MENSAJES = 50;

export class ObtenerRegistroDeMensajes {
  constructor(
    private readonly repositorioMensajes: IRepositorioMensajes,
    private readonly receptorSms: IReceptorSms,
  ) {}

  async ejecutar(): Promise<MensajeSms[]> {
    if (this.receptorSms.obtenerLogsNativos) {
      try {
        const logsStr = await this.receptorSms.obtenerLogsNativos();
        if (logsStr && logsStr !== '[]') {
          const logs = JSON.parse(logsStr);
          for (const log of logs) {
            const mensaje: MensajeSms = {
              id: Date.now().toString(36) + Math.random().toString(36).substring(2),
              remitente: log.remitente,
              cuerpo: log.cuerpo,
              estado: log.estado as EstadoMensaje,
              fechaHora: new Date(log.timestamp),
              motivoError: log.motivoError || undefined
            };
            await this.repositorioMensajes.guardar(mensaje);
          }
        }
      } catch (error) {
        // Ignorar errores al procesar logs nativos
      }
    }

    const mensajes = await this.repositorioMensajes.obtenerTodos();
    return this.obtenerUltimosMensajes(mensajes);
  }

  private obtenerUltimosMensajes(mensajes: MensajeSms[]): MensajeSms[] {
    return mensajes
      .sort((a, b) => b.fechaHora.getTime() - a.fechaHora.getTime())
      .slice(0, LIMITE_MENSAJES);
  }
}
