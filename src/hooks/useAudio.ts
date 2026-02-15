import { useState, useEffect, useCallback, useRef } from 'react';
import { getMicErrorMessageForName } from '../constants/micErrors';

type AudioStartError = {
    message: string;
    name?: string;
};

function getMicError(err: unknown): AudioStartError {
    // DOMException is typical for getUserMedia errors.
    if (err instanceof DOMException) {
        return { name: err.name, message: getMicErrorMessageForName(err.name) };
    }

    if (err instanceof Error && err.message) return { message: err.message };
    return { message: 'Error accessing microphone' };
}

export function useAudio() {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [error, setError] = useState<AudioStartError | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [isStarting, setIsStarting] = useState(false);

    const streamRef = useRef<MediaStream | null>(null);
    const ctxRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        streamRef.current = stream;
    }, [stream]);

    useEffect(() => {
        ctxRef.current = audioContext;
    }, [audioContext]);

    const startAudio = useCallback(async () => {
        // Clear any previous error immediately so the user sees we are retrying.
        setError(null);
        setIsStarting(true);

        let ctx: AudioContext | null = null;
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) {
                throw new Error('AudioContext is not supported in this browser');
            }
            ctx = new AudioContextClass();

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
            setIsStarting(false);
        } catch (err: unknown) {
            // If we created an AudioContext but failed later (e.g. getUserMedia), close it to avoid leaks.
            if (ctx && ctx.state !== 'closed') {
                void ctx.close();
            }
            console.error('Error starting audio:', err);
            setError(getMicError(err));
            setIsReady(false);
            setIsStarting(false);
        }
    }, []);

    const stopAudio = useCallback(() => {
        setIsStarting(false);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        if (ctxRef.current && ctxRef.current.state !== 'closed') {
            void ctxRef.current.close();
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
                void ctxRef.current.close();
            }
        };
    }, []);

    return { startAudio, stopAudio, isReady, isStarting, audioContext, stream, error };
}
