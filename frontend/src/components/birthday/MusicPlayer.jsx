import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

export default function MusicPlayer({ musicPath, isAutoPlayTriggered }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [hasInteracted, setHasInteracted] = useState(false);

  const defaultMusic = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-ambient-112282.mp3';
  const audioSrc = musicPath || defaultMusic;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isAutoPlayTriggered && audioRef.current && !hasInteracted) {
      setHasInteracted(true);
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log('Autoplay prevented by browser:', err));
    }
  }, [isAutoPlayTriggered, hasInteracted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log('Audio playback error:', err));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      if (val === 0) setIsMuted(true);
      else setIsMuted(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <audio 
        ref={audioRef}
        src={audioSrc}
        loop
        preload="auto"
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-3 rounded-full border border-pink-500/30 shadow-2xl flex items-center gap-3 bg-purple-950/80 backdrop-blur-xl"
      >
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>

        <div className="hidden sm:flex flex-col text-left pr-2">
          <span className="text-[10px] uppercase font-bold text-pink-300 tracking-wider flex items-center gap-1">
            <Music size={10} className={isPlaying ? 'animate-bounce' : ''} />
            <span>Birthday Music</span>
          </span>
          <span className="text-xs text-white font-medium max-w-[120px] truncate">
            {isPlaying ? 'Playing Romantic Bliss' : 'Background Music'}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 border-l border-white/10 pl-3">
          <button onClick={toggleMute} className="text-purple-200 hover:text-white cursor-pointer">
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-purple-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
        </div>
      </motion.div>
    </div>
  );
}
