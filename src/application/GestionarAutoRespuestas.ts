import { IRepositorioAutoRespuestas } from '../domain/ports/IRepositorioAutoRespuestas';
import {
  ReglaDeAutoRespuesta,
  PlataformaAutoRespuesta,
  TipoDestinatario,
} from '../domain/entities/ReglaDeAutoRespuesta';

function generarId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export class GestionarAutoRespuestas {
  constructor(
    private readonly repositorio: IRepositorioAutoRespuestas,
  ) {}

  async crearRegla(datos: Omit<ReglaDeAutoRespuesta, 'id'>): Promise<void> {
    const regla: ReglaDeAutoRespuesta = { ...datos, id: generarId() };
    await this.repositorio.guardar(regla);
  }

  async editarRegla(regla: ReglaDeAutoRespuesta): Promise<void> {
    const existente = await this.repositorio.obtenerPorId(regla.id);
    if (!existente) throw new Error(`Regla con id "${regla.id}" no encontrada`);
    await this.repositorio.guardar(regla);
  }

  async eliminarRegla(id: string): Promise<void> {
    await this.repositorio.eliminar(id);
  }

  async obtenerReglas(): Promise<ReglaDeAutoRespuesta[]> {
    return this.repositorio.obtenerTodas();
  }

  async alternarEstado(id: string): Promise<void> {
    const regla = await this.repositorio.obtenerPorId(id);
    if (!regla) throw new Error(`Regla con id "${id}" no encontrada`);
    await this.repositorio.guardar({ ...regla, activa: !regla.activa });
  }

  crearReglaEjemplo(): Omit<ReglaDeAutoRespuesta, 'id'> {
    return {
      nombre: 'Respuesta automática',
      plataforma: PlataformaAutoRespuesta.CUALQUIERA,
      tipoDestinatario: TipoDestinatario.CUALQUIERA,
      identificador: '',
      condicion: '',
      respuesta: '🤖 Mensaje recibido, respondo pronto.',
      activa: true,
      delaySegundos: 0,
    };
  }
}
