import React, { useState, useCallback, useEffect } from 'react';
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
import { FUENTES } from '../theme/tipografia';

const ICONO_PLATAFORMA: Record<PlataformaAutoRespuesta, { name: string; color: string }> = {
  [PlataformaAutoRespuesta.WHATSAPP]:   { name: 'message-square', color: '#25D366' },
  [PlataformaAutoRespuesta.TELEGRAM]:   { name: 'send', color: '#0088cc' },
  [PlataformaAutoRespuesta.CUALQUIERA]: { name: 'globe', color: COLORES.primario },
};

export const TIPOS_DESTINATARIO: Record<TipoDestinatario, { name: string; color: string }> = {
  [TipoDestinatario.CONTACTO]:   { name: 'user', color: COLORES.acento },
  [TipoDestinatario.GRUPO]:      { name: 'users', color: COLORES.acento },
  [TipoDestinatario.CUALQUIERA]: { name: 'globe', color: COLORES.primario },
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
              <Feather name={ICONO_PLATAFORMA[item.plataforma].name as any} size={12} color={ICONO_PLATAFORMA[item.plataforma].color} />
              <Text style={estilos.badgeTexto}> {item.plataforma}</Text>
            </View>
            <View style={estilos.badge}>
              <Feather name={TIPOS_DESTINATARIO[item.tipoDestinatario].name as any} size={12} color={TIPOS_DESTINATARIO[item.tipoDestinatario].color} />
              <Text style={estilos.badgeTexto}> {item.tipoDestinatario}</Text>
            </View>
            {item.delaySegundos > 0 && (
              <View style={estilos.badge}>
                <Text style={estilos.badgeTexto}>⏱️ {item.delaySegundos}s</Text>
              </View>
            )}
          </View>

          {item.identificador ? (
            <Text style={estilos.textoDetalle}>[Me] {item.identificador}</Text>
          ) : null}
          {item.condicion ? (
            <Text style={estilos.textoDetalle}>[Key] Si contiene: "{item.condicion}"</Text>
          ) : null}
          <Text style={estilos.textoRespuesta} numberOfLines={2}>
            [Chat] {item.respuesta}
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
            <Feather name="x" size={16} color={COLORES.error} />
          </TouchableOpacity>
        </View>
      </View>
    ),
    [alternarEstado],
  );

  const renderizarVacio = () => (
    <View style={estilos.vacio}>
      <Feather name="message-circle" size={48} color={COLORES.textoSutil} />
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
          <Text style={estilos.bannerIcono}>[Warn]</Text>
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
            [OK] {reglas.filter((r) => r.activa).length} activas de {reglas.length} reglas
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
    fontSize: FUENTES.tamano.xxl,
    marginRight: 12,
  },
  bannerTextos: {
    flex: 1,
  },
  bannerTitulo: {
    color: COLORES.advertencia,
    fontWeight: FUENTES.peso.bold,
    fontSize: FUENTES.tamano.md,
  },
  bannerSubtitulo: {
    color: COLORES.textoSecundario,
    fontSize: FUENTES.tamano.xs,
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
    fontSize: FUENTES.tamano.sm,
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
    fontSize: FUENTES.tamano.md,
    fontWeight: FUENTES.peso.semibold,
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
    fontSize: FUENTES.tamano.xs,
    fontWeight: FUENTES.peso.semibold,
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
    fontSize: FUENTES.tamano.xs,
    fontWeight: FUENTES.peso.medio,
  },
  textoDetalle: {
    color: COLORES.textoSecundario,
    fontSize: FUENTES.tamano.xs,
    marginBottom: 3,
  },
  textoRespuesta: {
    color: COLORES.primario,
    fontSize: FUENTES.tamano.xs,
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
    fontSize: FUENTES.tamano.xl,
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
    fontSize: FUENTES.tamano.xl,
    fontWeight: FUENTES.peso.semibold,
    textAlign: 'center',
    marginBottom: 8,
  },
  textoSubtitulo: {
    color: COLORES.textoSecundario,
    fontSize: FUENTES.tamano.md,
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
