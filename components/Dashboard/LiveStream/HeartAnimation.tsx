// import { motion } from "framer-motion";
// import { PiHeartFill } from "react-icons/pi";

// const HeartAnimation = ({ onAnimationComplete, id }: { onAnimationComplete: (id: string | number) => void, id: string | number }) => {
//   const x = Math.random() * 200 - 100;
//   const y = Math.random() * -200 - 100;
//   const scale = Math.random() * 0.5 + 0.5;

//   const animationProps = {
//     initial: { opacity: 1, x: 0, y: 0, scale: 1 },
//     animate: { opacity: 0, x, y, scale },
//     transition: {
//       duration: 1.5,
//       ease: "easeOut",
//       opacity: { duration: 1.5, ease: "linear" },
//       y: { duration: 1.5, ease: "easeOut" },
//       x: { duration: 1.5, ease: [0.1, 0.4, 0.7, 1] },
//       scale: { duration: 1.5, ease: "easeOut" },
//     },
//   };

//   const styles = {
//     position: "absolute",
//     left: "50%",
//     top: "50%",
//     transform: "translate(-50%, -50%)",
//   };

//   return (
//     <motion.div {...animationProps} onAnimationComplete={onAnimationComplete}>
//       <div className="bg-red-600 text-foreground rounded-full size-10 place-content-center items-center">
//         <PiHeartFill className="size-5 flex mx-auto" />
//       </div>
//     </motion.div>
//   );
// };

// export default HeartAnimation;
