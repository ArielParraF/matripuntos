import { useSession } from './lib/session';

export const palettes = {
  hombre: { primary: '#3B9AE1', soft: '#E3F2FD', dark: '#1E5F8C' },
  mujer: { primary: '#E8619A', soft: '#FDE7F0', dark: '#9C2F5F' },
  neutral: { primary: '#8E7CC3', soft: '#F1EDFA', dark: '#4B3D7A' },
};

export const colors = { text: '#222', muted: '#777', good: '#2E9E5B', bad: '#D64545', white: '#fff', border: '#ddd' };

export const paletteFor = (genero) => palettes[genero] ?? palettes.neutral;

// Palette of the logged-in person: blue for hombre, pink for mujer.
export const useTheme = () => paletteFor(useSession().user?.genero);
