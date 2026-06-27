import React, { useState, useCallback } from 'react';
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
    campo === CampoObjetivo.REMITENTE ? '[Contact]' : '[Body]';

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
              {obtenerIconoCampo(item.campoObjetivo)}
            </Text>
            <Text style={estilos.detalleRegla}>
              {item.campoObjetivo === CampoObjetivo.REMITENTE
                ? 'Remitente'
                : 'Cuerpo'}{' '}
              · {item.esRegex ? '🔣 Regex' : '[Doc] Texto'}: {item.patron}
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
            <Text style={estilos.textoEliminar}>[X]</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [alternarEstado],
  );

  const renderizarVacio = () => (
    <View style={estilos.vacio}>
      <Text style={estilos.iconoVacio}>[List]</Text>
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
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      </FondoGradiente>
    );
  }

  return (
    <FondoGradiente>
      {reglas.length > 0 && (
        <View style={estilos.resumen}>
          <Text style={estilos.textoResumen}>
            [Stats] {reglas.filter((r) => r.activa).length} activas de{' '}
            {reglas.length} reglas
          </Text>
        </View>
      )}

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
        style={estilos.contenedorBotonAgregar}
      >
        <LinearGradient
          colors={[...GRADIENTES.boton]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={estilos.botonAgregar}
        >
          <Text style={estilos.textoAgregar}>[+ Nueva] regla</Text>
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
    backgroundColor: COLORES.tarjeta,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 6,
    padding: 12,
    borderRadius: BORDES.radio.md,
    borderWidth: 1,
    borderColor: COLORES.tarjetaBorde,
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
    backgroundColor: COLORES.tarjeta,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: BORDES.radio.md,
    borderWidth: 1,
    borderColor: COLORES.tarjetaBorde,
    ...SOMBRAS.suave,
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
  contenedorBotonAgregar: {
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 4,
    borderRadius: BORDES.radio.md,
    ...SOMBRAS.boton,
  },
  botonAgregar: {
    padding: 16,
    borderRadius: BORDES.radio.md,
    alignItems: 'center',
  },
  textoAgregar: {
    color: '#FFFFFF',
    fontSize: FUENTES.tamano.lg,
    fontWeight: FUENTES.peso.bold,
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
