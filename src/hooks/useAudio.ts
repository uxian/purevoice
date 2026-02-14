import { useState, useEffect, useCallback, useRef } from 'react';

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
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContextClass();

            if (ctx.state === 'suspended') {
                await ctx.resume();
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
        } catch (err: any) {
            console.error("Error starting audio:", err);
            setError(err.message || 'Error accessing microphone');
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
