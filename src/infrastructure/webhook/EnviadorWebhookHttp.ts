import { IEnviadorWebhook, DatosWebhook } from '../../domain/ports/IEnviadorWebhook';

const HOSTS_BLOQUEADOS = [
  '169.254.169.254',
  '127.0.0.1',
  'localhost',
  '0.0.0.0',
  '[::1]',
];

export class EnviadorWebhookHttp implements IEnviadorWebhook {
  async enviar(url: string, datos: DatosWebhook): Promise<void> {
    let urlParseada: URL;
    try {
      urlParseada = new URL(url);
    } catch {
      throw new Error(`URL de webhook inválida: ${url}`);
    }

    if (urlParseada.protocol !== 'https:') {
      throw new Error(
        `Webhooks solo pueden rechazada: ${urlParseada.host}`,
      );
    }

    if (HOSTS_BLOQUEADOS.includes(urlParseada.hostname)) {
      throw new Error(
        `Webhook no puede apuntar a dirección local/privada: ${urlParseada.host}`,
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    try {
      const respuesta = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'HermesSMSForwarder/1.0' },
        body: JSON.stringify(datos),
        signal: controller.signal,
      });

      if (!respuesta.ok) {
        throw new Error(`Webhook respondió con status ${respuesta.status}`);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Timeout al conectar con webhook (>10s)');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
