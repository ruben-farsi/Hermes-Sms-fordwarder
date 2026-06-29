import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORES, SOMBRAS, BORDES } from '../theme/colores';
import { FUENTES } from '../theme/tipografia';
import { BotonGradiente } from './BotonGradiente';

interface Props {
  activo: boolean;
  onAlternar: () => void;
}

export const IndicadorServicio = React.memo<Props>(({ activo, onAlternar }) => {
  return (
    <View style={estilos.contenedor}>
      <View style={estilos.indicador}>
        <View style={[estilos.punto, activo ? estilos.puntoActivo : estilos.puntoInactivo]} />
        <View style={{ flex: 1 }}>
          <Text style={estilos.titulo}>Servicio SMS</Text>
          <Text
            style={[
              estilos.estado,
              { color: activo ? COLORES.exito : COLORES.error },
            ]}
          >
            {activo ? 'Activo — interceptando' : 'Detenido'}
          </Text>
        </View>
      </View>

      <BotonGradiente
        variante={activo ? 'error' : 'exito'}
        onPress={onAlternar}
        accessibilityLabel={activo ? 'Detener servicio SMS' : 'Iniciar servicio SMS'}
      >
        <Text style={estilos.textoBoton}>
          {activo ? '⏹ Detener' : '▶ Iniciar'}
        </Text>
      </BotonGradiente>
    </View>
  );
});

const estilos = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORES.tarjeta,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 6,
    borderRadius: BORDES.radio.md,
    borderWidth: 1,
    borderColor: COLORES.tarjetaBorde,
    ...SOMBRAS.suave,
  },
  indicador: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  punto: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  puntoActivo: {
    backgroundColor: COLORES.exito,
  },
  puntoInactivo: {
    backgroundColor: COLORES.error,
  },
  titulo: {
    fontSize: FUENTES.tamano.lg,
    fontWeight: FUENTES.peso.bold,
    color: COLORES.texto,
  },
  estado: {
    fontSize: FUENTES.tamano.sm,
    fontWeight: FUENTES.peso.medio,
    marginTop: 2,
  },
  textoBoton: {
    color: COLORES.textoClaro,
    fontWeight: FUENTES.peso.bold,
    fontSize: FUENTES.tamano.sm,
  },
});
