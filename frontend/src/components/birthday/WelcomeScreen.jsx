import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Scissors, ArrowRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WelcomeScreen({ birthdayName = "My Girl", headline, onOpenSurprise }) {
  // Screen state: 1 = SEAL.EXE, 2 = PARTY.EXE, 3 = CAKE.EXE (Cut), 4 = CAKE.EXE (Cut Complete)
  const [screen, setScreen] = useState(1);

  // --- SCREEN 1: SEAL.EXE STATE ---
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef(null);
  const HOLD_DURATION = 1500; // 1.5 seconds hold duration

  useEffect(() => {
    if (isHolding && screen === 1) {
      const startTime = Date.now();
      const initialProgress = progress;

      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min(100, initialProgress + (elapsed / HOLD_DURATION) * 100);
        setProgress(newProgress);

        if (newProgress >= 100) {
          clearInterval(timerRef.current);
          setIsHolding(false);
          // Trigger confetti burst on seal open
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.5 }
          });
          // Transition to Screen 2 (PARTY.EXE)
          setTimeout(() => {
            setScreen(2);
          }, 300);
        }
      }, 20);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (screen === 1 && progress < 100) {
        const resetInterval = setInterval(() => {
          setProgress(prev => {
            if (prev <= 0) {
              clearInterval(resetInterval);
              return 0;
            }
            return Math.max(0, prev - 12);
          });
        }, 20);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHolding, screen]);

  const handleHoldStart = (e) => {
    e.preventDefault();
    if (screen !== 1) return;
    setIsHolding(true);
  };

  const handleHoldEnd = () => {
    if (screen !== 1) return;
    setIsHolding(false);
  };

  // SVG Radial Progress Circle math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // --- SCREEN 3: CAKE CUTTING DRAG physics ---
  const [slicePoints, setSlicePoints] = useState([]);
  const [isSlicing, setIsSlicing] = useState(false);
  const [sliceCompleted, setSliceCompleted] = useState(false);
  const cakeBoxRef = useRef(null);

  const handleSliceStart = (e) => {
    if (screen !== 3 || sliceCompleted) return;
    setIsSlicing(true);
    const pos = getPos(e);
    if (pos) setSlicePoints([pos]);
  };

  const handleSliceMove = (e) => {
    if (!isSlicing || screen !== 3 || sliceCompleted) return;
    const pos = getPos(e);
    if (!pos) return;

    setSlicePoints(prev => {
      const next = [...prev, pos];
      // Check total swipe distance
      let totalDist = 0;
      for (let i = 1; i < next.length; i++) {
        const dx = next[i].x - next[i - 1].x;
        const dy = next[i].y - next[i - 1].y;
        totalDist += Math.sqrt(dx * dx + dy * dy);
      }

      if (totalDist > 140 && !sliceCompleted) {
        triggerSliceSuccess();
      }
      return next;
    });
  };

  const handleSliceEnd = () => {
    setIsSlicing(false);
  };

  const getPos = (e) => {
    if (!cakeBoxRef.current) return null;
    const rect = cakeBoxRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const triggerSliceSuccess = () => {
    setSliceCompleted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Move to Screen 4 (CAKE.EXE - Sliced & Wish Complete) after a short cut effect
    setTimeout(() => {
      setScreen(4);
    }, 600);
  };

  const handleNextToThankYou = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 }
    });
    if (onOpenSurprise) {
      onOpenSurprise();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-[#2D0A1E] via-[#1F0715] to-[#4A122E] overflow-hidden select-none font-mono"
    >
      {/* Background Animated Bokeh Lights */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#FF4D8D]/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-[#FFD166]/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Retro Window Modal Container */}
      <motion.div
        key={screen}
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: -15 }}
        transition={{ duration: 0.4 }}
        className="relative max-w-md w-full rounded-2xl bg-[#FFFDF6] border-4 border-[#3D0C22] shadow-[0_20px_60px_rgba(61,12,34,0.6)] overflow-hidden z-50"
      >
        {/* Retro Header Bar */}
        <div className="bg-[#FF4D8D] border-b-4 border-[#3D0C22] px-4 py-3 flex items-center justify-between font-extrabold text-[#3D0C22]">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 border-2 border-[#3D0C22] bg-[#FFF0F5] rounded-xs" />
            <div className="w-3.5 h-3.5 border-2 border-[#3D0C22] bg-[#FFF0F5] rounded-xs" />
            <div className="w-3.5 h-3.5 border-2 border-[#3D0C22] bg-[#FFF0F5] rounded-xs" />
          </div>

          <span className="tracking-[0.2em] text-xs md:text-sm uppercase font-extrabold">
            {screen === 1 && "SEAL.EXE"}
            {screen === 2 && "PARTY.EXE"}
            {screen === 3 && "CAKE.EXE"}
            {screen === 4 && "CAKE.EXE"}
          </span>
        </div>

        {/* ========================================================================= */}
        {/* SCREEN 1: SEAL.EXE (Entrance / Hold Me Screen)                           */}
        {/* ========================================================================= */}
        {screen === 1 && (
          <div className="relative min-h-[460px] bg-gradient-to-b from-[#8B2D57] via-[#A84A74] to-[#6E1C40] p-6 flex flex-col items-center justify-between overflow-hidden">
            {/* Velvet Curtain Stage Borders */}
            <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#5C1030] to-[#8B2D57] border-b-4 border-[#FFD166] shadow-md z-30 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FFD166] to-[#FFF3BF] shadow-lg border-2 border-[#3D0C22] -mb-10 flex items-center justify-center">
                <Sparkles size={12} className="text-[#3D0C22]" />
              </div>
            </div>

            {/* Left Velvet Curtain Frame */}
            <div className="absolute inset-y-0 left-0 w-8 md:w-12 bg-gradient-to-r from-[#5C1030] via-[#8B2D57] to-[#70163C] border-r-2 border-[#FFD166]/40 shadow-xl z-20" />
            
            {/* Right Velvet Curtain Frame */}
            <div className="absolute inset-y-0 right-0 w-8 md:w-12 bg-gradient-to-l from-[#5C1030] via-[#8B2D57] to-[#70163C] border-l-2 border-[#FFD166]/40 shadow-xl z-20" />

            {/* Center Gold Ribbon Line */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2.5 bg-gradient-to-b from-[#FFD166] via-[#FFE58F] to-[#FFD166] shadow-md z-25" />

            {/* Center Interactive Seal Area */}
            <div className="relative z-30 my-auto flex flex-col items-center pt-8">
              {/* Radial Progress Ring & HOLD ME Seal */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    className="stroke-[#5C1030]"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    className="stroke-[#FFD166] transition-all duration-75 ease-out"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                {/* Interactive Wax Seal HOLD ME Button */}
                <motion.button
                  onMouseDown={handleHoldStart}
                  onMouseUp={handleHoldEnd}
                  onMouseLeave={handleHoldEnd}
                  onTouchStart={handleHoldStart}
                  onTouchEnd={handleHoldEnd}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={isHolding ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                  transition={{ duration: 0.4, repeat: isHolding ? Infinity : 0 }}
                  className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-[#E879F9] via-[#F472B6] to-[#FCE7F3] border-4 border-[#3D0C22] shadow-[0_8px_25px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center text-[#3D0C22] cursor-pointer"
                >
                  <Heart className="fill-[#3D0C22] text-[#3D0C22] mb-1 animate-pulse" size={24} />
                  <span className="text-xs font-extrabold tracking-widest uppercase">
                    HOLD ME
                  </span>
                  <span className="text-[10px] font-bold text-[#3D0C22]/80 mt-0.5">
                    {Math.round(progress)}%
                  </span>
                </motion.button>
              </div>

              {/* Instruction Banner Box */}
              <motion.div 
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mt-6 px-5 py-3 rounded-xl bg-[#FFF0F5] border-3 border-[#3D0C22] shadow-[4px_4px_0px_#3D0C22] text-[#3D0C22] text-xs md:text-sm font-extrabold tracking-wide uppercase text-center"
              >
                Don't let go until it opens!
              </motion.div>
            </div>

            {/* Bottom Subtext */}
            <div className="relative z-30 text-[11px] text-[#FFE58F] font-bold tracking-widest uppercase text-center">
              SEAL.EXE • Hold to unlock surprise
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: PARTY.EXE (Surprise Intro Screen)                              */}
        {/* ========================================================================= */}
        {screen === 2 && (
          <div className="relative p-6 md:p-8 flex flex-col items-center text-center bg-[#FFFDF6]">
            {/* 4 Decorative Corner Circles */}
            <div className="absolute top-3 left-3 w-3 h-3 rounded-full border-2 border-[#3D0C22]" />
            <div className="absolute top-3 right-3 w-3 h-3 rounded-full border-2 border-[#3D0C22]" />
            <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full border-2 border-[#3D0C22]" />
            <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full border-2 border-[#3D0C22]" />

            {/* Animated Cute Party Cat SVG Graphic */}
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-44 h-40 flex items-center justify-center mb-4"
            >
              <svg className="w-full h-full drop-shadow-md" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background Sparkles & Fireworks */}
                <path d="M30 30L34 40L44 44L34 48L30 58L26 48L16 44L26 40Z" fill="#F472B6"/>
                <path d="M165 40L168 47L175 50L168 53L165 60L162 53L155 50L162 47Z" fill="#38BDF8"/>
                <path d="M140 20L142 24L147 26L142 28L140 32L138 28L133 26L138 24Z" fill="#FBBF24"/>

                {/* Cat Tail */}
                <path d="M60 140C40 140 30 110 45 100" stroke="#3D0C22" strokeWidth="8" strokeLinecap="round" fill="none"/>
                
                {/* Cat Body */}
                <ellipse cx="100" cy="120" rx="35" ry="25" fill="#E5E7EB" stroke="#3D0C22" strokeWidth="5"/>
                
                {/* Cat Head */}
                <ellipse cx="100" cy="85" rx="36" ry="30" fill="#FFFFFF" stroke="#3D0C22" strokeWidth="5"/>

                {/* Cat Ears */}
                <path d="M72 65L62 38L85 58Z" fill="#E5E7EB" stroke="#3D0C22" strokeWidth="4"/>
                <path d="M75 62L68 44L83 56Z" fill="#F472B6"/>

                <path d="M128 65L138 38L115 58Z" fill="#E5E7EB" stroke="#3D0C22" strokeWidth="4"/>
                <path d="M125 62L132 44L117 56Z" fill="#F472B6"/>

                {/* Party Hat */}
                <path d="M90 60L100 18L110 60Z" fill="#38BDF8" stroke="#3D0C22" strokeWidth="4"/>
                <path d="M94 48L106 42" stroke="#FFFFFF" strokeWidth="4"/>
                <path d="M92 34L108 28" stroke="#FFFFFF" strokeWidth="4"/>
                <circle cx="100" cy="16" r="6" fill="#FBBF24" stroke="#3D0C22" strokeWidth="3"/>

                {/* Face Details */}
                <path d="M82 82C82 82 86 78 90 82" stroke="#3D0C22" strokeWidth="3.5" strokeLinecap="round"/>
                <circle cx="112" cy="82" r="3.5" fill="#3D0C22"/>

                {/* Cheeks */}
                <circle cx="78" cy="88" r="5" fill="#F472B6" opacity="0.6"/>
                <circle cx="122" cy="88" r="5" fill="#F472B6" opacity="0.6"/>

                {/* Cute Nose & Mouth */}
                <ellipse cx="100" cy="86" rx="2" ry="1.5" fill="#3D0C22"/>
                <path d="M100 87.5C98 91 96 90 94 88" stroke="#3D0C22" strokeWidth="2.5" strokeLinecap="round"/>

                {/* Bow Tie */}
                <path d="M90 102C82 96 82 108 90 104Z" fill="#FF4D8D" stroke="#3D0C22" strokeWidth="3"/>
                <path d="M110 102C118 96 118 108 110 104Z" fill="#FF4D8D" stroke="#3D0C22" strokeWidth="3"/>
                <circle cx="100" cy="103" r="4" fill="#FF4D8D" stroke="#3D0C22" strokeWidth="3"/>

                {/* Birthday Cake in Paws */}
                <ellipse cx="120" cy="142" rx="26" ry="7" fill="#38BDF8" stroke="#3D0C22" strokeWidth="3"/>
                <rect x="96" y="115" width="48" height="24" rx="4" fill="#F472B6" stroke="#3D0C22" strokeWidth="4"/>
                <path d="M96 119C99 125 103 125 106 119C109 125 113 125 116 119C119 125 123 125 126 119C129 125 133 125 136 119C139 125 142 125 144 119" fill="#FFF0F5" stroke="#3D0C22" strokeWidth="3"/>
                
                {/* Cake Candle & Flame */}
                <rect x="118" y="103" width="4" height="13" fill="#FBBF24" stroke="#3D0C22" strokeWidth="2"/>
                <path d="M120 98C123 93 123 90 120 86C117 90 117 93 120 98Z" fill="#F59E0B"/>
                <path d="M120 78L120 84M112 86L116 88M128 86L124 88M114 78L117 81M126 78L123 81" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </motion.div>

            {/* Main Required Prompt Text */}
            <h1 className="text-xl md:text-2xl font-extrabold text-[#FF4D8D] mb-3 leading-snug">
              My girl was born 24 years ago today! ✨
            </h1>

            {/* Subtext */}
            <p className="text-sm font-bold text-[#3D0C22] mb-6 flex items-center justify-center gap-1 flex-wrap">
              <span>Yes, it's YOU! A little surprise awaits... ✨</span>
            </p>

            {/* Interactive Button: START THE SURPRISE */}
            <motion.button
              onClick={() => setScreen(3)}
              whileHover={{ scale: 1.03, x: -2, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 px-6 rounded-xl bg-[#FF4D8D] text-white font-extrabold text-sm md:text-base tracking-wider uppercase border-3 border-[#3D0C22] shadow-[4px_4px_0px_#3D0C22] hover:shadow-[6px_6px_0px_#3D0C22] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🎁</span>
              <span>START THE SURPRISE</span>
            </motion.button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: CAKE.EXE (Cake Cutting Screen)                                 */}
        {/* ========================================================================= */}
        {screen === 3 && (
          <div className="relative p-6 flex flex-col items-center text-center bg-[#FFFDF6]">
            {/* Prompt Instruction Header */}
            <h2 className="text-base md:text-lg font-extrabold text-[#3D0C22] mb-1">
              Swipe to Cut the Cake! 🎂
            </h2>
            <p className="text-xs text-[#FF4D8D] font-bold mb-4">
              Drag your finger/cursor inside box to slice
            </p>

            {/* Interactive Drag/Cut Box Container */}
            <div 
              ref={cakeBoxRef}
              onMouseDown={handleSliceStart}
              onMouseMove={handleSliceMove}
              onMouseUp={handleSliceEnd}
              onTouchStart={handleSliceStart}
              onTouchMove={handleSliceMove}
              onTouchEnd={handleSliceEnd}
              className="relative w-full h-64 rounded-xl bg-gradient-to-b from-[#FFF0F5] to-[#FCE7F3] border-3 border-dashed border-[#FF4D8D] p-4 flex flex-col items-center justify-center overflow-hidden cursor-crosshair shadow-inner"
            >
              {/* Slicing Knife Gesture Trail SVG Canvas Overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
                {slicePoints.length > 1 && (
                  <polyline
                    points={slicePoints.map(p => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke="#FFD166"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-[0_0_8px_#FFD166]"
                  />
                )}
                {slicePoints.length > 0 && (
                  <circle
                    cx={slicePoints[slicePoints.length - 1].x}
                    cy={slicePoints[slicePoints.length - 1].y}
                    r="8"
                    fill="#FF4D8D"
                    className="animate-ping"
                  />
                )}
              </svg>

              {/* Pixel Art Birthday Cake on Doily SVG Graphic */}
              <div className="relative w-48 h-44 flex flex-col items-center justify-end">
                {/* Lace Doily Base */}
                <div className="w-48 h-6 bg-[#FFFFFF] rounded-full border-2 border-pink-300 shadow-sm flex items-center justify-around overflow-hidden mb-[-8px]">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-3 h-3 rounded-full border border-pink-200 bg-[#FFFDF6]" />
                  ))}
                </div>

                {/* Candles with Lighted Flames */}
                <div className="flex justify-around w-32 mb-1 z-20">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className="relative flex flex-col items-center">
                      <motion.div
                        animate={{ scale: [1, 1.2, 0.9, 1.1], opacity: 1 }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: idx * 0.2 }}
                        className="w-3 h-4 bg-[#FFD166] rounded-t-full shadow-[0_0_10px_#FFD166]"
                      />
                      <div className="w-2.5 h-8 bg-gradient-to-b from-pink-300 to-pink-500 rounded-xs border border-[#3D0C22]" />
                    </div>
                  ))}
                </div>

                {/* Cake Top Layer */}
                <div className="w-36 h-12 bg-[#FF85B3] rounded-t-xl border-3 border-[#3D0C22] relative flex items-center justify-center">
                  <div className="absolute top-0 inset-x-0 h-4 bg-white rounded-t-lg opacity-80" />
                  <span className="text-[10px] font-extrabold text-[#3D0C22] tracking-wider uppercase z-10">
                    MAKE A WISH
                  </span>
                </div>

                {/* Cake Bottom Layer */}
                <div className="w-44 h-16 bg-[#F472B6] rounded-t-md border-3 border-[#3D0C22] border-t-0 relative flex items-center justify-center">
                  <div className="absolute top-0 inset-x-0 h-4 bg-[#FFF0F5] border-b-2 border-[#3D0C22]" />
                  {/* Decorative Frosting Dots */}
                  <div className="flex gap-2 z-10">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#FFD166] border border-[#3D0C22]" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Box Swipe Indicator Overlay */}
              <div className="absolute bottom-2 inset-x-0 text-center pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-[#3D0C22]/80 text-[#FFF0F5] text-[10px] font-bold tracking-widest uppercase">
                  ✂️ Drag across cake to slice
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 4: CAKE.EXE (Cake Cut Complete & Wish Screen)                      */}
        {/* ========================================================================= */}
        {screen === 4 && (
          <div className="relative p-6 md:p-8 flex flex-col items-center text-center bg-[#FFFDF6]">
            {/* Animated Sliced Cake SVG Visual */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-48 h-40 flex items-center justify-center mb-4"
            >
              <svg className="w-full h-full drop-shadow-md" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Lace Doily Base */}
                <ellipse cx="100" cy="135" rx="80" ry="15" fill="#FFFFFF" stroke="#3D0C22" strokeWidth="3"/>
                
                {/* Main Cake (Cut Gap) */}
                <path d="M40 100C40 70 60 60 90 60V120H40V100Z" fill="#FF85B3" stroke="#3D0C22" strokeWidth="4"/>
                <path d="M90 60C120 60 140 70 140 100V120H90V60Z" fill="#F472B6" stroke="#3D0C22" strokeWidth="4"/>

                {/* Sliced Piece Pulling Away */}
                <g transform="translate(25, -10) rotate(-10)">
                  <path d="M120 70L150 90V125L120 105Z" fill="#FF85B3" stroke="#3D0C22" strokeWidth="4"/>
                  <path d="M150 90L175 75V110L150 125Z" fill="#FFE58F" stroke="#3D0C22" strokeWidth="4"/>
                  {/* Strawberry on slice */}
                  <circle cx="140" cy="75" r="7" fill="#FF4D8D" stroke="#3D0C22" strokeWidth="2"/>
                </g>

                {/* Candles Extinguished with Smoke Wisps */}
                <path d="M85 45C80 40 90 35 85 30" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <path d="M115 45C110 40 120 35 115 30" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" fill="none"/>

                {/* Sparkles & Hearts */}
                <path d="M30 40L33 46L40 48L33 50L30 56L27 50L20 48L27 46Z" fill="#FFD166"/>
                <path d="M165 30L167 35L172 37L167 39L165 44L163 39L158 37L163 35Z" fill="#FF4D8D"/>
              </svg>
            </motion.div>

            {/* Cake Cut Complete Main Wish Text */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#FF4D8D] mb-3 leading-tight">
              Happy Birthday, My Girl! 💗
            </h1>

            <p className="text-xs md:text-sm font-bold text-[#3D0C22] mb-6 max-w-xs">
              The cake has been sliced & your wishes are sealed! Next up is your surprise thank you space...
            </p>

            {/* Interactive Button: NEXT -> */}
            <motion.button
              onClick={handleNextToThankYou}
              whileHover={{ scale: 1.04, x: 2 }}
              whileTap={{ scale: 0.96 }}
              className="w-full py-4 px-6 rounded-xl bg-[#FF4D8D] text-white font-extrabold text-base md:text-lg tracking-wider uppercase border-3 border-[#3D0C22] shadow-[4px_4px_0px_#3D0C22] hover:shadow-[6px_6px_0px_#3D0C22] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>NEXT</span>
              <ArrowRight size={22} className="stroke-[3]" />
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

