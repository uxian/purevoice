export const NOTES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

/**
 * Converts a frequency in Hz to a MIDI note number.
 * formula: note = 69 + 12 * log2(freq / 440)
 */
export function frequencyToMidi(frequency: number): number {
  return 69 + 12 * Math.log2(frequency / 440);
}

/**
 * Converts a MIDI note number to frequency in Hz.
 * formula: freq = 440 * 2^((note - 69) / 12)
 */
export function midiToFrequency(note: number): number {
  return 440 * Math.pow(2, (note - 69) / 12);
}

/**
 * Returns the note name (e.g., "A4", "C#3") and cents deviation from a given frequency.
 */
export function getNoteFromFrequency(frequency: number): {
  note: string;
  cents: number;
  frequency: number;
  midi: number;
  octave: number;
} | null {
  if (!frequency || frequency <= 0) return null;

  const midiFloat = frequencyToMidi(frequency);
  const midi = Math.round(midiFloat);
  const cents = Math.floor((midiFloat - midi) * 100);
  
  const noteName = NOTES[midi % 12];
  const octave = Math.floor(midi / 12) - 1;

  return {
    note: `${noteName}${octave}`,
    cents,
    frequency,
    midi,
    octave
  };
}
