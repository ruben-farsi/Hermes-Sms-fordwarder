import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORES } from '../theme/colores';

interface Props {
  esEdicion: boolean;
}

export const EncabezadoFormulario: React.FC<Props> = ({ esEdicion }) => (
  <View style={estilos.contenedor}>
    {/* Glass drag indicator */}
    <View style={estilos.barraIndicadora}>
      <View style={estilos.indicador} />
    </View>
    <View style={estilos.filaTitulo}>
      <Text style={estilos.titulo}>
        {esEdicion ? 'Editar regla' : 'Nueva regla'}
      </Text>
    </View>
  </View>
);

const estilos = StyleSheet.create({
  contenedor: {
    marginBottom: 8,
    backgroundColor: COLORES.glassFondo,
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORES.glassBorde,
  },
  barraIndicadora: {
    alignItems: 'center',
    marginBottom: 8,
  },
  indicador: {
    width: 40,
    height: 4,
    backgroundColor: COLORES.textoSutil,
    borderRadius: 2,
    opacity: 0.6,
  },
  filaTitulo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: COLORES.texto,
  },
});