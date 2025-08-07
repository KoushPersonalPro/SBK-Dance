"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Play, X } from 'lucide-react';

const LampGame = () => {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [lamps, setLamps] = useState<{ id: number; x: number; y: number; rotation: number }[]>([]);
  const [celebration, setCelebration] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const containerRef = useRef<HTMLDivElement>(null);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setCelebration(false);
    setTimeLeft(30);
    setLamps([]);
  };

  const spawnLamp = () => {
    if (!containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const lampSize = 80;
    const maxWidth = container.width - lampSize;
    const maxHeight = container.height - lampSize;

    const newLamp = {
      id: Date.now(),
      x: Math.random() * maxWidth,
      y: Math.random() * maxHeight,
      rotation: Math.random() * 360,
    };

    setLamps((prev) => [...prev, newLamp]);
    setTimeout(() => {
      setLamps((prev) => prev.filter((lamp) => lamp.id !== newLamp.id));
    }, 2000);
  };

  const lightLamp = (lampId: number) => {
    setLamps((prev) => prev.filter((lamp) => lamp.id !== lampId));
    setScore((prev) => {
      const newScore = prev + 1;
      if (newScore > highScore) {
        setHighScore(newScore);
      }
      return newScore;
    });
  };

  const closeCelebration = () => {
    setCelebration(false);
  };

  useEffect(() => {
    let gameInterval: NodeJS.Timeout;
    let timerInterval: NodeJS.Timeout;

    if (gameStarted) {
      gameInterval = setInterval(spawnLamp, 1000);
      timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameStarted(false);
            setCelebration(true);
            clearInterval(gameInterval);
            clearInterval(timerInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(gameInterval);
      clearInterval(timerInterval);
    };
  }, [gameStarted]);

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-[200] text-black mb-4 flex items-center justify-center gap-3">
            Light the Lamps 
            <motion.span 
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🪔
            </motion.span>
          </h1>
          <p className="text-xl text-gray-600 font-[300]">Click the lamps before they disappear!</p>
        </motion.div>

        {!gameStarted && !celebration ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <button
              onClick={startGame}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-[300] text-white bg-black rounded-full overflow-hidden shadow-xl transition-all duration-300 hover:bg-black/90"
            >
              <Play className="mr-2 h-6 w-6" />
              Start Game
              <motion.div
                className="absolute inset-0 bg-white opacity-0"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.5, opacity: 0.1 }}
                transition={{ duration: 0.4 }}
              />
            </button>
            {highScore > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-black flex items-center justify-center font-[300]"
              >
                <Trophy className="mr-2 h-5 w-5" />
                High Score: {highScore}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div className="relative">
            <div className="absolute top-4 left-4 z-10 flex items-center space-x-4">
              <div className="bg-black text-white rounded-full px-4 py-2 font-[300]">
                Score: {score}
              </div>
              <div className="bg-black text-white rounded-full px-4 py-2 font-[300]">
                Time: {timeLeft}s
              </div>
            </div>

            <motion.div
              ref={containerRef}
              className="relative h-[500px] bg-gray-50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden border border-black/[0.05]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <AnimatePresence>
                {lamps.map((lamp) => (
                  <motion.div
                    key={lamp.id}
                    initial={{ scale: 0, opacity: 0, rotate: lamp.rotation }}
                    animate={{ scale: 1, opacity: 1, rotate: lamp.rotation }}
                    exit={{ scale: 0, opacity: 0 }}
                    style={{ position: "absolute", left: lamp.x, top: lamp.y }}
                    className="cursor-pointer transform-gpu"
                    onClick={() => lightLamp(lamp.id)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="relative w-20 h-20"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                          src="/lamp.png"
                          alt="Lamp"
                          width={80}
                          height={80}
                          className="drop-shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                      <motion.div
                        className="absolute -inset-2"
                        animate={{
                          boxShadow: [
                            "0 0 20px rgba(0,0,0,0.1)",
                            "0 0 30px rgba(0,0,0,0.2)",
                            "0 0 20px rgba(0,0,0,0.1)",
                          ],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute inset-0 bg-yellow-400/20 rounded-full"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ 
                          scale: [0.8, 1.2, 0.8],
                          opacity: [0, 0.2, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

        <AnimatePresence>
          {celebration && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50"
            >
              <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-4 relative border border-black/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                <button
                  onClick={closeCelebration}
                  className="absolute top-4 right-4 text-black hover:opacity-70 transition-opacity"
                >
                  <X className="h-6 w-6" />
                </button>
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="inline-block mb-4"
                >
                  <Trophy className="h-16 w-16 text-black" />
                </motion.div>
                <h2 className="text-3xl font-[200] text-black mb-4">
                  Game Over!
                </h2>
                <p className="text-xl text-gray-600 mb-6 font-[300]">
                  You lit {score} lamps!
                  {score > highScore && (
                    <div className="text-black mt-2 font-[300]">New High Score! ✨</div>
                  )}
                </p>
                <button
                  onClick={startGame}
                  className="bg-black text-white px-6 py-3 rounded-full font-[300] hover:bg-black/90 transition-all duration-300"
                >
                  Play Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LampGame;