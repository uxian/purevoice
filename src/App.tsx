import { useEffect, useState } from 'react';
import { useAudio } from './hooks/useAudio';
// import { usePitchDetector } from './hooks/usePitchDetector'; // Moved to PitchVisualizer
import { PitchVisualizer } from './components/PitchVisualizer';
import { ReferenceTonePlayer } from './components/ReferenceTonePlayer';
import {
  Mic,
  MicOff,
  Music,
  Sparkles,
  Activity,
  Play,
  Square,
  ArrowDown,
  ChevronDown,
  ListMusic,
  Search,
  Star,
} from 'lucide-react';
import { SONGS, getSongById, getSongRange, transposeSong } from './data/songs';
import type { Song } from './data/songs';
import { midiToNoteName } from './utils/noteUtils';
import { MIC_TROUBLESHOOTING_TIPS } from './constants/micTroubleshooting';

const FAVORITES_STORAGE_KEY = 'purevoice:favorites:v1';

const loadFavorites = (): Set<string> => {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((x): x is string => typeof x === 'string'));
  } catch {
    return new Set();
  }
};

function App() {
  const { startAudio, stopAudio, audioContext, stream, isReady, isStarting, error } = useAudio();
  // Removed top-level usePitchDetector to prevent 60fps re-renders of the entire App tree.
  // Pitch detection is now handled internally by PitchVisualizer via callback refs.

  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [useLowOctave, setUseLowOctave] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState<string>('twinkle');
  const [songQuery, setSongQuery] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favoriteSongIds, setFavoriteSongIds] = useState<Set<string>>(() => loadFavorites());
  const [showMicHelp, setShowMicHelp] = useState(false);

  const toggleSong = () => {
    setIsPlayingSong(!isPlayingSong);
  };

  const handleSongChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSongId(e.target.value);
    setIsPlayingSong(false); // Reset playback on change
  };

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favoriteSongIds)));
    } catch {
      // ignore
    }
  }, [favoriteSongIds]);


  const toggleFavoriteForSelectedSong = () => {
    if (selectedSongId === 'free') return;
    setFavoriteSongIds(prev => {
      const next = new Set(prev);
      if (next.has(selectedSongId)) next.delete(selectedSongId);
      else next.add(selectedSongId);
      return next;
    });
  };

  // Determine current song object
  const baseSong: Song | undefined = selectedSongId === 'free' ? undefined : getSongById(selectedSongId);
  const currentSong: Song | undefined = baseSong
    ? (useLowOctave ? transposeSong(baseSong, -12) : baseSong)
    : undefined;

  const currentSongRange = currentSong ? getSongRange(currentSong) : null;

  const baseSongs = favoritesOnly ? SONGS.filter(song => favoriteSongIds.has(song.id)) : SONGS;
  const showFavoritesEmptyHint = favoritesOnly && baseSongs.length === 0;

  const q = songQuery.trim().toLowerCase();
  const filteredSongs = q
    ? baseSongs.filter(song => {
      const haystack = [song.title, song.meta.artist ?? '', song.meta.language, ...song.meta.tags]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    })
    : baseSongs;

  const selectedBaseSong = selectedSongId === 'free' ? undefined : getSongById(selectedSongId);
  const songsForSelect =
    (q || favoritesOnly) && selectedBaseSong && !filteredSongs.some(s => s.id === selectedBaseSong.id)
      ? [selectedBaseSong, ...filteredSongs]
      : filteredSongs;

  const selectedIsFavorite = selectedSongId !== 'free' && favoriteSongIds.has(selectedSongId);

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

        {!error && (isStarting || isReady) ? (
          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            {isStarting ? 'Starting microphone…' : 'Listening…'}
          </div>
        ) : null}

        {error && (
          <div className="mb-6 w-full space-y-2">
            <div
              role="alert"
              aria-live="polite"
              aria-atomic="true"
              className="flex items-center justify-center gap-3 text-rose-600 bg-rose-50 border border-rose-100 p-4 rounded-xl w-full shadow-sm"
            >
              <Activity size={20} />
              <span className="text-sm font-medium">{error}</span>
              <button
                type="button"
                onClick={() => startAudio()}
                className="ml-2 text-xs font-bold px-3 py-1 rounded-lg border border-rose-200 bg-white/70 hover:bg-white text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-rose-50"
                aria-label="Retry microphone"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={() => setShowMicHelp(v => !v)}
                className="text-xs font-bold underline underline-offset-2 decoration-rose-300 hover:decoration-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-rose-50 rounded"
                aria-label={showMicHelp ? 'Hide microphone troubleshooting' : 'Show microphone troubleshooting'}
                aria-expanded={showMicHelp}
                aria-controls="mic-troubleshooting"
              >
                {showMicHelp ? 'Hide help' : 'Troubleshoot'}
              </button>
            </div>

            {showMicHelp ? (
              <div
                id="mic-troubleshooting"
                role="region"
                aria-label="Microphone troubleshooting"
                className="text-xs text-slate-600 bg-white/70 backdrop-blur border border-slate-100 rounded-xl p-4"
              >
                <ul className="list-disc pl-5 space-y-1">
                  {MIC_TROUBLESHOOTING_TIPS.map(tip => (
                    <li key={tip.label}>
                      <span className="font-semibold">{tip.label}:</span>{' '}
                      {tip.text.includes('http://localhost') ? (() => {
                        const parts = tip.text.split('http://localhost');
                        return (
                          <>
                            {parts[0]}
                            <code className="font-mono">http://localhost</code>
                            {parts[1]}
                          </>
                        );
                      })() : (
                        tip.text
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
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
                aria-label="Start session (enable microphone)"
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

                {/* 1. Song Search + Selection (Flexible) */}
                <div className="flex flex-col gap-2 flex-grow md:flex-grow-[2] min-w-[200px]">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <Search size={16} />
                    </div>
                    <input
                      value={songQuery}
                      onChange={e => setSongQuery(e.target.value)}
                      placeholder="Search songs (title / artist / tags)…"
                      aria-label="Search songs"
                      className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white pl-11 pr-4 py-2.5 rounded-2xl text-sm font-semibold text-slate-700 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-rose-200 focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-all outline-none"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 pointer-events-none">
                      <ListMusic size={18} />
                    </div>
                    <select
                      value={selectedSongId}
                      onChange={handleSongChange}
                      aria-label="Select song"
                      className="w-full appearance-none bg-slate-50 hover:bg-slate-100 focus:bg-white pl-12 pr-10 py-3 md:py-3.5 rounded-2xl text-sm font-bold text-slate-700 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-rose-200 focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white cursor-pointer transition-all outline-none"
                    >
                      {songsForSelect.length === 0 && songQuery.trim() ? (
                        <option value="" disabled>
                          No matching songs
                        </option>
                      ) : null}
                      {songsForSelect.map(song => (
                        <option key={song.id} value={song.id}>
                          {(song.meta.emoji ? `${song.meta.emoji} ` : '') + song.title + (song.meta.artist ? ` — ${song.meta.artist}` : '')}
                        </option>
                      ))}
                      <option value="free">🎤 Free Style Mode</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>

                  {selectedSongId !== 'free' && currentSongRange ? (
                    <div className="px-1 -mt-0.5">
                      <p className="text-[11px] font-semibold text-slate-400">
                        Range: {midiToNoteName(currentSongRange.midiMin)}–{midiToNoteName(currentSongRange.midiMax)}
                      </p>
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between gap-2 px-1">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={favoritesOnly}
                        onChange={e => setFavoritesOnly(e.target.checked)}
                        aria-label="Show favorites only"
                        className="h-4 w-4 rounded border-slate-300 text-rose-500 focus:ring-rose-200"
                      />
                      Favorites only
                    </label>

                    <button
                      type="button"
                      onClick={toggleFavoriteForSelectedSong}
                      disabled={selectedSongId === 'free'}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                        selectedSongId === 'free'
                          ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                          : selectedIsFavorite
                            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                      }`}
                      title={selectedSongId === 'free' ? 'Favorites not available in Free Style mode' : selectedIsFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      aria-label={
                        selectedSongId === 'free'
                          ? 'Favorites not available in Free Style mode'
                          : selectedIsFavorite
                            ? 'Remove selected song from favorites'
                            : 'Add selected song to favorites'
                      }
                    >
                      <Star size={14} className={selectedIsFavorite ? 'fill-current' : ''} />
                      {selectedIsFavorite ? 'Saved' : 'Save'}
                    </button>
                  </div>

                  {showFavoritesEmptyHint ? (
                    <div className="px-1 -mt-1">
                      <p className="text-[11px] font-semibold text-slate-400">No favorites yet — save a song</p>
                    </div>
                  ) : null}
                </div>

                {/* Divider for Desktop */}
                <div className="hidden md:block w-px h-8 bg-slate-200 mx-1"></div>

                {/* 2. Controls Group */}
                <div className="flex items-center gap-2 flex-grow md:flex-grow-[3] justify-between md:justify-start">

                  {selectedSongId !== 'free' && (
                    <button
                      onClick={toggleSong}
                      className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${isPlayingSong ? 'bg-rose-500 text-white shadow-rose-200 hover:bg-rose-600' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                    >
                      {isPlayingSong ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                      <span>{isPlayingSong ? 'STOP' : 'PLAY'}</span>
                    </button>
                  )}

                  {isPlayingSong && selectedSongId !== 'free' && (
                    <button
                      onClick={() => setUseLowOctave(!useLowOctave)}
                      className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-semibold text-xs transition-all border animate-in fade-in slide-in-from-left-2 duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${useLowOctave ? 'bg-indigo-50 text-indigo-600 border-indigo-200 ring-2 ring-indigo-100' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
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
                    aria-label="End session (stop microphone)"
                    className="md:ml-auto group flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 text-xs font-bold hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all cursor-pointer whitespace-nowrap active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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
