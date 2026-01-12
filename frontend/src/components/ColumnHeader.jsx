import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ColumnHeader({
  title,
  columnKey,
  sortConfig,
  filters,
  onSort,
  onFilter,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const currentSort = sortConfig?.key === columnKey ? sortConfig.direction : null;
  const currentFilter = filters?.[columnKey] || '';

  const handleSort = (direction) => {
    onSort(columnKey, direction);
    // Don't close immediately to allow checking status
  };

  const handleClear = () => {
    onSort(columnKey, null);
    onFilter(columnKey, '');
    setIsOpen(false);
  };

  return (
    <div className={`relative flex items-center gap-2 ${className}`} ref={menuRef}>
      <span className="font-bold uppercase tracking-wider">{title}</span>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`ml-1 p-1 transition-colors duration-200 bg-transparent border-none outline-none focus:outline-none hover:bg-transparent shadow-none ${
          isOpen || currentSort || currentFilter
            ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(103,232,249,0.5)]'
            : 'text-[#5f5aa2] hover:text-[#a7c7e7] drop-shadow-md'
        }`}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: isOpen ? 180 : 0 }}
        >
          <path d="m6 9 6 6 6-6" />
        </motion.svg>
      </button>

      {/* Status Indicator Dot if active but menu closed */}
      {!isOpen && (currentSort || currentFilter) && (
        <div className="absolute top-0 right-0 -mt-1 -mr-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_5px_#22d3ee]"></div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-56 p-3 rounded-xl bg-[#232946]/95 backdrop-blur-xl border border-[#a7c7e7]/20 shadow-2xl z-50 flex flex-col gap-3"
          >
            {/* Sort Section */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#a7c7e7] uppercase opacity-70">Sort</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSort('asc')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    currentSort === 'asc'
                      ? 'bg-gradient-to-br from-[#5f5aa2] to-[#a7c7e7] text-[#232946] shadow-lg'
                      : 'bg-white/5 text-white/80 hover:bg-white/10'
                  }`}
                >
                  Asc ▲
                </button>
                <button
                  onClick={() => handleSort('desc')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    currentSort === 'desc'
                      ? 'bg-gradient-to-br from-[#5f5aa2] to-[#a7c7e7] text-[#232946] shadow-lg'
                      : 'bg-white/5 text-white/80 hover:bg-white/10'
                  }`}
                >
                  Desc ▼
                </button>
              </div>
            </div>

            <div className="h-px bg-[#a7c7e7]/20 w-full" />

            {/* Filter Section */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#a7c7e7] uppercase opacity-70">Filter</span>
              <input
                type="text"
                value={currentFilter}
                onChange={(e) => onFilter(columnKey, e.target.value)}
                placeholder={`Search ${title}...`}
                className="w-full bg-[#1b1e2e] border border-[#a7c7e7]/30 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#a7c7e7] focus:ring-1 focus:ring-[#a7c7e7]"
                autoFocus
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-1">
              <button
                onClick={handleClear}
                className="text-xs font-bold text-red-300 hover:text-red-200 transition-colors bg-transparent"
                disabled={!currentSort && !currentFilter}
              >
                Clear All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
