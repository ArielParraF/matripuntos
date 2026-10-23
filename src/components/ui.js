import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, useTheme } from '../theme';

export function Screen({ children }) {
  const t = useTheme();
  return (
    <ScrollView style={{ backgroundColor: t.soft }} contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}

export function Button({ title, onPress, color, outline, disabled }) {
  const t = useTheme();
  const c = color ?? t.primary;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        outline ? { borderColor: c, borderWidth: 2 } : { backgroundColor: c },
        (pressed || disabled) && { opacity: 0.6 },
      ]}
    >
      <Text style={[styles.buttonText, { color: outline ? c : colors.white }]}>{title}</Text>
    </Pressable>
  );
}

export function Field({ label, ...props }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor={colors.muted} accessibilityLabel={label} {...props} />
    </View>
  );
}

export function Chip({ label, selected, onPress, color }) {
  const t = useTheme();
  const c = color ?? t.primary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, { borderColor: c }, selected && { backgroundColor: c }]}
    >
      <Text style={{ color: selected ? colors.white : c, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}

export const Card = ({ children, style }) => <View style={[styles.card, style]}>{children}</View>;

export const ErrorText = ({ children }) => (children ? <Text style={styles.error}>{children}</Text> : null);

export const styles = StyleSheet.create({
  screen: { padding: 16, gap: 12 },
  button: { paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { fontSize: 16, fontWeight: '700' },
  field: { gap: 4 },
  label: { color: colors.text, fontWeight: '600' },
  input: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, fontSize: 16, color: colors.text },
  chip: { borderWidth: 2, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  card: { backgroundColor: colors.white, borderRadius: 16, padding: 16, gap: 8 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  muted: { color: colors.muted },
  error: { color: colors.bad, fontWeight: '600' },
});
