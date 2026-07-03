import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ConfiguracionTelegram } from '../../domain/entities/ConfiguracionTelegram';
import { COLORES, BORDES, SOMBRAS } from '../theme/colores';

interface Props {
  configuraciones: ConfiguracionTelegram[];
  configTelegramId: string;
  onConfigTelegramChange: (id: string) => void;
  horarioInicio: string;
  onHorarioInicioChange: (valor: string) => void;
  horarioFin: string;
  onHorarioFinChange: (valor: string) => void;
  diasActivos: number[];
  onToggleDia: (indice: number) => void;
  DIAS_SEMANA: string[];
}

const SelectorConfigTelegram: React.FC<{
  configuraciones: ConfiguracionTelegram[];
  configTelegramId: string;
  onChange: (id: string) => void;
}> = ({ configuraciones, configTelegramId, onChange }) => {
  if (configuraciones.length === 0) {
    return (
      <Text style={estilos.sinConfigs}>
        No hay bots configurados. Ve a Config para añadir uno.
      </Text>
    );
  }

  return (
    <View style={estilos.listaConfigs}>
      <TouchableOpacity
        style={[
          estilos.botonConfig,
          !configTelegramId && estilos.botonConfigSeleccionado,
        ]}
        onPress={() => onChange('')}
        activeOpacity={0.7}
      >
        <View style={estilos.filaConfig}>
          <Feather
            name="globe"
            size={14}
            color={!configTelegramId ? COLORES.textoClaro : COLORES.textoSecundario}
          />
          <Text
            style={[
              estilos.textoConfig,
              !configTelegramId && estilos.textoConfigSeleccionado,
            ]}
          >
            {' '}Bot predeterminado
          </Text>
        </View>
      </TouchableOpacity>
      {configuraciones.map((cfg) => (
        <TouchableOpacity
          key={cfg.id}
          style={[
            estilos.botonConfig,
            configTelegramId === cfg.id && estilos.botonConfigSeleccionado,
          ]}
          onPress={() => onChange(cfg.id)}
          activeOpacity={0.7}
        >
          <View style={estilos.filaConfig}>
            <Feather
              name="message-circle"
              size={14}
              color={configTelegramId === cfg.id ? COLORES.textoClaro : COLORES.textoSecundario}
            />
            <Text
              style={[
                estilos.textoConfig,
                configTelegramId === cfg.id && estilos.textoConfigSeleccionado,
              ]}
            >
              {' '}{cfg.nombre}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const SelectorDias: React.FC<{
  diasActivos: number[];
  onToggle: (indice: number) => void;
  DIAS_SEMANA: string[];
}> = ({ diasActivos, onToggle, DIAS_SEMANA }) => (
  <View style={estilos.filaDias}>
    {DIAS_SEMANA.map((dia, indice) => (
      <TouchableOpacity
        key={indice}
        style={[
          estilos.botonDia,
          diasActivos.includes(indice) && estilos.botonDiaActivo,
        ]}
        onPress={() => onToggle(indice)}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${dia} ${diasActivos.includes(indice) ? 'seleccionado' : 'no seleccionado'}`}
        accessibilityState={{ selected: diasActivos.includes(indice) }}
        hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
      >
        <Text
          style={[
            estilos.textoDia,
            diasActivos.includes(indice) && estilos.textoDiaActivo,
          ]}
        >
          {dia}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const FilaEtiqueta: React.FC<{
  texto: string;
}> = ({ texto }) => (
  <View style={estilos.filaEtiqueta}>
    <Text style={estilos.etiqueta}>{texto}</Text>
  </View>
);

export const OpcionesAvanzadas: React.FC<Props> = ({
  configuraciones,
  configTelegramId,
  onConfigTelegramChange,
  horarioInicio,
  onHorarioInicioChange,
  horarioFin,
  onHorarioFinChange,
  diasActivos,
  onToggleDia,
  DIAS_SEMANA,
}) => (
  <View style={estilos.contenedor}>
    <FilaEtiqueta texto="Bot de Telegram" />
    <SelectorConfigTelegram
      configuraciones={configuraciones}
      configTelegramId={configTelegramId}
      onChange={onConfigTelegramChange}
    />

    <FilaEtiqueta texto="Horario activo" />
    <View style={estilos.filaHorarios}>
      <View style={estilos.inputNeumorph}>
        <TextInput
          style={estilos.inputHorario}
          value={horarioInicio}
          onChangeText={onHorarioInicioChange}
          placeholder="Desde (HH:MM)"
          placeholderTextColor={COLORES.textoSutil}
          keyboardType="numeric"
        />
      </View>
      <View style={estilos.inputNeumorph}>
        <TextInput
          style={estilos.inputHorario}
          value={horarioFin}
          onChangeText={onHorarioFinChange}
          placeholder="Hasta (HH:MM)"
          placeholderTextColor={COLORES.textoSutil}
          keyboardType="numeric"
        />
      </View>
    </View>

    <FilaEtiqueta texto="Días activos" />
    <SelectorDias
      diasActivos={diasActivos}
      onToggle={onToggleDia}
      DIAS_SEMANA={DIAS_SEMANA}
    />
  </View>
);

const estilos = StyleSheet.create({
  contenedor: {
    marginTop: 4,
    paddingTop: 4,
  },
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
  listaConfigs: {
    gap: 6,
  },
  // ─── Glass config buttons ──
  botonConfig: {
    padding: 12,
    borderRadius: BORDES.radio.xs,
    backgroundColor: COLORES.glassFondo,
    borderWidth: 1,
    borderColor: COLORES.glassBorde,
    ...SOMBRAS.glass,
  },
  botonConfigSeleccionado: {
    backgroundColor: COLORES.primarioOscuro,
    borderColor: COLORES.primario,
    shadowColor: COLORES.primario,
    shadowOpacity: 0.25,
  },
  filaConfig: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoConfig: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORES.textoSecundario,
  },
  textoConfigSeleccionado: {
    color: COLORES.textoClaro,
  },
  sinConfigs: {
    fontSize: 13,
    color: COLORES.textoSutil,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  filaHorarios: {
    flexDirection: 'row',
    gap: 10,
  },
  // ─── Glass time inputs ──
  inputNeumorph: {
    flex: 1,
    backgroundColor: COLORES.glassInput,
    borderRadius: BORDES.radio.xs,
    borderWidth: 1,
    borderColor: COLORES.glassInputBorde,
  },
  inputHorario: {
    padding: 12,
    fontSize: 15,
    color: COLORES.texto,
    borderRadius: BORDES.radio.xs,
    backgroundColor: 'transparent',
  },
  // ─── Neumorphic day buttons ──
  filaDias: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  botonDia: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: BORDES.radio.xs,
    alignItems: 'center',
    backgroundColor: COLORES.glassFondo,
    borderWidth: 1,
    borderColor: COLORES.glassBorde,
    ...SOMBRAS.glass,
  },
  botonDiaActivo: {
    backgroundColor: COLORES.primarioOscuro,
    borderColor: COLORES.primario,
    shadowColor: COLORES.primario,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  textoDia: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORES.textoSecundario,
  },
  textoDiaActivo: {
    color: COLORES.textoClaro,
  },
});