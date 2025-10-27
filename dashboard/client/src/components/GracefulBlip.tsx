import { motion } from "framer-motion";

interface GracefulBlipProps {
  type: "gain" | "loss";
}

export function GracefulBlip({ type }: GracefulBlipProps) {
  const isGain = type === "gain";
  
  return (
    <>
      {/* Subtle expanding glow */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 2.5, opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute inset-0 rounded-lg ${
          isGain ? "bg-green-400/10" : "bg-red-400/10"
        }`}
        style={{
          filter: "blur(20px)",
        }}
      />
      
      {/* Elegant border pulse */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, times: [0, 0.3, 1], ease: "easeInOut" }}
        className={`absolute inset-0 rounded-lg border-2 ${
          isGain ? "border-green-400/50" : "border-red-400/50"
        }`}
        style={{
          boxShadow: isGain 
            ? "0 0 30px rgba(34, 197, 94, 0.3)" 
            : "0 0 30px rgba(239, 68, 68, 0.3)",
        }}
      />
      
      {/* Large floating indicator - right-aligned */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, x: 20 }}
        animate={{ 
          opacity: [0, 1, 0.9, 0],
          scale: [0.5, 1.1, 1, 0.95],
          x: [20, 0, 0, -10]
        }}
        exit={{ opacity: 0 }}
        transition={{ 
          duration: 1.5, 
          times: [0, 0.2, 0.7, 1],
          ease: [0.16, 1, 0.3, 1]
        }}
        className={`absolute top-1/2 right-4 -translate-y-1/2 font-bold metric-value ${
          isGain ? "text-green-400" : "text-red-400"
        }`}
        style={{
          fontSize: "clamp(3rem, 12vw, 5rem)",
          lineHeight: 1,
          textShadow: isGain 
            ? "0 0 30px rgba(34, 197, 94, 0.8), 0 0 60px rgba(34, 197, 94, 0.4)" 
            : "0 0 30px rgba(239, 68, 68, 0.8), 0 0 60px rgba(239, 68, 68, 0.4)",
        }}
      >
        {isGain ? "+1" : "-1"}
      </motion.div>
      
      {/* Subtle shimmer effect */}
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: "200%", opacity: [0, 0.3, 0] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute inset-0 rounded-lg overflow-hidden"
      >
        <div 
          className={`h-full w-1/3 ${
            isGain ? "bg-green-400/20" : "bg-red-400/20"
          }`}
          style={{
            filter: "blur(15px)",
            transform: "skewX(-20deg)",
          }}
        />
      </motion.div>
    </>
  );
}

