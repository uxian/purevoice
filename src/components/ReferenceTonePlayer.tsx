import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Volume2 } from 'lucide-react';

export function ReferenceTonePlayer() {
    const [isPlaying, setIsPlaying] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const samplerRef = useRef<Tone.Sampler | null>(null);

    useEffect(() => {
        // Initialize Sampler with Salamander Piano samples (lightweight version)
        // Using a reliable CDN for basic piano samples
        const sampler = new Tone.Sampler({
            urls: {
                "C4": "C4.mp3",
                "D#4": "Ds4.mp3",
                "F#4": "Fs4.mp3",
                "A4": "A4.mp3",
            },
            release: 1,
            baseUrl: "https://tonejs.github.io/audio/salamander/",
            onload: () => {
                setIsLoaded(true);
            }
        }).toDestination();

        // Boost volume for "fullness"
        sampler.volume.value = 0;

        samplerRef.current = sampler;

        return () => {
            sampler.dispose();
        };
    }, []);

    const playNote = async (note: string) => {
        if (!samplerRef.current || !isLoaded) return;

        await Tone.start();

        // Trigger attack
        samplerRef.current.triggerAttackRelease(note, "2n");
        setIsPlaying(note);
        setTimeout(() => setIsPlaying(null), 500);
    };

    const SCALE = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4'];

    return (
        <div className="w-full max-w-lg mx-auto bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-lg shadow-rose-100/20">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-slate-500">
                    <div className="p-2 bg-rose-50 rounded-lg text-rose-400">
                        <Volume2 size={18} />
                    </div>
                    <span className="text-xs font-bold tracking-widest uppercase">Reference Piano</span>
                </div>
                {!isLoaded && <span className="text-[10px] text-slate-400 animate-pulse">LOADING SOUNDS...</span>}
            </div>

            <div className="flex justify-between gap-2 overflow-x-auto pb-2 relative">
                {/* Overlay if not loaded */}
                {!isLoaded && <div className="absolute inset-0 bg-white/50 z-10 cursor-wait"></div>}

                {SCALE.map((note) => (
                    <button
                        key={note}
                        onClick={() => playNote(note)}
                        disabled={!isLoaded}
                        className={`
              relative group flex flex-col items-center justify-end
              w-12 h-32 rounded-b-lg rounded-t-sm border border-slate-200
              transition-all duration-150 active:scale-95
              ${isPlaying === note
                                ? 'bg-gradient-to-b from-rose-400 to-rose-500 border-rose-500 shadow-[0_0_20px_rgba(251,113,133,0.5)] translate-y-1'
                                : 'bg-gradient-to-b from-white to-slate-50 hover:to-white hover:shadow-md hover:-translate-y-0.5'
                            }
            `}
                    >
                        <span className={`
              mb-3 text-sm font-bold font-mono
              ${isPlaying === note ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}
            `}>
                            {note.replace(/\d/, '')}
                        </span>

                        {/* Key glint */}
                        <div className={`absolute top-0 left-0 w-full h-full rounded-t-sm rounded-b-lg bg-gradient-to-b from-white/80 to-transparent pointer-events-none opacity-50`} />
                    </button>
                ))}
            </div>
        </div>
    );
}
