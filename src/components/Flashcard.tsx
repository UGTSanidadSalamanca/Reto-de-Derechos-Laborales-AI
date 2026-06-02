import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Flashcard as FlashcardType } from '../types';
import { RotateCcw } from 'lucide-react';

interface Props {
  card: FlashcardType;
  currentIndex: number;
  onAnswer: (known: boolean) => void;
}

export default function Flashcard({ card, currentIndex, onAnswer }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [card]);

  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-[4/4] max-w-2xl mx-auto perspective-1000 mt-2">
      <motion.div
        className="w-full h-full relative preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-white dark:bg-[#131B2F] rounded-[2.5rem] p-6 sm:p-10 shadow-2xl flex flex-col items-center justify-between text-center border-2 border-stone-100 dark:border-[#1F293F]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 dark:bg-[#3A1D24] text-red-600 dark:text-[#FF5A5A] text-xs font-black rounded-full uppercase tracking-widest shadow-sm">
            💡 Pregunta {currentIndex + 1}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-800 dark:text-white leading-snug sm:leading-tight px-4">
            {card.q}
          </h2>
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-stone-400 dark:text-stone-500 uppercase">
            Toca para girar <RotateCcw className="w-3 h-3" />
          </div>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 backface-hidden bg-stone-50 dark:bg-[#1A2235] rounded-[2.5rem] p-6 sm:p-10 shadow-2xl flex flex-col items-center justify-between text-center border-2 border-stone-200 dark:border-[#2A364F] origin-center"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-stone-200 dark:bg-[#131B2F] text-stone-500 dark:text-stone-400 text-xs font-black rounded-full uppercase tracking-widest shadow-sm">
            Respuesta
          </div>
          <p className="text-lg sm:text-xl md:text-2xl text-stone-700 dark:text-stone-200 font-medium leading-relaxed px-4 py-6 overflow-y-auto w-full">
            {card.a}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full px-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAnswer(false);
              }}
              className="flex-1 py-4 px-6 rounded-2xl border-2 border-stone-300 dark:border-[#3A1D24] text-stone-600 dark:text-[#FF8A8A] font-bold tracking-wide hover:bg-stone-100 dark:hover:bg-[#2E151A] transition-colors"
            >
              No lo sabía
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAnswer(true);
              }}
              className="flex-1 py-4 px-6 rounded-2xl bg-[#E60019] text-white font-bold tracking-wide transition-transform active:scale-95 shadow-lg shadow-red-500/20 hover:bg-red-700"
            >
              Lo sabía
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
