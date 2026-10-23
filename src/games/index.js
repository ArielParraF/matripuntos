// Game registry. To add a game:
//   1. Create src/games/<id>.js exporting a component that receives
//      { me, partner, mode, onFinish }   (mode: 'rival' | 'equipo')
//   2. When the game ends call onFinish({ winnerId }) in rival mode (null = empate)
//      or onFinish({ teamWon: true|false }) in equipo mode. The result is saved
//      and shows up in the scoreboard automatically.
//   3. Add an entry below:
//      { id: 'gato', nombre: 'Gato', emoji: '❌⭕', descripcion: '...', modos: ['rival'], Component: Gato }
export const GAMES = [];

export const findGame = (id) => GAMES.find((g) => g.id === id);
