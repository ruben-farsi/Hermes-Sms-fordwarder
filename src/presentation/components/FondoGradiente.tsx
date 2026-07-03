import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const FondoGradiente: React.FC<Props> = ({ children, style }) => (
  <View style={[estilos.contenedor, style]}>
    <LinearGradient
      colors={['#0f2027', '#203a43', '#2c5364']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={estilos.gradiente}
    >
      {children}
    </LinearGradient>
  </View>
);

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
  },
  gradiente: {
    flex: 1,
  },
});