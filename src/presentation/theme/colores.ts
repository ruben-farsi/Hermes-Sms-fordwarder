export const COLORES = {
  fondoPrincipal: '#0F1923',
  fondoSecundario: '#1A2733',
  fondoTerciario: '#243442',

  // ─── Cards & containers ahora usan glass ──
  /** @deprecated Usar glassFondo en su lugar */
  tarjeta: '#1A2733',
  tarjetaBorde: 'rgba(255, 255, 255, 0.06)',
  tarjetaSombra: 'rgba(0, 0, 0, 0.3)',

  primario: '#2ECC71',
  primarioOscuro: '#27AE60',
  secundario: '#7C4DFF',
  acento: '#00E676',

  texto: '#ECEFF1',
  textoSecundario: '#B0BEC5',
  textoClaro: '#FFFFFF',
  textoSutil: '#B0BEC5',

  exito: '#00E676',
  exitoFondo: 'rgba(0, 230, 118, 0.12)',
  error: '#FF5252',
  errorFondo: 'rgba(255, 82, 82, 0.12)',
  advertencia: '#FFD740',
  advertenciaFondo: 'rgba(255, 215, 64, 0.12)',
  filtrado: '#78909C',
  filtradoFondo: 'rgba(120, 144, 156, 0.12)',

  inputFondo: 'rgba(255, 255, 255, 0.05)',
  inputBorde: 'rgba(255, 255, 255, 0.1)',
  inputBordeActivo: 'rgba(46, 204, 113, 0.5)',

  switchTrackActivo: 'rgba(46, 204, 113, 0.3)',
  switchThumbActivo: '#2ECC71',
  switchTrackInactivo: 'rgba(255, 255, 255, 0.08)',
  switchThumbInactivo: '#546E7A',

  tabBarFondo: '#0F1923',
  tabBarActivo: '#2ECC71',
  tabBarInactivo: '#546E7A',

  separador: 'rgba(255, 255, 255, 0.06)',

  // ─── Glassmorphism tokens ───────────────────────
  /** Fondo glass para tarjetas, contenedores y modales */
  glassFondo: 'rgba(15, 25, 35, 0.75)',
  /** Borde sutil para elementos glass */
  glassBorde: 'rgba(255, 255, 255, 0.15)',
  /** Borde activo con acento verde */
  glassBordeActivo: 'rgba(46, 204, 113, 0.25)',
  /** Sombra profunda para glass */
  glassSombra: 'rgba(0, 0, 0, 0.35)',
  /** Fondo glass para inputs (más translúcido) */
  glassInput: 'rgba(0, 0, 0, 0.3)',
  /** Borde glass para inputs */
  glassInputBorde: 'rgba(255, 255, 255, 0.08)',

  // ─── Neumorphism tokens (legacy, mantenidos para compatibilidad) ──
  neumorphLuces: 'rgba(255, 255, 255, 0.04)',
  neumorphSombras: 'rgba(0, 0, 0, 0.35)',
  neumorphLucesFuerte: 'rgba(46, 204, 113, 0.12)',
  neumorphBase: '#1E2D3D',
  neumorphHundido: '#16212E',
};

export const GRADIENTES = {
  /** Fondo principal — azul profundo premium */
  principal: ['#0f2027', '#203a43', '#2c5364'] as const,
  header: ['#1A2733', '#243442'] as const,
  boton: ['#2ECC71', '#27AE60'] as const,
  botonExito: ['#00E676', '#00C853'] as const,
  botonError: ['#FF5252', '#D32F2F'] as const,
  acento: ['#7C4DFF', '#E040FB'] as const,
  /** Overlay glass oscuro */
  glass: ['rgba(15, 25, 35, 0.6)', 'rgba(26, 39, 51, 0.4)'] as const,
};

export const SOMBRAS = {
  tarjeta: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  suave: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  boton: {
    shadowColor: '#2ECC71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  // ─── Neumorphism (legacy) ──
  neumorphExtruido: {
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  neumorphLuz: {
    shadowColor: 'rgba(255, 255, 255, 0.06)',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 0,
  },
  neumorphSombra: {
    shadowColor: 'rgba(0, 0, 0, 0.35)',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  // ─── Glassmorphism ──
  glass: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
};

export const BORDES = {
  radio: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 28,
  },
};