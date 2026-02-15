/// <reference types="vite/client" />

interface Window {
  /** Safari prefix */
  webkitAudioContext?: typeof AudioContext;
}

declare module 'ml5' {
  export interface PitchDetector {
    getPitch(cb: (err: unknown, frequency: number) => void): void;
  }

  export function pitchDetection(
    modelPath: string,
    audioContext: AudioContext,
    stream: MediaStream,
    callback?: () => void
  ): PitchDetector;
}
