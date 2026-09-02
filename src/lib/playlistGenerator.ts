const ADJECTIVES = [
  'Cosmic',
  'Midnight',
  'Neon',
  'Retro',
  'Golden',
  'Cyber',
  'Velvet',
  'Electric',
  'Epic',
  'Shadow',
  'Wild',
  'Dark',
  'Quantum',
  'Stellar',
  'Infinity',
  'Solar',
  'Astral',
  'Lunar',
  'Mystic',
  'Horizon',
  'Vivid',
  'Radiant',
  'Galactic',
];

const NOUNS = [
  'Cinema',
  'Vault',
  'Marathon',
  'Chronicles',
  'Odyssey',
  'Pulse',
  'Sessions',
  'Rewind',
  'Nights',
  'Horizon',
  'Fest',
  'Lounge',
  'Dimension',
  'Realm',
  'Wave',
  'Flow',
  'Haven',
  'Journey',
  'Spectrum',
  'Mirage',
  'Picks',
  'Archive',
];

const TAGS = [
  'Binge Night',
  'Action Marathon',
  'Weekend Vibes',
  'Late Night Cinema',
  'Mind Benders',
  'Chill Mood',
  'Date Night',
  'Classics Rewind',
  'Cyberpunk Drive',
  'Adrenaline Rush',
  'Epic Sagas',
  'Popcorn Hour',
  'Sci-Fi Universe',
  'Thrills & Chills',
  'Anime & Fantasy',
  'Superhero Fever',
];

export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateRandomPlaylistName(): string {
  const adj = getRandomElement(ADJECTIVES);
  const noun = getRandomElement(NOUNS);
  return `${adj} ${noun}`;
}

export function generateRandomPlaylistTag(): string {
  return getRandomElement(TAGS);
}

export function getRandomPlaylistSuggestion(): { name: string; tag: string } {
  return {
    name: generateRandomPlaylistName(),
    tag: generateRandomPlaylistTag(),
  };
}
