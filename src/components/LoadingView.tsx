import { Loader2 } from 'lucide-react';
import { UGT_RED } from '../constants';

export default function LoadingView() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
      <div className="relative">
        <Loader2 className="w-16 h-16 animate-spin" style={{ color: UGT_RED }} />
        <div className="absolute inset-0 blur-2xl animate-pulse" style={{ backgroundColor: UGT_RED, opacity: 0.2 }} />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-stone-900 dark:text-white">Generando Reto Laboral...</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm max-w-[250px]">
          Estamos preparando las mejores tarjetas de estudio con inteligencia artificial.
        </p>
      </div>
    </div>
  );
}
