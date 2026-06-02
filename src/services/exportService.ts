// src/services/exportService.ts
import JSZip from 'jszip';
import { Flashcard } from '../types';

export async function exportStandaloneProject(flashcards: Flashcard[], topic: string) {
  const zip = new JSZip();

  const standaloneAppContent = `
import React, { useState, useMemo } from 'react';
import { Shield, Sun, Moon, Trophy, Home, RotateCcw, Info, ChevronLeft, ChevronRight, PlayCircle, AlertCircle, FastForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UGT_RED = "#E60019";
const MAIN_TOPIC = ${JSON.stringify(topic)};
const initialFlashcards = ${JSON.stringify(flashcards, null, 2)};

export default function App() {
  const [flashcards, setFlashcards] = useState(initialFlashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const correct = Object.values(results).filter(v => v === true).length;
  const total = flashcards.length;
  const percentage = Math.round((correct / total) * 100) || 0;
  const isPass = percentage >= 70;
  const failures = total - correct;
  const hasFailures = failures > 0;

  const handleAnswer = (known) => {
    const cardId = flashcards[currentIndex].id;
    setResults(prev => ({ ...prev, [cardId]: known }));
    setIsFlipped(false);
    
    if (currentIndex < flashcards.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 150);
    } else {
      setTimeout(() => setIsFinished(true), 150);
    }
  };

  const navNext = () => { if (currentIndex < flashcards.length - 1) { setCurrentIndex(currentIndex + 1); setIsFlipped(false); } };
  const navPrev = () => { if (currentIndex > 0) { setCurrentIndex(currentIndex - 1); setIsFlipped(false); } };

  const reviewFailures = () => {
    const failedCards = initialFlashcards.filter(c => results[c.id] === false);
    if(failedCards.length > 0) {
      setFlashcards(failedCards);
      setCurrentIndex(0);
      setResults({});
      setIsFinished(false);
      setIsFlipped(false);
    }
  };

  const restart = () => {
    setFlashcards(initialFlashcards);
    setCurrentIndex(0);
    setResults({});
    setIsFinished(false);
    setIsFlipped(false);
  }

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-stone-50 dark:bg-[#0B1221] transition-colors flex flex-col font-sans selection:bg-[#E60019] selection:text-white">
        {/* Header */}
        <header className="p-4 sm:p-6 flex items-center justify-between max-w-4xl w-full mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#E60019] text-white font-black text-xl px-2 py-0.5 rounded flex items-center justify-center tracking-tighter">
              UGT
            </div>
            <div className="flex flex-col text-stone-900 dark:text-white font-bold text-[10px] leading-[1.1] tracking-wider">
              <span>SERVICIOS</span>
              <span>PÚBLICOS</span>
            </div>
          </div>

          <button onClick={() => setIsDark(!isDark)} className="p-2.5 rounded-full bg-stone-200 dark:bg-white/5 text-stone-600 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-white/10 transition-colors">
            {isDark ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
          </button>
        </header>

        <main className="flex-1 flex flex-col items-center p-6 w-full pb-12">
          {!isFinished ? (
            <div className="w-full max-w-3xl space-y-8 flex flex-col mt-2">
              
              <div className="flex flex-col items-center text-center space-y-2 mb-6 px-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white leading-tight sm:leading-tight max-w-2xl tracking-tight">
                  {MAIN_TOPIC}
                </h1>
                <p className="text-stone-500 font-bold tracking-wide">Reto de Flashcards</p>
              </div>

              <div className="w-full max-w-2xl mx-auto space-y-6 px-2">
                <div className="w-full space-y-3">
                  <div className="flex justify-between items-end text-sm sm:text-base font-bold text-stone-700 dark:text-stone-300">
                    <span className="tracking-wide">Pregunta {currentIndex + 1} de {flashcards.length}</span>
                    <span className="text-[#FF5A5A] flex items-center gap-1.5 drop-shadow-sm">
                      <Trophy className="w-4 h-4" /> {correct} pts
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-200 dark:bg-stone-800/80 rounded-full overflow-hidden">
                    <div className="h-full transition-all duration-300 ease-out bg-[#E60019]" style={{ width: \`\${((currentIndex + 1)/flashcards.length)*100}%\` }} />
                  </div>
                </div>

                <div className="relative w-full aspect-[4/5] sm:aspect-[4/4] max-w-2xl mx-auto perspective-1000 mt-2">
                  <motion.div
                    className="w-full h-full relative preserve-3d cursor-pointer"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
                    onClick={() => setIsFlipped(!isFlipped)}
                  >
                    <div className="absolute inset-0 backface-hidden bg-white dark:bg-[#131B2F] rounded-[2.5rem] p-6 sm:p-10 shadow-2xl flex flex-col items-center justify-between text-center border-2 border-stone-100 dark:border-[#1F293F]">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 dark:bg-[#3A1D24] text-red-600 dark:text-[#FF5A5A] text-xs font-black rounded-full uppercase tracking-widest shadow-sm">
                        💡 Pregunta {currentIndex + 1}
                      </div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-800 dark:text-white leading-snug sm:leading-tight px-4 flex-1 flex flex-col items-center justify-center">
                        {flashcards[currentIndex].q}
                      </h2>
                      <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-stone-400 dark:text-stone-500 uppercase pb-2">
                        Toca para girar <RotateCcw className="w-3 h-3" />
                      </div>
                    </div>
                    <div className="absolute inset-0 backface-hidden bg-stone-50 dark:bg-[#1A2235] rounded-[2.5rem] p-6 sm:p-10 shadow-2xl flex flex-col items-center justify-between text-center border-2 border-stone-200 dark:border-[#2A364F] origin-center" style={{ transform: 'rotateY(180deg)' }}>
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-stone-200 dark:bg-[#131B2F] text-stone-500 dark:text-stone-400 text-xs font-black rounded-full uppercase tracking-widest shadow-sm">
                        Respuesta
                      </div>
                      <div className="text-lg sm:text-xl md:text-2xl text-stone-700 dark:text-stone-200 font-medium leading-relaxed px-4 py-6 overflow-y-auto w-full flex-1 flex items-center justify-center">
                        {flashcards[currentIndex].a}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full px-4 shrink-0 pb-2">
                        <button onClick={(e) => { e.stopPropagation(); handleAnswer(false); }} className="flex-1 py-4 px-6 rounded-2xl border-2 border-stone-300 dark:border-[#3A1D24] text-stone-600 dark:text-[#FF8A8A] font-bold tracking-wide hover:bg-stone-100 dark:hover:bg-[#2E151A] transition-colors">
                          No lo sabía
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleAnswer(true); }} className="flex-1 py-4 px-6 rounded-2xl bg-[#E60019] text-white font-bold tracking-wide transition-transform active:scale-95 shadow-lg shadow-red-500/20 hover:bg-red-700">
                          Lo sabía
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="flex items-center justify-between w-64 mx-auto bg-stone-100 dark:bg-[#131B2F] rounded-full p-2 border border-stone-200 dark:border-stone-800 shadow-sm mt-8">
                  <button onClick={navPrev} disabled={currentIndex === 0} className="p-3 rounded-full text-stone-500 hover:text-stone-800 dark:hover:text-white disabled:opacity-30 transition-all hover:bg-white dark:hover:bg-stone-800">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div className="flex flex-col items-center justify-center font-bold text-stone-900 dark:text-white leading-[1.1]">
                    <span className="text-xl">{currentIndex + 1}</span>
                    <span className="text-[9px] text-stone-500 uppercase tracking-widest mt-0.5">DE {flashcards.length}</span>
                  </div>
                  <button onClick={navNext} disabled={currentIndex === flashcards.length - 1} className="p-3 rounded-full text-stone-500 hover:text-stone-800 dark:hover:text-white disabled:opacity-30 transition-all hover:bg-white dark:hover:bg-stone-800">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex justify-center pt-4">
                  <button onClick={() => setIsFinished(true)} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 opacity-60 hover:opacity-100">
                    <FastForward className="w-4 h-4"/> Terminar Reto Ahora
                  </button>
                </div>

              </div>
            </div>
          ) : (
             <div className="max-w-md w-full mx-auto space-y-6 animate-in zoom-in-95 duration-500 bg-[#0B1221] p-6 sm:p-8 rounded-[2.5rem] shadow-2xl shadow-black/50">
                <div className="flex flex-col items-center space-y-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-[#3A1D24]">
                    <Trophy className="w-10 h-10 text-[#FF5A5A]" strokeWidth={1.5} />
                  </motion.div>
                  <div className="space-y-2 text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Resultado Final</h2>
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

                <div className={\`p-5 rounded-2xl border \${isPass ? 'bg-[#0E291E] border-[#16422E] text-[#4ADE80]' : 'bg-[#2E151A] border-[#4A1E24] text-[#FFA0A0]'}\`}>
                  <p className="leading-relaxed font-medium text-[15px]">
                    {isPass 
                      ? "¡Enhorabuena por el resultado! Recuerda agradecer a tus delegados y delegadas sindicales de UGT su labor informativa."
                      : "Es necesario repasar algunos conceptos. Si necesitas información más detallada te animamos a que consultes con tu delegado o delegada sindical de UGT para cualquier duda acerca de tus derechos."
                    }
                  </p>
                </div>

                <div className="grid gap-4 pt-4">
                  {hasFailures && (
                    <button onClick={reviewFailures} className="w-full py-4 px-6 rounded-2xl bg-[#3D201A] text-[#FF8A00] font-bold flex items-center justify-center gap-2 hover:bg-[#4A261E] transition-colors">
                      <AlertCircle className="w-5 h-5" /> <span>Repasar los {failures} fallos</span>
                    </button>
                  )}
                  <button onClick={restart} className="w-full py-4 px-6 rounded-2xl text-white font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors" style={{ backgroundColor: '#E60000' }}>
                    <PlayCircle className="w-5 h-5" /> <span>Volver a jugar</span>
                  </button>
                </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
  `;

  // 2. Add necessary config files
  zip.file('src/App.jsx', standaloneAppContent);
  zip.file('src/main.jsx', `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
  `);
  zip.file('index.html', `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reto: ${topic}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
  `);
  zip.file('package.json', JSON.stringify({
    name: `reto-${topic.toLowerCase().replace(/\s+/g, '-')}`,
    private: true,
    version: "0.0.0",
    type: "module",
    scripts: {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview"
    },
    dependencies: {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "framer-motion": "^10.12.16",
      "lucide-react": "latest"
    },
    devDependencies: {
      "@types/react": "^18.0.28",
      "@types/react-dom": "^18.0.11",
      "@vitejs/plugin-react": "^4.0.0",
      "autoprefixer": "^10.4.14",
      "postcss": "^8.4.24",
      "tailwindcss": "^3.3.2",
      "vite": "^4.3.9"
    }
  }, null, 2));

  zip.file('tailwind.config.js', `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
  `);

  zip.file('postcss.config.js', `
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
  `);

  zip.file('vite.config.js', `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
  `);

  zip.file('src/index.css', `
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .perspective-1000 { perspective: 1000px; }
  .preserve-3d { transform-style: preserve-3d; }
  .backface-hidden { backface-visibility: hidden; }
}
  `);

  zip.file('netlify.toml', `
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  `);

  zip.file('README.md', `
# Reto de Derechos Laborales: ${topic}

Este es un proyecto independiente generado por AI.

## Instrucciones para subirlo a Netlify

1. Descomprime este archivo.
2. Sube la carpeta a un repositorio de GitHub o arrástrala directamente a Netlify Drop.
3. El comando de construcción es: \`npm run build\`
4. El directorio de publicación es: \`dist\`
  `);

  const content = await zip.generateAsync({ type: 'blob' });
  const url = window.URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = `reto_laboral_${topic.toLowerCase().replace(/\s+/g, '_')}.zip`;
  link.click();
}
