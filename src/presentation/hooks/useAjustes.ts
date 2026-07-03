import { useState, useCallback, useEffect, useRef } from 'react';
import { Ajustes } from '../../domain/entities/Ajustes';
import { ContenedorDeDependencias } from '../../infrastructure/container/ContenedorDeDependencias';

export const useAjustes = () => {
  const [ajustes, setAjustes] = useState<Ajustes | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardado, setGuardado] = useState(false);
  const temporizadorGuardado = useRef<ReturnType<typeof setTimeout>>();

  const { gestionarAjustes } =
    ContenedorDeDependencias.obtenerInstancia();

  const cargarAjustes = useCallback(async () => {
    setCargando(true);
    const resultado = await gestionarAjustes.obtenerAjustes();
    setAjustes(resultado);
    setCargando(false);
  }, [gestionarAjustes]);

  useEffect(() => {
    cargarAjustes();
  }, [cargarAjustes]);

  const guardar = useCallback(
    async (nuevosAjustes: Ajustes) => {
      setGuardado(false);
      await gestionarAjustes.guardarAjustes(nuevosAjustes);
      setAjustes(nuevosAjustes);
      setGuardado(true);
      if (temporizadorGuardado.current) clearTimeout(temporizadorGuardado.current);
      temporizadorGuardado.current = setTimeout(() => setGuardado(false), 3000);
    },
    [gestionarAjustes],
  );

  return { ajustes, cargando, guardado, guardar };
};
