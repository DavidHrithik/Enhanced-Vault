import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const quotes = [
  "Success is not the key to happiness. Happiness is the key to success.",
  "Quality means doing it right when no one is looking. – Henry Ford",
  "Don’t watch the clock; do what it does. Keep going.",
  "The secret of getting ahead is getting started. – Mark Twain",
  "Great things never come from comfort zones.",
  "It always seems impossible until it’s done. – Nelson Mandela",
  "The only way to do great work is to love what you do. – Steve Jobs",
  "Strive not to be a success, but rather to be of value. – Albert Einstein",
  "Well done is better than well said. – Benjamin Franklin",
  "Simplicity is the soul of efficiency. – Austin Freeman"
];


export default function QuoteWidget() {
  // Change quote every 5 minutes
  const getQuoteIdx = () => {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    return Math.floor(minutes / 5) % quotes.length;
  };
  const [quoteIdx, setQuoteIdx] = useState(getQuoteIdx());

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx(getQuoteIdx());
    }, 1000 * 60); // check every minute for accuracy
    return () => clearInterval(interval);
  }, []);

  const quote = quotes[quoteIdx];
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence mode="wait">
        <motion.div
          key={quoteIdx}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="max-w-xs bg-gradient-to-br from-[#232946]/80 via-[#15161c]/80 to-[#232946]/80 border border-[#a7c7e7]/30 shadow-xl backdrop-blur-xl rounded-2xl px-6 py-4 flex flex-col items-end"
        >
          <span className="text-base italic text-[#a7c7e7] drop-shadow block mb-2">“{quote}”</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
