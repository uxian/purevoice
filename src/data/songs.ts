export interface NoteData {
    note: string;     // Note name (e.g., 'C4')
    midi: number;     // MIDI number for easier drawing
    start: number;    // Start time in seconds
    duration: number; // Duration in seconds
    lyric?: string;   // Lyric text
}

export interface Song {
    id: string;
    title: string;
    notes: NoteData[];
}

export const transposeSong = (song: Song, semitones: number): Song => {
    return {
        ...song,
        id: `${song.id}-${semitones}`,
        notes: song.notes.map(n => ({
            ...n,
            midi: n.midi + semitones,
            note: n.note // Note name might be inaccurate after shift but visualizer uses midi
        }))
    };
};

// 1. Twinkle Twinkle Little Star (Complete A-B-B-A)
// Key: C Major
export const TWINKLE_TWINKLE: Song = {
    id: 'twinkle',
    title: 'Twinkle Twinkle Little Star',
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
    ]
};

// 2. Let It Go (Frozen) - Chorus
// Transposed to C Major (Range C4-G5)
// Original Chorus: Ab Bb C / Ab Bb Eb / Fm Eb Db...
// C Major Mapping: A B C...
export const LET_IT_GO: Song = {
    id: 'let_it_go',
    title: 'Let It Go (Disney)',
    notes: [
        // Let it go, let it go (A4 B4 C5, A4 B4 C5?) - Simplified melody C Major
        // Let(A) it(B) go(C)
        { note: 'A4', midi: 69, start: 1.0, duration: 0.5, lyric: 'Let' },
        { note: 'B4', midi: 71, start: 1.5, duration: 0.5, lyric: 'it' },
        { note: 'C5', midi: 72, start: 2.0, duration: 1.5, lyric: 'go' },

        // Let it go, let it go (A4 B4 E5, C5 B4 A4...)
        { note: 'A4', midi: 69, start: 4.0, duration: 0.5, lyric: 'Let' },
        { note: 'B4', midi: 71, start: 4.5, duration: 0.5, lyric: 'it' },
        { note: 'D5', midi: 74, start: 5.0, duration: 1.5, lyric: 'go' },

        // Can't hold it back anymore (C5 D5 C5 B4 A4 G4)
        { note: 'C5', midi: 72, start: 7.0, duration: 0.5, lyric: 'Can\'t' },
        { note: 'D5', midi: 74, start: 7.4, duration: 0.5, lyric: 'hold' },
        { note: 'C5', midi: 72, start: 7.8, duration: 0.5, lyric: 'it' },
        { note: 'B4', midi: 71, start: 8.2, duration: 0.5, lyric: 'back' },
        { note: 'A4', midi: 69, start: 8.6, duration: 0.5, lyric: 'a' },
        { note: 'G4', midi: 67, start: 9.0, duration: 0.5, lyric: 'ny' },
        { note: 'G4', midi: 67, start: 9.5, duration: 1.0, lyric: 'more' },

        // Let it go, let it go (A4 B4 C5, A4 B4 C5)
        { note: 'A4', midi: 69, start: 11.5, duration: 0.5, lyric: 'Let' },
        { note: 'B4', midi: 71, start: 12.0, duration: 0.5, lyric: 'it' },
        { note: 'C5', midi: 72, start: 12.5, duration: 1.5, lyric: 'go' },

        // Turn away and slam the door (C5 B4 C5, D5 D5 C5)
        { note: 'A4', midi: 69, start: 14.5, duration: 0.5, lyric: 'Turn' },
        { note: 'B4', midi: 71, start: 15.0, duration: 0.5, lyric: 'a' },
        { note: 'E5', midi: 76, start: 15.5, duration: 1.0, lyric: 'way' },

        { note: 'E5', midi: 76, start: 17.0, duration: 0.5, lyric: 'and' },
        { note: 'D5', midi: 74, start: 17.5, duration: 0.5, lyric: 'slam' },
        { note: 'C5', midi: 72, start: 18.0, duration: 0.5, lyric: 'the' },
        { note: 'C5', midi: 72, start: 18.5, duration: 1.0, lyric: 'door' },

        // I don't care what they're going to say (G5 E5 C5, C5 C5 C5 B4 A4)
        { note: 'G5', midi: 79, start: 20.0, duration: 0.8, lyric: 'I' },
        { note: 'E5', midi: 76, start: 20.8, duration: 0.5, lyric: 'don\'t' },
        { note: 'C5', midi: 72, start: 21.3, duration: 0.8, lyric: 'care' },

        { note: 'C5', midi: 72, start: 22.5, duration: 0.4, lyric: 'what' },
        { note: 'C5', midi: 72, start: 22.9, duration: 0.4, lyric: 'they\'re' },
        { note: 'B4', midi: 71, start: 23.3, duration: 0.4, lyric: 'going' },
        { note: 'C5', midi: 72, start: 23.7, duration: 0.4, lyric: 'to' },
        { note: 'C5', midi: 72, start: 24.1, duration: 1.0, lyric: 'say' },

        // Let the storm rage on (E5 E5 F5 E5 D5)
        { note: 'E5', midi: 76, start: 26.0, duration: 0.5, lyric: 'Let' },
        { note: 'E5', midi: 76, start: 26.5, duration: 0.5, lyric: 'the' },
        { note: 'F5', midi: 77, start: 27.0, duration: 0.5, lyric: 'storm' },
        { note: 'E5', midi: 76, start: 27.5, duration: 0.5, lyric: 'rage' },
        { note: 'D5', midi: 74, start: 28.0, duration: 2.0, lyric: 'on' },

        // The cold never bothered me anyway (C5 B4 A4 G4 A4... C5)
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
    ]
};

// 3. 青花瓷 (Qing Hua Ci) - Jay Chou
// Key: C Major (Pentatonic)
export const QING_HUA_CI: Song = {
    id: 'qing_hua_ci',
    title: '青花瓷 (Jay Chou)',
    notes: [
        // Tian qing se deng yan yu (E G A C D E)
        { note: 'E4', midi: 64, start: 1.0, duration: 0.5, lyric: '天' },
        { note: 'G4', midi: 67, start: 1.5, duration: 0.5, lyric: '青' },
        { note: 'A4', midi: 69, start: 2.0, duration: 0.5, lyric: '色' },
        { note: 'C5', midi: 72, start: 2.5, duration: 0.5, lyric: '等' },
        { note: 'D5', midi: 74, start: 3.0, duration: 0.5, lyric: '烟' },
        { note: 'E5', midi: 76, start: 3.5, duration: 1.5, lyric: '雨' },

        // Er wo zai deng ni (D C A G A C)
        { note: 'D5', midi: 74, start: 5.5, duration: 0.5, lyric: '而' },
        { note: 'C5', midi: 72, start: 6.0, duration: 0.5, lyric: '我' },
        { note: 'A4', midi: 69, start: 6.5, duration: 0.5, lyric: '在' },
        { note: 'G4', midi: 67, start: 7.0, duration: 0.5, lyric: '等' },
        { note: 'A4', midi: 69, start: 7.5, duration: 1.5, lyric: '你' },

        // Yue se bei da lao qi (E G A C D E)
        { note: 'E4', midi: 64, start: 9.5, duration: 0.5, lyric: '炊' }, // cui (Changed lyrics to simplified flow if needed but sticking to standard)
        { note: 'G4', midi: 67, start: 10.0, duration: 0.5, lyric: '烟' },
        { note: 'A4', midi: 69, start: 10.5, duration: 0.5, lyric: '袅' },
        { note: 'C5', midi: 72, start: 11.0, duration: 0.5, lyric: '袅' },
        { note: 'D5', midi: 74, start: 11.5, duration: 0.5, lyric: '升' },
        { note: 'E5', midi: 76, start: 12.0, duration: 1.5, lyric: '起' },

        // Ge jiang qian wan li (D C A G A C)
        { note: 'D5', midi: 74, start: 13.5, duration: 0.5, lyric: '隔' },
        { note: 'C5', midi: 72, start: 14.0, duration: 0.5, lyric: '江' },
        { note: 'A4', midi: 69, start: 14.5, duration: 0.5, lyric: '千' },
        { note: 'G4', midi: 67, start: 15.0, duration: 0.5, lyric: '万' },
        { note: 'C5', midi: 72, start: 15.5, duration: 1.5, lyric: '里' },

        // Zai pin di shu xie (E A G E D C)
        { note: 'E4', midi: 64, start: 17.5, duration: 0.5, lyric: '在' },
        { note: 'A4', midi: 69, start: 18.0, duration: 0.5, lyric: '瓶' },
        { note: 'G4', midi: 67, start: 18.5, duration: 0.5, lyric: '底' },
        { note: 'E4', midi: 64, start: 19.0, duration: 0.5, lyric: '书' },
        { note: 'D4', midi: 62, start: 19.5, duration: 0.5, lyric: '汉' }, // han li
        { note: 'C4', midi: 60, start: 20.0, duration: 1.5, lyric: '隶' }, // li

        // Fang qian chao de ni (A G E D C A) -> A3? No, keep it simpler C4 range.
        // Let's go up: A4 G4 E4 D4 C4...
        { note: 'A4', midi: 69, start: 22.0, duration: 0.5, lyric: '仿' },
        { note: 'G4', midi: 67, start: 22.5, duration: 0.5, lyric: '前' },
        { note: 'E4', midi: 64, start: 23.0, duration: 0.5, lyric: '朝' },
        { note: 'D4', midi: 62, start: 23.5, duration: 0.5, lyric: '的' },
        { note: 'C4', midi: 60, start: 24.0, duration: 1.5, lyric: '你' },

        // Jiu dang wo wei yu jian ni (E G A C D C A G A C)
        { note: 'E4', midi: 64, start: 26.0, duration: 0.5, lyric: '就' },
        { note: 'G4', midi: 67, start: 26.5, duration: 0.5, lyric: '当' },
        { note: 'A4', midi: 69, start: 27.0, duration: 0.5, lyric: '我' },
        { note: 'C5', midi: 72, start: 27.5, duration: 0.5, lyric: '为' },
        { note: 'D5', midi: 74, start: 28.0, duration: 0.5, lyric: '遇' },
        { note: 'E5', midi: 76, start: 28.5, duration: 0.5, lyric: '见' },
        { note: 'D5', midi: 74, start: 29.0, duration: 0.5, lyric: '你' },
        { note: 'C5', midi: 72, start: 29.5, duration: 1.0, lyric: '伏' },
        { note: 'D5', midi: 74, start: 30.5, duration: 2.0, lyric: '笔' },

    ]
};

// 4. 可爱女人 (Cute Woman) - Jay Chou
// Key: F Major (Bb)
// Chorus Loop: F A C (Piao liang de) -> D C A G F (Rang wo mian hong de) -> D F G A (Ke ai nv ren)
export const KE_AI_NV_REN: Song = {
    id: 'ke_ai_nv_ren',
    title: '可爱女人 (Jay Chou)',
    notes: [
        // 1. Piao liang de (Beautiful)
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

        // 2. Wen rou de (Gentle)
        { note: 'F4', midi: 65, start: 8.5, duration: 0.4, lyric: '温' },
        { note: 'A4', midi: 69, start: 8.9, duration: 0.4, lyric: '柔' },
        { note: 'C5', midi: 72, start: 9.3, duration: 0.4, lyric: '的' },

        { note: 'D5', midi: 74, start: 10.0, duration: 0.4, lyric: '让' },
        { note: 'C5', midi: 72, start: 10.4, duration: 0.4, lyric: '我' },
        { note: 'A4', midi: 69, start: 10.8, duration: 0.4, lyric: '心' },
        { note: 'G4', midi: 67, start: 11.2, duration: 0.4, lyric: '疼' },
        { note: 'F4', midi: 65, start: 11.6, duration: 0.4, lyric: '的' },

        { note: 'D4', midi: 62, start: 12.5, duration: 0.4, lyric: '可' },
        { note: 'F4', midi: 65, start: 12.9, duration: 0.4, lyric: '爱' },
        { note: 'G4', midi: 67, start: 13.3, duration: 0.4, lyric: '女' },
        { note: 'A4', midi: 69, start: 13.7, duration: 1.5, lyric: '人' },

        // 3. Tou ming de (Transparent)
        { note: 'F4', midi: 65, start: 16.0, duration: 0.4, lyric: '透' },
        { note: 'A4', midi: 69, start: 16.4, duration: 0.4, lyric: '明' },
        { note: 'C5', midi: 72, start: 16.8, duration: 0.4, lyric: '的' },

        { note: 'D5', midi: 74, start: 17.5, duration: 0.4, lyric: '让' },
        { note: 'C5', midi: 72, start: 17.9, duration: 0.4, lyric: '我' },
        { note: 'A4', midi: 69, start: 18.3, duration: 0.4, lyric: '感' },
        { note: 'G4', midi: 67, start: 18.7, duration: 0.4, lyric: '动' },
        { note: 'F4', midi: 65, start: 19.1, duration: 0.4, lyric: '的' },

        { note: 'D4', midi: 62, start: 20.0, duration: 0.4, lyric: '可' },
        { note: 'F4', midi: 65, start: 20.4, duration: 0.4, lyric: '爱' },
        { note: 'G4', midi: 67, start: 20.8, duration: 0.4, lyric: '女' },
        { note: 'A4', midi: 69, start: 21.2, duration: 1.5, lyric: '人' },

        // 4. Huai huai de (Bad)
        { note: 'F4', midi: 65, start: 23.5, duration: 0.4, lyric: '坏' },
        { note: 'A4', midi: 69, start: 23.9, duration: 0.4, lyric: '坏' },
        { note: 'C5', midi: 72, start: 24.3, duration: 0.4, lyric: '的' },

        { note: 'D5', midi: 74, start: 25.0, duration: 0.4, lyric: '让' },
        { note: 'C5', midi: 72, start: 25.4, duration: 0.4, lyric: '我' },
        { note: 'A4', midi: 69, start: 25.8, duration: 0.4, lyric: '疯' },
        { note: 'G4', midi: 67, start: 26.2, duration: 0.4, lyric: '狂' },
        { note: 'F4', midi: 65, start: 26.6, duration: 0.4, lyric: '的' },

        { note: 'D4', midi: 62, start: 27.5, duration: 0.4, lyric: '可' },
        { note: 'F4', midi: 65, start: 27.9, duration: 0.4, lyric: '爱' },
        { note: 'G4', midi: 67, start: 28.3, duration: 0.4, lyric: '女' },
        { note: 'A4', midi: 69, start: 28.7, duration: 1.5, lyric: '人' },
    ]
};

export const TWINKLE_TWINKLE_LOW = transposeSong(TWINKLE_TWINKLE, -12);
export const LET_IT_GO_LOW = transposeSong(LET_IT_GO, -12);
export const QING_HUA_CI_LOW = transposeSong(QING_HUA_CI, -12);
export const KE_AI_NV_REN_LOW = transposeSong(KE_AI_NV_REN, -12);
