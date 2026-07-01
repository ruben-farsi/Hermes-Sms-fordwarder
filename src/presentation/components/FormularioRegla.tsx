import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFormularioRegla } from '../hooks/useFormularioRegla';
import { COLORES, BORDES } from '../theme/colores';
import { EncabezadoFormulario } from './EncabezadoFormulario';
import { SelectorCampoObjetivo } from './SelectorCampoObjetivo';
import { OpcionesAvanzadas } from './OpcionesAvanzadas';
import { SeccionSwitches } from './SeccionSwitches';
import { BotonesAccion } from './BotonesAccion';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  visible: boolean;
  reglaExistente?: Parameters<typeof useFormularioRegla>[1];
  onGuardar: (datos: NonNullable<ReturnType<ReturnType<typeof useFormularioRegla>['obtenerDatos']>>) => void;
  onCancelar: () => void;
}

export const FormularioRegla: React.FC<Props> = ({
  visible,
  reglaExistente,
  onGuardar,
  onCancelar,
}) => {
  const {
    nombre, setNombre,
    campoObjetivo, setCampoObjetivo,
    patron, setPatron,
    esRegex, setEsRegex,
    activa, setActiva,
    configTelegramId, setConfigTelegramId,
    configuraciones,
    horarioInicio, setHorarioInicio,
    horarioFin, setHorarioFin,
    diasActivos, toggleDia,
    avanzadoVisible, setAvanzadoVisible,
    error,
    obtenerDatos,
    DIAS_SEMANA,
  } = useFormularioRegla(visible, reglaExistente);

  const manejarGuardado = () => {
    Keyboard.dismiss();
    const datos = obtenerDatos();
    if (datos) onGuardar(datos);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={estilos.fondo}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={estilos.contenedorExterior}>
          <ScrollView
            style={estilos.contenedor}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <EncabezadoFormulario esEdicion={!!reglaExistente} />

            {/* Nombre */}
            <View style={estilos.filaEtiqueta}>
              <Feather name="edit" size={14} color={COLORES.primario} />
              <Text style={estilos.etiqueta}> Nombre de la regla</Text>
            </View>
            <TextInput
              style={estilos.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ej: Alertas del banco"
              placeholderTextColor={COLORES.textoSutil}
              accessibilityLabel="Nombre de la regla"
            />

            <SelectorCampoObjetivo
              valor={campoObjetivo}
              onChange={setCampoObjetivo}
            />

            {/* Patrón */}
            <View style={estilos.filaEtiqueta}>
              <Feather name="search" size={14} color={COLORES.primario} />
              <Text style={estilos.etiqueta}> Patrón de búsqueda</Text>
            </View>
            <TextInput
              style={estilos.input}
              value={patron}
              onChangeText={setPatron}
              placeholder={esRegex ? 'Ej: \\d{6}' : 'Ej: banco'}
              placeholderTextColor={COLORES.textoSutil}
              autoCapitalize="none"
              accessibilityLabel={esRegex ? 'Patrón regex' : 'Patrón de búsqueda'}
            />

            {/* Opciones avanzadas */}
            <TouchableOpacity
              style={estilos.botonAvanzado}
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setAvanzadoVisible(!avanzadoVisible);
              }}
              activeOpacity={0.7}
            >
              <Feather name="sliders" size={14} color={COLORES.primario} />
              <Text style={estilos.textoAvanzado}> Opciones avanzadas</Text>
              <Feather name={avanzadoVisible ? 'chevron-up' : 'chevron-down'} size={16} color={COLORES.primario} />
            </TouchableOpacity>

            {avanzadoVisible && (
              <OpcionesAvanzadas
                configuraciones={configuraciones}
                configTelegramId={configTelegramId}
                onConfigTelegramChange={setConfigTelegramId}
                horarioInicio={horarioInicio}
                onHorarioInicioChange={setHorarioInicio}
                horarioFin={horarioFin}
                onHorarioFinChange={setHorarioFin}
                diasActivos={diasActivos}
                onToggleDia={toggleDia}
                DIAS_SEMANA={DIAS_SEMANA}
              />
            )}

            <SeccionSwitches
              esRegex={esRegex}
              onEsRegexChange={setEsRegex}
              activa={activa}
              onActivaChange={setActiva}
            />

            <BotonesAccion
              onGuardar={manejarGuardado}
              onCancelar={onCancelar}
              error={error}
              deshabilitarGuardado={!!error}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  contenedorExterior: {
    maxHeight: '85%',
  },
  contenedor: {
    backgroundColor: COLORES.fondoSecundario,
    borderTopLeftRadius: BORDES.radio.xl,
    borderTopRightRadius: BORDES.radio.xl,
    padding: 20,
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
  input: {
    borderWidth: 1,
    borderColor: COLORES.inputBorde,
    borderRadius: BORDES.radio.sm,
    padding: 12,
    fontSize: 15,
    backgroundColor: COLORES.inputFondo,
    color: COLORES.texto,
  },
  botonAvanzado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    padding: 14,
    borderRadius: BORDES.radio.sm,
    borderWidth: 1,
    borderColor: COLORES.inputBorde,
    backgroundColor: COLORES.inputFondo,
  },
  textoAvanzado: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORES.textoSecundario,
  },
});