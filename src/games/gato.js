import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';
import { gatoResult } from './gatoLogic';
import { colors, paletteFor } from '../theme';
import { Button, styles } from '../components/ui';

const SYMBOL = { X: '✕', O: '◯' };
const empty = () => Array(9).fill(null);
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const nameOf = (u) => u.apodo || u.nombre;

const winPhrases = (n) => [
  `¡${n} es el rey del gato! 👑`,
  `¡Gatazo de ${n}! 😼`,
  `¡${n} no tuvo piedad! 🔥`,
  `¡${n} ganó! El otro lava los platos 🍽️`,
];
const tiePhrases = ['¡Empate! Gato encerrado 🐱', 'Nadie gana… ¡están hechos el uno para el otro! 💞'];

// Pops in with a spin when it mounts.
function Pop({ children, style }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(v, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  }, [v]);
  const rotate = v.interpolate({ inputRange: [0, 1], outputRange: ['-90deg', '0deg'] });
  return <Animated.View style={[style, { transform: [{ scale: v }, { rotate }] }]}>{children}</Animated.View>;
}

export default function Gato({ me, partner, onFinish }) {
  const players = { X: me, O: partner };
  const pal = { X: paletteFor(me.genero), O: paletteFor(partner.genero) };
  const [board, setBoard] = useState(empty);
  const [starter, setStarter] = useState('X');
  const [turn, setTurn] = useState('X');
  const [round, setRound] = useState({ result: null, phrase: '' });
  const [score, setScore] = useState({ X: 0, O: 0, empates: 0 });
  const { width } = useWindowDimensions();
  const size = Math.min(width - 32, 360);

  const play = (i) => {
    if (board[i] || round.result) return;
    const next = board.map((c, j) => (j === i ? turn : c));
    setBoard(next);
    const result = gatoResult(next);
    if (!result) return setTurn(turn === 'X' ? 'O' : 'X');
    if (result === 'empate') {
      setRound({ result, phrase: pick(tiePhrases) });
      setScore((s) => ({ ...s, empates: s.empates + 1 }));
      onFinish({ winnerId: null });
    } else {
      setRound({ result, phrase: pick(winPhrases(nameOf(players[result.mark]))) });
      setScore((s) => ({ ...s, [result.mark]: s[result.mark] + 1 }));
      onFinish({ winnerId: players[result.mark].id });
    }
  };

  const rematch = () => {
    const s = starter === 'X' ? 'O' : 'X'; // whoever didn't start last time goes first
    setStarter(s);
    setTurn(s);
    setBoard(empty());
    setRound({ result: null, phrase: '' });
  };

  const winLine = round.result?.line ?? [];
  const banner = round.result ? null : pal[turn];

  return (
    <ScrollView style={{ backgroundColor: pal[turn].soft }} contentContainerStyle={[styles.screen, { alignItems: 'center' }]}>
      <View style={{ flexDirection: 'row', width: size, justifyContent: 'space-between', alignItems: 'center' }}>
        {['X', 'O'].map((m) => (
          <View key={m} style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: 28, fontWeight: '900', color: pal[m].primary }}>{SYMBOL[m]}</Text>
            <Text style={{ color: colors.text, fontWeight: '700' }} numberOfLines={1}>{nameOf(players[m])}</Text>
            <Text style={{ fontSize: 32, fontWeight: '900', color: pal[m].dark }}>{score[m]}</Text>
          </View>
        ))}
      </View>
      {score.empates > 0 && <Text style={styles.muted}>Empates: {score.empates} 🐱</Text>}

      {banner ? (
        <View style={{ backgroundColor: banner.primary, borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20 }}>
          <Text style={{ color: colors.white, fontSize: 18, fontWeight: '800' }}>
            Turno de {nameOf(players[turn])} {SYMBOL[turn]}
          </Text>
        </View>
      ) : (
        <Pop key={round.phrase} style={{ alignItems: 'center', gap: 4 }}>
          <Text style={{ fontSize: 40 }}>{round.result === 'empate' ? '🤝' : '🎉🏆🎉'}</Text>
          <Text style={{ fontSize: 20, fontWeight: '900', color: colors.text, textAlign: 'center' }}>{round.phrase}</Text>
        </Pop>
      )}

      <View style={{ width: size, height: size, flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 8, borderRadius: 24, backgroundColor: pal[turn].tint }}>
        {board.map((cell, i) => {
          const winning = winLine.includes(i);
          return (
            <Pressable
              key={i}
              accessibilityRole="button"
              accessibilityLabel={cell ? `Casilla ${i + 1}: ${nameOf(players[cell])}` : `Casilla ${i + 1} libre`}
              onPress={() => play(i)}
              style={({ pressed }) => ({
                width: (size - 32) / 3,
                height: (size - 32) / 3,
                borderRadius: 18,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: winning ? pal[cell].primary : colors.white,
                opacity: pressed && !cell ? 0.7 : 1,
              })}
            >
              {cell && (
                <Pop>
                  <Text style={{ fontSize: size / 6, fontWeight: '900', color: winning ? colors.white : pal[cell].primary }}>{SYMBOL[cell]}</Text>
                </Pop>
              )}
            </Pressable>
          );
        })}
      </View>

      {round.result && (
        <View style={{ width: size, gap: 10 }}>
          <Button title="🔁 ¡Revancha!" color={pal[starter === 'X' ? 'O' : 'X'].primary} onPress={rematch} />
          <Button title="Salir" outline color={colors.muted} onPress={() => router.back()} />
        </View>
      )}
    </ScrollView>
  );
}
