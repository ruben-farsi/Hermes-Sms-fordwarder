import { IEnviadorTelegram } from '../../domain/ports/IEnviadorTelegram';

const URL_BASE_TELEGRAM = 'https://api.telegram.org';
const MIN_INTERVAL_MS = 35;
let ultimoEnvio = 0;

async function esperarRateLimit(): Promise<void> {
  const ahora = Date.now();
  const espera = ultimoEnvio + MIN_INTERVAL_MS - ahora;
  if (espera > 0) {
    await new Promise(resolve => setTimeout(resolve, espera));
  }
  ultimoEnvio = Date.now();
}

export class EnviadorTelegramApi implements IEnviadorTelegram {
  async enviarMensaje(
    botToken: string,
    chatId: string,
    texto: string,
  ): Promise<void> {
    await esperarRateLimit();
    const url = `${URL_BASE_TELEGRAM}/bot${botToken}/sendMessage`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    try {
      const respuesta = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'User-Agent': 'HermesSMSForwarder/1.0',
        },
        body: JSON.stringify({ chat_id: chatId, text: texto }),
        signal: controller.signal,
      });

      if (!respuesta.ok) {
        const error = await respuesta.json().catch(() => ({}));
        throw new Error(
          error.description || `Telegram API respondió con status ${respuesta.status}`,
        );
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Timeout al conectar con Telegram (>10s)');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
