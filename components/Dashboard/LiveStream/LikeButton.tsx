import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart } from "react-icons/fa";
// import HeartAnimation from "./HeartAnimation";
import { PiHeartFill } from "react-icons/pi";

interface Heart {
  id: number;
}

function LikeButton() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  const handleLike = () => {
    setHearts([...hearts, { id: Date.now() }]);
  };

  const removeHeart = (id: number) => {
    setHearts((hearts) => hearts.filter((heart) => heart.id !== id));
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        onClick={handleLike}
        className="bg-white/10 rounded-full size-10 place-content-center items-center cursor-pointer"
      >
        <PiHeartFill className="size-5 flex mx-auto" />
      </div>
      <div style={{ position: "absolute", top: 0, left: 0 }}>
        <AnimatePresence>
          {/* {hearts.map((heart) => (
            <HeartAnimation key={heart.id} onAnimationComplete={() => removeHeart(heart.id)} />
          ))} */}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default LikeButton;