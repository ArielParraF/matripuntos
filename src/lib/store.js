// Local data layer (one device). Shapes mirror the planned Firestore collections:
//   users/{id}, couples/{id}, couples/{id}/points, couples/{id}/games
// When Firebase is ready, reimplement these same exports; screens only use them via useSession().
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeCode } from './stats';

const KEY = 'matripuntos:db';
const empty = () => ({ sessionUserId: null, users: {}, couples: {}, points: [], games: [] });
const id = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

async function read() {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : empty();
}
const write = (db) => AsyncStorage.setItem(KEY, JSON.stringify(db));

export async function loadState() {
  const db = await read();
  const user = db.users[db.sessionUserId] ?? null;
  const couple = user?.coupleId ? db.couples[user.coupleId] : null;
  const partnerId = couple?.members.find((m) => m !== user.id);
  return {
    user,
    couple,
    partner: partnerId ? db.users[partnerId] : null,
    points: couple ? db.points.filter((p) => p.coupleId === couple.id) : [],
    games: couple ? db.games.filter((g) => g.coupleId === couple.id) : [],
  };
}

// shortcut: password stored in plain text on the device; Firebase Auth replaces this.
export async function register(data) {
  const db = await read();
  const email = data.email.trim().toLowerCase();
  if (Object.values(db.users).some((u) => u.email === email)) throw new Error('Ese correo ya está registrado.');
  const user = { ...data, email, id: id(), code: makeCode(), coupleId: null };
  db.users[user.id] = user;
  db.sessionUserId = user.id;
  await write(db);
}

export async function login(email, password) {
  const db = await read();
  const user = Object.values(db.users).find((u) => u.email === email.trim().toLowerCase());
  if (!user || user.password !== password) throw new Error('Correo o contraseña incorrectos.');
  db.sessionUserId = user.id;
  await write(db);
}

export async function logout() {
  const db = await read();
  db.sessionUserId = null;
  await write(db);
}

export async function linkWithCode(code) {
  const db = await read();
  const me = db.users[db.sessionUserId];
  const other = Object.values(db.users).find((u) => u.code === code.trim().toUpperCase());
  if (!other) throw new Error('No encontramos ese código.');
  if (other.id === me.id) throw new Error('Ese es tu propio código.');
  if (other.coupleId) throw new Error('Esa persona ya está conectada con otra pareja.');
  const couple = { id: id(), members: [me.id, other.id], createdAt: new Date().toISOString() };
  db.couples[couple.id] = couple;
  me.coupleId = other.coupleId = couple.id;
  await write(db);
}

// amount is negative to take points away
export async function addPoints({ toId, amount, reason }) {
  const db = await read();
  const me = db.users[db.sessionUserId];
  db.points.unshift({ id: id(), coupleId: me.coupleId, fromId: me.id, toId, amount, reason, createdAt: new Date().toISOString() });
  await write(db);
}

// result: { gameId, mode: 'rival', winnerId|null } or { gameId, mode: 'equipo', teamWon }
export async function addGameResult(result) {
  const db = await read();
  const me = db.users[db.sessionUserId];
  db.games.unshift({ ...result, id: id(), coupleId: me.coupleId, createdAt: new Date().toISOString() });
  await write(db);
}
