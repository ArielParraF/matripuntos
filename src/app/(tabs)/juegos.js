import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSession } from '../../lib/session';
import { scoreboard } from '../../lib/stats';
import { GAMES, findGame } from '../../games';
import { colors, paletteFor, useTheme } from '../../theme';
import { Button, Card, Screen, styles } from '../../components/ui';

const MODE_LABEL = { rival: '⚔️ Rivales', equipo: '🤝 En equipo' };

export default function Juegos() {
  const { user, partner, games } = useSession();
  const t = useTheme();
  if (!partner) return null;
  const s = scoreboard(games, user.id, partner.id);
  const name = (id) => (id === user.id ? 'Tú' : id === partner.id ? partner.apodo || partner.nombre : 'Empate');

  return (
    <Screen>
      <Card>
        <Text style={styles.label}>⚔️ Como rivales</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
          <Score label="Tú" value={s.yo} color={paletteFor(user.genero).primary} />
          <Text style={[styles.muted, { fontSize: 18 }]}>vs</Text>
          <Score label={partner.apodo || partner.nombre} value={s.pareja} color={paletteFor(partner.genero).primary} />
        </View>
        {s.empates > 0 && <Text style={[styles.muted, { textAlign: 'center' }]}>Empates: {s.empates}</Text>}
        <Text style={[styles.label, { marginTop: 8 }]}>🤝 Como equipo</Text>
        <Text style={{ color: colors.text }}>
          Ganadas: {s.equipoGanadas} · Perdidas: {s.equipoPerdidas}
        </Text>
      </Card>

      <Text style={styles.label}>Juegos</Text>
      {GAMES.length === 0 && (
        <Card>
          <Text style={{ color: colors.text }}>🧩 Muy pronto: gato, preguntas de pareja, puzzles y más.</Text>
        </Card>
      )}
      {GAMES.map((g) => (
        <Card key={g.id}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
            {g.emoji} {g.nombre}
          </Text>
          <Text style={styles.muted}>{g.descripcion}</Text>
          {g.modos.map((m) => (
            <Button key={m} title={MODE_LABEL[m]} color={t.primary} onPress={() => router.push({ pathname: '/juego/[id]', params: { id: g.id, mode: m } })} />
          ))}
        </Card>
      ))}

      {games.length > 0 && <Text style={styles.label}>Últimas partidas</Text>}
      {games.slice(0, 20).map((g) => (
        <Card key={g.id}>
          <Text style={{ color: colors.text, fontWeight: '600' }}>
            {findGame(g.gameId)?.nombre ?? g.gameId} · {MODE_LABEL[g.mode]}
          </Text>
          <Text style={{ color: colors.text }}>
            {g.mode === 'equipo' ? (g.teamWon ? '¡Ganaron juntos! 🎉' : 'Perdieron esta vez') : g.winnerId ? `Ganó: ${name(g.winnerId)}` : 'Empate'}
          </Text>
          <Text style={styles.muted}>{new Date(g.createdAt).toLocaleString('es')}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const Score = ({ label, value, color }) => (
  <View style={{ alignItems: 'center' }}>
    <Text style={{ fontSize: 40, fontWeight: '900', color }}>{value}</Text>
    <Text style={{ color: colors.text }} numberOfLines={1}>{label}</Text>
  </View>
);
