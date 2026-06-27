import React, { useState, useEffect } from 'react';
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
  { valor: PlataformaAutoRespuesta.CUALQUIERA, etiqueta: 'Cualquiera', icono: '🌐' },
  { valor: PlataformaAutoRespuesta.WHATSAPP,   etiqueta: 'WhatsApp',   icono: '💬' },
  { valor: PlataformaAutoRespuesta.TELEGRAM,   etiqueta: 'Telegram',   icono: '✈️' },
];

const TIPOS: { valor: TipoDestinatario; etiqueta: string; icono: string }[] = [
  { valor: TipoDestinatario.CUALQUIERA, etiqueta: 'Cualquiera', icono: '👥' },
  { valor: TipoDestinatario.CONTACTO,   etiqueta: 'Contacto',   icono: '👤' },
  { valor: TipoDestinatario.GRUPO,      etiqueta: 'Grupo',      icono: '🏘️' },
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
    <Modal visible={visible} animationType="slide" transparent>
      <View style={estilos.overlay}>
        <View style={estilos.contenedor}>
          <LinearGradient
            colors={[...GRADIENTES.header]}
            style={estilos.encabezado}
          >
            <Text style={estilos.titulo}>
              {reglaExistente ? '✏️ Editar regla' : '➕ Nueva regla'}
            </Text>
          </LinearGradient>

          <ScrollView style={estilos.cuerpo} showsVerticalScrollIndicator={false}>
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
              {PLATAFORMAS.map((p) => (
                <TouchableOpacity
                  key={p.valor}
                  style={[
                    estilos.chip,
                    plataforma === p.valor && estilos.chipActivo,
                  ]}
                  onPress={() => setPlataforma(p.valor)}
                  activeOpacity={0.7}
                >
                  <Text style={estilos.chipTexto}>{p.icono} {p.etiqueta}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tipo */}
            <Text style={estilos.etiqueta}>Tipo de chat</Text>
            <View style={estilos.opcionesRow}>
              {TIPOS.map((t) => (
                <TouchableOpacity
                  key={t.valor}
                  style={[
                    estilos.chip,
                    tipo === t.valor && estilos.chipActivo,
                  ]}
                  onPress={() => setTipo(t.valor)}
                  activeOpacity={0.7}
                >
                  <Text style={estilos.chipTexto}>{t.icono} {t.etiqueta}</Text>
                </TouchableOpacity>
              ))}
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
              placeholder="Ej: 🤖 Estoy ocupado, respondo pronto."
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
                  colors={puedeGuardar ? [...GRADIENTES.boton] : ['#546E7A', '#546E7A']}
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
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const estilos = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  contenedor: {
    backgroundColor: COLORES.fondoSecundario,
    borderTopLeftRadius: BORDES.radio.xl,
    borderTopRightRadius: BORDES.radio.xl,
    maxHeight: '92%',
  },
  encabezado: {
    padding: 20,
    borderTopLeftRadius: BORDES.radio.xl,
    borderTopRightRadius: BORDES.radio.xl,
    alignItems: 'center',
  },
  titulo: {
    color: COLORES.textoClaro,
    fontSize: 18,
    fontWeight: '700',
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
    backgroundColor: COLORES.inputFondo,
    borderWidth: 1,
    borderColor: COLORES.inputBorde,
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BORDES.radio.sm,
    borderWidth: 1,
    borderColor: COLORES.inputBorde,
    backgroundColor: COLORES.inputFondo,
  },
  chipActivo: {
    borderColor: COLORES.primario,
    backgroundColor: 'rgba(0, 217, 255, 0.12)',
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
    borderColor: COLORES.separador,
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
