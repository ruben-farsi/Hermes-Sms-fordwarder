import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORES } from '../theme/colores';

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
      <TouchableOpacity
        style={estilos.botonCancelar}
        onPress={onCancelar}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Cancelar"
        activeOpacity={0.7}
      >
        <Text style={estilos.textoCancelar}>Cancelar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[estilos.botonGuardar, deshabilitarGuardado && { opacity: 0.5 }]}
        onPress={onGuardar}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Guardar regla"
        activeOpacity={0.8}
      >
        <View style={estilos.filaGuardar}>
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
    borderRadius: 8,
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
  botonCancelar: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORES.inputBorde,
    alignItems: 'center',
    backgroundColor: COLORES.inputFondo,
  },
  textoCancelar: {
    color: COLORES.textoSecundario,
    fontWeight: '600',
    fontSize: 15,
  },
  botonGuardar: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: COLORES.primario,
    alignItems: 'center',
    elevation: 4,
  },
  textoGuardar: {
    color: COLORES.textoClaro,
    fontWeight: '700',
    fontSize: 15,
  },
  filaGuardar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});