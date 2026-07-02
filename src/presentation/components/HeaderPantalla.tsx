import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORES, GRADIENTES, BORDES } from '../theme/colores';

interface Props {
  titulo: string;
}

export const HeaderPantalla = React.memo<Props>(({ titulo }) => {
  const insets = useSafeAreaInsets();

  const colors = useMemo(() => [...GRADIENTES.header] as const, []);

  const contenido = (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[estilos.header, { paddingTop: Math.max(insets.top, 20) + 12 }]}
    >
      <Text style={estilos.headerTitulo}>{titulo}</Text>
    </LinearGradient>
  );

  if (Platform.OS === 'ios') {
    // iOS: true glassmorphism with BlurView overlay
    return (
      <View style={estilos.contenedorGlass}>
        {contenido}
        <BlurView
          intensity={12}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
      </View>
    );
  }

  // Android: glass-mimic with translucent overlay gradient
  return (
    <View style={estilos.contenedorGlass}>
      {contenido}
      <LinearGradient
        colors={['rgba(15, 25, 35, 0.3)', 'rgba(26, 39, 51, 0.15)']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
    </View>
  );
});

const estilos = StyleSheet.create({
  contenedorGlass: {
    position: 'relative',
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: COLORES.glassBorde,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitulo: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: COLORES.textoClaro,
  },
});