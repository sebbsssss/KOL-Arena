import { motion } from "framer-motion";

/**
 * Collection of different blip animation styles
 * Choose the one that fits your aesthetic preference
 */

// Style 1: Expanding Ring + Floating Number (Current)
export const BlipStyle1 = ({ type }: { type: "gain" | "loss" }) => {
  const isGain = type === "gain";
  return (
    <>
      {/* Expanding ring effect */}
      <motion.div
        initial={{ scale: 0, opacity: 0.8 }}
        animate={{ scale: 3, opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-4 ${
          isGain ? "border-green-500" : "border-red-500"
        }`}
      />
      
      {/* Center pulse */}
      <motion.div
        initial={{ scale: 0.5, opacity: 1 }}
        animate={{ scale: 1.2, opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full ${
          isGain ? "bg-green-500/30" : "bg-red-500/30"
        }`}
      />
      
      {/* Floating indicator */}
      <motion.div
        initial={{ y: 0, opacity: 1, scale: 1 }}
        animate={{ y: -40, opacity: 0, scale: 1.5 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold ${
          isGain ? "text-green-500" : "text-red-500"
        }`}
      >
        {isGain ? "+1" : "-1"}
      </motion.div>
    </>
  );
};

// Style 2: Confetti Burst (Celebratory)
export const BlipStyle2 = ({ type }: { type: "gain" | "loss" }) => {
  const isGain = type === "gain";
  const particles = Array.from({ length: 8 });
  
  return (
    <>
      {/* Particle burst */}
      {particles.map((_, i) => {
        const angle = (i * 360) / particles.length;
        const distance = 60;
        const x = Math.cos((angle * Math.PI) / 180) * distance;
        const y = Math.sin((angle * Math.PI) / 180) * distance;
        
        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x, y, opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full ${
              isGain ? "bg-green-500" : "bg-red-500"
            }`}
          />
        );
      })}
      
      {/* Center flash */}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 2, opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full ${
          isGain ? "bg-green-400" : "bg-red-400"
        }`}
      />
      
      {/* Number */}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 1.5, opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold ${
          isGain ? "text-green-500" : "text-red-500"
        }`}
      >
        {isGain ? "+1" : "-1"}
      </motion.div>
    </>
  );
};

// Style 3: Corner Badge (Subtle but Clear)
export const BlipStyle3 = ({ type }: { type: "gain" | "loss" }) => {
  const isGain = type === "gain";
  
  return (
    <>
      {/* Badge in top-right corner */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180, opacity: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
        className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-bold text-white shadow-lg ${
          isGain ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {isGain ? "+1" : "-1"}
      </motion.div>
      
      {/* Glow effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 1, times: [0, 0.5, 1] }}
        className={`absolute inset-0 rounded-lg ${
          isGain ? "bg-green-500/10" : "bg-red-500/10"
        }`}
      />
    </>
  );
};

// Style 4: Ripple Wave (Smooth and Elegant)
export const BlipStyle4 = ({ type }: { type: "gain" | "loss" }) => {
  const isGain = type === "gain";
  
  return (
    <>
      {/* Multiple ripple waves */}
      {[0, 0.2, 0.4].map((delay, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{ scale: 2.5, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 ${
            isGain ? "border-green-400" : "border-red-400"
          }`}
        />
      ))}
      
      {/* Center icon */}
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.4, type: "spring" }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl ${
          isGain ? "text-green-500" : "text-red-500"
        }`}
      >
        {isGain ? "↑" : "↓"}
      </motion.div>
    </>
  );
};

// Style 5: Neon Flash (Modern and Bold)
export const BlipStyle5 = ({ type }: { type: "gain" | "loss" }) => {
  const isGain = type === "gain";
  
  return (
    <>
      {/* Neon glow background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: [0, 1, 0], scale: [0.9, 1.05, 1] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, times: [0, 0.3, 1] }}
        className={`absolute inset-0 rounded-lg blur-sm ${
          isGain ? "bg-green-500/40" : "bg-red-500/40"
        }`}
      />
      
      {/* Border flash */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, times: [0, 0.4, 1] }}
        className={`absolute inset-0 rounded-lg border-2 ${
          isGain ? "border-green-400" : "border-red-400"
        }`}
      />
      
      {/* Floating text */}
      <motion.div
        initial={{ y: 10, opacity: 0, scale: 0.5 }}
        animate={{ y: -30, opacity: [0, 1, 0], scale: 1.5 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 text-3xl font-black ${
          isGain ? "text-green-400" : "text-red-400"
        }`}
        style={{ textShadow: isGain ? "0 0 20px rgba(34, 197, 94, 0.8)" : "0 0 20px rgba(239, 68, 68, 0.8)" }}
      >
        {isGain ? "+1" : "-1"}
      </motion.div>
    </>
  );
};

// Style 6: Minimal Pulse (Clean and Professional)
export const BlipStyle6 = ({ type }: { type: "gain" | "loss" }) => {
  const isGain = type === "gain";
  
  return (
    <>
      {/* Single expanding circle */}
      <motion.div
        initial={{ scale: 0, opacity: 0.8 }}
        animate={{ scale: 2, opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full ${
          isGain ? "bg-green-500/20" : "bg-red-500/20"
        }`}
      />
      
      {/* Small indicator */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.5, times: [0, 0.6, 1] }}
        className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
          isGain ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {isGain ? "+" : "-"}
      </motion.div>
    </>
  );
};

