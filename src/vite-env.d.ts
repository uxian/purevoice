/// <reference types="vite/client" />

declare module 'ml5' {
    export function pitchDetection(
        modelPath: string,
        audioContext: AudioContext,
        stream: MediaStream,
        callback?: () => void
    ): any;
}
