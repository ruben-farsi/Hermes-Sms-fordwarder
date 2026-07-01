import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORES } from '../theme/colores';
import { FUENTES } from '../theme/tipografia';

interface Props {
  esRegex: boolean;
  onEsRegexChange: (valor: boolean) => void;
  activa: boolean;
  onActivaChange: (valor: boolean) => void;
}

export const SeccionSwitches: React.FC<Props> = ({
  esRegex,
  onEsRegexChange,
  activa,
  onActivaChange,
}) => (
  <View style={estilos.contenedor}>
    <View style={estilos.filaSwitch}>
      <View style={estilos.infoSwitch}>
        <View style={estilos.filaEtiqueta}>
          <Feather name="code" size={14} color={COLORES.primario} />
          <Text style={estilos.etiquetaSwitch}> Expresión regular</Text>
        </View>
        <Text style={estilos.ayudaSwitch}>
          Permite patrones avanzados como {'{'}6{'}'}
        </Text>
      </View>
      <Switch
        value={esRegex}
        onValueChange={onEsRegexChange}
        trackColor={{ false: COLORES.switchTrackInactivo, true: COLORES.switchTrackActivo }}
        thumbColor={esRegex ? COLORES.switchThumbActivo : COLORES.switchThumbInactivo}
      />
    </View>

    <View style={estilos.separador} />

    <View style={estilos.filaSwitch}>
      <View style={estilos.infoSwitch}>
        <View style={estilos.filaEtiqueta}>
          <Feather name="zap" size={14} color={COLORES.acento} />
          <Text style={estilos.etiquetaSwitch}> Regla activa</Text>
        </View>
        <Text style={estilos.ayudaSwitch}>
          Solo las reglas activas filtran SMS
        </Text>
      </View>
      <Switch
        value={activa}
        onValueChange={onActivaChange}
        trackColor={{ false: COLORES.switchTrackInactivo, true: 'rgba(0, 230, 118, 0.3)' }}
        thumbColor={activa ? COLORES.acento : COLORES.switchThumbInactivo}
      />
    </View>
  </View>
);

const estilos = StyleSheet.create({
  contenedor: {
    backgroundColor: COLORES.inputFondo,
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORES.inputBorde,
  },
  filaSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoSwitch: {
    flex: 1,
    marginRight: 12,
  },
  filaEtiqueta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  etiquetaSwitch: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORES.textoSecundario,
  },
  ayudaSwitch: {
    fontSize: FUENTES.tamano.xs,
    color: COLORES.textoSutil,
    marginTop: 2,
  },
  separador: {
    height: 1,
    backgroundColor: COLORES.separador,
    marginVertical: 8,
  },
});