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
      {/* Círculo difuminado superior derecho */}
      <View style={[estilos.circulo, estilos.circulo1]} />
      {/* Círculo difuminado inferior izquierdo */}
      <View style={[estilos.circulo, estilos.circulo2]} />
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
    position: 'relative',
  },
  circulo: {
    position: 'absolute',
    borderRadius: 9999,
  },
  circulo1: {
    width: 300,
    height: 300,
    backgroundColor: '#2c5364',
    top: -80,
    right: -100,
    opacity: 0.35,
    shadowColor: '#2c5364',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 120,
    elevation: 0,
  },
  circulo2: {
    width: 220,
    height: 220,
    backgroundColor: '#0f2027',
    bottom: 40,
    left: -60,
    opacity: 0.3,
    shadowColor: '#0f2027',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 100,
    elevation: 0,
  },
});