import React from 'react';
import { Text, Platform, View, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PantallaInicio } from '../screens/PantallaInicio';
import { PantallaReglas } from '../screens/PantallaReglas';
import { PantallaConfiguracion } from '../screens/PantallaConfiguracion';
import { PantallaAjustes } from '../screens/PantallaAjustes';
import { PantallaAutoRespuesta } from '../screens/PantallaAutoRespuesta';
import { COLORES, GRADIENTES } from '../theme/colores';

const Tab = createBottomTabNavigator();

const NavegacionInterna: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Inicio':
              iconName = focused ? 'phone-portrait' : 'phone-portrait-outline';
              break;
            case 'Reglas':
              iconName = focused ? 'list-circle' : 'list';
              break;
            case 'AutoRespuesta':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              break;
            case 'Configuracion':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            case 'Ajustes':
              iconName = focused ? 'construct' : 'construct-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORES.tabBarActivo,
        tabBarInactiveTintColor: COLORES.tabBarInactivo,
        tabBarStyle: {
          backgroundColor: COLORES.tabBarFondo,
          borderTopWidth: 1,
          borderTopColor: COLORES.separador,
          elevation: 0,
          shadowOpacity: 0,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 6),
          height: 56 + Math.max(insets.bottom, 6),
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 0,
        },
        header: ({ options }) => (
          <LinearGradient
            colors={[...GRADIENTES.header]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[estilos.header, { paddingTop: Math.max(insets.top, 20) + 12 }]}
          >
            <Text style={estilos.headerTitulo}>
              {options.title ?? route.name}
            </Text>
          </LinearGradient>
        ),
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={PantallaInicio}
        options={{
          title: 'SMS Forwarder',
          tabBarLabel: 'Monitor',
        }}
      />
      <Tab.Screen
        name="Reglas"
        component={PantallaReglas}
        options={{
          title: 'Reglas',
          tabBarLabel: 'Reglas',
        }}
      />
      <Tab.Screen
        name="AutoRespuesta"
        component={PantallaAutoRespuesta}
        options={{
          title: 'Auto-respuesta',
          tabBarLabel: 'Respuestas',
        }}
      />
      <Tab.Screen
        name="Configuracion"
        component={PantallaConfiguracion}
        options={{
          title: 'Telegram',
          tabBarLabel: 'Bot',
        }}
      />
      <Tab.Screen
        name="Ajustes"
        component={PantallaAjustes}
        options={{
          title: 'Ajustes',
          tabBarLabel: 'Ajustes',
        }}
      />
    </Tab.Navigator>
  );
};

export const NavegacionPrincipal: React.FC = () => (
  <SafeAreaProvider>
    <StatusBar barStyle="light-content" backgroundColor={COLORES.fondoPrincipal} />
    <NavigationContainer>
      <NavegacionInterna />
    </NavigationContainer>
  </SafeAreaProvider>
);

const estilos = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitulo: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: COLORES.textoClaro,
  },
});

export { NavegacionPrincipal as default };
