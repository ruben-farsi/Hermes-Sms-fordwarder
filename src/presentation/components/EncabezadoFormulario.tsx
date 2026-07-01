import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORES } from '../theme/colores';

interface Props {
  esEdicion: boolean;
}

export const EncabezadoFormulario: React.FC<Props> = ({ esEdicion }) => (
  <View style={estilos.contenedor}>
    <View style={estilos.barraIndicadora}>
      <View style={estilos.indicador} />
    </View>
    <View style={estilos.filaTitulo}>
      <Feather
        name={esEdicion ? 'edit' : 'plus'}
        size={16}
        color={COLORES.texto}
      />
      <Text style={estilos.titulo}>
        {' '}{esEdicion ? 'Editar regla' : 'Nueva regla'}
      </Text>
    </View>
  </View>
);

const estilos = StyleSheet.create({
  contenedor: {
    marginBottom: 8,
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
  },
  filaTitulo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: COLORES.texto,
  },
});