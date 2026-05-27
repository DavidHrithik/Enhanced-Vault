import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quotes } from '../utils/quotes';

export default function QuoteWidget() {
  // Better randomization for 300+ quotes
  const [quoteIdx, setQuoteIdx] = useState(() => Math.floor(Math.random() * quotes.length));

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx((prevIdx) => {
        let nextIdx = Math.floor(Math.random() * quotes.length);
        // Ensure same quote doesn't show twice in a row
        while (nextIdx === prevIdx && quotes.length > 1) {
          nextIdx = Math.floor(Math.random() * quotes.length);
        }
        return nextIdx;
      });
    }, 1000 * 30); // Change every 30 seconds for more variety with 300 quotes
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
          className="max-w-xs bg-gradient-to-br from-surface/80 via-bg-end/80 to-surface/80 border border-primary/30 shadow-xl backdrop-blur-xl rounded-2xl px-6 py-4 flex flex-col items-end"
        >
          <span className="text-base italic text-primary drop-shadow block mb-2">“{quote}”</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
