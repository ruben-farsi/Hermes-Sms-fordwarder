import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ReglaDeAutoRespuesta,
  PlataformaAutoRespuesta,
  TipoDestinatario,
} from '../../domain/entities/ReglaDeAutoRespuesta';
import { COLORES, GRADIENTES, BORDES } from '../theme/colores';
import { FUENTES } from '../theme/tipografia';

interface Props {
  visible: boolean;
  reglaExistente?: ReglaDeAutoRespuesta;
  onGuardar: (datos: Omit<ReglaDeAutoRespuesta, 'id'>) => void;
  onCancelar: () => void;
}

const PLATAFORMAS: { valor: PlataformaAutoRespuesta; etiqueta: string; icono: string }[] = [
  { valor: PlataformaAutoRespuesta.CUALQUIERA, etiqueta: 'Cualquiera', icono: 'globe' },
  { valor: PlataformaAutoRespuesta.WHATSAPP,   etiqueta: 'WhatsApp',   icono: 'message-square' },
  { valor: PlataformaAutoRespuesta.TELEGRAM,   etiqueta: 'Telegram',   icono: 'send' },
];

const TIPOS: { valor: TipoDestinatario; etiqueta: string; icono: string }[] = [
  { valor: TipoDestinatario.CUALQUIERA, etiqueta: 'Cualquiera', icono: 'globe' },
  { valor: TipoDestinatario.CONTACTO,   etiqueta: 'Contacto',   icono: 'user' },
  { valor: TipoDestinatario.GRUPO,      etiqueta: 'Grupo',      icono: 'users' },
];

export const FormularioAutoRespuesta: React.FC<Props> = ({
  visible,
  reglaExistente,
  onGuardar,
  onCancelar,
}) => {
  const [nombre, setNombre]             = useState('');
  const [plataforma, setPlataforma]     = useState<PlataformaAutoRespuesta>(PlataformaAutoRespuesta.CUALQUIERA);
  const [tipo, setTipo]                 = useState<TipoDestinatario>(TipoDestinatario.CUALQUIERA);
  const [identificador, setIdentificador] = useState('');
  const [condicion, setCondicion]       = useState('');
  const [respuesta, setRespuesta]       = useState('');
  const [delay, setDelay]               = useState('0');

  useEffect(() => {
    if (reglaExistente) {
      setNombre(reglaExistente.nombre);
      setPlataforma(reglaExistente.plataforma);
      setTipo(reglaExistente.tipoDestinatario);
      setIdentificador(reglaExistente.identificador);
      setCondicion(reglaExistente.condicion);
      setRespuesta(reglaExistente.respuesta);
      setDelay(String(reglaExistente.delaySegundos));
    } else {
      setNombre('');
      setPlataforma(PlataformaAutoRespuesta.CUALQUIERA);
      setTipo(TipoDestinatario.CUALQUIERA);
      setIdentificador('');
      setCondicion('');
      setRespuesta('');
      setDelay('0');
    }
  }, [reglaExistente, visible]);

  const puedeGuardar = nombre.trim().length > 0 && respuesta.trim().length > 0;

  const manejarGuardar = () => {
    Keyboard.dismiss();
    if (!puedeGuardar) return;
    onGuardar({
      nombre: nombre.trim(),
      plataforma,
      tipoDestinatario: tipo,
      identificador: identificador.trim(),
      condicion: condicion.trim(),
      respuesta: respuesta.trim(),
      activa: reglaExistente?.activa ?? true,
      delaySegundos: Math.max(0, parseInt(delay, 10) || 0),
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
        <ScrollView
          contentContainerStyle={estilos.contenedorScroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={estilos.contenedor}>
            <LinearGradient
              colors={[...GRADIENTES.header]}
              style={estilos.encabezado}
            >
              <View style={estilos.filaTitulo}>
                {reglaExistente ? (
                  <><Feather name="edit" size={16} color={COLORES.textoClaro} /><Text style={estilos.titulo}> Editar regla</Text></>
                ) : (
                  <><Feather name="plus" size={16} color={COLORES.textoClaro} /><Text style={estilos.titulo}> Nueva regla</Text></>
                )}
              </View>
            </LinearGradient>

            <View style={estilos.cuerpo}>
              {/* Nombre */}
              <Text style={estilos.etiqueta}>Nombre de la regla *</Text>
              <TextInput
                style={estilos.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Ej: Respuesta trabajo"
                placeholderTextColor={COLORES.textoSutil}
              />

              {/* Plataforma */}
              <Text style={estilos.etiqueta}>Plataforma</Text>
              <View style={estilos.opcionesRow}>
                {PLATAFORMAS.map((p) => {
                  const activo = plataforma === p.valor;
                  return (
                    <TouchableOpacity
                      key={p.valor}
                      style={[
                        estilos.chip,
                        activo && estilos.chipActivo,
                      ]}
                      onPress={() => setPlataforma(p.valor)}
                      activeOpacity={0.7}
                    >
                      <Feather name={p.icono as any} size={14} color={activo ? COLORES.textoClaro : COLORES.primario} />
                      <Text style={[estilos.chipTexto, activo && { color: COLORES.textoClaro }]}> {p.etiqueta}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Tipo */}
              <Text style={estilos.etiqueta}>Tipo de chat</Text>
              <View style={estilos.opcionesRow}>
                {TIPOS.map((t) => {
                  const activo = tipo === t.valor;
                  return (
                    <TouchableOpacity
                      key={t.valor}
                      style={[
                        estilos.chip,
                        activo && estilos.chipActivo,
                      ]}
                      onPress={() => setTipo(t.valor)}
                      activeOpacity={0.7}
                    >
                      <Feather name={t.icono as any} size={14} color={activo ? COLORES.textoClaro : COLORES.primario} />
                      <Text style={[estilos.chipTexto, activo && { color: COLORES.textoClaro }]}> {t.etiqueta}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Identificador */}
              <Text style={estilos.etiqueta}>Nombre del contacto / grupo</Text>
              <Text style={estilos.ayuda}>Dejar vacío para aplicar a todos</Text>
              <TextInput
                style={estilos.input}
                value={identificador}
                onChangeText={setIdentificador}
                placeholder="Ej: Juan Pérez, Trabajo IT"
                placeholderTextColor={COLORES.textoSutil}
              />

              {/* Condición */}
              <Text style={estilos.etiqueta}>Condición (palabra clave)</Text>
              <Text style={estilos.ayuda}>Solo responder si el mensaje contiene esta palabra</Text>
              <TextInput
                style={estilos.input}
                value={condicion}
                onChangeText={setCondicion}
                placeholder="Ej: urgente, ayuda"
                placeholderTextColor={COLORES.textoSutil}
              />

              {/* Respuesta */}
              <Text style={estilos.etiqueta}>Respuesta automática *</Text>
              <TextInput
                style={[estilos.input, estilos.inputMultilinea]}
                value={respuesta}
                onChangeText={setRespuesta}
                placeholder="Ej: [Bot] Estoy ocupado, respondo pronto."
                placeholderTextColor={COLORES.textoSutil}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              {/* Delay */}
              <Text style={estilos.etiqueta}>Delay antes de responder (segundos)</Text>
              <TextInput
                style={estilos.input}
                value={delay}
                onChangeText={setDelay}
                placeholder="0"
                placeholderTextColor={COLORES.textoSutil}
                keyboardType="numeric"
                accessibilityLabel="Delay en segundos antes de responder"
              />

              <View style={estilos.botonesAccion}>
                <TouchableOpacity
                  style={estilos.botonCancelar}
                  onPress={onCancelar}
                  activeOpacity={0.7}
                >
                  <Text style={estilos.textoCancelar}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={manejarGuardar}
                  activeOpacity={0.7}
                  disabled={!puedeGuardar}
                  style={puedeGuardar ? undefined : estilos.botonDesactivado}
                >
                  <LinearGradient
                    colors={puedeGuardar ? [...GRADIENTES.boton] : ['#3A3A3C', '#3A3A3C']}
                    style={estilos.botonGuardar}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={estilos.textoGuardar}>
                      {reglaExistente ? 'Guardar cambios' : 'Crear regla'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </BlurView>
    </Modal>
  );
};

const estilos = StyleSheet.create({
  contenedorScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 60,
  },
  contenedor: {
    backgroundColor: COLORES.glassFondo,
    borderRadius: BORDES.radio.md,
    borderWidth: 1,
    borderColor: COLORES.glassBorde,
    overflow: 'hidden',
  },
  encabezado: {
    padding: 20,
    alignItems: 'center',
  },
  titulo: {
    color: COLORES.textoClaro,
    fontSize: 18,
    fontWeight: '700',
  },
  filaTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cuerpo: {
    padding: 20,
  },
  etiqueta: {
    color: COLORES.textoSecundario,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 16,
    marginBottom: 6,
  },
  ayuda: {
    color: COLORES.textoSutil,
    fontSize: FUENTES.tamano.xs,
    marginBottom: 6,
    marginTop: -4,
  },
  input: {
    backgroundColor: COLORES.glassInput,
    borderWidth: 1,
    borderColor: COLORES.glassInputBorde,
    borderRadius: BORDES.radio.sm,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: COLORES.texto,
    fontSize: 14,
  },
  inputMultilinea: {
    minHeight: 80,
    paddingTop: 10,
  },
  opcionesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BORDES.radio.sm,
    borderWidth: 1,
    borderColor: COLORES.glassInputBorde,
    backgroundColor: COLORES.glassInput,
    gap: 6,
  },
  chipActivo: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.primario,
  },
  chipTexto: {
    color: COLORES.texto,
    fontSize: 13,
  },
  botonesAccion: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 12,
  },
  botonCancelar: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BORDES.radio.md,
    borderWidth: 1,
    borderColor: COLORES.glassBorde,
    alignItems: 'center',
  },
  textoCancelar: {
    color: COLORES.textoSecundario,
    fontWeight: '600',
    fontSize: 15,
  },
  botonGuardar: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BORDES.radio.md,
    alignItems: 'center',
    minWidth: 140,
  },
  textoGuardar: {
    color: COLORES.textoClaro,
    fontWeight: '700',
    fontSize: 15,
  },
  botonDesactivado: {
    opacity: 0.5,
  },
});