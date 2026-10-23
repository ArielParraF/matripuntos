import { useState } from 'react';
import { Text, View } from 'react-native';
import { useSession } from '../lib/session';
import { isValidDate } from '../lib/stats';
import { palettes } from '../theme';
import { Button, Card, Chip, ErrorText, Field, Screen, styles } from '../components/ui';

const RELACIONES = ['Matrimonio', 'Novios', 'Pareja'];

export default function Registro() {
  const { register } = useSession();
  const [form, setForm] = useState({ nombre: '', apodo: '', genero: null, nacimiento: '', relacion: null, aniversario: '', email: '', password: '' });
  const [error, setError] = useState('');
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  // The form previews the color the app will use once the person picks a gender.
  const accent = form.genero ? palettes[form.genero].primary : undefined;

  const submit = async () => {
    setError('');
    if (!form.nombre.trim()) return setError('Escribe tu nombre.');
    if (!form.genero) return setError('Elige si eres hombre o mujer.');
    if (!isValidDate(form.nacimiento)) return setError('Fecha de nacimiento inválida (DD/MM/AAAA).');
    if (!form.relacion) return setError('Elige el tipo de relación.');
    if (form.aniversario && !isValidDate(form.aniversario)) return setError('Fecha de aniversario inválida (DD/MM/AAAA).');
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setError('Correo inválido.');
    if (form.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
    try {
      await register({ ...form, nombre: form.nombre.trim(), apodo: form.apodo.trim() });
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Screen>
      <Card>
        <Text style={styles.label}>Soy</Text>
        <View style={styles.row}>
          <Chip label="💙 Hombre" color={palettes.hombre.primary} selected={form.genero === 'hombre'} onPress={() => set('genero')('hombre')} />
          <Chip label="💗 Mujer" color={palettes.mujer.primary} selected={form.genero === 'mujer'} onPress={() => set('genero')('mujer')} />
        </View>
        <Field label="Nombre" value={form.nombre} onChangeText={set('nombre')} />
        <Field label="Apodo cariñoso (opcional)" value={form.apodo} onChangeText={set('apodo')} placeholder="Ej: Gordi, Amor, Cielo" />
        <Field label="Fecha de nacimiento" value={form.nacimiento} onChangeText={set('nacimiento')} placeholder="DD/MM/AAAA" keyboardType="numbers-and-punctuation" />
      </Card>
      <Card>
        <Text style={styles.label}>Somos</Text>
        <View style={styles.row}>
          {RELACIONES.map((r) => (
            <Chip key={r} label={r} color={accent} selected={form.relacion === r} onPress={() => set('relacion')(r)} />
          ))}
        </View>
        <Field label="¿Desde cuándo están juntos? (opcional)" value={form.aniversario} onChangeText={set('aniversario')} placeholder="DD/MM/AAAA" keyboardType="numbers-and-punctuation" />
      </Card>
      <Card>
        <Field label="Correo" value={form.email} onChangeText={set('email')} autoCapitalize="none" keyboardType="email-address" />
        <Field label="Contraseña" value={form.password} onChangeText={set('password')} secureTextEntry />
        <ErrorText>{error}</ErrorText>
        <Button title="Crear cuenta" color={accent} onPress={submit} />
      </Card>
    </Screen>
  );
}
