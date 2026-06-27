import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PantallaInicio } from '../screens/PantallaInicio';
import { PantallaReglas } from '../screens/PantallaReglas';
import { PantallaConfiguracion } from '../screens/PantallaConfiguracion';
import { PantallaAjustes } from '../screens/PantallaAjustes';
import { PantallaAutoRespuesta } from '../screens/PantallaAutoRespuesta';
import { COLORES } from '../theme/colores';
import { FUENTES } from '../theme/tipografia';
import { HeaderPantalla } from '../components/HeaderPantalla';

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
          fontSize: FUENTES.tamano.xs,
          fontWeight: '600',
          marginTop: 0,
        },
        header: ({ options }) => (
          <HeaderPantalla titulo={options.title ?? route.name} />
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

export { NavegacionPrincipal as default };
