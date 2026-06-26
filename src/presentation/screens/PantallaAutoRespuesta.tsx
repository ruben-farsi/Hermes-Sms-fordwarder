import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Switch,
  Alert,
  StyleSheet,
  ActivityIndicator,
  AppState,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAutoRespuestas } from '../hooks/useAutoRespuestas';
import { FormularioAutoRespuesta } from '../components/FormularioAutoRespuesta';
import { FondoGradiente } from '../components/FondoGradiente';
import {
  ReglaDeAutoRespuesta,
  PlataformaAutoRespuesta,
  TipoDestinatario,
} from '../../domain/entities/ReglaDeAutoRespuesta';
import { COLORES, SOMBRAS, BORDES, GRADIENTES } from '../theme/colores';

const ICONO_PLATAFORMA: Record<PlataformaAutoRespuesta, string> = {
  [PlataformaAutoRespuesta.WHATSAPP]:   '💬',
  [PlataformaAutoRespuesta.TELEGRAM]:   '✈️',
  [PlataformaAutoRespuesta.CUALQUIERA]: '🌐',
};

const ICONO_TIPO: Record<TipoDestinatario, string> = {
  [TipoDestinatario.CONTACTO]:   '👤',
  [TipoDestinatario.GRUPO]:      '🏘️',
  [TipoDestinatario.CUALQUIERA]: '👥',
};

export const PantallaAutoRespuesta: React.FC = () => {
  const {
    reglas,
    cargando,
    tienePermiso,
    crear,
    editar,
    eliminar,
    alternarEstado,
    solicitarPermiso,
    verificarPermiso,
  } = useAutoRespuestas();

  const [modalVisible, setModalVisible]     = useState(false);
  const [reglaEditando, setReglaEditando]   = useState<ReglaDeAutoRespuesta | undefined>();

  // Reverificar permiso cuando la app vuelve al primer plano
  useEffect(() => {
    const suscripcion = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') verificarPermiso();
    });
    return () => suscripcion.remove();
  }, [verificarPermiso]);

  const abrirFormularioNuevo = () => {
    setReglaEditando(undefined);
    setModalVisible(true);
  };

  const abrirFormularioEdicion = (regla: ReglaDeAutoRespuesta) => {
    setReglaEditando(regla);
    setModalVisible(true);
  };

  const manejarGuardado = async (datos: Omit<ReglaDeAutoRespuesta, 'id'>) => {
    if (reglaEditando) {
      await editar({ ...datos, id: reglaEditando.id });
    } else {
      await crear(datos);
    }
    setModalVisible(false);
  };

  const confirmarEliminacion = (regla: ReglaDeAutoRespuesta) => {
    Alert.alert(
      'Eliminar regla',
      `¿Eliminar la regla "${regla.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => eliminar(regla.id) },
      ],
    );
  };

  const renderizarRegla = useCallback(
    ({ item }: { item: ReglaDeAutoRespuesta }) => (
      <View style={estilos.tarjeta}>
        <TouchableOpacity
          style={estilos.infoRegla}
          onPress={() => abrirFormularioEdicion(item)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Editar regla ${item.nombre}`}
          activeOpacity={0.6}
        >
          <View style={estilos.filaEncabezado}>
            <View style={[
              estilos.indicadorEstado,
              { backgroundColor: item.activa ? COLORES.exito : COLORES.textoSutil },
            ]} />
            <Text style={estilos.nombreRegla}>{item.nombre}</Text>
            {!item.activa && (
              <View style={estilos.insigniaInactiva}>
                <Text style={estilos.textoInactiva}>Inactiva</Text>
              </View>
            )}
          </View>

          <View style={estilos.filaBadges}>
            <View style={estilos.badge}>
              <Text style={estilos.badgeTexto}>
                {ICONO_PLATAFORMA[item.plataforma]} {item.plataforma}
              </Text>
            </View>
            <View style={estilos.badge}>
              <Text style={estilos.badgeTexto}>
                {ICONO_TIPO[item.tipoDestinatario]} {item.tipoDestinatario}
              </Text>
            </View>
            {item.delaySegundos > 0 && (
              <View style={estilos.badge}>
                <Text style={estilos.badgeTexto}>⏱️ {item.delaySegundos}s</Text>
              </View>
            )}
          </View>

          {item.identificador ? (
            <Text style={estilos.textoDetalle}>👤 {item.identificador}</Text>
          ) : null}
          {item.condicion ? (
            <Text style={estilos.textoDetalle}>🔑 Si contiene: "{item.condicion}"</Text>
          ) : null}
          <Text style={estilos.textoRespuesta} numberOfLines={2}>
            💬 {item.respuesta}
          </Text>
        </TouchableOpacity>

        <View style={estilos.acciones}>
          <Switch
            value={item.activa}
            onValueChange={() => alternarEstado(item.id)}
            trackColor={{ false: COLORES.switchTrackInactivo, true: COLORES.switchTrackActivo }}
            thumbColor={item.activa ? COLORES.switchThumbActivo : COLORES.switchThumbInactivo}
          />
          <TouchableOpacity
            onPress={() => confirmarEliminacion(item)}
            style={estilos.botonEliminar}
            activeOpacity={0.6}
          >
            <Text style={estilos.iconoEliminar}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [alternarEstado],
  );

  const renderizarVacio = () => (
    <View style={estilos.vacio}>
      <Text style={estilos.iconoVacio}>🤖</Text>
      <Text style={estilos.textoVacio}>Sin reglas de auto-respuesta</Text>
      <Text style={estilos.textoSubtitulo}>
        Crea una regla para responder automáticamente mensajes de WhatsApp o Telegram
      </Text>
    </View>
  );

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
      {/* Banner de permiso */}
      {!tienePermiso && (
        <TouchableOpacity
          style={estilos.bannerPermiso}
          onPress={solicitarPermiso}
          activeOpacity={0.8}
        >
          <Text style={estilos.bannerIcono}>⚠️</Text>
          <View style={estilos.bannerTextos}>
            <Text style={estilos.bannerTitulo}>Permiso requerido</Text>
            <Text style={estilos.bannerSubtitulo}>
              Toca aquí para habilitar el acceso a notificaciones
            </Text>
          </View>
          <Text style={estilos.bannerFlecha}>›</Text>
        </TouchableOpacity>
      )}

      {tienePermiso && reglas.length > 0 && (
        <View style={estilos.resumen}>
          <Text style={estilos.textoResumen}>
            ✅ {reglas.filter((r) => r.activa).length} activas de {reglas.length} reglas
          </Text>
        </View>
      )}

      <FlatList
        data={reglas}
        keyExtractor={(item) => item.id}
        renderItem={renderizarRegla}
        ListEmptyComponent={renderizarVacio}
        contentContainerStyle={estilos.lista}
        showsVerticalScrollIndicator={false}
      />

      {/* Boton flotante */}
      <TouchableOpacity
        style={estilos.fab}
        onPress={abrirFormularioNuevo}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Agregar nueva regla de auto-respuesta"
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[...GRADIENTES.boton]}
          style={estilos.fabGradiente}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={estilos.fabTexto}>+</Text>
        </LinearGradient>
      </TouchableOpacity>

      <FormularioAutoRespuesta
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
  bannerPermiso: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES.advertenciaFondo,
    borderWidth: 1,
    borderColor: COLORES.advertencia,
    borderRadius: BORDES.radio.md,
    margin: 16,
    padding: 14,
  },
  bannerIcono: {
    fontSize: 24,
    marginRight: 12,
  },
  bannerTextos: {
    flex: 1,
  },
  bannerTitulo: {
    color: COLORES.advertencia,
    fontWeight: '700',
    fontSize: 14,
  },
  bannerSubtitulo: {
    color: COLORES.textoSecundario,
    fontSize: 12,
    marginTop: 2,
  },
  bannerFlecha: {
    color: COLORES.advertencia,
    fontSize: 22,
    fontWeight: '300',
  },
  resumen: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  textoResumen: {
    color: COLORES.textoSecundario,
    fontSize: 13,
  },
  lista: {
    padding: 16,
    paddingBottom: 100,
  },
  tarjeta: {
    backgroundColor: COLORES.tarjeta,
    borderRadius: BORDES.radio.lg,
    borderWidth: 1,
    borderColor: COLORES.tarjetaBorde,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    ...SOMBRAS.tarjeta,
  },
  infoRegla: {
    flex: 1,
    padding: 14,
  },
  filaEncabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  indicadorEstado: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  nombreRegla: {
    color: COLORES.texto,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  insigniaInactiva: {
    backgroundColor: COLORES.filtradoFondo,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  textoInactiva: {
    color: COLORES.filtrado,
    fontSize: 10,
    fontWeight: '600',
  },
  filaBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: COLORES.fondoTerciario,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeTexto: {
    color: COLORES.textoSecundario,
    fontSize: 11,
    fontWeight: '500',
  },
  textoDetalle: {
    color: COLORES.textoSecundario,
    fontSize: 12,
    marginBottom: 3,
  },
  textoRespuesta: {
    color: COLORES.primario,
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  acciones: {
    paddingRight: 12,
    alignItems: 'center',
    gap: 8,
  },
  botonEliminar: {
    padding: 6,
  },
  iconoEliminar: {
    fontSize: 18,
  },
  vacio: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  iconoVacio: {
    fontSize: 64,
    marginBottom: 16,
  },
  textoVacio: {
    color: COLORES.texto,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  textoSubtitulo: {
    color: COLORES.textoSecundario,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    ...SOMBRAS.boton,
  },
  fabGradiente: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabTexto: {
    color: COLORES.textoClaro,
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 32,
  },
});
