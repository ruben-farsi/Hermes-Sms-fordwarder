import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useConfigTelegram } from '../hooks/useConfigTelegram';
import { ConfiguracionTelegram } from '../../domain/entities/ConfiguracionTelegram';
import { FondoGradiente } from '../components/FondoGradiente';
import { COLORES, SOMBRAS, BORDES, GRADIENTES } from '../theme/colores';
import { FUENTES } from '../theme/tipografia';

export const PantallaConfiguracion: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    configuraciones,
    cargando,
    enviandoPrueba,
    error,
    exito,
    guardar,
    eliminar,
    enviarPrueba,
  } = useConfigTelegram();

  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<ConfiguracionTelegram | null>(null);
  const [nombre, setNombre] = useState('');
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [esPredeterminada, setEsPredeterminada] = useState(false);
  const [guiaVisible, setGuiaVisible] = useState(false);

  const abrirFormularioNuevo = () => {
    setEditando(null);
    setNombre('');
    setBotToken('');
    setChatId('');
    setEsPredeterminada(configuraciones.length === 0);
    setModalVisible(true);
  };

  const abrirFormularioEdicion = (config: ConfiguracionTelegram) => {
    setEditando(config);
    setNombre(config.nombre);
    setBotToken(config.botToken);
    setChatId(config.chatId);
    setEsPredeterminada(config.esPredeterminada);
    setModalVisible(true);
  };

  const manejarGuardado = () => {
    if (!nombre.trim() || !botToken.trim() || !chatId.trim()) return;
    const config: ConfiguracionTelegram = {
      id: editando?.id ?? Date.now().toString(),
      nombre: nombre.trim(),
      botToken: botToken.trim(),
      chatId: chatId.trim(),
      esPredeterminada,
    };
    guardar(config);
    setModalVisible(false);
  };

  const confirmarEliminacion = (config: ConfiguracionTelegram) => {
    Alert.alert(
      'Eliminar configuración',
      `¿Eliminar "${config.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => eliminar(config.id) },
      ],
    );
  };

  if (cargando) {
    return (
      <FondoGradiente>
        <View style={estilos.centrado}>
          <ActivityIndicator size="large" color={COLORES.primario} />
        </View>
      </FondoGradiente>
    );
  }

  return (
    <FondoGradiente>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }} keyboardShouldPersistTaps="handled">
        <TouchableOpacity
          style={estilos.botonGuia}
          onPress={() => setGuiaVisible(!guiaVisible)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={guiaVisible ? 'Ocultar guia' : 'Mostrar guia de configuracion'}
          activeOpacity={0.7}
        >
          <Feather name="help-circle" size={22} color={COLORES.primario} />
          <Text style={estilos.tituloGuia}>¿Cómo obtener los datos del bot?</Text>
          <Feather name={guiaVisible ? 'chevron-up' : 'chevron-down'} size={16} color={COLORES.textoSutil} />
        </TouchableOpacity>

        {guiaVisible && (
          <View style={estilos.tarjetaGuia}>
            <View style={estilos.pasos}>
              <Text style={estilos.paso}>1️⃣  Abre Telegram y busca @BotFather</Text>
              <Text style={estilos.paso}>2️⃣  Envía /newbot y sigue las instrucciones</Text>
              <Text style={estilos.paso}>3️⃣  Copia el token que te entrega BotFather</Text>
              <Text style={estilos.paso}>4️⃣  Crea un grupo e invita al bot</Text>
              <Text style={estilos.paso}>5️⃣  Envía un mensaje al grupo y visita:</Text>
              <View style={estilos.contenedorUrl}>
                <Text style={estilos.url}>api.telegram.org/bot{'<TOKEN>'}/getUpdates</Text>
              </View>
              <Text style={estilos.paso}>6️⃣  Busca "chat":{'{"id":'} en la respuesta JSON</Text>
            </View>
          </View>
        )}

        {error && (
          <View style={estilos.alerta}>
            <Feather name="alert-triangle" size={16} color={COLORES.advertencia} />
            <Text style={estilos.textoAlerta}> {error}</Text>
          </View>
        )}
        {exito && (
          <View style={estilos.alertaExito}>
            <Feather name="check-circle" size={16} color={COLORES.exito} />
            <Text style={estilos.textoAlertaExito}>{exito}</Text>
          </View>
        )}

        {configuraciones.length === 0 && (
          <View style={estilos.vacio}>
            <Feather name="settings" size={48} color={COLORES.textoSutil} />
            <Text style={estilos.textoVacio}>No hay configuraciones de Telegram</Text>
            <Text style={estilos.textoSubVacio}>Toca el botón + para agregar una</Text>
          </View>
        )}

        {configuraciones.map((config) => (
          <View key={config.id} style={estilos.tarjetaConfig}>
            <View style={estilos.cabeceraConfig}>
              <Text style={estilos.nombreConfig}>
                {config.esPredeterminada ? <><Feather name="star" size={14} color={COLORES.acento} />{' '}Default{' '}</> : <><Feather name="message-circle" size={14} color={COLORES.primario} />{' '}</>}{config.nombre}
              </Text>
              {config.esPredeterminada && (
                <View style={estilos.badgePredeterminada}>
                  <Text style={estilos.textoBadge}>Default</Text>
                </View>
              )}
            </View>
            <Text style={estilos.chatIdConfig}>Chat ID: {config.chatId}</Text>
            <View style={estilos.botonesConfig}>
              <TouchableOpacity
                style={estilos.botonAccionConfig}
                onPress={() => enviarPrueba(config.id)}
                disabled={enviandoPrueba === config.id}
              >
                {enviandoPrueba === config.id ? (
                  <ActivityIndicator size="small" color={COLORES.primario} />
                ) : (
                  <><Feather name="send" size={14} color={COLORES.primario} />
                    <Text style={estilos.textoAccionConfig}> Probar</Text></>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={estilos.botonAccionConfig}
                onPress={() => abrirFormularioEdicion(config)}
              >
                <Feather name="edit" size={14} color={COLORES.primario} />
                <Text style={estilos.textoAccionConfig}> Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[estilos.botonAccionConfig, estilos.botonEliminar]}
                onPress={() => confirmarEliminacion(config)}
              >
                <Feather name="x-circle" size={14} color={COLORES.error} />
                <Text style={estilos.textoEliminarBtn}> Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={estilos.fabContenedor}
        onPress={abrirFormularioNuevo}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[...GRADIENTES.boton]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={estilos.fab}
        >
          <Feather name="plus" size={28} color={COLORES.textoClaro} />
        </LinearGradient>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={estilos.fondoModal}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={estilos.contenedorModal}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={estilos.barraModal}>
              <View style={estilos.indicadorModal} />
            </View>
            <View style={estilos.filaTituloModal}>
                          {editando ? <><Feather name="edit" size={16} color={COLORES.primario} /><Text style={estilos.tituloModal}> Editar configuración</Text></> : <><Feather name="plus" size={16} color={COLORES.primario} /><Text style={estilos.tituloModal}> Nueva configuración</Text></>}
                        </View>

            <Text style={estilos.etiqueta}>Nombre</Text>
            <TextInput
              style={estilos.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ej: Bot principal"
              placeholderTextColor={COLORES.textoSutil}
              accessibilityLabel="Nombre de la configuración"
            />

            <Text style={estilos.etiqueta}>Bot Token</Text>
            <TextInput
              style={estilos.input}
              value={botToken}
              onChangeText={setBotToken}
              placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v"
              placeholderTextColor={COLORES.textoSutil}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              accessibilityLabel="Token del bot de Telegram"
            />

            <Text style={estilos.etiqueta}>Chat ID</Text>
            <TextInput
              style={estilos.input}
              value={chatId}
              onChangeText={setChatId}
              placeholder="-1001234567890"
              placeholderTextColor={COLORES.textoSutil}
              autoCapitalize="none"
              keyboardType="numeric"
              accessibilityLabel="ID del chat de Telegram"
            />

            <TouchableOpacity
              style={estilos.filaPredeterminada}
              onPress={() => setEsPredeterminada(!esPredeterminada)}
            >
              {esPredeterminada ? <Feather name="star" size={16} color={COLORES.acento} /> : <Feather name="square" size={16} color={COLORES.textoSutil} />}
                {' '}<Text style={estilos.textoPredeterminada}>Configuración predeterminada</Text>
            </TouchableOpacity>

            <View style={[estilos.botonesModal, { marginBottom: Math.max(insets.bottom, 12) }]}>
              <TouchableOpacity
                style={estilos.botonCancelar}
                onPress={() => setModalVisible(false)}
              >
                <Text style={estilos.textoCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={manejarGuardado} activeOpacity={0.8}>
                <LinearGradient
                  colors={[...GRADIENTES.boton]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={estilos.botonGuardar}
                >
                  <Text style={estilos.textoGuardar}>Guardar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </FondoGradiente>
  );
};

const estilos = StyleSheet.create({
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonGuia: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES.glassFondo,
    margin: 16,
    marginBottom: 0,
    padding: 14,
    borderRadius: BORDES.radio.md,
    borderWidth: 1,
    borderColor: COLORES.glassBorde,
  },
  iconoGuia: { fontSize: 22, marginRight: 8 },
  tituloGuia: { fontSize: FUENTES.tamano.md, fontWeight: FUENTES.peso.bold, color: COLORES.primario, flex: 1 },
  flechaGuia: { fontSize: FUENTES.tamano.md, color: COLORES.primario, fontWeight: '700' },
  tarjetaGuia: {
    backgroundColor: COLORES.glassFondo,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomLeftRadius: BORDES.radio.md,
    borderBottomRightRadius: BORDES.radio.md,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: COLORES.glassBorde,
  },
  pasos: { gap: 6 },
  paso: { fontSize: FUENTES.tamano.sm, color: COLORES.textoSecundario, lineHeight: 20 },
  contenedorUrl: {
    backgroundColor: 'rgba(0, 217, 255, 0.08)',
    padding: 8,
    borderRadius: 6,
    marginVertical: 4,
    marginLeft: 24,
  },
  url: { fontSize: FUENTES.tamano.xs, color: COLORES.primario, fontFamily: 'monospace' },
  alerta: {
    backgroundColor: COLORES.errorFondo,
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    borderRadius: BORDES.radio.sm,
  },
  textoAlerta: { color: COLORES.error, fontSize: FUENTES.tamano.md, fontWeight: '500' },
  alertaExito: {
    backgroundColor: COLORES.exitoFondo,
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    borderRadius: BORDES.radio.sm,
  },
  textoAlertaExito: { color: COLORES.exito, fontSize: FUENTES.tamano.md, fontWeight: '500' },
  vacio: {
    margin: 16,
    padding: 40,
    alignItems: 'center',
  },
  iconoVacio: { fontSize: FUENTES.tamano.icono, marginBottom: 12 },
  textoVacio: { color: COLORES.texto, fontSize: FUENTES.tamano.lg, fontWeight: '600' },
  textoSubVacio: { color: COLORES.textoSecundario, fontSize: FUENTES.tamano.sm, marginTop: 4 },
  tarjetaConfig: {
    backgroundColor: COLORES.glassFondo,
    margin: 16,
    marginBottom: 4,
    padding: 16,
    borderRadius: BORDES.radio.md,
    borderWidth: 1,
    borderColor: COLORES.glassBorde,
    ...SOMBRAS.glass,
  },
  cabeceraConfig: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  nombreConfig: { fontSize: FUENTES.tamano.lg, fontWeight: FUENTES.peso.bold, color: COLORES.texto, flex: 1 },
  badgePredeterminada: {
    backgroundColor: COLORES.advertenciaFondo,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  textoBadge: { color: COLORES.advertencia, fontSize: FUENTES.tamano.xs, fontWeight: '700' },
  chatIdConfig: { color: COLORES.textoSecundario, fontSize: FUENTES.tamano.sm, marginBottom: 10 },
  botonesConfig: { flexDirection: 'row', gap: 8 },
  botonAccionConfig: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BORDES.radio.sm,
    backgroundColor: 'rgba(0, 217, 255, 0.08)',
  },
  textoAccionConfig: { color: COLORES.primario, fontSize: FUENTES.tamano.sm, fontWeight: '600' },
  botonEliminar: { backgroundColor: COLORES.errorFondo },
  textoEliminarBtn: { fontSize: 14 },
  fabContenedor: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    ...SOMBRAS.boton,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoFab: { color: COLORES.textoClaro, fontSize: 28, fontWeight: '300', marginTop: -2 },
  fondoModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  contenedorModal: {
    backgroundColor: COLORES.glassFondo,
    borderTopLeftRadius: BORDES.radio.xl,
    borderTopRightRadius: BORDES.radio.xl,
    padding: 20,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: COLORES.glassBorde,
    borderBottomWidth: 0,
  },
  barraModal: {
    alignItems: 'center',
    marginBottom: 8,
  },
  indicadorModal: {
    width: 40,
    height: 4,
    backgroundColor: COLORES.textoSutil,
    borderRadius: 2,
  },
  tituloModal: {
    fontSize: FUENTES.tamano.xl,
    fontWeight: FUENTES.peso.bold,
    textAlign: 'center',
    color: COLORES.texto,
  },
  filaTituloModal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  etiqueta: {
    fontSize: FUENTES.tamano.md,
    fontWeight: FUENTES.peso.semibold,
    color: COLORES.textoSecundario,
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORES.glassInputBorde,
    borderRadius: BORDES.radio.sm,
    padding: 12,
    fontSize: FUENTES.tamano.md,
    backgroundColor: COLORES.glassInput,
    color: COLORES.texto,
  },
  filaPredeterminada: {
    marginTop: 16,
    padding: 12,
    borderRadius: BORDES.radio.sm,
    backgroundColor: COLORES.advertenciaFondo,
  },
  textoPredeterminada: { fontSize: FUENTES.tamano.md, fontWeight: FUENTES.peso.semibold, color: COLORES.advertencia },
  botonesModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 10,
  },
  botonCancelar: {
    flex: 1,
    padding: 14,
    borderRadius: BORDES.radio.sm,
    borderWidth: 1,
    borderColor: COLORES.glassInputBorde,
    alignItems: 'center',
    backgroundColor: COLORES.glassInput,
  },
  textoCancelar: { color: COLORES.textoSecundario, fontWeight: FUENTES.peso.bold, fontSize: 15 },
  botonGuardar: {
    flex: 1,
    padding: 14,
    borderRadius: BORDES.radio.sm,
    alignItems: 'center',
  },
  textoGuardar: { color: COLORES.textoClaro, fontWeight: FUENTES.peso.bold, fontSize: 15 },
  espacioInferior: { height: 80 },
});
