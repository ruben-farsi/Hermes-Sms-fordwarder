import { PixelRatio } from 'react-native';

const fontScale = (size: number): number => Math.round(size * PixelRatio.getFontScale());

export const FUENTES = {
  familia: {
    regular: 'System',
    bold: 'System',
  },
  tamano: {
    xs: fontScale(12),   // mínimo accesible
    sm: fontScale(13),   // subtítulos
    md: fontScale(14),   // cuerpo principal
    lg: fontScale(16),   // títulos chicos
    xl: fontScale(20),   // títulos medianos
    xxl: fontScale(24),  // títulos grandes
    xxxl: fontScale(28), // display/FAB
    icono: fontScale(48), // iconos grandes
  },
  peso: {
    regular: '400' as const,
    medio: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const ESPACIADO = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};
