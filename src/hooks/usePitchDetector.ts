import { useEffect, useRef, useState } from 'react';
import ml5 from 'ml5';

export function usePitchDetector(
    audioContext: AudioContext | null,
    stream: MediaStream | null,
    onPitchDetected?: (frequency: number | null) => void
) {
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const pitchDetectorRef = useRef<any>(null);
    const rafId = useRef<number | null>(null);
    const isRunningRef = useRef(false);

    useEffect(() => {
        if (!audioContext || !stream) {
            isRunningRef.current = false;
            if (rafId.current) cancelAnimationFrame(rafId.current);
            return;
        }

        console.log("Initializing Pitch Detection...");

        const modelUrl = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';

        try {
            const detector = ml5.pitchDetection(modelUrl, audioContext, stream, () => {
                console.log("Pitch Detection Model Loaded");
                setIsModelLoaded(true);
                pitchDetectorRef.current = detector;
                isRunningRef.current = true;
                detect();
            });

            if (!detector) {
                console.error("ml5.pitchDetection returned undefined/null");
            }
        } catch (e) {
            console.error("Error starting ml5:", e);
        }

        const detect = () => {
            if (!isRunningRef.current || !pitchDetectorRef.current) return;

            try {
                pitchDetectorRef.current.getPitch((err: any, frequency: number) => {
                    if (err) {
                        console.error("Pitch detection error:", err);
                        return;
                    }

                    const val = frequency || null;
                    
                    // Invoke callback directly (bypassing React state)
                    if (onPitchDetected) {
                        onPitchDetected(val);
                    }

                    if (isRunningRef.current) {
                        rafId.current = requestAnimationFrame(detect);
                    }
                });
            } catch (e) {
                console.error("Error in pitch detection loop:", e);
                isRunningRef.current = false;
            }
        };

        return () => {
            isRunningRef.current = false;
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [audioContext, stream, onPitchDetected]);

    return { isModelLoaded };
}
