import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SessionProvider, useSession } from '../lib/session';
import { useTheme } from '../theme';

function RootStack() {
  const { loading, user, couple } = useSession();
  const t = useTheme();
  if (loading) return null;
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerStyle: { backgroundColor: t.soft }, headerTintColor: t.dark, headerShadowVisible: false }}>
        <Stack.Protected guard={!user}>
          <Stack.Screen name="login" options={{ title: 'Matripuntos' }} />
          <Stack.Screen name="registro" options={{ title: 'Crear cuenta' }} />
        </Stack.Protected>
        <Stack.Protected guard={!!user && !couple}>
          <Stack.Screen name="vincular" options={{ title: 'Conecta con tu pareja' }} />
        </Stack.Protected>
        <Stack.Protected guard={!!couple}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="juego/[id]" options={{ title: 'Juego' }} />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SessionProvider>
      <RootStack />
    </SessionProvider>
  );
}
