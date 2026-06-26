import { useState, useEffect } from 'react';
import { ReglaDeReenvio, CampoObjetivo } from '../../domain/entities/ReglaDeReenvio';
import { ConfiguracionTelegram } from '../../domain/entities/ConfiguracionTelegram';
import { ContenedorDeDependencias } from '../../infrastructure/container/ContenedorDeDependencias';

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const useFormularioRegla = (visible: boolean, reglaExistente?: ReglaDeReenvio) => {
  const [nombre, setNombre] = useState('');
  const [campoObjetivo, setCampoObjetivo] = useState<CampoObjetivo>(CampoObjetivo.REMITENTE);
  const [patron, setPatron] = useState('');
  const [esRegex, setEsRegex] = useState(false);
  const [activa, setActiva] = useState(true);
  const [configTelegramId, setConfigTelegramId] = useState('');
  const [configuraciones, setConfiguraciones] = useState<ConfiguracionTelegram[]>([]);
  const [horarioInicio, setHorarioInicio] = useState('');
  const [horarioFin, setHorarioFin] = useState('');
  const [diasActivos, setDiasActivos] = useState<number[]>([]);
  const [avanzadoVisible, setAvanzadoVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const contenedor = ContenedorDeDependencias.obtenerInstancia();
        const configs = await contenedor.configurarTelegram.obtenerTodas();
        setConfiguraciones(configs);
      } catch {}
    };
    cargar();
  }, []);

  useEffect(() => {
    if (visible) {
      setNombre(reglaExistente?.nombre ?? '');
      setCampoObjetivo(reglaExistente?.campoObjetivo ?? CampoObjetivo.REMITENTE);
      setPatron(reglaExistente?.patron ?? '');
      setEsRegex(reglaExistente?.esRegex ?? false);
      setActiva(reglaExistente?.activa ?? true);
      setConfigTelegramId(reglaExistente?.configTelegramId ?? '');
      setHorarioInicio(reglaExistente?.horarioInicio ?? '');
      setHorarioFin(reglaExistente?.horarioFin ?? '');
      setDiasActivos(reglaExistente?.diasActivos ?? []);
      setAvanzadoVisible(
        !!(reglaExistente?.configTelegramId || reglaExistente?.horarioInicio || reglaExistente?.diasActivos?.length)
      );
      setError(null);
    }
  }, [visible, reglaExistente]);

  const toggleDia = (dia: number) => {
    setDiasActivos(prev =>
      prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
    );
  };

  const validar = (): boolean => {
    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }
    if (!patron.trim()) {
      setError('El patrón es obligatorio');
      return false;
    }
    if (esRegex) {
      try {
        new RegExp(patron);
      } catch {
        setError('El patrón regex no es válido');
        return false;
      }
    }
    if (horarioInicio && horarioFin) {
      const [hI, mI] = horarioInicio.split(':').map(Number);
      const [hF, mF] = horarioFin.split(':').map(Number);
      if (hI * 60 + mI >= hF * 60 + mF) {
        setError('El horario de inicio debe ser menor al de fin');
        return false;
      }
    }
    setError(null);
    return true;
  };

  const obtenerDatos = (): Omit<ReglaDeReenvio, 'id'> | null => {
    if (!validar()) return null;
    return {
      nombre: nombre.trim(),
      campoObjetivo,
      patron: patron.trim(),
      esRegex,
      activa,
      configTelegramId: configTelegramId || undefined,
      horarioInicio: horarioInicio.trim() || undefined,
      horarioFin: horarioFin.trim() || undefined,
      diasActivos: diasActivos.length > 0 ? diasActivos : undefined,
    };
  };

  return {
    nombre, setNombre,
    campoObjetivo, setCampoObjetivo,
    patron, setPatron,
    esRegex, setEsRegex,
    activa, setActiva,
    configTelegramId, setConfigTelegramId,
    configuraciones,
    horarioInicio, setHorarioInicio,
    horarioFin, setHorarioFin,
    diasActivos, setDiasActivos, toggleDia,
    avanzadoVisible, setAvanzadoVisible,
    error,
    obtenerDatos,
    DIAS_SEMANA,
  };
};
