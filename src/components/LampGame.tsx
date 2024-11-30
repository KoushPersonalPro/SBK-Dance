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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Light the Lamps 
            <span className="ml-2">🪔</span>
          </h1>
          <p className="text-xl text-purple-200">Click the lamps before they disappear!</p>
        </motion.div>

        {!gameStarted && !celebration ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <button
              onClick={startGame}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full overflow-hidden shadow-xl transition-all duration-300 hover:from-yellow-400 hover:to-orange-400"
            >
              <Play className="mr-2 h-6 w-6" />
              Start Game
              <motion.div
                className="absolute inset-0 bg-white opacity-20"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.5, opacity: 0.2 }}
                transition={{ duration: 0.4 }}
              />
            </button>
            {highScore > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-yellow-300 flex items-center justify-center"
              >
                <Trophy className="mr-2 h-5 w-5" />
                High Score: {highScore}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div className="relative">
            <div className="absolute top-4 left-4 z-10 flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
                Score: {score}
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
                Time: {timeLeft}s
              </div>
            </div>

            <motion.div
              ref={containerRef}
              className="relative h-[500px] bg-gradient-to-br from-purple-800/50 to-indigo-800/50 rounded-2xl backdrop-blur-sm shadow-2xl overflow-hidden border border-white/10"
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
                          className="drop-shadow-[0_0_15px_rgba(255,165,0,0.5)]"
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                      <motion.div
                        className="absolute -inset-2"
                        animate={{
                          boxShadow: [
                            "0 0 20px rgba(255,165,0,0.3)",
                            "0 0 30px rgba(255,165,0,0.5)",
                            "0 0 20px rgba(255,165,0,0.3)",
                          ],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
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
              className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
            >
              <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-4 relative">
                <button
                  onClick={closeCelebration}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block mb-4"
                >
                  <Trophy className="h-16 w-16 text-yellow-500" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Game Over!
                </h2>
                <p className="text-xl text-gray-600 mb-6">
                  You lit {score} lamps!
                  {score > highScore && (
                    <div className="text-green-500 mt-2">New High Score! 🎉</div>
                  )}
                </p>
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-500 hover:to-indigo-500 transition-all duration-300"
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