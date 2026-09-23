import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2, VolumeX, Play, Pause, SkipForward, Sparkles } from 'lucide-react';

const MUSIC_TRACKS = [
  {
    title: "Soft Romantic Birthday Instrumental",
    artist: "Romantic Melodies",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3",
  },
  {
    title: "Happy Birthday Piano Grace",
    artist: "Celebration Beats",
    url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73562.mp3?filename=happy-birthday-to-you-piano-version-13909.mp3",
  },
];

export default function MusicPlayer({ musicPath, isAutoPlayTriggered }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const audioRef = useRef(null);

  const activeTrackUrl = musicPath || MUSIC_TRACKS[currentTrackIndex].url;

  useEffect(() => {
    audioRef.current = new Audio(activeTrackUrl);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [activeTrackUrl]);

  useEffect(() => {
    if (isAutoPlayTriggered && audioRef.current && !isPlaying) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Browser prevented autoplay without click
          setIsPlaying(false);
        });
    }
  }, [isAutoPlayTriggered]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log('Audio play error:', e));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const nextTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const nextIdx = (currentTrackIndex + 1) % MUSIC_TRACKS.length;
    setCurrentTrackIndex(nextIdx);
    setIsPlaying(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="mb-3 glass-card p-4 rounded-2xl border border-pink-500/40 shadow-2xl w-64 text-left backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-pink-300 flex items-center gap-1">
                <Music size={12} /> Background Music
              </span>
              <span className="text-[10px] text-purple-300/70">
                {isPlaying ? 'Playing 🎵' : 'Paused ⏸️'}
              </span>
            </div>

            <p className="text-xs font-semibold text-white truncate">
              {MUSIC_TRACKS[currentTrackIndex].title}
            </p>
            <p className="text-[10px] text-purple-200/70 truncate mb-3">
              {MUSIC_TRACKS[currentTrackIndex].artist}
            </p>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-pink-500/20">
              <button
                onClick={togglePlay}
                className="p-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
              </button>

              <button
                onClick={toggleMute}
                className="p-2 rounded-full bg-white/10 text-purple-200 hover:text-white transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>

              <button
                onClick={nextTrack}
                className="p-2 rounded-full bg-white/10 text-purple-200 hover:text-white transition-colors cursor-pointer"
                title="Next Track"
              >
                <SkipForward size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (!expanded) {
            setExpanded(true);
            if (!isPlaying) togglePlay();
          } else {
            setExpanded(false);
          }
        }}
        className={`p-4 rounded-full glass-card border-2 shadow-2xl flex items-center justify-center gap-2 cursor-pointer transition-all ${
          isPlaying
            ? 'border-pink-400 bg-pink-500/30 text-pink-300 shadow-[0_0_20px_rgba(255,111,174,0.5)]'
            : 'border-purple-400/40 text-purple-200 hover:bg-white/10'
        }`}
        title="Background Music Controls"
      >
        <Music size={22} className={isPlaying ? 'animate-bounce text-pink-300' : ''} />
        {isPlaying && (
          <span className="flex items-center gap-0.5 h-3">
            <span className="w-1 bg-pink-400 animate-pulse h-full rounded-full" />
            <span className="w-1 bg-amber-300 animate-pulse h-2 rounded-full" />
            <span className="w-1 bg-pink-400 animate-pulse h-full rounded-full" />
          </span>
        )}
      </motion.button>
    </div>
  );
}
