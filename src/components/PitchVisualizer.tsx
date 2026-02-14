import { useEffect, useRef, useState, useCallback } from 'react';
import { frequencyToMidi, NOTES } from '../utils/noteUtils';
import type { Song } from '../data/songs';
import { usePitchDetector } from '../hooks/usePitchDetector';

interface PitchVisualizerProps {
    audioContext: AudioContext | null;
    stream: MediaStream | null;
    song?: Song | null;
    isPlaying?: boolean;
    onSongEnd?: () => void;
}

export function PitchVisualizer({ audioContext, stream, song, isPlaying }: PitchVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Display State
    const [displayPitch, setDisplayPitch] = useState<number | null>(null);
    const lastDisplayUpdateRef = useRef<number>(0);

    // Time State
    const startTimeRef = useRef<number | null>(null);

    // Data Store using strictly timestamps
    const historyRef = useRef<{ t: number; midi: number | null }[]>([]);

    // Smoothed Input Pointers
    const currentMidiRef = useRef<number | null>(null);
    const targetMidiRef = useRef<number | null>(null);

    const animationFrameRef = useRef<number>(0);

    // Particle System
    const particlesRef = useRef<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        life: number;
        color: string;
        size: number;
    }[]>([]);

    // --- Pitch Detection Callback ---
    const handlePitch = useCallback((pitch: number | null) => {
        // 1. Update Target MIDI (Instant for canvas)
        if (pitch && pitch > 0) {
            targetMidiRef.current = frequencyToMidi(pitch);
            if (currentMidiRef.current === null) {
                currentMidiRef.current = targetMidiRef.current;
            }
        } else {
            targetMidiRef.current = null;
        }

        // 2. Update Display Pitch (Throttled)
        const now = Date.now();
        if (now - lastDisplayUpdateRef.current > 150) { // Update text ~6fps
             if (pitch && pitch > 65) {
                setDisplayPitch(pitch);
            } else {
                setDisplayPitch(null);
            }
            lastDisplayUpdateRef.current = now;
        }
    }, []);

    // Activate Pitch Detector
    usePitchDetector(audioContext, stream, handlePitch);

    // 3. Playback Control
    useEffect(() => {
        if (isPlaying) {
            if (startTimeRef.current === null) {
                startTimeRef.current = Date.now();
                historyRef.current = [];
            }
        } else {
            startTimeRef.current = null;
            historyRef.current = [];
        }
    }, [isPlaying]);


    // 4. Main Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // High DPI
        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        // Theme Config
        const primaryColor = '#f43f5e';
        const secondaryColor = '#f59e0b';

        // Viewport Config
        const TIME_WINDOW = 6; // See 6 seconds total
        const NOW_OFFSET_PCT = 0.75; // "Now" is at 75% of screen width

        const spawnParticle = (x: number, y: number) => {
            if (Math.random() > 0.4) return;
            particlesRef.current.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 1) * 2,
                life: 1.0,
                color: Math.random() > 0.5 ? primaryColor : secondaryColor,
                size: Math.random() * 3 + 1
            });
        };

        const animate = () => {
            // --- A. Logic Update ---

            let now = 0;
            if (isPlaying && startTimeRef.current) {
                now = (Date.now() - startTimeRef.current) / 1000;
            } else {
                now = Date.now() / 1000;
            }

            // 2. Smooth Input
            if (targetMidiRef.current !== null) {
                if (currentMidiRef.current === null) {
                    currentMidiRef.current = targetMidiRef.current;
                } else {
                    currentMidiRef.current += (targetMidiRef.current - currentMidiRef.current) * 0.15;
                }
            }

            // 3. Store History
            const valToPush = targetMidiRef.current !== null ? currentMidiRef.current : null;
            historyRef.current.push({ t: now, midi: valToPush });

            const pruneThreshold = now - TIME_WINDOW;
            if (historyRef.current.length > 0 && historyRef.current[0].t < pruneThreshold) {
                historyRef.current.shift();
            }


            // --- B. Rendering ---

            const width = rect.width;
            const height = rect.height;

            const minMidi = 36;
            const maxMidi = 84;
            const yScale = height / (maxMidi - minMidi);
            const getY = (midi: number) => height - (midi - minMidi) * yScale;

            const getX = (t: number) => {
                const dt = t - now; // delta from Now
                return (width * NOW_OFFSET_PCT) + (dt * (width / TIME_WINDOW));
            }

            ctx.clearRect(0, 0, width, height);

            // Background
            const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
            bgGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
            bgGrad.addColorStop(1, 'rgba(255, 241, 242, 0.6)');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            // Grid
            for (let i = Math.ceil(minMidi); i <= Math.floor(maxMidi); i++) {
                const y = getY(i);
                const isC = (i % 12) === 0;
                const isMain = NOTES[i % 12].length === 1;

                ctx.beginPath();
                if (isC) {
                    ctx.strokeStyle = 'rgba(244, 63, 94, 0.2)';
                    ctx.lineWidth = 1;
                } else if (isMain) {
                    ctx.strokeStyle = 'rgba(100, 116, 139, 0.1)';
                    ctx.lineWidth = 0.5;
                } else {
                    ctx.strokeStyle = 'rgba(100, 116, 139, 0.05)';
                    ctx.lineWidth = 0.5;
                }
                if (isC || isMain) {
                    ctx.moveTo(0, y);
                    ctx.lineTo(width, y);
                    ctx.stroke();
                }
                if (isC) {
                    ctx.fillStyle = 'rgba(244, 63, 94, 0.6)';
                    ctx.font = '500 11px "Outfit", sans-serif';
                    ctx.fillText(`${NOTES[i % 12]} ${Math.floor(i / 12) - 1}`, 10, y - 4);
                }
            }

            // Draw Song Target Overlay
            if (song && isPlaying) {
                song.notes.forEach(note => {
                    const xStart = getX(note.start);
                    const xEnd = getX(note.start + note.duration);
                    const y = getY(note.midi);

                    if (xEnd < 0 || xStart > width) return;

                    const isCurrent = now >= note.start && now <= note.start + note.duration;

                    ctx.fillStyle = isCurrent ? '#f59e0b' : 'rgba(203, 213, 225, 0.8)';
                    if (isCurrent) {
                        ctx.shadowColor = '#f59e0b';
                        ctx.shadowBlur = 10;
                    }

                    const barH = 12;
                    ctx.beginPath();
                    ctx.roundRect(xStart, y - barH / 2, Math.max(xEnd - xStart, 4), barH, 6);
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    if (note.lyric) {
                        ctx.fillStyle = isCurrent ? '#d97706' : '#64748b';
                        ctx.font = isCurrent ? 'bold 18px "Outfit", sans-serif' : '16px "Outfit", sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText(note.lyric, (xStart + xEnd) / 2, y - 18);
                    }
                });

                const nowX = width * NOW_OFFSET_PCT;
                ctx.beginPath();
                ctx.moveTo(nowX, 0);
                ctx.lineTo(nowX, height);
                ctx.strokeStyle = 'rgba(244, 63, 94, 0.3)';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.stroke();
                ctx.setLineDash([]);
            }

            // Draw User Pitch Curve
            const points: { x: number, y: number }[] = [];
            historyRef.current.forEach(pt => {
                const x = getX(pt.t);
                if (x >= -50 && x <= width + 50) {
                    if (pt.midi !== null) {
                        points.push({ x, y: getY(pt.midi) });
                    } else {
                        points.push({ x, y: -1 });
                    }
                }
            });

            if (points.length > 0) {
                ctx.beginPath();
                let isDrawing = false;
                for (const p of points) {
                    if (p.y !== -1) {
                        if (!isDrawing) {
                            ctx.moveTo(p.x, p.y);
                            isDrawing = true;
                        } else {
                            ctx.lineTo(p.x, p.y);
                        }
                    } else {
                        isDrawing = false;
                    }
                }

                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.lineWidth = 4;

                const strokeGrad = ctx.createLinearGradient(0, 0, width, 0);
                strokeGrad.addColorStop(0, '#f43f5e');
                strokeGrad.addColorStop(1, '#f59e0b');
                ctx.strokeStyle = strokeGrad;

                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgba(244, 63, 94, 0.4)';
                ctx.stroke();
                ctx.shadowBlur = 0;

                ctx.lineTo(points[points.length - 1].x, height);
                ctx.lineTo(points[0].x, height);
                ctx.closePath();
                const fillGrad = ctx.createLinearGradient(0, 0, 0, height);
                fillGrad.addColorStop(0, 'rgba(251, 113, 133, 0.2)');
                fillGrad.addColorStop(1, 'rgba(251, 113, 133, 0.0)');
                ctx.fillStyle = fillGrad;
            }

            // Particles
            // Use targetMidiRef.current to determine if we have a valid signal 'now' for particle spawn
            // But for X/Y position of the cursor ball, we use currentMidiRef
            if (currentMidiRef.current && targetMidiRef.current !== null) {
                const nowX = width * NOW_OFFSET_PCT;
                const nowY = getY(currentMidiRef.current);

                spawnParticle(nowX, nowY);

                for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                    const p = particlesRef.current[i];
                    p.x += p.vx - (2);
                    p.y += p.vy;
                    p.life -= 0.03;
                    if (p.life <= 0) particlesRef.current.splice(i, 1);
                    else {
                        ctx.fillStyle = p.color;
                        ctx.globalAlpha = p.life;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                ctx.globalAlpha = 1;

                ctx.beginPath();
                ctx.arc(nowX, nowY, 6, 0, Math.PI * 2);
                ctx.fillStyle = 'white';
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#f43f5e';
                ctx.stroke();
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationFrameRef.current);
    }, [isPlaying, song]);

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto">
            <div ref={containerRef} className="relative w-full rounded-3xl overflow-hidden shadow-xl shadow-rose-100/50 bg-white/60 backdrop-blur-md border border-white/80 ring-1 ring-white">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>

                <canvas
                    ref={canvasRef}
                    style={{ width: '100%', height: '500px' }}
                    className="block relative z-10"
                />
            </div>

            <div className={`inline-flex items-center gap-3 bg-white/90 px-8 py-3 rounded-full border border-slate-100 shadow-sm backdrop-blur-md transition-opacity duration-300 ${displayPitch ? 'opacity-100' : 'opacity-70'}`}>
                <span className="font-semibold text-slate-400 text-xs tracking-widest uppercase">Frequency</span>
                <span className={`font-bold text-slate-700 font-mono text-lg tabular-nums ${displayPitch ? 'text-slate-800' : 'text-slate-300'}`}>
                    {displayPitch ? `${displayPitch.toFixed(1)} Hz` : '---.-- Hz'}
                </span>
            </div>
        </div>
    );
}
