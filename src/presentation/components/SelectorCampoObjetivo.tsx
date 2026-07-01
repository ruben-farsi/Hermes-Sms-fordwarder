import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CampoObjetivo } from '../../domain/entities/ReglaDeReenvio';
import { COLORES, BORDES } from '../theme/colores';

interface Props {
  valor: CampoObjetivo;
  onChange: (valor: CampoObjetivo) => void;
}

const OPCIONES: { valor: CampoObjetivo; icono: React.ComponentProps<typeof Feather>['name']; texto: string }[] = [
  { valor: CampoObjetivo.REMITENTE, icono: 'user', texto: 'Remitente' },
  { valor: CampoObjetivo.CUERPO, icono: 'message-square', texto: 'Cuerpo' },
];

export const SelectorCampoObjetivo: React.FC<Props> = ({ valor, onChange }) => (
  <>
    <View style={estilos.filaEtiqueta}>
      <Feather name="crosshair" size={14} color={COLORES.primario} />
      <Text style={estilos.etiqueta}> Aplicar sobre</Text>
    </View>
    <View style={estilos.filaBotones}>
      {OPCIONES.map((opcion) => (
        <TouchableOpacity
          key={opcion.valor}
          style={[
            estilos.botonOpcion,
            valor === opcion.valor && estilos.botonSeleccionado,
          ]}
          onPress={() => onChange(opcion.valor)}
          activeOpacity={0.7}
        >
          <Feather name={opcion.icono} size={16} color={COLORES.primario} />
          <Text
            style={[
              estilos.textoOpcion,
              valor === opcion.valor && estilos.textoSeleccionado,
            ]}
          >
            {opcion.texto}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </>
);

const estilos = StyleSheet.create({
  filaEtiqueta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 6,
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORES.textoSecundario,
  },
  filaBotones: {
    flexDirection: 'row',
    gap: 10,
  },
  botonOpcion: {
    flex: 1,
    padding: 12,
    borderRadius: BORDES.radio.sm,
    borderWidth: 1,
    borderColor: COLORES.inputBorde,
    alignItems: 'center',
    backgroundColor: COLORES.inputFondo,
  },
  botonSeleccionado: {
    backgroundColor: COLORES.primario,
    borderColor: COLORES.primario,
  },
  textoOpcion: {
    color: COLORES.textoSecundario,
    fontWeight: '600',
    fontSize: 13,
    marginTop: 4,
  },
  textoSeleccionado: {
    color: COLORES.textoClaro,
  },
});