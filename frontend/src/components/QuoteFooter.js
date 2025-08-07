import React from "react";

// Blended, glassy quote footer for dark UI
export default function QuoteFooter() {
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
  // Change quote every 40 minutes
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const quoteIdx = Math.floor(minutes / 40) % quotes.length;
  const quote = quotes[quoteIdx];
  return (
    <div className="fixed bottom-0 left-0 w-full text-center bg-gradient-to-r from-[#232946]/80 via-[#15161c]/80 to-[#232946]/80 py-4 shadow-inner backdrop-blur-md border-t border-[#a7c7e7]/20">
      <span className="text-lg italic text-[#a7c7e7] drop-shadow">“{quote}”</span>
    </div>
  );
}
