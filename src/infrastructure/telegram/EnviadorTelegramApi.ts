import { IEnviadorTelegram } from '../../domain/ports/IEnviadorTelegram';

const URL_BASE_TELEGRAM = 'https://api.telegram.org';

export class EnviadorTelegramApi implements IEnviadorTelegram {
  async enviarMensaje(
    botToken: string,
    chatId: string,
    texto: string,
  ): Promise<void> {
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
