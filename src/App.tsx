import { useState } from 'react';
import { useAudio } from './hooks/useAudio';
// import { usePitchDetector } from './hooks/usePitchDetector'; // Moved to PitchVisualizer
import { PitchVisualizer } from './components/PitchVisualizer';
import { ReferenceTonePlayer } from './components/ReferenceTonePlayer';
import { Mic, MicOff, Music, Sparkles, Activity, Play, Square, ArrowDown, ChevronDown, ListMusic } from 'lucide-react';
import { SONGS, getSongById, transposeSong } from './data/songs';
import type { Song } from './data/songs';

function App() {
  const { startAudio, stopAudio, audioContext, stream, isReady, error } = useAudio();
  // Removed top-level usePitchDetector to prevent 60fps re-renders of the entire App tree.
  // Pitch detection is now handled internally by PitchVisualizer via callback refs.

  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [useLowOctave, setUseLowOctave] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState<string>('twinkle');

  const toggleSong = () => {
    setIsPlayingSong(!isPlayingSong);
  };

  const handleSongChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSongId(e.target.value);
    setIsPlayingSong(false); // Reset playback on change
  };

  // Determine current song object
  const baseSong: Song | undefined = selectedSongId === 'free' ? undefined : getSongById(selectedSongId);
  const currentSong: Song | undefined = baseSong
    ? (useLowOctave ? transposeSong(baseSong, -12) : baseSong)
    : undefined;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-slate-600">

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <Music className="absolute top-10 left-[10%] text-rose-200/50 w-24 h-24 rotate-12" />
        <Music className="absolute bottom-20 right-[15%] text-indigo-200/50 w-32 h-32 -rotate-12" />
        <Sparkles className="absolute top-1/3 right-[10%] text-amber-200/60 w-16 h-16 animate-pulse" />
      </div>

      <header className="mb-6 text-center space-y-2 relative z-10 transition-all duration-500" style={{ transform: isReady ? 'scale(0.9) translateY(-10px)' : 'none' }}>
        <div className="inline-flex items-center justify-center p-3 bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm mb-4 ring-1 ring-slate-100">
          <div className="bg-gradient-to-tr from-rose-400 to-orange-400 text-white p-2 rounded-xl">
            <Music size={24} strokeWidth={2.5} />
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 drop-shadow-sm">
          Pure Voice
        </h1>
        {!isReady && (
          <p className="text-slate-500 text-base font-medium max-w-md mx-auto leading-relaxed">
            Discover the beauty of your voice with precision AI coaching.
          </p>
        )}
      </header>

      <main className="w-full max-w-4xl space-y-6 relative z-10 flex flex-col items-center">

        {error && (
          <div className="mb-6 flex items-center gap-3 text-rose-600 bg-rose-50 border border-rose-100 p-4 rounded-xl w-full justify-center shadow-sm">
            <Activity size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {!isReady ? (
          <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white ring-1 ring-slate-100 relative overflow-hidden w-full max-w-lg text-center transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex flex-col items-center gap-8 py-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-rose-100 to-orange-100 flex items-center justify-center mb-2 animate-pulse">
                <Mic size={48} className="text-rose-400" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-800">Ready to Sing?</h2>
                <p className="text-slate-500 text-sm">Allow microphone access to begin your session.</p>
              </div>

              {/* Start Button Block */}
              <button
                onClick={startAudio}
                className="w-full group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-slate-200 hover:shadow-2xl hover:shadow-slate-300 hover:-translate-y-1 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <span>Start Session</span>
                  <Mic size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Unified Control Bar */}
            <div className="w-full">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg shadow-slate-200/40 border border-white ring-1 ring-slate-100 p-2 md:p-3 flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 transition-all">

                {/* 1. Song Selection (Flexible) */}
                <div className="relative flex-grow md:flex-grow-[2] min-w-[200px]">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 pointer-events-none">
                    <ListMusic size={18} />
                  </div>
                  <select
                    value={selectedSongId}
                    onChange={handleSongChange}
                    className="w-full appearance-none bg-slate-50 hover:bg-slate-100 focus:bg-white pl-12 pr-10 py-3 md:py-3.5 rounded-2xl text-sm font-bold text-slate-700 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-rose-200 cursor-pointer transition-all outline-none"
                  >
                    {SONGS.map(song => (
                      <option key={song.id} value={song.id}>
                        {(song.meta.emoji ? `${song.meta.emoji} ` : '') + song.title + (song.meta.artist ? ` — ${song.meta.artist}` : '')}
                      </option>
                    ))}
                    <option value="free">🎤 Free Style Mode</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {/* Divider for Desktop */}
                <div className="hidden md:block w-px h-8 bg-slate-200 mx-1"></div>

                {/* 2. Controls Group */}
                <div className="flex items-center gap-2 flex-grow md:flex-grow-[3] justify-between md:justify-start">

                  {selectedSongId !== 'free' && (
                    <button
                      onClick={toggleSong}
                      className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm ${isPlayingSong ? 'bg-rose-500 text-white shadow-rose-200 hover:bg-rose-600' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                    >
                      {isPlayingSong ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                      <span>{isPlayingSong ? 'STOP' : 'PLAY'}</span>
                    </button>
                  )}

                  {isPlayingSong && selectedSongId !== 'free' && (
                    <button
                      onClick={() => setUseLowOctave(!useLowOctave)}
                      className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-semibold text-xs transition-all border animate-in fade-in slide-in-from-left-2 duration-300 ${useLowOctave ? 'bg-indigo-50 text-indigo-600 border-indigo-200 ring-2 ring-indigo-100' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                    >
                      <ArrowDown size={14} className={useLowOctave ? 'translate-y-0.5' : ''} />
                      <span>{useLowOctave ? 'Low Octave' : 'Lower Octave'}</span>
                    </button>
                  )}

                  {/* Spacer to push Stop Rec to right on desktop */}
                  <div className="flex-grow hidden md:block"></div>

                  {/* 3. Stop Recording / On Air */}
                  <button
                    onClick={stopAudio}
                    className="md:ml-auto group flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 text-xs font-bold hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all cursor-pointer whitespace-nowrap active:scale-95"
                    title="Click to End Session"
                  >
                    <span className="relative flex h-2.5 w-2.5 group-hover:hidden">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <MicOff size={14} className="hidden group-hover:block" />
                    <span className="group-hover:hidden tracking-wider">ON AIR</span>
                    <span className="hidden group-hover:block tracking-wider">END SESSION</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Visualizer Container */}
            <div className="w-full bg-white/40 backdrop-blur-sm rounded-3xl p-1 border border-white/50 shadow-sm">
              <PitchVisualizer
                audioContext={audioContext}
                stream={stream}
                song={selectedSongId === 'free' ? null : currentSong}
                isPlaying={isPlayingSong}
                onSongEnd={() => setIsPlayingSong(false)}
              />
            </div>

            {/* Reference Tones */}
            <ReferenceTonePlayer />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
