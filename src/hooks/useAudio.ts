import { useState, useEffect, useCallback, useRef } from 'react';

function getMicErrorMessage(err: unknown): string {
    // DOMException is typical for getUserMedia errors.
    if (err instanceof DOMException) {
        switch (err.name) {
            case 'NotAllowedError':
            case 'PermissionDeniedError':
                return 'Microphone permission denied. Please allow access in your browser settings and try again.';
            case 'NotFoundError':
            case 'DevicesNotFoundError':
                return 'No microphone found. Please connect a mic or check your OS input settings.';
            case 'NotReadableError':
            case 'TrackStartError':
                return 'Microphone is in use by another app, or could not be started. Close other apps (Zoom, Meet) and try again.';
            case 'OverconstrainedError':
                return 'Your microphone does not support the requested audio constraints. Try a different input device.';
            case 'SecurityError':
                return 'Microphone access blocked by security settings. Make sure you are on HTTPS (or localhost).';
            case 'AbortError':
                return 'Microphone request was aborted. Please try again.';
            default:
                return `Microphone error: ${err.name}`;
        }
    }

    if (err instanceof Error && err.message) return err.message;
    return 'Error accessing microphone';
}

export function useAudio() {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);

    const streamRef = useRef<MediaStream | null>(null);
    const ctxRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        streamRef.current = stream;
    }, [stream]);

    useEffect(() => {
        ctxRef.current = audioContext;
    }, [audioContext]);

    const startAudio = useCallback(async () => {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) {
                throw new Error('AudioContext is not supported in this browser');
            }
            const ctx = new AudioContextClass();

            if (ctx.state === 'suspended') {
                await ctx.resume();
            }

            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error('Microphone access is not supported in this browser');
            }

            const userStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    autoGainControl: false,
                    noiseSuppression: false,
                }
            });

            setAudioContext(ctx);
            setStream(userStream);
            setIsReady(true);
            setError(null);
        } catch (err: unknown) {
            console.error('Error starting audio:', err);
            setError(getMicErrorMessage(err));
            setIsReady(false);
        }
    }, []);

    const stopAudio = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        if (ctxRef.current && ctxRef.current.state !== 'closed') {
            ctxRef.current.close();
            setAudioContext(null);
        }
        setIsReady(false);
    }, []);

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
            }
            if (ctxRef.current && ctxRef.current.state !== 'closed') {
                ctxRef.current.close();
            }
        };
    }, []);

    return { startAudio, stopAudio, isReady, audioContext, stream, error };
}
