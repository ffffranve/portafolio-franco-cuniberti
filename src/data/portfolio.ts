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
  { kind: 'placeholder', title: 'Video corto 1' },
  { kind: 'placeholder', title: 'Video corto 2' },
  { kind: 'placeholder', title: 'Video corto 3' },
  { kind: 'placeholder', title: 'Video corto 4' },
  { kind: 'placeholder', title: 'Video corto 5' },
  { kind: 'placeholder', title: 'Video corto 6' },
];

export const longVideos: Video[] = [
  { kind: 'placeholder', title: 'Video largo 1' },
  { kind: 'placeholder', title: 'Video largo 2' },
];
