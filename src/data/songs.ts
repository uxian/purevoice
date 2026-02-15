export interface NoteData {
  note: string; // Note name (e.g., 'C4')
  midi: number; // MIDI number for easier drawing
  start: number; // Start time in seconds
  duration: number; // Duration in seconds
  lyric?: string; // Lyric text
}

export type SongDifficulty = 'easy' | 'medium' | 'hard';
export type SongLanguage = 'en' | 'zh' | 'ja' | 'ko' | 'instrumental' | (string & {});

export interface SongRange {
  midiMin: number;
  midiMax: number;
}

export interface SongMeta {
  artist?: string;
  language: SongLanguage;
  difficulty: SongDifficulty;
  tags: string[];
  /** Optional short label for UI (e.g. emoji). */
  emoji?: string;
}

export interface Song {
  id: string;
  title: string;
  notes: NoteData[];
  meta: SongMeta;
}

export const getSongRange = (song: Pick<Song, 'notes'>): SongRange => {
  const midis = song.notes.map(n => n.midi);
  return {
    midiMin: Math.min(...midis),
    midiMax: Math.max(...midis),
  };
};

export const transposeSong = (song: Song, semitones: number): Song => {
  return {
    ...song,
    // Keep a stable base id for selection, but change actual id to avoid collisions
    id: `${song.id}-${semitones}`,
    notes: song.notes.map(n => ({
      ...n,
      midi: n.midi + semitones,
      // Note name might be inaccurate after shift but visualizer uses midi.
      note: n.note,
    })),
  };
};

// --- Seed songs (10) ---

// 1) Twinkle Twinkle Little Star (Complete A-B-B-A)
// Key: C Major
export const TWINKLE_TWINKLE: Song = {
  id: 'twinkle',
  title: 'Twinkle Twinkle Little Star',
  meta: {
    artist: 'Traditional',
    language: 'en',
    difficulty: 'easy',
    tags: ['nursery', 'melody', 'warmup'],
    emoji: '✨',
  },
  notes: [
    // A Section
    { note: 'C4', midi: 60, start: 1.0, duration: 0.5, lyric: 'Twin' },
    { note: 'C4', midi: 60, start: 1.5, duration: 0.5, lyric: 'kle' },
    { note: 'G4', midi: 67, start: 2.0, duration: 0.5, lyric: 'twin' },
    { note: 'G4', midi: 67, start: 2.5, duration: 0.5, lyric: 'kle' },
    { note: 'A4', midi: 69, start: 3.0, duration: 0.5, lyric: 'lit' },
    { note: 'A4', midi: 69, start: 3.5, duration: 0.5, lyric: 'tle' },
    { note: 'G4', midi: 67, start: 4.0, duration: 1.0, lyric: 'star' },

    { note: 'F4', midi: 65, start: 5.5, duration: 0.5, lyric: 'How' },
    { note: 'F4', midi: 65, start: 6.0, duration: 0.5, lyric: 'I' },
    { note: 'E4', midi: 64, start: 6.5, duration: 0.5, lyric: 'won' },
    { note: 'E4', midi: 64, start: 7.0, duration: 0.5, lyric: 'der' },
    { note: 'D4', midi: 62, start: 7.5, duration: 0.5, lyric: 'what' },
    { note: 'D4', midi: 62, start: 8.0, duration: 0.5, lyric: 'you' },
    { note: 'C4', midi: 60, start: 8.5, duration: 1.0, lyric: 'are' },

    // B Section (Up above...)
    { note: 'G4', midi: 67, start: 10.0, duration: 0.5, lyric: 'Up' },
    { note: 'G4', midi: 67, start: 10.5, duration: 0.5, lyric: 'a' },
    { note: 'F4', midi: 65, start: 11.0, duration: 0.5, lyric: 'bove' },
    { note: 'F4', midi: 65, start: 11.5, duration: 0.5, lyric: 'the' },
    { note: 'E4', midi: 64, start: 12.0, duration: 0.5, lyric: 'world' },
    { note: 'E4', midi: 64, start: 12.5, duration: 0.5, lyric: 'so' },
    { note: 'D4', midi: 62, start: 13.0, duration: 1.0, lyric: 'high' },

    { note: 'G4', midi: 67, start: 14.5, duration: 0.5, lyric: 'Like' },
    { note: 'G4', midi: 67, start: 15.0, duration: 0.5, lyric: 'a' },
    { note: 'F4', midi: 65, start: 15.5, duration: 0.5, lyric: 'dia' },
    { note: 'F4', midi: 65, start: 16.0, duration: 0.5, lyric: 'mond' },
    { note: 'E4', midi: 64, start: 16.5, duration: 0.5, lyric: 'in' },
    { note: 'E4', midi: 64, start: 17.0, duration: 0.5, lyric: 'the' },
    { note: 'D4', midi: 62, start: 17.5, duration: 1.0, lyric: 'sky' },

    // A Section Repeat
    { note: 'C4', midi: 60, start: 19.0, duration: 0.5, lyric: 'Twin' },
    { note: 'C4', midi: 60, start: 19.5, duration: 0.5, lyric: 'kle' },
    { note: 'G4', midi: 67, start: 20.0, duration: 0.5, lyric: 'twin' },
    { note: 'G4', midi: 67, start: 20.5, duration: 0.5, lyric: 'kle' },
    { note: 'A4', midi: 69, start: 21.0, duration: 0.5, lyric: 'lit' },
    { note: 'A4', midi: 69, start: 21.5, duration: 0.5, lyric: 'tle' },
    { note: 'G4', midi: 67, start: 22.0, duration: 1.0, lyric: 'star' },

    { note: 'F4', midi: 65, start: 23.5, duration: 0.5, lyric: 'How' },
    { note: 'F4', midi: 65, start: 24.0, duration: 0.5, lyric: 'I' },
    { note: 'E4', midi: 64, start: 24.5, duration: 0.5, lyric: 'won' },
    { note: 'E4', midi: 64, start: 25.0, duration: 0.5, lyric: 'der' },
    { note: 'D4', midi: 62, start: 25.5, duration: 0.5, lyric: 'what' },
    { note: 'D4', midi: 62, start: 26.0, duration: 0.5, lyric: 'you' },
    { note: 'C4', midi: 60, start: 26.5, duration: 1.0, lyric: 'are' },
  ],
};

// 2) Let It Go (Frozen) - Chorus (simplified)
export const LET_IT_GO: Song = {
  id: 'let_it_go',
  title: 'Let It Go (Disney)',
  meta: {
    artist: 'Kristen Anderson-Lopez / Robert Lopez',
    language: 'en',
    difficulty: 'medium',
    tags: ['pop', 'disney', 'belt'],
    emoji: '❄️',
  },
  notes: [
    { note: 'A4', midi: 69, start: 1.0, duration: 0.5, lyric: 'Let' },
    { note: 'B4', midi: 71, start: 1.5, duration: 0.5, lyric: 'it' },
    { note: 'C5', midi: 72, start: 2.0, duration: 1.5, lyric: 'go' },

    { note: 'A4', midi: 69, start: 4.0, duration: 0.5, lyric: 'Let' },
    { note: 'B4', midi: 71, start: 4.5, duration: 0.5, lyric: 'it' },
    { note: 'D5', midi: 74, start: 5.0, duration: 1.5, lyric: 'go' },

    { note: 'C5', midi: 72, start: 7.0, duration: 0.5, lyric: "Can't" },
    { note: 'D5', midi: 74, start: 7.4, duration: 0.5, lyric: 'hold' },
    { note: 'C5', midi: 72, start: 7.8, duration: 0.5, lyric: 'it' },
    { note: 'B4', midi: 71, start: 8.2, duration: 0.5, lyric: 'back' },
    { note: 'A4', midi: 69, start: 8.6, duration: 0.5, lyric: 'a' },
    { note: 'G4', midi: 67, start: 9.0, duration: 0.5, lyric: 'ny' },
    { note: 'G4', midi: 67, start: 9.5, duration: 1.0, lyric: 'more' },

    { note: 'A4', midi: 69, start: 11.5, duration: 0.5, lyric: 'Let' },
    { note: 'B4', midi: 71, start: 12.0, duration: 0.5, lyric: 'it' },
    { note: 'C5', midi: 72, start: 12.5, duration: 1.5, lyric: 'go' },

    { note: 'A4', midi: 69, start: 14.5, duration: 0.5, lyric: 'Turn' },
    { note: 'B4', midi: 71, start: 15.0, duration: 0.5, lyric: 'a' },
    { note: 'E5', midi: 76, start: 15.5, duration: 1.0, lyric: 'way' },

    { note: 'E5', midi: 76, start: 17.0, duration: 0.5, lyric: 'and' },
    { note: 'D5', midi: 74, start: 17.5, duration: 0.5, lyric: 'slam' },
    { note: 'C5', midi: 72, start: 18.0, duration: 0.5, lyric: 'the' },
    { note: 'C5', midi: 72, start: 18.5, duration: 1.0, lyric: 'door' },

    { note: 'G5', midi: 79, start: 20.0, duration: 0.8, lyric: 'I' },
    { note: 'E5', midi: 76, start: 20.8, duration: 0.5, lyric: "don't" },
    { note: 'C5', midi: 72, start: 21.3, duration: 0.8, lyric: 'care' },

    { note: 'C5', midi: 72, start: 22.5, duration: 0.4, lyric: 'what' },
    { note: 'C5', midi: 72, start: 22.9, duration: 0.4, lyric: "they're" },
    { note: 'B4', midi: 71, start: 23.3, duration: 0.4, lyric: 'going' },
    { note: 'C5', midi: 72, start: 23.7, duration: 0.4, lyric: 'to' },
    { note: 'C5', midi: 72, start: 24.1, duration: 1.0, lyric: 'say' },

    { note: 'E5', midi: 76, start: 26.0, duration: 0.5, lyric: 'Let' },
    { note: 'E5', midi: 76, start: 26.5, duration: 0.5, lyric: 'the' },
    { note: 'F5', midi: 77, start: 27.0, duration: 0.5, lyric: 'storm' },
    { note: 'E5', midi: 76, start: 27.5, duration: 0.5, lyric: 'rage' },
    { note: 'D5', midi: 74, start: 28.0, duration: 2.0, lyric: 'on' },

    { note: 'C5', midi: 72, start: 30.5, duration: 0.5, lyric: 'The' },
    { note: 'B4', midi: 71, start: 31.0, duration: 0.5, lyric: 'cold' },
    { note: 'A4', midi: 69, start: 31.5, duration: 0.5, lyric: 'ne' },
    { note: 'G4', midi: 67, start: 32.0, duration: 0.5, lyric: 'ver' },
    { note: 'A4', midi: 69, start: 32.5, duration: 0.5, lyric: 'bo' },
    { note: 'B4', midi: 71, start: 33.0, duration: 0.5, lyric: 'thered' },
    { note: 'A4', midi: 69, start: 33.5, duration: 0.5, lyric: 'me' },
    { note: 'A4', midi: 69, start: 34.0, duration: 0.5, lyric: 'a' },
    { note: 'G4', midi: 67, start: 34.5, duration: 0.5, lyric: 'ny' },
    { note: 'A4', midi: 69, start: 35.0, duration: 1.0, lyric: 'way' },
  ],
};

// 3) 青花瓷 (Qing Hua Ci) - Jay Chou (simplified)
export const QING_HUA_CI: Song = {
  id: 'qing_hua_ci',
  title: '青花瓷',
  meta: {
    artist: '周杰伦 (Jay Chou)',
    language: 'zh',
    difficulty: 'medium',
    tags: ['mandopop', 'legato', 'phrasing'],
    emoji: '🎻',
  },
  notes: [
    { note: 'E4', midi: 64, start: 1.0, duration: 0.5, lyric: '天' },
    { note: 'G4', midi: 67, start: 1.5, duration: 0.5, lyric: '青' },
    { note: 'A4', midi: 69, start: 2.0, duration: 0.5, lyric: '色' },
    { note: 'C5', midi: 72, start: 2.5, duration: 0.5, lyric: '等' },
    { note: 'D5', midi: 74, start: 3.0, duration: 0.5, lyric: '烟' },
    { note: 'E5', midi: 76, start: 3.5, duration: 1.5, lyric: '雨' },

    { note: 'D5', midi: 74, start: 5.5, duration: 0.5, lyric: '而' },
    { note: 'C5', midi: 72, start: 6.0, duration: 0.5, lyric: '我' },
    { note: 'A4', midi: 69, start: 6.5, duration: 0.5, lyric: '在' },
    { note: 'G4', midi: 67, start: 7.0, duration: 0.5, lyric: '等' },
    { note: 'A4', midi: 69, start: 7.5, duration: 1.5, lyric: '你' },

    { note: 'E4', midi: 64, start: 9.5, duration: 0.5, lyric: '炊' },
    { note: 'G4', midi: 67, start: 10.0, duration: 0.5, lyric: '烟' },
    { note: 'A4', midi: 69, start: 10.5, duration: 0.5, lyric: '袅' },
    { note: 'C5', midi: 72, start: 11.0, duration: 0.5, lyric: '袅' },
    { note: 'D5', midi: 74, start: 11.5, duration: 0.5, lyric: '升' },
    { note: 'E5', midi: 76, start: 12.0, duration: 1.5, lyric: '起' },

    { note: 'D5', midi: 74, start: 13.5, duration: 0.5, lyric: '隔' },
    { note: 'C5', midi: 72, start: 14.0, duration: 0.5, lyric: '江' },
    { note: 'A4', midi: 69, start: 14.5, duration: 0.5, lyric: '千' },
    { note: 'G4', midi: 67, start: 15.0, duration: 0.5, lyric: '万' },
    { note: 'C5', midi:  72, start: 15.5, duration: 1.5, lyric: '里' },

    { note: 'E4', midi: 64, start: 17.5, duration: 0.5, lyric: '在' },
    { note: 'A4', midi: 69, start: 18.0, duration: 0.5, lyric: '瓶' },
    { note: 'G4', midi: 67, start: 18.5, duration: 0.5, lyric: '底' },
    { note: 'E4', midi: 64, start: 19.0, duration: 0.5, lyric: '书' },
    { note: 'D4', midi: 62, start: 19.5, duration: 0.5, lyric: '汉' },
    { note: 'C4', midi: 60, start: 20.0, duration: 1.5, lyric: '隶' },

    { note: 'A4', midi: 69, start: 22.0, duration: 0.5, lyric: '仿' },
    { note: 'G4', midi: 67, start: 22.5, duration: 0.5, lyric: '前' },
    { note: 'E4', midi: 64, start: 23.0, duration: 0.5, lyric: '朝' },
    { note: 'D4', midi: 62, start: 23.5, duration: 0.5, lyric: '的' },
    { note: 'C4', midi: 60, start: 24.0, duration: 1.5, lyric: '你' },
  ],
};

// 4) 可爱女人 (Cute Woman) - Jay Chou (simplified)
export const KE_AI_NV_REN: Song = {
  id: 'ke_ai_nv_ren',
  title: '可爱女人',
  meta: {
    artist: '周杰伦 (Jay Chou)',
    language: 'zh',
    difficulty: 'medium',
    tags: ['mandopop', 'rhythm'],
    emoji: '💖',
  },
  notes: [
    { note: 'F4', midi: 65, start: 1.0, duration: 0.4, lyric: '漂' },
    { note: 'A4', midi: 69, start: 1.4, duration: 0.4, lyric: '亮' },
    { note: 'C5', midi: 72, start: 1.8, duration: 0.4, lyric: '的' },

    { note: 'D5', midi: 74, start: 2.5, duration: 0.4, lyric: '让' },
    { note: 'C5', midi: 72, start: 2.9, duration: 0.4, lyric: '我' },
    { note: 'A4', midi: 69, start: 3.3, duration: 0.4, lyric: '面' },
    { note: 'G4', midi: 67, start: 3.7, duration: 0.4, lyric: '红' },
    { note: 'F4', midi: 65, start: 4.1, duration: 0.4, lyric: '的' },

    { note: 'D4', midi: 62, start: 5.0, duration: 0.4, lyric: '可' },
    { note: 'F4', midi: 65, start: 5.4, duration: 0.4, lyric: '爱' },
    { note: 'G4', midi: 67, start: 5.8, duration: 0.4, lyric: '女' },
    { note: 'A4', midi: 69, start: 6.2, duration: 1.5, lyric: '人' },
  ],
};

// 5) Happy Birthday
export const HAPPY_BIRTHDAY: Song = {
  id: 'happy_birthday',
  title: 'Happy Birthday',
  meta: {
    artist: 'Traditional',
    language: 'en',
    difficulty: 'easy',
    tags: ['familiar', 'warmup'],
    emoji: '🎂',
  },
  notes: [
    { note: 'C4', midi: 60, start: 1.0, duration: 0.4, lyric: 'Hap' },
    { note: 'C4', midi: 60, start: 1.4, duration: 0.4, lyric: 'py' },
    { note: 'D4', midi: 62, start: 1.8, duration: 0.8, lyric: 'birth' },
    { note: 'C4', midi: 60, start: 2.6, duration: 0.8, lyric: 'day' },
    { note: 'F4', midi: 65, start: 3.4, duration: 0.8, lyric: 'to' },
    { note: 'E4', midi: 64, start: 4.2, duration: 1.2, lyric: 'you' },

    { note: 'C4', midi: 60, start: 6.0, duration: 0.4, lyric: 'Hap' },
    { note: 'C4', midi: 60, start: 6.4, duration: 0.4, lyric: 'py' },
    { note: 'D4', midi: 62, start: 6.8, duration: 0.8, lyric: 'birth' },
    { note: 'C4', midi: 60, start: 7.6, duration: 0.8, lyric: 'day' },
    { note: 'G4', midi: 67, start: 8.4, duration: 0.8, lyric: 'to' },
    { note: 'F4', midi: 65, start: 9.2, duration: 1.2, lyric: 'you' },
  ],
};

// 6) 生日快乐 (same melody as Happy Birthday)
export const SHENG_RI_KUAI_LE: Song = {
  id: 'sheng_ri_kuai_le',
  title: '生日快乐',
  meta: {
    artist: 'Traditional',
    language: 'zh',
    difficulty: 'easy',
    tags: ['familiar', 'warmup'],
    emoji: '🥳',
  },
  notes: (() => {
    // Match the same note count as HAPPY_BIRTHDAY; lyrics are per-note syllables.
    const lyrics = ['生', '日', '快', '乐', '祝', '你', '生', '日', '快', '乐', '祝', '你'];
    return HAPPY_BIRTHDAY.notes.map((n, i) => ({ ...n, lyric: lyrics[i] }));
  })(),
};

// 7) Ode to Joy (Beethoven) - opening phrase
export const ODE_TO_JOY: Song = {
  id: 'ode_to_joy',
  title: 'Ode to Joy (Beethoven)',
  meta: {
    artist: 'L. van Beethoven',
    language: 'instrumental',
    difficulty: 'easy',
    tags: ['classical', 'sight-sing'],
    emoji: '🎼',
  },
  notes: [
    { note: 'E4', midi: 64, start: 1.0, duration: 0.5 },
    { note: 'E4', midi: 64, start: 1.5, duration: 0.5 },
    { note: 'F4', midi: 65, start: 2.0, duration: 0.5 },
    { note: 'G4', midi: 67, start: 2.5, duration: 0.5 },
    { note: 'G4', midi: 67, start: 3.0, duration: 0.5 },
    { note: 'F4', midi: 65, start: 3.5, duration: 0.5 },
    { note: 'E4', midi: 64, start: 4.0, duration: 0.5 },
    { note: 'D4', midi: 62, start: 4.5, duration: 0.5 },
    { note: 'C4', midi: 60, start: 5.0, duration: 0.7 },
    { note: 'C4', midi: 60, start: 5.7, duration: 0.7 },
  ],
};

// 8) Jingle Bells - opening phrase
export const JINGLE_BELLS: Song = {
  id: 'jingle_bells',
  title: 'Jingle Bells',
  meta: {
    artist: 'James Lord Pierpont',
    language: 'en',
    difficulty: 'easy',
    tags: ['holiday', 'rhythm'],
    emoji: '🔔',
  },
  notes: [
    { note: 'E4', midi: 64, start: 1.0, duration: 0.4, lyric: 'Jin' },
    { note: 'E4', midi: 64, start: 1.4, duration: 0.4, lyric: 'gle' },
    { note: 'E4', midi: 64, start: 1.8, duration: 0.8, lyric: 'bells' },
    { note: 'E4', midi: 64, start: 2.8, duration: 0.4, lyric: 'jin' },
    { note: 'E4', midi: 64, start: 3.2, duration: 0.4, lyric: 'gle' },
    { note: 'E4', midi: 64, start: 3.6, duration: 0.8, lyric: 'bells' },
    { note: 'E4', midi: 64, start: 4.6, duration: 0.4, lyric: 'jin' },
    { note: 'G4', midi: 67, start: 5.0, duration: 0.4, lyric: 'gle' },
    { note: 'C4', midi: 60, start: 5.4, duration: 0.6, lyric: 'all' },
    { note: 'D4', midi: 62, start: 6.0, duration: 0.6, lyric: 'the' },
    { note: 'E4', midi: 64, start: 6.6, duration: 1.0, lyric: 'way' },
  ],
};

// 9) Mary Had a Little Lamb - opening phrase
export const MARY_LITTLE_LAMB: Song = {
  id: 'mary_little_lamb',
  title: 'Mary Had a Little Lamb',
  meta: {
    artist: 'Traditional',
    language: 'en',
    difficulty: 'easy',
    tags: ['nursery', 'intervals'],
    emoji: '🐑',
  },
  notes: [
    { note: 'E4', midi: 64, start: 1.0, duration: 0.5, lyric: 'Ma' },
    { note: 'D4', midi: 62, start: 1.5, duration: 0.5, lyric: 'ry' },
    { note: 'C4', midi: 60, start: 2.0, duration: 0.5, lyric: 'had' },
    { note: 'D4', midi: 62, start: 2.5, duration: 0.5, lyric: 'a' },
    { note: 'E4', midi: 64, start: 3.0, duration: 0.5, lyric: 'lit' },
    { note: 'E4', midi: 64, start: 3.5, duration: 0.5, lyric: 'tle' },
    { note: 'E4', midi: 64, start: 4.0, duration: 1.0, lyric: 'lamb' },
  ],
};

// 10) You Are My Sunshine - opening phrase
export const YOU_ARE_MY_SUNSHINE: Song = {
  id: 'you_are_my_sunshine',
  title: 'You Are My Sunshine',
  meta: {
    artist: 'Jimmie Davis / Charles Mitchell',
    language: 'en',
    difficulty: 'easy',
    tags: ['folk', 'breath'],
    emoji: '☀️',
  },
  notes: [
    { note: 'C4', midi: 60, start: 1.0, duration: 0.5, lyric: 'You' },
    { note: 'D4', midi: 62, start: 1.5, duration: 0.5, lyric: 'are' },
    { note: 'E4', midi: 64, start: 2.0, duration: 0.5, lyric: 'my' },
    { note: 'F4', midi: 65, start: 2.5, duration: 0.5, lyric: 'sun' },
    { note: 'G4', midi: 67, start: 3.0, duration: 1.0, lyric: 'shine' },
    { note: 'G4', midi: 67, start: 4.2, duration: 0.5, lyric: 'my' },
    { note: 'F4', midi: 65, start: 4.7, duration: 0.5, lyric: 'on' },
    { note: 'E4', midi: 64, start: 5.2, duration: 0.5, lyric: 'ly' },
    { note: 'D4', midi: 62, start: 5.7, duration: 1.0, lyric: 'sun' },
    { note: 'C4', midi: 60, start: 6.9, duration: 1.0, lyric: 'shine' },
  ],
};

export const SONGS: Song[] = [
  TWINKLE_TWINKLE,
  LET_IT_GO,
  QING_HUA_CI,
  KE_AI_NV_REN,
  HAPPY_BIRTHDAY,
  SHENG_RI_KUAI_LE,
  ODE_TO_JOY,
  JINGLE_BELLS,
  MARY_LITTLE_LAMB,
  YOU_ARE_MY_SUNSHINE,
];

export const getSongById = (id: string): Song | undefined => SONGS.find(s => s.id === id);

// Back-compat exports for existing code paths
export const TWINKLE_TWINKLE_LOW = transposeSong(TWINKLE_TWINKLE, -12);
export const LET_IT_GO_LOW = transposeSong(LET_IT_GO, -12);
export const QING_HUA_CI_LOW = transposeSong(QING_HUA_CI, -12);
export const KE_AI_NV_REN_LOW = transposeSong(KE_AI_NV_REN, -12);
