// Game registry. To add a game:
//   1. Create src/games/<id>.js exporting a component that receives
//      { me, partner, mode, onFinish }   (mode: 'rival' | 'equipo')
//   2. When a round ends call onFinish({ winnerId }) in rival mode (null = empate)
//      or onFinish({ teamWon: true|false }) in equipo mode. It only saves the result
//      (it can be called again for a rematch); the game decides when to leave.
//   3. Add an entry below.
import Gato from './gato';

export const GAMES = [
  { id: 'gato', nombre: 'Gato', emoji: '😼', descripcion: 'El clásico tres en línea. ¡Uno contra el otro, en el mismo teléfono!', modos: ['rival'], Component: Gato },
];

export const findGame = (id) => GAMES.find((g) => g.id === id);
