import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MensajeSms, EstadoMensaje } from '../../domain/entities/MensajeSms';
import { COLORES, SOMBRAS, BORDES } from '../theme/colores';
import { FUENTES } from '../theme/tipografia';

const ICONOS_ESTADO: Record<EstadoMensaje, React.ComponentProps<typeof Feather>['name']> = {
  [EstadoMensaje.REENVIADO]: 'check-circle',
  [EstadoMensaje.FILTRADO]: 'x-circle',
  [EstadoMensaje.ERROR]: 'alert-triangle',
};

const COLORES_ESTADO: Record<EstadoMensaje, { texto: string; fondo: string }> = {
  [EstadoMensaje.REENVIADO]: { texto: COLORES.exito, fondo: COLORES.exitoFondo },
  [EstadoMensaje.FILTRADO]: { texto: COLORES.filtrado, fondo: COLORES.filtradoFondo },
  [EstadoMensaje.ERROR]: { texto: COLORES.error, fondo: COLORES.errorFondo },
};

const ETIQUETAS_ESTADO: Record<EstadoMensaje, string> = {
  [EstadoMensaje.REENVIADO]: 'Reenviado',
  [EstadoMensaje.FILTRADO]: 'Filtrado',
  [EstadoMensaje.ERROR]: 'Error',
};

interface Props {
  mensaje: MensajeSms;
  onReintentar?: (mensaje: MensajeSms) => void;
}

export const TarjetaMensaje: React.FC<Props> = ({ mensaje, onReintentar }) => {
  const estado = COLORES_ESTADO[mensaje.estado];

  return (
    <View style={estilos.contenedor}>
      {/* Glass highlight overlay */}
      <View style={estilos.brillo} pointerEvents="none" />

      <View style={estilos.encabezado}>
        <View style={estilos.infoRemitente}>
          <View style={estilos.avatarRemitente}>
            <Feather name="user" size={14} color={COLORES.textoSecundario} />
          </View>
          <Text style={estilos.remitente} numberOfLines={1}>
            {mensaje.remitente}
          </Text>
        </View>
        <View style={[estilos.insigniaEstado, { backgroundColor: estado.fondo }]}>
          <Feather name={ICONOS_ESTADO[mensaje.estado]} size={14} color={estado.texto} />
          <Text style={[estilos.textoEstado, { color: estado.texto }]}>
            {ETIQUETAS_ESTADO[mensaje.estado]}
          </Text>
        </View>
      </View>

      <Text style={estilos.cuerpo} numberOfLines={2}>
        {mensaje.cuerpo}
      </Text>

      <View style={estilos.pieDetarjeta}>
        <Feather name="clock" size={12} color={COLORES.textoSutil} />
        <Text style={estilos.fecha}> {mensaje.fechaHora.toLocaleString()}</Text>
      </View>

      {mensaje.motivoError && (
        <View style={estilos.contenedorError}>
          <View style={estilos.filaError}>
            <Feather name="alert-triangle" size={14} color={COLORES.error} />
            <Text style={estilos.error}> {mensaje.motivoError}</Text>
          </View>
          {onReintentar && mensaje.estado === EstadoMensaje.ERROR && (
            <TouchableOpacity
              style={estilos.botonReintentar}
              onPress={() => onReintentar(mensaje)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Reintentar envío de mensaje de ${mensaje.remitente}`}
              activeOpacity={0.7}
            >
              <View style={estilos.filaReintentar}>
                <Feather name="refresh-cw" size={14} color="#FFFFFF" />
                <Text style={estilos.textoReintentar}> Reintentar</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    backgroundColor: COLORES.neumorphBase,
    borderRadius: BORDES.radio.md,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: COLORES.glassBorde,
    // Neumorphic extrusion
    ...SOMBRAS.neumorphExtruido,
    // Light top-left shadow
    shadowColor: COLORES.neumorphLuces,
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
    overflow: 'hidden',
  },
  brillo: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderTopLeftRadius: BORDES.radio.md,
    borderTopRightRadius: BORDES.radio.md,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    height: '50%',
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoRemitente: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  avatarRemitente: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 217, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  remitente: {
    fontSize: FUENTES.tamano.md,
    fontWeight: FUENTES.peso.semibold,
    color: COLORES.texto,
    flex: 1,
  },
  insigniaEstado: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  textoEstado: {
    fontSize: FUENTES.tamano.xs,
    fontWeight: '700',
  },
  cuerpo: {
    fontSize: FUENTES.tamano.sm,
    color: COLORES.textoSecundario,
    marginTop: 6,
    lineHeight: 18,
  },
  pieDetarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  fecha: {
    fontSize: FUENTES.tamano.xs,
    color: COLORES.textoSutil,
  },
  contenedorError: {
    backgroundColor: COLORES.errorFondo,
    padding: 10,
    borderRadius: BORDES.radio.xs,
    marginTop: 10,
  },
  error: {
    fontSize: 12,
    color: COLORES.error,
  },
  botonReintentar: {
    marginTop: 8,
    backgroundColor: COLORES.error,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: BORDES.radio.xs,
    alignSelf: 'flex-start',
  },
  textoReintentar: {
    color: COLORES.textoClaro,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  filaError: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filaReintentar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});