import { ReglaDeAutoRespuesta } from '../entities/ReglaDeAutoRespuesta';

export interface IRepositorioAutoRespuestas {
  guardar(regla: ReglaDeAutoRespuesta): Promise<void>;
  obtenerTodas(): Promise<ReglaDeAutoRespuesta[]>;
  obtenerPorId(id: string): Promise<ReglaDeAutoRespuesta | null>;
  eliminar(id: string): Promise<void>;
}
