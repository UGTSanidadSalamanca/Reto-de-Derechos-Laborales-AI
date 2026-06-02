/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useMemo } from 'react';
import { Flashcard as FlashcardType, Screen, GeneratePayload } from './types';
import { generateFlashcards } from './services/geminiService';
import UGTBadge from './components/UGTBadge';
import ThemeToggle from './components/ThemeToggle';
import SetupView from './components/SetupView';
import LoadingView from './components/LoadingView';
import Flashcard from './components/Flashcard';
import ProgressBar from './components/ProgressBar';
import ResultsView from './components/ResultsView';
import { ChevronLeft, ChevronRight, X, FastForward } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<Screen>('setup');
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<Record<number, boolean | null>>({});
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState('');

  const startChallenge = useCallback(async (payload: GeneratePayload) => {
    setScreen('loading');
    setError(null);
    try {
      const generated = await generateFlashcards(payload);
      setFlashcards(generated.cards);
      setTopic(generated.title || 'Reto de Flashcards');
      setResults({});
      setCurrentIndex(0);
      setScreen('game');
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con la IA o el tema es demasiado complejo. Por favor, inténtalo de nuevo.");
      setScreen('setup');
    }
  }, []);

  const handleAnswer = (known: boolean) => {
    const cardId = flashcards[currentIndex].id;
    setResults(prev => ({ ...prev, [cardId]: known }));
    
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setScreen('results');
    }
  };

  const navNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const navPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const score = useMemo(() => {
    return Object.values(results).filter(v => v === true).length;
  }, [results]);

  const reviewFailures = () => {
    const failures = flashcards.filter(c => results[c.id] === false);
    if (failures.length > 0) {
      setFlashcards(failures);
      setResults({});
      setCurrentIndex(0);
      setScreen('game');
    }
  };

  const reset = () => {
    setScreen('setup');
    setFlashcards([]);
    setResults({});
    setCurrentIndex(0);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0B1221] transition-colors flex flex-col font-sans">
      {/* Header */}
      <header className="p-4 md:p-6 flex items-center justify-between max-w-5xl w-full mx-auto">
        <UGTBadge />
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 rounded-xl flex items-center justify-between text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-4">
            <p>{error}</p>
            <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
          </div>
        )}

        {screen === 'setup' && <SetupView onStart={startChallenge} />}
        {screen === 'loading' && <LoadingView />}
        
        {screen === 'game' && flashcards.length > 0 && (
          <div className="w-full flex justify-center mt-2 pb-12">
            <div className="w-full max-w-3xl space-y-8 flex flex-col">
              
              {/* Central Title */}
              <div className="flex flex-col items-center text-center space-y-2 mb-6 px-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white leading-tight sm:leading-tight max-w-2xl tracking-tight">
                  {topic}
                </h1>
                <p className="text-stone-500 font-bold tracking-wide">Reto de Flashcards</p>
              </div>

              <div className="w-full max-w-2xl mx-auto space-y-6 px-2">
                <ProgressBar 
                  current={currentIndex + 1} 
                  total={flashcards.length}
                  score={score}
                />
                
                <Flashcard 
                  card={flashcards[currentIndex]} 
                  currentIndex={currentIndex}
                  onAnswer={handleAnswer} 
                />

                <div className="flex items-center justify-between w-64 mx-auto bg-stone-100 dark:bg-stone-900/40 rounded-full p-2 border border-stone-200 dark:border-stone-800 shadow-sm mt-8">
                  <button
                    onClick={navPrev}
                    disabled={currentIndex === 0}
                    className="p-3 rounded-full text-stone-500 hover:text-stone-800 dark:hover:text-white disabled:opacity-30 transition-all hover:bg-white dark:hover:bg-stone-800"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  
                  <div className="flex flex-col items-center justify-center font-bold text-stone-900 dark:text-white leading-[1.1]">
                    <span className="text-xl">{currentIndex + 1}</span>
                    <span className="text-[9px] text-stone-500 uppercase tracking-widest mt-0.5">DE {flashcards.length}</span>
                  </div>

                  <button
                    onClick={navNext}
                    disabled={currentIndex === flashcards.length - 1}
                    className="p-3 rounded-full text-stone-500 hover:text-stone-800 dark:hover:text-white disabled:opacity-30 transition-all hover:bg-white dark:hover:bg-stone-800"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex justify-center pt-4">
                  <button 
                    onClick={() => setScreen('results')}
                    className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 opacity-60 hover:opacity-100"
                  >
                    <FastForward className="w-4 h-4"/> Terminar Ahora
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {screen === 'results' && (
          <ResultsView 
            correct={score} 
            total={flashcards.length} 
            onRestart={reset}
            onReviewFailures={reviewFailures}
            hasFailures={flashcards.length > 0 && Object.values(results).includes(false)}
            flashcards={flashcards}
            topic={topic}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="p-8 text-center border-t border-stone-100 dark:border-stone-900 mt-auto">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 dark:text-stone-600">
          Unión General de Trabajadores © 2026
        </p>
      </footer>
    </div>
  );
}
