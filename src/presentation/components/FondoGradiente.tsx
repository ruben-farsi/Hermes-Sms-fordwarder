import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORES } from '../theme/colores';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const FondoGradiente: React.FC<Props> = ({ children, style }) => (
  <View style={[estilos.contenedor, style]}>
    <LinearGradient
      colors={['#7C4DFF', '#E040FB', '#FF6B6B', '#FF8E53']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={estilos.gradiente}
    >
      {/* Círculos difuminados para simular fondo abstracto 3D */}
      <View style={[estilos.circulo, estilos.circulo1]} />
      <View style={[estilos.circulo, estilos.circulo2]} />
      <View style={[estilos.circulo, estilos.circulo3]} />
      <View style={estilos.overlay}>
        {children}
      </View>
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
    opacity: 0.3,
  },
  circulo1: {
    width: 280,
    height: 280,
    backgroundColor: '#FF6B6B',
    top: -60,
    right: -80,
    opacity: 0.25,
    // shadow solo para darle más difuminado visual
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 120,
    elevation: 0,
  },
  circulo2: {
    width: 200,
    height: 200,
    backgroundColor: '#7C4DFF',
    bottom: 60,
    left: -50,
    opacity: 0.2,
    shadowColor: '#7C4DFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 100,
    elevation: 0,
  },
  circulo3: {
    width: 160,
    height: 160,
    backgroundColor: '#E040FB',
    top: '30%',
    left: '20%',
    opacity: 0.15,
    shadowColor: '#E040FB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 80,
    elevation: 0,
  },
  overlay: {
    flex: 1,
    backgroundColor: COLORES.glassFondo,
  },
});