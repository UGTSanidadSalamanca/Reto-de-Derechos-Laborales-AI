import { Search, Sparkles, FileText, Upload, File } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { UGT_RED } from '../constants';
import { GeneratePayload } from '../types';

interface Props {
  onStart: (payload: GeneratePayload) => void;
}

export default function SetupView({ onStart }: Props) {
  const [activeTab, setActiveTab] = useState<'topic' | 'text' | 'file'>('topic');
  const [topic, setTopic] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'topic' && topic.trim()) {
      onStart({ type: 'topic', value: topic.trim() });
    } else if (activeTab === 'text' && text.trim()) {
      onStart({ type: 'text', value: text.trim() });
    } else if (activeTab === 'file' && file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        onStart({ 
          type: 'file', 
          value: base64String, 
          fileName: file.name,
          mimeType: file.type 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-stone-900 dark:text-white tracking-tight leading-tight">
          Reto de <span style={{ color: UGT_RED }}>Derechos Laborales</span> AI
        </h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm italic">
          Domina tus derechos con inteligencia colectiva y tecnología.
        </p>
      </div>

      <div className="flex bg-stone-100 dark:bg-stone-900 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('topic')}
          className={`flex-1 py-2 px-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'topic' ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}
        >
          <Search className="w-4 h-4" /> Tema
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-2 px-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'text' ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}
        >
          <FileText className="w-4 h-4" /> Texto
        </button>
        <button
          onClick={() => setActiveTab('file')}
          className={`flex-1 py-2 px-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'file' ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}
        >
          <Upload className="w-4 h-4" /> Documento
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {activeTab === 'topic' && (
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-red-500 transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ej. Despido, Maternidad, Vacaciones..."
              className="block w-full pl-11 pr-4 py-4 bg-white dark:bg-stone-900 border-2 border-stone-100 dark:border-stone-800 rounded-2xl text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/5 transition-all shadow-sm"
              required
            />
          </div>
        )}

        {activeTab === 'text' && (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Pega aquí el convenio, artículo o texto legal..."
            className="block w-full p-4 min-h-[160px] resize-none bg-white dark:bg-stone-900 border-2 border-stone-100 dark:border-stone-800 rounded-2xl text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/5 transition-all shadow-sm"
            required
          />
        )}

        {activeTab === 'file' && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="block w-full p-8 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-2xl text-center cursor-pointer hover:border-red-500 dark:hover:border-red-500 hover:bg-red-500/5 transition-all"
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              accept=".pdf,.txt,.doc,.docx"
            />
            {file ? (
              <div className="space-y-2">
                <File className="w-8 h-8 text-red-500 mx-auto" />
                <p className="text-stone-900 dark:text-white font-bold">{file.name}</p>
                <p className="text-stone-500 text-xs text-center">Click para cambiar</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 text-stone-400 mx-auto" />
                <p className="text-stone-600 dark:text-stone-300 font-medium">Click para subir documento</p>
                <p className="text-stone-500 text-xs">PDF, Word o TXT</p>
              </div>
            )}
          </div>
        )}
        
        <button
          type="submit"
          disabled={
            (activeTab === 'topic' && !topic.trim()) || 
            (activeTab === 'text' && !text.trim()) || 
            (activeTab === 'file' && !file)
          }
          className="w-full py-4 px-6 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-xl shadow-red-500/20 group overflow-hidden relative disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed"
          style={{ backgroundColor: UGT_RED }}
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 disabled:hidden" />
          <Sparkles className="w-5 h-5" />
          <span>Generar Reto AI</span>
        </button>
      </form>

      {activeTab === 'topic' && (
        <div className="pt-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-600 mb-4">Temas sugeridos</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Turnicidad', 'Prevención de riesgos', 'Permisos retribuidos', 'Salario mínimo'].map((t) => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className="text-xs px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
