import { Trophy, PlayCircle, AlertCircle, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { Flashcard } from '../types';
import { exportStandaloneProject } from '../services/exportService';
import { useState } from 'react';

interface Props {
  correct: number;
  total: number;
  onRestart: () => void;
  onReviewFailures: () => void;
  hasFailures: boolean;
  flashcards: Flashcard[];
  topic: string;
}

export default function ResultsView({ correct, total, onRestart, onReviewFailures, hasFailures, flashcards, topic }: Props) {
  const [isExporting, setIsExporting] = useState(false);
  const percentage = Math.round((correct / total) * 100);
  const isPass = percentage >= 70;
  const failures = total - correct;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportStandaloneProject(flashcards, topic);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto space-y-6 animate-in zoom-in-95 duration-500 bg-[#0B1221] p-6 sm:p-8 rounded-[2.5rem] shadow-2xl shadow-black/50">
      <div className="flex flex-col items-center space-y-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-[#3A1D24]"
        >
          <Trophy className="w-10 h-10 text-[#FF5A5A]" strokeWidth={1.5} />
        </motion.div>
        
        <div className="space-y-2 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Resultado Final
          </h2>
          <p className="text-xl text-stone-400 font-medium">
            <span className="text-[#FF5A5A] font-bold">{correct} aciertos</span> / {total}
          </p>
        </div>
      </div>

      <div className="bg-[#131B2F] rounded-2xl border border-stone-800/80 p-5 space-y-3 mt-8">
        <div className="flex justify-between items-center">
          <span className="text-stone-300 font-medium text-lg">Precisión:</span>
          <span className="text-white font-bold text-lg">{percentage}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-stone-300 font-medium text-lg">Por repasar:</span>
          <span className="text-[#FF8A00] font-bold text-lg">{failures} fallos</span>
        </div>
      </div>

      <div className={`p-5 rounded-2xl border ${isPass ? 'bg-[#0E291E] border-[#16422E] text-[#4ADE80]' : 'bg-[#2E151A] border-[#4A1E24] text-[#FFA0A0]'}`}>
        <p className="leading-relaxed font-medium text-[15px]">
          {isPass 
            ? "¡Enhorabuena por el resultado! Recuerda agradecer a tus delegados y delegadas sindicales de UGT su labor informativa."
            : "Es necesario repasar algunos conceptos. Si necesitas información más detallada te animamos a que consultes con tu delegado o delegada sindical de UGT para cualquier duda acerca de tus derechos."
          }
        </p>
      </div>

      <div className="grid gap-4 pt-4">
        {hasFailures && (
          <button
            onClick={onReviewFailures}
            className="w-full py-4 px-6 rounded-2xl bg-[#3D201A] text-[#FF8A00] font-bold flex items-center justify-center gap-2 hover:bg-[#4A261E] transition-colors"
          >
            <AlertCircle className="w-5 h-5" />
            <span>Repasar los {failures} fallos</span>
          </button>
        )}
        
        <button
          onClick={onRestart}
          className="w-full py-4 px-6 rounded-2xl text-white font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
          style={{ backgroundColor: '#E60000' }}
        >
          <PlayCircle className="w-5 h-5" />
          <span>Volver a jugar</span>
        </button>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full py-3 px-6 mt-2 rounded-xl bg-transparent border-2 border-stone-800 text-stone-500 font-bold flex items-center justify-center gap-2 hover:text-stone-300 hover:border-stone-700 transition-all disabled:opacity-50"
        >
          <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
          <span className="text-sm">{isExporting ? 'Preparando...' : 'Descargar App Independiente'}</span>
        </button>
      </div>
    </div>
  );
}
