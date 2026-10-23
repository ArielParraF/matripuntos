import { useState } from 'react';
import { Share, Text } from 'react-native';
import { useSession } from '../lib/session';
import { useTheme } from '../theme';
import { Button, Card, ErrorText, Field, Screen, styles } from '../components/ui';

export default function Vincular() {
  const { user, linkWithCode, logout } = useSession();
  const t = useTheme();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    try {
      await linkWithCode(code);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>Hola {user.nombre} 👋</Text>
      <Card>
        <Text style={styles.label}>Tu código de pareja</Text>
        <Text style={{ fontSize: 40, fontWeight: '900', letterSpacing: 6, color: t.dark, textAlign: 'center' }}>{user.code}</Text>
        <Text style={styles.muted}>Compártelo con tu pareja para que lo escriba en su teléfono, o escribe tú el suyo aquí abajo.</Text>
        <Button title="Compartir código" outline onPress={() => Share.share({ message: `Únete a mí en Matripuntos 💞 Mi código es: ${user.code}` })} />
      </Card>
      <Card>
        <Field label="Código de tu pareja" value={code} onChangeText={setCode} autoCapitalize="characters" maxLength={6} />
        <ErrorText>{error}</ErrorText>
        <Button title="Conectar" onPress={submit} disabled={code.trim().length !== 6} />
      </Card>
      <Button title="Cerrar sesión" outline onPress={logout} />
    </Screen>
  );
}
