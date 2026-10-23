// Pure calculations shared by the screens (no storage here, so they're easy to test).

// A person's matripuntos = sum of what their partner gave/took from them.
export function totalFor(points, userId) {
  return points.filter((p) => p.toId === userId).reduce((sum, p) => sum + p.amount, 0);
}

// games: [{ mode: 'rival'|'equipo', winnerId?: string, teamWon?: boolean }]
export function scoreboard(games, meId, partnerId) {
  const s = { yo: 0, pareja: 0, empates: 0, equipoGanadas: 0, equipoPerdidas: 0 };
  for (const g of games) {
    if (g.mode === 'equipo') g.teamWon ? s.equipoGanadas++ : s.equipoPerdidas++;
    else if (g.winnerId === meId) s.yo++;
    else if (g.winnerId === partnerId) s.pareja++;
    else s.empates++;
  }
  return s;
}

export function makeCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I to avoid typos
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// "DD/MM/AAAA" -> true if it's a real date
export function isValidDate(text) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text.trim());
  if (!m) return false;
  const [d, mo, y] = [+m[1], +m[2], +m[3]];
  const date = new Date(y, mo - 1, d);
  return date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d && y > 1900;
}
