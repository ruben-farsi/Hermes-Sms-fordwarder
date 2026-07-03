import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORES, BORDES, SOMBRAS } from '../theme/colores';

interface Props {
  onGuardar: () => void;
  onCancelar: () => void;
  error: string | null;
  deshabilitarGuardado?: boolean;
}

export const BotonesAccion: React.FC<Props> = ({
  onGuardar,
  onCancelar,
  error,
  deshabilitarGuardado = false,
}) => (
  <>
    {error && (
      <View style={estilos.contenedorError}>
        <Text style={estilos.textoError}>{error}</Text>
      </View>
    )}

    <View style={estilos.filaBotones}>
      {/* Neumorphic Cancel button — extruded */}
      <TouchableOpacity
        style={estilos.botonCancelar}
        onPress={onCancelar}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Cancelar"
        activeOpacity={0.7}
      >
        <View style={estilos.cancelarInterior}>
          <Text style={estilos.textoCancelar}>Cancelar</Text>
        </View>
      </TouchableOpacity>

      {/* Neumorphic Save button — extruded with accent */}
      <TouchableOpacity
        style={[estilos.botonGuardar, deshabilitarGuardado && { opacity: 0.5 }]}
        onPress={onGuardar}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Guardar regla"
        activeOpacity={0.8}
      >
        <View style={estilos.guardarInterior}>
          <Feather name="save" size={16} color={COLORES.textoClaro} />
          <Text style={estilos.textoGuardar}> Guardar</Text>
        </View>
      </TouchableOpacity>
    </View>
  </>
);

const estilos = StyleSheet.create({
  contenedorError: {
    backgroundColor: COLORES.errorFondo,
    padding: 12,
    borderRadius: BORDES.radio.xs,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORES.error,
  },
  textoError: {
    color: COLORES.error,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  filaBotones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 12,
    gap: 10,
  },
  // ─── Cancel: Glass ──
  botonCancelar: {
    flex: 1,
    borderRadius: BORDES.radio.sm,
    backgroundColor: COLORES.glassFondo,
    ...SOMBRAS.glass,
  },
  cancelarInterior: {
    padding: 14,
    minHeight: 52,
    borderRadius: BORDES.radio.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORES.glassBorde,
  },
  textoCancelar: {
    color: COLORES.textoSecundario,
    fontWeight: '600',
    fontSize: 15,
  },
  // ─── Save: Glass with Verde Esmeralda ──
  botonGuardar: {
    flex: 1,
    borderRadius: BORDES.radio.sm,
    backgroundColor: COLORES.primarioOscuro,
    shadowColor: COLORES.primario,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  guardarInterior: {
    padding: 14,
    minHeight: 52,
    borderRadius: BORDES.radio.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: COLORES.primario,
    borderWidth: 1,
    borderColor: 'rgba(10, 132, 255, 0.3)',
  },
  textoGuardar: {
    color: COLORES.textoClaro,
    fontWeight: '700',
    fontSize: 15,
  },
});