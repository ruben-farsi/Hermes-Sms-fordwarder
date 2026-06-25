import { useState, useCallback, useEffect } from 'react';
import { ReglaDeAutoRespuesta } from '../../domain/entities/ReglaDeAutoRespuesta';
import { ContenedorDeDependencias } from '../../infrastructure/container/ContenedorDeDependencias';

export const useAutoRespuestas = () => {
  const [reglas, setReglas] = useState<ReglaDeAutoRespuesta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [tienePermiso, setTienePermiso] = useState(false);

  const { gestionarAutoRespuestas, sincronizadorAutoRespuestasNativo } =
    ContenedorDeDependencias.obtenerInstancia();

  const cargarReglas = useCallback(async () => {
    setCargando(true);
    const resultado = await gestionarAutoRespuestas.obtenerReglas();
    setReglas(resultado);
    setCargando(false);
  }, [gestionarAutoRespuestas]);

  const verificarPermiso = useCallback(async () => {
    const permiso = await sincronizadorAutoRespuestasNativo.verificarPermisoNotificaciones();
    setTienePermiso(permiso);
  }, [sincronizadorAutoRespuestasNativo]);

  useEffect(() => {
    cargarReglas();
    verificarPermiso();
  }, [cargarReglas, verificarPermiso]);

  const crear = useCallback(
    async (datos: Omit<ReglaDeAutoRespuesta, 'id'>) => {
      await gestionarAutoRespuestas.crearRegla(datos);
      await cargarReglas();
      await sincronizadorAutoRespuestasNativo.sincronizar();
    },
    [gestionarAutoRespuestas, cargarReglas, sincronizadorAutoRespuestasNativo],
  );

  const editar = useCallback(
    async (regla: ReglaDeAutoRespuesta) => {
      await gestionarAutoRespuestas.editarRegla(regla);
      await cargarReglas();
      await sincronizadorAutoRespuestasNativo.sincronizar();
    },
    [gestionarAutoRespuestas, cargarReglas, sincronizadorAutoRespuestasNativo],
  );

  const eliminar = useCallback(
    async (id: string) => {
      await gestionarAutoRespuestas.eliminarRegla(id);
      await cargarReglas();
      await sincronizadorAutoRespuestasNativo.sincronizar();
    },
    [gestionarAutoRespuestas, cargarReglas, sincronizadorAutoRespuestasNativo],
  );

  const alternarEstado = useCallback(
    async (id: string) => {
      await gestionarAutoRespuestas.alternarEstado(id);
      await cargarReglas();
      await sincronizadorAutoRespuestasNativo.sincronizar();
    },
    [gestionarAutoRespuestas, cargarReglas, sincronizadorAutoRespuestasNativo],
  );

  const solicitarPermiso = useCallback(() => {
    sincronizadorAutoRespuestasNativo.abrirConfiguracionPermisos();
  }, [sincronizadorAutoRespuestasNativo]);

  return {
    reglas,
    cargando,
    tienePermiso,
    crear,
    editar,
    eliminar,
    alternarEstado,
    solicitarPermiso,
    verificarPermiso,
  };
};
