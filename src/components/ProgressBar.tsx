import { Trophy } from 'lucide-react';

interface Props {
  current: number;
  total: number;
  score: number;
}

export default function ProgressBar({ current, total, score }: Props) {
  const percentage = (current / total) * 100;
  
  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between items-end text-sm sm:text-base font-bold text-stone-700 dark:text-stone-300">
        <span className="tracking-wide">Pregunta {current} de {total}</span>
        <span className="text-[#FF5A5A] flex items-center gap-1.5 drop-shadow-sm">
          <Trophy className="w-4 h-4" /> {score} pts
        </span>
      </div>
      <div className="w-full h-2 bg-stone-200 dark:bg-stone-800/80 rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-300 ease-out bg-[#E60019]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
