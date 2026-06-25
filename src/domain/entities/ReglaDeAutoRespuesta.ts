export enum PlataformaAutoRespuesta {
  WHATSAPP = 'whatsapp',
  TELEGRAM = 'telegram',
  CUALQUIERA = 'cualquiera',
}

export enum TipoDestinatario {
  CONTACTO = 'contacto',
  GRUPO = 'grupo',
  CUALQUIERA = 'cualquiera',
}

export interface ReglaDeAutoRespuesta {
  readonly id: string;
  readonly nombre: string;
  readonly plataforma: PlataformaAutoRespuesta;
  readonly tipoDestinatario: TipoDestinatario;
  readonly identificador: string;
  readonly condicion: string;
  readonly respuesta: string;
  readonly activa: boolean;
  readonly delaySegundos: number;
}
