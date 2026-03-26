import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onComplete }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onComplete) {
        // Wait for exit animation to complete
        setTimeout(onComplete, 800);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []); // Run only once on mount

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.1,
            filter: "blur(10px)"
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-gradient-to-br from-green-400 via-green-500 to-green-700 overflow-hidden"
        >
          {/* Animated Wheat Emoji Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
            animate={{ 
              scale: [0.5, 1.3, 1],
              opacity: 1,
              rotate: [0, -10, 10, 0],
            }}
            transition={{ 
              duration: 1.5,
              ease: "easeOut",
              times: [0, 0.6, 0.8, 1],
              scale: { type: "spring", stiffness: 200, damping: 15 }
            }}
            className="text-9xl mb-10 relative cursor-default select-none"
          >
            <span role="img" aria-label="wheat">🌾</span>
            
            {/* Soft Glow Effect */}
            <motion.div
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ 
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-yellow-200 blur-3xl -z-10 rounded-full"
            />
          </motion.div>

          {/* App Name with Fade-in and Slide-up */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="text-6xl font-extrabold text-white tracking-tight drop-shadow-2xl">
              FarmFresh
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-green-50 text-xl mt-2 font-medium tracking-wide opacity-80"
            >
              Directly from farmers to you
            </motion.p>
          </motion.div>

          {/* Premium Loading Indicator */}
          <div className="absolute bottom-20 flex flex-col items-center">
            <div className="flex space-x-3">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 bg-white rounded-full shadow-lg"
                  animate={{ 
                    y: [0, -15, 0],
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 1.5 }}
              className="text-white text-xs mt-6 font-bold tracking-[0.3em] uppercase"
            >
              Initializing...
            </motion.p>
          </div>

          {/* Background Decorative Elements */}
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-20 -right-20 w-96 h-96 bg-green-300 opacity-10 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              rotate: -360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-20 -left-20 w-80 h-80 bg-green-200 opacity-10 rounded-full blur-3xl"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
