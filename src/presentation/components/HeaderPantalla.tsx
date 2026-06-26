import React, { useMemo } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORES, GRADIENTES } from '../theme/colores';

interface Props {
  titulo: string;
}

export const HeaderPantalla = React.memo<Props>(({ titulo }) => {
  const insets = useSafeAreaInsets();

  const colors = useMemo(() => [...GRADIENTES.header] as const, []);

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[estilos.header, { paddingTop: Math.max(insets.top, 20) + 12 }]}
    >
      <Text style={estilos.headerTitulo}>{titulo}</Text>
    </LinearGradient>
  );
});

const estilos = StyleSheet.create({
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
