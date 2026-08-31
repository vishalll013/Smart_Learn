import React, { useState } from 'react';
import { Volume2, RefreshCw, FlaskConical, SpellCheck, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Interactive() {
  const [activeTab, setActiveTab] = useState('flashcards');

  // --- FLASHCARDS STATE ---
  const [flashIndex, setFlashIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const flashcards = [
    { word: 'Gravity', definition: 'The invisible force that pulls objects toward each other. It holds us to the ground!', emoji: '🍏', sound: 'Gravity' },
    { word: 'Photosynthesis', definition: 'The process plants use to change sunlight, water, and carbon dioxide into food!', emoji: '🌱', sound: 'Photosynthesis' },
    { word: 'Algorithm', definition: 'A set of step-by-step instructions or rules followed to solve a problem or complete a task.', emoji: '💻', sound: 'Algorithm' },
    { word: 'Fraction', definition: 'A number that represents a part of a whole, like a slice of pizza or half an apple!', emoji: '🍕', sound: 'Fraction' }
  ];

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-Speech is not supported in this browser.");
    }
  };

  // --- VIRTUAL SCIENCE LAB STATE ---
  const [beakerColor, setBeakerColor] = useState('bg-slate-200');
  const [beakerLiquid, setBeakerLiquid] = useState('Empty');
  const [reactionMsg, setReactionMsg] = useState('Select chemicals to pour into the beaker!');
  const [bubbles, setBubbles] = useState(false);

  const mixChemical = (color, name) => {
    if (beakerLiquid === 'Empty') {
      setBeakerLiquid(name);
      setBeakerColor(color);
      setReactionMsg(`Beaker filled with ${name}. Add another chemical to mix!`);
      setBubbles(false);
    } else {
      const finalLiquid = `${beakerLiquid} + ${name}`;
      setBubbles(true);
      // Mix Logic
      if (finalLiquid.includes('Acid') && finalLiquid.includes('Base')) {
        setBeakerColor('bg-purple-500');
        setReactionMsg('🔥 Neutralization Reaction! Acid and Base mixed to make Purple Saltwater!');
      } else if (finalLiquid.includes('Copper') && finalLiquid.includes('Sodium')) {
        setBeakerColor('bg-teal-400 animate-pulse');
        setReactionMsg('✨ Displacement Reaction! Color shifted to Teal with high precipitation!');
      } else if (finalLiquid.includes('Iodine') && finalLiquid.includes('Starch')) {
        setBeakerColor('bg-blue-950');
        setReactionMsg('🍇 Starch Complex Reaction! Liquid turned Dark Blue/Purple.');
      } else {
        setBeakerColor('bg-gray-400');
        setReactionMsg(`Mixed ${beakerLiquid} with ${name}. Solution turned Grey.`);
      }
    }
  };

  const resetLab = () => {
    setBeakerColor('bg-slate-200');
    setBeakerLiquid('Empty');
    setReactionMsg('Select chemicals to pour into the beaker!');
    setBubbles(false);
  };

  // --- SPELLING GAME STATE ---
  const [spellingIndex, setSpellingIndex] = useState(0);
  const [placedLetters, setPlacedLetters] = useState([]);
  const [spellingFeedback, setSpellingFeedback] = useState('');
  const [spellingFinished, setSpellingFinished] = useState(false);

  const spellingWords = [
    { word: 'CODE', hint: 'Instructions written for a computer.', emoji: '💻', jumbled: ['D', 'O', 'C', 'E'] },
    { word: 'MOON', hint: 'The natural satellite orbiting the Earth.', emoji: '🌙', jumbled: ['N', 'O', 'O', 'M'] },
    { word: 'MATH', hint: 'Study of numbers, fractions, and patterns.', emoji: '📐', jumbled: ['H', 'T', 'M', 'A'] }
  ];

  const currentSpelling = spellingWords[spellingIndex];

  const handleAddLetter = (letter) => {
    if (placedLetters.length < currentSpelling.word.length) {
      const nextLetters = [...placedLetters, letter];
      setPlacedLetters(nextLetters);
      
      if (nextLetters.length === currentSpelling.word.length) {
        const formedWord = nextLetters.join('');
        if (formedWord === currentSpelling.word) {
          setSpellingFeedback('🎉 Excellent Job! Correct spelling!');
          setSpellingFinished(true);
        } else {
          setSpellingFeedback('❌ Oops! Not quite right. Try again!');
        }
      }
    }
  };

  const clearSpelling = () => {
    setPlacedLetters([]);
    setSpellingFeedback('');
    setSpellingFinished(false);
  };

  const nextSpelling = () => {
    setSpellingIndex((spellingIndex + 1) % spellingWords.length);
    setPlacedLetters([]);
    setSpellingFeedback('');
    setSpellingFinished(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Intro */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <span className="text-4xl">🧪</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100">Interactive Activities</h1>
        <p className="text-slate-500 font-semibold">Hands-on lessons that make science, language, and logic feel like playing!</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-sky-100 dark:border-slate-800 mb-10">
        <button
          onClick={() => setActiveTab('flashcards')}
          className={`pb-4 px-6 font-extrabold text-base border-b-4 transition-all ${
            activeTab === 'flashcards'
              ? 'border-brand-blue text-brand-blue'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
          id="tab-flashcards"
        >
          📖 Talking Flashcards
        </button>
        <button
          onClick={() => setActiveTab('lab')}
          className={`pb-4 px-6 font-extrabold text-base border-b-4 transition-all ${
            activeTab === 'lab'
              ? 'border-brand-blue text-brand-blue'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
          id="tab-lab"
        >
          🧪 Science Chem Lab
        </button>
        <button
          onClick={() => setActiveTab('spelling')}
          className={`pb-4 px-6 font-extrabold text-base border-b-4 transition-all ${
            activeTab === 'spelling'
              ? 'border-brand-blue text-brand-blue'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
          id="tab-spelling"
        >
          🧩 Spelling Builder
        </button>
      </div>

      {/* --- TAB 1: FLASHCARDS --- */}
      {activeTab === 'flashcards' && (
        <div className="max-w-xl mx-auto text-center space-y-8">
          <div className="text-slate-500 font-bold">Click the card to flip it and read the explanation!</div>
          
          <motion.div
            onClick={() => setFlipped(!flipped)}
            className="w-full h-80 cursor-pointer perspective"
          >
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: 'tween' }}
              className="w-full h-full relative preserve-3d"
            >
              {/* Front Side */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue to-sky-400 text-white rounded-4xl shadow-playful flex flex-col justify-center items-center p-8 backface-hidden">
                <span className="text-7xl mb-4 animate-bounce-slow">{flashcards[flashIndex].emoji}</span>
                <h2 className="text-3xl font-extrabold tracking-tight">{flashcards[flashIndex].word}</h2>
                <span className="mt-6 px-3 py-1 bg-white/20 text-xs font-bold rounded-full">Click to Reveal 🔄</span>
              </div>

              {/* Back Side */}
              <div className="absolute inset-0 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-4xl border-2 border-brand-blue shadow-playful flex flex-col justify-center items-center p-8 backface-hidden rotate-y-180">
                <div className="flex items-center space-x-2.5 mb-4">
                  <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{flashcards[flashIndex].word}</h3>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSpeak(flashcards[flashIndex].word + '. ' + flashcards[flashIndex].definition); }}
                    className="p-2 rounded-xl bg-sky-100 dark:bg-slate-700 text-brand-blue dark:text-sky-300 hover:scale-105 active:scale-95 transition-all"
                    title="Speak word aloud"
                    id={`speak-btn-${flashIndex}`}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-300 leading-relaxed text-center">
                  {flashcards[flashIndex].definition}
                </p>
                <span className="mt-6 text-xs text-slate-400 font-bold">Click to Flip Back 🔄</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center px-4">
            <button
              onClick={() => { setFlipped(false); setFlashIndex((flashIndex - 1 + flashcards.length) % flashcards.length); }}
              className="px-6 py-2.5 bg-slate-200 dark:bg-slate-800 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-300"
              id="prev-flash-btn"
            >
              Previous
            </button>
            <span className="font-extrabold text-sm text-slate-400">Card {flashIndex + 1} of {flashcards.length}</span>
            <button
              onClick={() => { setFlipped(false); setFlashIndex((flashIndex + 1) % flashcards.length); }}
              className="px-6 py-2.5 bg-brand-blue text-white rounded-xl font-bold text-sm hover:bg-brand-blue-dark shadow-md"
              id="next-flash-btn"
            >
              Next Word
            </button>
          </div>
        </div>
      )}

      {/* --- TAB 2: SCIENCE LAB --- */}
      {activeTab === 'lab' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          {/* Controls */}
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center">
                <FlaskConical className="w-6 h-6 mr-1.5 text-brand-blue" /> Chemistry Mixer
              </h2>
              <p className="text-sm font-semibold text-slate-400">Select and pour two chemical solutions into the beaker to create reactions.</p>
            </div>

            {/* Chemical buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => mixChemical('bg-red-500/80', 'Acid Solution (Red)')}
                className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/20 hover:bg-red-100 border border-red-200 dark:border-red-900/50 flex flex-col items-center space-y-2 text-center"
                id="chem-acid-btn"
              >
                <span className="text-3xl">🔴</span>
                <span className="font-extrabold text-sm text-red-700 dark:text-red-300">Hydrochloric Acid</span>
              </button>
              <button
                onClick={() => mixChemical('bg-blue-600/80', 'Base Solution (Blue)')}
                className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 border border-blue-200 dark:border-blue-900/50 flex flex-col items-center space-y-2 text-center"
                id="chem-base-btn"
              >
                <span className="text-3xl">🔵</span>
                <span className="font-extrabold text-sm text-brand-blue dark:text-sky-300">Sodium Hydroxide</span>
              </button>
              <button
                onClick={() => mixChemical('bg-yellow-400/80', 'Starch Indicator (Yellow)')}
                className="p-5 rounded-2xl bg-yellow-50 dark:bg-yellow-950/20 hover:bg-yellow-100 border border-yellow-200 dark:border-yellow-900/50 flex flex-col items-center space-y-2 text-center"
                id="chem-starch-btn"
              >
                <span className="text-3xl">🟡</span>
                <span className="font-extrabold text-sm text-yellow-700 dark:text-yellow-300">Starch Liquid</span>
              </button>
              <button
                onClick={() => mixChemical('bg-amber-800/80', 'Iodine Solution (Amber)')}
                className="p-5 rounded-2xl bg-orange-50 dark:bg-orange-950/20 hover:bg-orange-100 border border-orange-200 dark:border-orange-900/50 flex flex-col items-center space-y-2 text-center"
                id="chem-iodine-btn"
              >
                <span className="text-3xl">🟤</span>
                <span className="font-extrabold text-sm text-amber-700 dark:text-amber-300">Iodine Drops</span>
              </button>
            </div>

            <button
              onClick={resetLab}
              className="w-full py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-sm rounded-2xl flex items-center justify-center space-x-1.5"
              id="reset-lab-btn"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Empty the Beaker</span>
            </button>
          </div>

          {/* Graphic Beaker display */}
          <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-4xl border border-sky-100 dark:border-slate-700 shadow-playful text-center space-y-6">
            <h3 className="font-extrabold text-slate-700 dark:text-slate-200 text-lg">Virtual Beaker</h3>
            
            {/* Beaker representation */}
            <div className="relative w-44 h-56 border-x-4 border-b-4 border-slate-400 dark:border-slate-500 rounded-b-4xl overflow-hidden flex items-end">
              
              {/* Liquid */}
              <div className={`w-full transition-all duration-700 ease-out relative ${beakerColor} ${beakerLiquid === 'Empty' ? 'h-0' : 'h-36'}`}>
                {/* Bubble animations */}
                {bubbles && (
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-2.5 h-2.5 bg-white/40 rounded-full bottom-2 left-6 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="absolute w-3.5 h-3.5 bg-white/40 rounded-full bottom-4 left-16 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute w-2 h-2 bg-white/40 rounded-full bottom-3 left-28 animate-bounce" style={{ animationDelay: '0.8s' }}></div>
                    <div className="absolute w-3 h-3 bg-white/40 rounded-full bottom-6 left-10 animate-bounce" style={{ animationDelay: '1.2s' }}></div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-sky-50 dark:bg-slate-900 p-4 rounded-2xl border border-sky-100 dark:border-slate-700 w-full text-left">
              <span className="block text-xs font-bold text-slate-400">Chemical contents</span>
              <span className="block font-extrabold text-sm text-slate-700 dark:text-slate-200 capitalize mt-0.5">Liquid: {beakerLiquid}</span>
              <span className="block font-bold text-xs text-brand-orange mt-2 leading-relaxed">
                {reactionMsg}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: SPELLING GAME --- */}
      {activeTab === 'spelling' && (
        <div className="max-w-xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-4xl border border-sky-100 dark:border-slate-700 shadow-playful space-y-8 text-center">
          
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center justify-center">
              <SpellCheck className="w-6 h-6 mr-1.5 text-brand-blue" /> Spelling Jigsaw
            </h2>
            <p className="text-sm font-semibold text-slate-500">{currentSpelling.hint}</p>
          </div>

          <div className="text-8xl block animate-pulse-slow">{currentSpelling.emoji}</div>

          {/* Placed Letter boxes */}
          <div className="flex justify-center space-x-3">
            {Array.from({ length: currentSpelling.word.length }).map((_, idx) => (
              <div
                key={idx}
                className="w-14 h-14 border-3 border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-2xl font-black text-brand-blue"
              >
                {placedLetters[idx] || ''}
              </div>
            ))}
          </div>

          {/* Letter Choices */}
          <div className="space-y-4">
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Select letters in correct order:</div>
            <div className="flex justify-center flex-wrap gap-2.5">
              {currentSpelling.jumbled.map((letter, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddLetter(letter)}
                  className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-brand-blue hover:text-white dark:hover:bg-brand-blue transition-colors text-lg font-black text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-600"
                  id={`spelling-letter-btn-${idx}`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback & Actions */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            {spellingFeedback && (
              <div className={`font-extrabold text-base ${spellingFeedback.includes('🎉') ? 'text-emerald-500' : 'text-red-500'}`}>
                {spellingFeedback}
              </div>
            )}
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={clearSpelling}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-sm font-bold rounded-xl"
                id="clear-spelling-btn"
              >
                Clear
              </button>
              {spellingFinished && (
                <button
                  onClick={nextSpelling}
                  className="px-5 py-2.5 bg-brand-green hover:bg-brand-green-dark text-white text-sm font-extrabold rounded-xl shadow"
                  id="next-spelling-btn"
                >
                  Next Word
                </button>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
