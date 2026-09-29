// Everything you'll want to edit lives in this file.

export type Video =
  | { kind: 'youtube'; id: string; title: string }
  | { kind: 'file'; src: string; poster?: string; title: string } // file in public/videos/
  | { kind: 'placeholder'; title: string };

export const profile = {
  name: 'Franco Cuniberti',
  role: 'Editor de video',
  // Small line under the title, separated by dots.
  tags: ['Portafolio', 'Argentina', '2026'],
};

// Contact buttons at the bottom. Leave a url empty ('') to hide that button.
// `label` is the tooltip shown when hovering the button.
export const contact = {
  email: { address: 'cunibertifranco@gmail.com', label: 'cunibertifranco@gmail.com' }, // opens a new email
  discord: { url: 'https://discord.com/users/522218360914837528', label: 'Discord' },
  whatsapp: { url: 'https://api.whatsapp.com/qr/SFFIXYY3KH43A1?autoload=1&app_absent=0', label: 'WhatsApp' },
  instagram: { url: '', label: 'Instagram' },
};

export const shortVideos: Video[] = [
  { kind: 'file', src: 'videos/corto-2-mustaccio.mp4', poster: 'videos/corto-2-mustaccio.jpg', title: 'Mustaccio' },
  { kind: 'file', src: 'videos/corto-7-dos-pizzas-v3b.mp4', poster: 'videos/corto-7-dos-pizzas-v3b.jpg', title: 'Dos pizzas' },
  { kind: 'file', src: 'videos/corto-5-franve.mp4', poster: 'videos/corto-5-franve.jpg', title: 'Franve' },
  { kind: 'file', src: 'videos/corto-4-publi.mp4', poster: 'videos/corto-4-publi.jpg', title: 'Publicidad' },
  { kind: 'file', src: 'videos/corto-8-doge-luna-v7.mp4', poster: 'videos/corto-8-doge-luna-v7.jpg', title: 'Doge' },
  { kind: 'file', src: 'videos/corto-1-mixwell.mp4', poster: 'videos/corto-1-mixwell.jpg', title: 'Mixwell' },
];

export const longVideos: Video[] = [
  { kind: 'file', src: 'videos/largo-1-pulpos.mp4', poster: 'videos/largo-1-pulpos.jpg', title: 'Pulpos' },
  { kind: 'file', src: 'videos/largo-2-sin-violencia.mp4', poster: 'videos/largo-2-sin-violencia.jpg', title: 'Sin violencia' },
];
