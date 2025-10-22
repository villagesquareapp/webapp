// "use client";

// import { useEffect, useState } from "react";
// import { PiHeartFill } from "react-icons/pi";

// interface FloatingHeartProps {
//   id: string | number;
//   onComplete: (id: string | number) => void;
// }

// const FloatingHeart = ({ id, onComplete }: FloatingHeartProps) => {
//   const [position] = useState({
//     left: Math.random() * 80 + 10, 
//     delay: Math.random() * 0.3,
//     duration: 3 + Math.random() * 2, 
//     rotation: Math.random() * 60 - 30,
//     scale: 0.7 + Math.random() * 0.6,
//   });

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onComplete(id);
//     }, position.duration * 1000);

//     return () => clearTimeout(timer);
//   }, [id, position.duration, onComplete]);

//   return (
//     <div
//       className="absolute pointer-events-none z-50"
//       style={{
//         left: `${position.left}%`,
//         bottom: '100px',
//         animation: `float-up ${position.duration}s ease-out forwards`,
//         animationDelay: `${position.delay}s`,
//         transform: `scale(${position.scale}) rotate(${position.rotation}deg)`,
//       }}
//     >
//       <div className="bg-red-600 text-foreground rounded-full size-10 place-content-center items-center">
//         <PiHeartFill className="size-5 flex mx-auto" />
//       </div>
//     </div>
//   );
// };

// export default FloatingHeart;

"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { PiHeartFill } from "react-icons/pi";

interface FloatingHeartProps {
  id: string | number;
  onComplete: (id: string | number) => void;
}

const FloatingHeart = ({ id, onComplete }: FloatingHeartProps) => {
  // Randomize position, direction, and animation behavior
  const x = Math.random() * 200 - 100; // random horizontal movement
  const y = Math.random() * -200 - 100; // random upward movement
  const scale = Math.random() * 0.5 + 0.5; // random scale
  const duration = 1.5 + Math.random() * 0.5; // between 1.5s and 2s

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
    // Trigger cleanup when animation completes
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


// "use client";

// import { useEffect, useState } from "react";
// import { FaHeart } from "react-icons/fa";

// interface FloatingHeartProps {
//   id: string | number;
//   onComplete: (id: string | number) => void;
// }

// const FloatingHeart = ({ id, onComplete }: FloatingHeartProps) => {
//   const [position] = useState({
//     right: Math.random() * 15 + 5, 
//     delay: Math.random() * 0.2,
//     duration: 2.5 + Math.random() * 1.5,
//     wobble: Math.random() * 30 - 15, 
//     scale: 0.8 + Math.random() * 0.4, 
//   });

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onComplete(id);
//     }, position.duration * 1000);

//     return () => clearTimeout(timer);
//   }, [id, position.duration, onComplete]);

//   return (
//     <div
//       className="absolute pointer-events-none z-50"
//       style={{
//         right: `${position.right}%`,
//         bottom: '120px',
//         animation: `float-up-right ${position.duration}s ease-out forwards`,
//         animationDelay: `${position.delay}s`,
//         transform: `scale(${position.scale})`,
//         '--wobble': `${position.wobble}px`,
//       } as React.CSSProperties}
//     >
//       <FaHeart
//         className="text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]"
//         size={36}
//       />
//     </div>
//   );
// };

// export default FloatingHeart;