// Everything you'll want to edit lives in this file.
// Texts marked with [ ] are placeholders: replace them with your own.

export type Video =
  | { kind: 'youtube'; id: string; title: string }
  | { kind: 'file'; src: string; poster?: string; title: string } // file in public/videos/
  | { kind: 'placeholder'; title: string };

export const profile = {
  name: 'Franco Cuniberti',
  role: 'Edición de video',
  basedIn: '[Tu ciudad]',
  since: '[Año]',
  // Words wrapped in **double asterisks** are rendered bold.
  about:
    'Soy Franco, **editor de video**. [Contá en dos o tres líneas qué hacés, para quién trabajás y qué resultados buscás.] **[Tu propuesta de valor en una frase.]**',
};

// Leave a value empty ('') to hide that contact.
export const contact = {
  email: '[tu-mail@ejemplo.com]',
  discord: '[tu-usuario]',
  instagram: '',
  whatsapp: '', // international format without spaces, e.g. 5491112345678
};

// Leave the list empty to hide the "Programas" block.
export const programs: { short: string; name: string }[] = [
  // { short: 'Pr', name: 'Premiere Pro' },
  // { short: 'Ae', name: 'After Effects' },
];

export const shortVideos: Video[] = [
  { kind: 'file', src: 'videos/corto-1-mixwell.mp4', poster: 'videos/corto-1-mixwell.jpg', title: 'Mixwell' },
  { kind: 'file', src: 'videos/corto-2-mustaccio.mp4', poster: 'videos/corto-2-mustaccio.jpg', title: 'Mustaccio' },
  { kind: 'file', src: 'videos/corto-3-paises.mp4', poster: 'videos/corto-3-paises.jpg', title: 'Países' },
  { kind: 'file', src: 'videos/corto-4-publi.mp4', poster: 'videos/corto-4-publi.jpg', title: 'Publicidad' },
  { kind: 'file', src: 'videos/corto-5-franve.mp4', poster: 'videos/corto-5-franve.jpg', title: 'Franve' },
  { kind: 'file', src: 'videos/corto-6-guion.mp4', poster: 'videos/corto-6-guion.jpg', title: 'Guion' },
];

export const longVideos: Video[] = [
  { kind: 'file', src: 'videos/largo-1-top-tier.mp4', poster: 'videos/largo-1-top-tier.jpg', title: 'Top tier' },
  { kind: 'file', src: 'videos/largo-2-muestra.mp4', poster: 'videos/largo-2-muestra.jpg', title: 'Muestra' },
];
