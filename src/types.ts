export interface Flashcard {
  id: number;
  q: string;
  a: string;
}

export interface GeneratedDeck {
  title: string;
  cards: Flashcard[];
}

export type Screen = 'setup' | 'loading' | 'game' | 'results';

export interface GeneratePayload {
  type: 'topic' | 'text' | 'file';
  value: string; // the topic, the pasted text, or the base64 of the file
  fileName?: string;
  mimeType?: string;
}

export interface GameState {
  flashcards: Flashcard[];
  currentIndex: number;
  results: Record<number, boolean | null>;
  topic: string;
}
