import * as SecureStore from 'expo-secure-store';
import { ConfiguracionTelegram } from '../../domain/entities/ConfiguracionTelegram';
import { IRepositorioConfigTelegram } from '../../domain/ports/IRepositorioConfigTelegram';

const CLAVE = 'sms_forwarder_configs_telegram';

export class RepositorioConfigTelegramSecureStore
  implements IRepositorioConfigTelegram
{
  async guardar(configuracion: ConfiguracionTelegram): Promise<void> {
    const todas = await this.obtenerTodas();
    const indice = todas.findIndex((c) => c.id === configuracion.id);
    if (indice >= 0) {
      todas[indice] = configuracion;
    } else {
      todas.push(configuracion);
    }
    await this.guardarTodas(todas);
  }

  async obtener(): Promise<ConfiguracionTelegram | null> {
    const todas = await this.obtenerTodas();
    return todas.find((c) => c.esPredeterminada) ?? todas[0] ?? null;
  }

  async obtenerTodas(): Promise<ConfiguracionTelegram[]> {
    const datos = await SecureStore.getItemAsync(CLAVE);
    if (!datos) return [];
    return JSON.parse(datos) as ConfiguracionTelegram[];
  }

  async obtenerPorId(id: string): Promise<ConfiguracionTelegram | null> {
    const todas = await this.obtenerTodas();
    return todas.find((c) => c.id === id) ?? null;
  }

  async eliminar(id: string): Promise<void> {
    const todas = await this.obtenerTodas();
    const filtradas = todas.filter((c) => c.id !== id);
    await this.guardarTodas(filtradas);
  }

  private async guardarTodas(configs: ConfiguracionTelegram[]): Promise<void> {
    await SecureStore.setItemAsync(CLAVE, JSON.stringify(configs));
  }
}
