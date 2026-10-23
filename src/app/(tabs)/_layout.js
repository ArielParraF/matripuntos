import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { useTheme } from '../../theme';

const icon = (emoji) => ({ focused }) => <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;

export default function TabsLayout() {
  const t = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: t.dark,
        headerStyle: { backgroundColor: t.soft },
        headerTintColor: t.dark,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Matripuntos', tabBarIcon: icon('💞') }} />
      <Tabs.Screen name="juegos" options={{ title: 'Juegos', tabBarIcon: icon('🎮') }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: icon('👤') }} />
    </Tabs>
  );
}
