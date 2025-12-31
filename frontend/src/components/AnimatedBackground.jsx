
import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Large blurred moving blobs for a modern animated background */}
      <motion.div
        initial={{ x: -200, y: -100, scale: 1 }}
        animate={{ x: [0, 100, 0], y: [0, 100, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 18, repeat: Infinity, repeatType: "mirror" }}
        className="absolute top-[-12%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-green-300 via-blue-300 to-purple-300 opacity-40 blur-3xl"
      />
      <motion.div
        initial={{ x: 200, y: 400, scale: 1.1 }}
        animate={{ x: [0, -120, 0], y: [0, -80, 0], scale: [1.1, 1.25, 1.1] }}
        transition={{ duration: 22, repeat: Infinity, repeatType: "mirror", delay: 2 }}
        className="absolute bottom-[-18%] right-[-12%] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-blue-300 via-indigo-200 to-pink-300 opacity-40 blur-3xl"
      />
      <motion.div
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={{ x: [0, 80, -40, 0], y: [0, -60, 100, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 26, repeat: Infinity, repeatType: "mirror", delay: 3 }}
        className="absolute top-[30%] left-[40%] w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-purple-200 via-blue-100 to-green-100 opacity-30 blur-2xl"
      />
    </div>
  );
}
