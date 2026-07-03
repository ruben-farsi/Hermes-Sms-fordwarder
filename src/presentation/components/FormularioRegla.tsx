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
import { BlurView } from 'expo-blur';
import { useFormularioRegla } from '../hooks/useFormularioRegla';
import { COLORES, BORDES, SOMBRAS } from '../theme/colores';
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

  const renderInput = (
    valor: string,
    onChange: (v: string) => void,
    placeholder: string,
    accLabel: string,
    extra?: { autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' }
  ) => (
    <View style={estilos.inputNeumorph}>
      <TextInput
        style={estilos.input}
        value={valor}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={COLORES.textoSutil}
        autoCapitalize={extra?.autoCapitalize}
        accessibilityLabel={accLabel}
      />
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
        <KeyboardAvoidingView
          style={estilos.fondo}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={estilos.contenedorScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={estilos.contenedor}>
              <EncabezadoFormulario esEdicion={!!reglaExistente} />

              {/* Nombre */}
              <View style={estilos.filaEtiqueta}>
                <Text style={estilos.etiqueta}>Nombre de la regla</Text>
              </View>
              {renderInput(nombre, setNombre, 'Ej: Alertas del banco', 'Nombre de la regla')}

              <SelectorCampoObjetivo
                valor={campoObjetivo}
                onChange={setCampoObjetivo}
              />

              {/* Patrón */}
              <View style={estilos.filaEtiqueta}>
                <Text style={estilos.etiqueta}>Patrón de búsqueda</Text>
              </View>
              {renderInput(
                patron, setPatron,
                esRegex ? 'Ej: \\d{6}' : 'Ej: banco',
                esRegex ? 'Patrón regex' : 'Patrón de búsqueda',
                { autoCapitalize: 'none' }
              )}

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
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </BlurView>
    </Modal>
  );
};

const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
  },
  contenedorScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 60,
  },
  contenedor: {
    backgroundColor: COLORES.glassFondo,
    borderRadius: BORDES.radio.md,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORES.glassBorde,
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
  // ─── Midnight Glass Input ──
  inputNeumorph: {
    backgroundColor: COLORES.glassInput,
    borderRadius: BORDES.radio.sm,
    borderWidth: 1,
    borderColor: COLORES.glassInputBorde,
  },
  input: {
    padding: 12,
    fontSize: 15,
    color: COLORES.texto,
    borderRadius: BORDES.radio.sm,
    backgroundColor: 'transparent',
  },
  botonAvanzado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    padding: 14,
    borderRadius: BORDES.radio.sm,
    borderWidth: 1,
    borderColor: COLORES.glassBorde,
    backgroundColor: COLORES.glassFondo,
    ...SOMBRAS.glass,
  },
  textoAvanzado: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORES.textoSecundario,
  },
});