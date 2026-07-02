import React, { useMemo } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENTES, BORDES, SOMBRAS, COLORES } from '../theme/colores';

interface Props {
  children: React.ReactNode;
  variante?: 'principal' | 'exito' | 'error';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export const BotonGradiente = React.memo<Props>(({
  children,
  variante = 'principal',
  onPress,
  style,
  disabled = false,
  accessibilityLabel,
}) => {
  const colors = useMemo((): readonly [string, string] => {
    switch (variante) {
      case 'exito': return [...GRADIENTES.botonExito] as const;
      case 'error': return [...GRADIENTES.botonError] as const;
      default: return [...GRADIENTES.boton] as const;
    }
  }, [variante]);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      activeOpacity={0.8}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8, }}
      style={[estilos.sombraExterior, style, disabled && { opacity: 0.5 }]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={estilos.boton}
      >
        {children}
      </LinearGradient>
    </TouchableOpacity>
  );
});

const estilos = StyleSheet.create({
  sombraExterior: {
    // Neumorphic extrusion: dark shadow bottom-right, light top-left
    shadowColor: COLORES.neumorphSombras,
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
    borderRadius: BORDES.radio.sm,
  },
  boton: {
    padding: 14,
    borderRadius: BORDES.radio.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    // Light shadow (top-left) for neumorphic depth
    shadowColor: COLORES.neumorphLuces,
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 0,
  },
});