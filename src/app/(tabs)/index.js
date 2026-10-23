import { useState } from 'react';
import { FlatList, Modal, Text, View } from 'react-native';
import { useSession } from '../../lib/session';
import { totalFor } from '../../lib/stats';
import { colors, paletteFor, useTheme } from '../../theme';
import { Button, Card, Chip, ErrorText, Field, styles } from '../../components/ui';

const AMOUNTS = [1, 2, 3, 5, 10];
const SUGGESTIONS = {
  dar: ['Me hizo el desayuno', 'Un detalle bonito', 'Me escuchó', 'Me ayudó en casa', 'Me hizo reír'],
  quitar: ['Llegó tarde', 'Olvidó algo importante', 'Me dejó en visto', 'Se enojó sin razón', 'No lavó los platos'],
};

const displayName = (u) => u.apodo || u.nombre;

function ScoreCard({ person, total, label }) {
  const p = paletteFor(person.genero);
  return (
    <Card style={{ flex: 1, backgroundColor: p.primary, alignItems: 'center' }}>
      <Text style={{ color: colors.white, fontWeight: '600' }}>{label}</Text>
      <Text style={{ color: colors.white, fontSize: 40, fontWeight: '900' }}>{total}</Text>
      <Text style={{ color: colors.white }} numberOfLines={1}>{displayName(person)}</Text>
    </Card>
  );
}

export default function Matripuntos() {
  const { user, partner, points, addPoints } = useSession();
  const t = useTheme();
  const [mode, setMode] = useState(null); // 'dar' | 'quitar' | null
  const [amount, setAmount] = useState(1);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  if (!partner) return null; // session just ended; the guard is navigating away

  const open = (m) => {
    setMode(m);
    setAmount(1);
    setReason('');
    setError('');
  };

  const submit = async () => {
    if (!reason.trim()) return setError('Cuéntale el motivo.');
    await addPoints({ toId: partner.id, amount: mode === 'dar' ? amount : -amount, reason: reason.trim() });
    setMode(null);
  };

  const header = (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <ScoreCard person={user} total={totalFor(points, user.id)} label="Tú" />
        <ScoreCard person={partner} total={totalFor(points, partner.id)} label="Tu pareja" />
      </View>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Button title="➕ Dar" color={colors.good} onPress={() => open('dar')} />
        </View>
        <View style={{ flex: 1 }}>
          <Button title="➖ Quitar" color={colors.bad} onPress={() => open('quitar')} />
        </View>
      </View>
      <Text style={[styles.label, { marginTop: 8 }]}>Historial</Text>
    </View>
  );

  return (
    <>
      <FlatList
        style={{ backgroundColor: t.soft }}
        contentContainerStyle={styles.screen}
        data={points}
        keyExtractor={(p) => p.id}
        ListHeaderComponent={header}
        ListEmptyComponent={<Text style={styles.muted}>Aún no hay matripuntos. ¡Dale el primero a {displayName(partner)}!</Text>}
        renderItem={({ item }) => {
          const positive = item.amount > 0;
          // Each entry wears the colors of whoever gave/took the points.
          const p = paletteFor((item.fromId === user.id ? user : partner).genero);
          return (
            <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: p.tint, borderLeftWidth: 6, borderLeftColor: p.primary }}>
              <Text style={{ fontSize: 22, fontWeight: '900', color: positive ? colors.good : colors.bad, minWidth: 48 }}>
                {positive ? '+' : ''}
                {item.amount}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: '600' }}>
                  {item.fromId === user.id
                    ? `${positive ? 'Le diste' : 'Le quitaste'} a ${displayName(partner)}`
                    : `${displayName(partner)} ${positive ? 'te dio' : 'te quitó'}`}
                </Text>
                <Text style={{ color: colors.text }}>{item.reason}</Text>
                <Text style={styles.muted}>{new Date(item.createdAt).toLocaleString('es')}</Text>
              </View>
            </Card>
          );
        }}
      />

      <Modal visible={!!mode} animationType="slide" transparent onRequestClose={() => setMode(null)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: '#0006' }}>
          <Card style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, gap: 12 }}>
            <Text style={styles.title}>
              {mode === 'dar' ? 'Dar' : 'Quitar'} matripuntos a {partner && displayName(partner)}
            </Text>
            <View style={styles.row}>
              {AMOUNTS.map((a) => (
                <Chip key={a} label={`${mode === 'dar' ? '+' : '-'}${a}`} color={mode === 'dar' ? colors.good : colors.bad} selected={amount === a} onPress={() => setAmount(a)} />
              ))}
            </View>
            <Field label="¿Por qué?" value={reason} onChangeText={setReason} placeholder="Escribe el motivo" />
            <View style={styles.row}>
              {(SUGGESTIONS[mode] ?? []).map((s) => (
                <Chip key={s} label={s} selected={reason === s} onPress={() => setReason(s)} />
              ))}
            </View>
            <ErrorText>{error}</ErrorText>
            <Button title="Confirmar" color={mode === 'dar' ? colors.good : colors.bad} onPress={submit} />
            <Button title="Cancelar" outline onPress={() => setMode(null)} />
          </Card>
        </View>
      </Modal>
    </>
  );
}
