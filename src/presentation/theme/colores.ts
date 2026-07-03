export const COLORES = {
  // ─── Midnight OLED Base ────────────────────────
  fondoPrincipal: '#000000',
  fondoSecundario: '#0A0B10',
  fondoTerciario: '#12141C',

  // ─── Cards & containers — glass midnight ──
  tarjeta: '#0A0B10',
  tarjetaBorde: 'rgba(255, 255, 255, 0.08)',
  tarjetaSombra: 'rgba(0, 0, 0, 0.5)',

  // ─── Electric Blue / Cyan accent ────────────────
  primario: '#0A84FF',
  primarioOscuro: '#0066D6',
  secundario: '#00F0FF',
  acento: '#00F0FF',

  // ─── Text ──────────────────────────────────────
  texto: '#F0F2F8',
  textoSecundario: '#B0BEC5',
  textoClaro: '#FFFFFF',
  textoSutil: '#8E99A4',

  // ─── State ─────────────────────────────────────
  exito: '#30D158',
  exitoFondo: 'rgba(48, 209, 88, 0.12)',
  error: '#FF453A',
  errorFondo: 'rgba(255, 69, 58, 0.12)',
  advertencia: '#FFD60A',
  advertenciaFondo: 'rgba(255, 214, 10, 0.12)',
  filtrado: '#8E99A4',
  filtradoFondo: 'rgba(142, 153, 164, 0.12)',

  // ─── Input — midnight glass ─────────────────────
  inputFondo: 'rgba(255, 255, 255, 0.05)',
  inputBorde: 'rgba(255, 255, 255, 0.1)',
  inputBordeActivo: 'rgba(10, 132, 255, 0.5)',

  // ─── Switch ────────────────────────────────────
  switchTrackActivo: 'rgba(10, 132, 255, 0.3)',
  switchThumbActivo: '#0A84FF',
  switchTrackInactivo: 'rgba(255, 255, 255, 0.08)',
  switchThumbInactivo: '#3A3A3C',

  // ─── Tab bar ───────────────────────────────────
  tabBarFondo: '#000000',
  tabBarActivo: '#0A84FF',
  tabBarInactivo: '#3A3A3C',

  separador: 'rgba(255, 255, 255, 0.06)',

  // ─── Glassmorphism tokens ───────────────────────
  glassFondo: 'rgba(10, 11, 16, 0.75)',
  glassBorde: 'rgba(255, 255, 255, 0.10)',
  glassBordeActivo: 'rgba(10, 132, 255, 0.25)',
  glassSombra: 'rgba(0, 0, 0, 0.5)',
  glassInput: 'rgba(255, 255, 255, 0.04)',
  glassInputBorde: 'rgba(255, 255, 255, 0.07)',

  // ─── Neumorphism tokens (legacy) ────────────────
  neumorphLuces: 'rgba(255, 255, 255, 0.03)',
  neumorphSombras: 'rgba(0, 0, 0, 0.5)',
  neumorphLucesFuerte: 'rgba(10, 132, 255, 0.10)',
  neumorphBase: '#0A0B10',
  neumorphHundido: '#050508',
};

export const GRADIENTES = {
  /** Fondo principal — Midnight profundo */
  principal: ['#000000', '#0A0B10', '#12141C'] as const,
  header: ['#0A0B10', '#12141C'] as const,
  boton: ['#0A84FF', '#0066D6'] as const,
  botonExito: ['#30D158', '#248A3D'] as const,
  botonError: ['#FF453A', '#BF332B'] as const,
  acento: ['#00F0FF', '#0A84FF'] as const,
  glass: ['rgba(0, 0, 0, 0.6)', 'rgba(10, 11, 16, 0.4)'] as const,
};

export const SOMBRAS = {
  tarjeta: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  suave: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  boton: {
    shadowColor: '#0A84FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  neumorphExtruido: {
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  neumorphLuz: {
    shadowColor: 'rgba(255, 255, 255, 0.03)',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 0,
  },
  neumorphSombra: {
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  glass: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 28,
    elevation: 14,
  },
};

export const BORDES = {
  radio: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
  },
};