import { Text } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useSession } from '../../lib/session';
import { findGame } from '../../games';
import { Screen, styles } from '../../components/ui';

export default function Juego() {
  const { id, mode } = useLocalSearchParams();
  const { user, partner, addGameResult } = useSession();
  const game = findGame(id);
  if (!partner) return null;

  if (!game) {
    return (
      <Screen>
        <Text style={styles.muted}>Este juego no existe.</Text>
      </Screen>
    );
  }

  const onFinish = (result) => addGameResult({ gameId: id, mode, ...result });

  return (
    <>
      <Stack.Screen options={{ title: `${game.emoji} ${game.nombre}` }} />
      <game.Component me={user} partner={partner} mode={mode} onFinish={onFinish} />
    </>
  );
}
