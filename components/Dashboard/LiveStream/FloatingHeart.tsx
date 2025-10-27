"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { PiHeartFill } from "react-icons/pi";

interface FloatingHeartProps {
  id: string | number;
  onComplete: (id: string | number) => void;
}

const FloatingHeart = ({ id, onComplete }: FloatingHeartProps) => {
  const x = Math.random() * 200 - 100; 
  const y = Math.random() * -200 - 100; 
  const scale = Math.random() * 0.5 + 0.5;
  const duration = 1.5 + Math.random() * 0.5;

  const animationProps = {
    initial: { opacity: 1, x: 0, y: 0, scale: 1 },
    animate: { opacity: 0, x, y, scale },
    transition: {
      duration,
      ease: "easeOut",
      opacity: { duration, ease: "linear" },
      y: { duration, ease: "easeOut" },
      x: { duration, ease: [0.1, 0.4, 0.7, 1] },
      scale: { duration, ease: "easeOut" },
    },
  };

  const styles = {
    position: "absolute" as const,
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    pointerEvents: "none" as const,
    zIndex: 50,
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(id);
    }, duration * 1000);
    return () => clearTimeout(timer);
  }, [id, duration, onComplete]);

  return (
    <motion.div {...animationProps} style={styles}>
      <div className="bg-red-600 text-foreground rounded-full size-10 place-content-center items-center">
        <PiHeartFill className="size-5 flex mx-auto" />
      </div>
    </motion.div>
  );
};

export default FloatingHeart;