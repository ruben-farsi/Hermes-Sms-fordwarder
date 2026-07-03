import React, { useState, useCallback } from 'react';
import { Feather } from '@expo/vector-icons';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Switch,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useReglas } from '../hooks/useReglas';
import { FormularioRegla } from '../components/FormularioRegla';
import { FondoGradiente } from '../components/FondoGradiente';
import { ReglaDeReenvio, CampoObjetivo } from '../../domain/entities/ReglaDeReenvio';
import { COLORES, SOMBRAS, BORDES, GRADIENTES } from '../theme/colores';
import { FUENTES } from '../theme/tipografia';

export const PantallaReglas: React.FC = () => {
  const { reglas, cargando, crear, editar, eliminar, alternarEstado } =
    useReglas();
  const [modalVisible, setModalVisible] = useState(false);
  const [reglaEditando, setReglaEditando] = useState<
    ReglaDeReenvio | undefined
  >();

  const abrirFormularioNuevo = () => {
    setReglaEditando(undefined);
    setModalVisible(true);
  };

  const abrirFormularioEdicion = (regla: ReglaDeReenvio) => {
    setReglaEditando(regla);
    setModalVisible(true);
  };

  const manejarGuardado = async (
    datos: Omit<ReglaDeReenvio, 'id'>,
  ) => {
    if (reglaEditando) {
      await editar({ ...datos, id: reglaEditando.id });
    } else {
      await crear(datos);
    }
    setModalVisible(false);
  };

  const confirmarEliminacion = (regla: ReglaDeReenvio) => {
    Alert.alert(
      'Eliminar regla',
      `¿Eliminar la regla "${regla.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => eliminar(regla.id),
        },
      ],
    );
  };

  const obtenerIconoCampo = (campo: CampoObjetivo) =>
    campo === CampoObjetivo.REMITENTE ? 'user' : 'message-square';

  const renderizarRegla = useCallback(
    ({ item }: { item: ReglaDeReenvio }) => (
      <View style={estilos.tarjetaRegla}>
        <TouchableOpacity
          style={estilos.infoRegla}
          onPress={() => abrirFormularioEdicion(item)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Editar regla ${item.nombre}, ${item.activa ? 'activa' : 'inactiva'}`}
          accessibilityHint="Abre el formulario de edición"
          activeOpacity={0.6}
        >
          <View style={estilos.filaEncabezado}>
            <View style={[estilos.indicadorEstado, { backgroundColor: item.activa ? COLORES.exito : COLORES.textoSutil }]} />
            <Text style={estilos.nombreRegla}>{item.nombre}</Text>
            {!item.activa && (
              <View style={estilos.insigniaInactiva}>
                <Text style={estilos.textoInactiva}>Inactiva</Text>
              </View>
            )}
          </View>
          <View style={estilos.filaDetalle}>
            <Text style={estilos.iconoCampo}>
              <Feather name={obtenerIconoCampo(item.campoObjetivo)} size={14} color={COLORES.primario} />
            </Text>
            <Text style={estilos.detalleRegla}>
              {item.campoObjetivo === CampoObjetivo.REMITENTE
                ? 'Remitente'
                : 'Cuerpo'}{' '}
              · {item.esRegex ? <><Feather name="hash" size={14} color={COLORES.primario} /> Regex</> : <><Feather name="file-text" size={14} color={COLORES.primario} /> Texto</>}: {item.patron}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={estilos.accionesRegla}>
          <Switch
            value={item.activa}
            onValueChange={() => alternarEstado(item.id)}
            trackColor={{ false: COLORES.switchTrackInactivo, true: COLORES.switchTrackActivo }}
            thumbColor={item.activa ? COLORES.switchThumbActivo : COLORES.switchThumbInactivo}
          />
          <TouchableOpacity
            onPress={() => confirmarEliminacion(item)}
            style={estilos.botonEliminar}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Eliminar regla ${item.nombre}`}
            activeOpacity={0.6}
          >
            <Feather name="x" size={16} color={COLORES.error} />
          </TouchableOpacity>
        </View>
      </View>
    ),
    [alternarEstado],
  );

  const renderizarVacio = () => (
    <View style={estilos.vacio}>
      <Feather name="list" size={48} color={COLORES.textoSutil} />
      <Text style={estilos.textoVacio}>No hay reglas configuradas</Text>
      <Text style={estilos.textoSubtitulo}>
        Crea una regla para empezar a filtrar y reenviar SMS automáticamente
      </Text>
    </View>
  );

  if (cargando) {
    return (
      <FondoGradiente>
        <View style={estilos.centrado}>
          <ActivityIndicator size="large" color={COLORES.textoClaro} />
        </View>
      </FondoGradiente>
    );
  }

  return (
    <FondoGradiente>
      <FlatList
        data={reglas}
        keyExtractor={(item) => item.id}
        renderItem={renderizarRegla}
        ListEmptyComponent={renderizarVacio}
        contentContainerStyle={
          reglas.length === 0 ? estilos.listaVacia : estilos.lista
        }
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        onPress={abrirFormularioNuevo}
        activeOpacity={0.8}
        style={estilos.fabContenedor}
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

      <FormularioRegla
        visible={modalVisible}
        reglaExistente={reglaEditando}
        onGuardar={manejarGuardado}
        onCancelar={() => setModalVisible(false)}
      />
    </FondoGradiente>
  );
};

const estilos = StyleSheet.create({
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resumen: {
    backgroundColor: COLORES.glassFondo,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 6,
    padding: 12,
    borderRadius: BORDES.radio.md,
    borderWidth: 1,
    borderColor: COLORES.glassBorde,
    alignItems: 'center',
  },
  textoResumen: {
    fontSize: FUENTES.tamano.sm,
    fontWeight: FUENTES.peso.semibold,
    color: COLORES.primario,
  },
  lista: {
    paddingVertical: 4,
    paddingBottom: 8,
  },
  listaVacia: {
    flex: 1,
  },
  tarjetaRegla: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORES.glassFondo,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: BORDES.radio.md,
    borderWidth: 1,
    borderColor: COLORES.glassBorde,
    ...SOMBRAS.glass,
  },
  infoRegla: {
    flex: 1,
    marginRight: 12,
  },
  filaEncabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicadorEstado: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  nombreRegla: {
    fontSize: FUENTES.tamano.lg,
    fontWeight: FUENTES.peso.bold,
    color: COLORES.texto,
  },
  insigniaInactiva: {
    backgroundColor: COLORES.advertenciaFondo,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  textoInactiva: {
    fontSize: FUENTES.tamano.xs,
    fontWeight: FUENTES.peso.bold,
    color: COLORES.advertencia,
  },
  filaDetalle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  iconoCampo: {
    fontSize: FUENTES.tamano.sm,
    marginRight: 6,
  },
  detalleRegla: {
    fontSize: FUENTES.tamano.sm,
    color: COLORES.textoSecundario,
    flex: 1,
  },
  accionesRegla: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  botonEliminar: {
    padding: 6,
  },
  textoEliminar: {
    fontSize: FUENTES.tamano.xl,
  },
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
  vacio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  iconoVacio: {
    fontSize: FUENTES.tamano.icono,
    marginBottom: 16,
  },
  textoVacio: {
    fontSize: FUENTES.tamano.xl,
    fontWeight: FUENTES.peso.semibold,
    color: COLORES.texto,
    textAlign: 'center',
  },
  textoSubtitulo: {
    fontSize: FUENTES.tamano.md,
    color: COLORES.textoSecundario,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
});
