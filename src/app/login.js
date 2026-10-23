import { useState } from 'react';
import { Text } from 'react-native';
import { router } from 'expo-router';
import { useSession } from '../lib/session';
import { Button, Card, ErrorText, Field, Screen, styles } from '../components/ui';

export default function Login() {
  const { login } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    try {
      await login(email, password);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>💞 Bienvenidos a Matripuntos</Text>
      <Text style={styles.muted}>Dense puntos por lo bueno, quítenlos por lo malo y vean quién gana en los juegos.</Text>
      <Card>
        <Field label="Correo" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <Field label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
        <ErrorText>{error}</ErrorText>
        <Button title="Entrar" onPress={submit} disabled={!email || !password} />
      </Card>
      <Button title="Crear una cuenta nueva" outline onPress={() => router.push('/registro')} />
    </Screen>
  );
}
