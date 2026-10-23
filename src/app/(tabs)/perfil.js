import { Text } from 'react-native';
import { useSession } from '../../lib/session';
import { colors } from '../../theme';
import { Button, Card, Screen, styles } from '../../components/ui';

// "DD/MM/AAAA" -> whole days until today
function daysSince(text) {
  const [d, m, y] = text.split('/').map(Number);
  return Math.floor((Date.now() - new Date(y, m - 1, d)) / 86400000);
}

const Row = ({ label, value }) =>
  value ? (
    <Text style={{ color: colors.text }}>
      <Text style={{ fontWeight: '700' }}>{label}: </Text>
      {value}
    </Text>
  ) : null;

export default function Perfil() {
  const { user, partner, logout } = useSession();
  if (!partner) return null;
  return (
    <Screen>
      <Card>
        <Text style={styles.title}>
          {user.genero === 'mujer' ? '💗' : '💙'} {user.nombre}
        </Text>
        <Row label="Apodo" value={user.apodo} />
        <Row label="Nacimiento" value={user.nacimiento} />
        <Row label="Correo" value={user.email} />
        <Row label="Mi código" value={user.code} />
      </Card>
      <Card>
        <Text style={styles.label}>
          {user.relacion} con {partner.nombre} {partner.genero === 'mujer' ? '💗' : '💙'}
        </Text>
        {user.aniversario && (
          <Text style={{ color: colors.text }}>
            Juntos desde el {user.aniversario} · {daysSince(user.aniversario)} días 💞
          </Text>
        )}
      </Card>
      <Button title="Cerrar sesión" outline onPress={logout} />
    </Screen>
  );
}
