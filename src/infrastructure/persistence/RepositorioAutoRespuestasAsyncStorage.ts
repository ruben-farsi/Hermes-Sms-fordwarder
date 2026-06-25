import AsyncStorage from '@react-native-async-storage/async-storage';
import { IRepositorioAutoRespuestas } from '../../domain/ports/IRepositorioAutoRespuestas';
import { ReglaDeAutoRespuesta } from '../../domain/entities/ReglaDeAutoRespuesta';

const CLAVE = '@sms_forwarder/auto_respuestas';

export class RepositorioAutoRespuestasAsyncStorage
  implements IRepositorioAutoRespuestas
{
  async guardar(regla: ReglaDeAutoRespuesta): Promise<void> {
    const todas = await this.obtenerTodas();
    const indice = todas.findIndex((r) => r.id === regla.id);
    if (indice >= 0) {
      todas[indice] = regla;
    } else {
      todas.push(regla);
    }
    await AsyncStorage.setItem(CLAVE, JSON.stringify(todas));
  }

  async obtenerTodas(): Promise<ReglaDeAutoRespuesta[]> {
    const json = await AsyncStorage.getItem(CLAVE);
    if (!json) return [];
    return JSON.parse(json) as ReglaDeAutoRespuesta[];
  }

  async obtenerPorId(id: string): Promise<ReglaDeAutoRespuesta | null> {
    const todas = await this.obtenerTodas();
    return todas.find((r) => r.id === id) ?? null;
  }

  async eliminar(id: string): Promise<void> {
    const todas = await this.obtenerTodas();
    const filtradas = todas.filter((r) => r.id !== id);
    await AsyncStorage.setItem(CLAVE, JSON.stringify(filtradas));
  }
}
