import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Gamepad2, Award, RefreshCw, Star, Zap, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Games() {
  const { user, addPoints } = useAuth();
  const [activeGame, setActiveGame] = useState(null);

  // --- GAME 1: MATH EXPLORER ---
  const [mathScore, setMathScore] = useState(0);
  const [mathHigh, setMathHigh] = useState(parseInt(localStorage.getItem('math_high') || '0'));
  const [mathLeft, setMathLeft] = useState(10); // 10 questions per run
  const [currentMathQuestion, setCurrentMathQuestion] = useState(null);
  const [mathInput, setMathInput] = useState('');
  const [mathFeedback, setMathFeedback] = useState('');

  const generateMathQuestion = () => {
    const num1 = Math.floor(Math.random() * 12) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operation = Math.random() > 0.5 ? '+' : '-';
    const answer = operation === '+' ? num1 + num2 : num1 - num2;
    
    setCurrentMathQuestion({
      text: `${num1} ${operation} ${num2} = ?`,
      answer
    });
    setMathInput('');
    setMathFeedback('');
  };

  const handleMathSubmit = (e) => {
    e.preventDefault();
    if (!currentMathQuestion) return;

    const userAns = parseInt(mathInput);
    if (userAns === currentMathQuestion.answer) {
      setMathScore(mathScore + 10);
      setMathFeedback('🎉 Correct! +10 points');
      if (mathScore + 10 > mathHigh) {
        setMathHigh(mathScore + 10);
        localStorage.setItem('math_high', mathScore + 10);
      }
    } else {
      setMathFeedback(`❌ Wrong! Correct was ${currentMathQuestion.answer}`);
    }

    setMathLeft(mathLeft - 1);
    setTimeout(() => {
      if (mathLeft > 1) {
        generateMathQuestion();
      } else {
        // End of game
        addPoints(mathScore);
        alert(`Game Over! You earned ${mathScore} XP points for your profile!`);
        setCurrentMathQuestion(null);
      }
    }, 1200);
  };

  const startMathGame = () => {
    setMathScore(0);
    setMathLeft(10);
    generateMathQuestion();
  };

  // --- GAME 2: MEMORY MATCH ---
  const emojis = ['🐶', '🐱', '🦁', '🦊', '🐸', '🐙', '🦖', '🦋'];
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memorySolved, setMemorySolved] = useState(false);

  const initMemoryGame = () => {
    const double = [...emojis, ...emojis];
    // Shuffle
    const shuffled = double
      .map((val, idx) => ({ id: idx, emoji: val }))
      .sort(() => Math.random() - 0.5);
    
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedCards([]);
    setMemoryMoves(0);
    setMemorySolved(false);
  };

  const handleCardClick = (cardId) => {
    if (flippedCards.length === 2 || matchedCards.includes(cardId) || flippedCards.includes(cardId)) {
      return;
    }

    const nextFlipped = [...flippedCards, cardId];
    setFlippedCards(nextFlipped);

    if (nextFlipped.length === 2) {
      setMemoryMoves(memoryMoves + 1);
      const card1 = cards.find(c => c.id === nextFlipped[0]);
      const card2 = cards.find(c => c.id === nextFlipped[1]);

      if (card1.emoji === card2.emoji) {
        setMatchedCards([...matchedCards, card1.id, card2.id]);
        setFlippedCards([]);
        
        // Check if finished
        if (matchedCards.length + 2 === cards.length) {
          setMemorySolved(true);
          addPoints(50); // reward points
        }
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  // --- GAME 3: TYPING CHALLENGE ---
  const typingWordsList = [
    'PLANET', 'ORBIT', 'SCIENCE', 'FRACTION', 'COMPUTER', 'GEOGRAPHY', 'DIVISION', 'SCRATCH', 'ALGORITHM', 'KEYBOARD'
  ];
  const [activeWordIdx, setActiveWordIdx] = useState(0);
  const [typingInput, setTypingInput] = useState('');
  const [typingTimer, setTypingTimer] = useState(20);
  const [typingScore, setTypingScore] = useState(0);
  const [typingActive, setTypingActive] = useState(false);

  useEffect(() => {
    if (typingActive && typingTimer > 0) {
      const timer = setTimeout(() => setTypingTimer(typingTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (typingActive && typingTimer === 0) {
      setTypingActive(false);
      addPoints(typingScore);
      alert(`Typing challenge completed! Score: ${typingScore} XP points.`);
    }
  }, [typingActive, typingTimer]);

  const handleTypeChange = (e) => {
    const val = e.target.value.toUpperCase();
    setTypingInput(val);

    if (val === typingWordsList[activeWordIdx]) {
      setTypingScore(typingScore + 15);
      setTypingInput('');
      setActiveWordIdx((activeWordIdx + 1) % typingWordsList.length);
    }
  };

  const startTypingGame = () => {
    setTypingScore(0);
    setTypingTimer(20);
    setTypingInput('');
    setActiveWordIdx(0);
    setTypingActive(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      
      {/* Page Header */}
      {!activeGame && (
        <div className="space-y-8">
          <div className="space-y-1.5 text-center max-w-2xl mx-auto">
            <span className="text-4xl block">🎮</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100">Learning Arcade</h1>
            <p className="text-slate-500 font-semibold">Fun games that help you practice math facts, increase typing speed, and train memory!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            
            {/* Game 1: Math Challenge */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-4xl border border-sky-100 dark:border-slate-700/50 shadow-playful flex flex-col justify-between space-y-4 hover-scale">
              <div className="space-y-2">
                <span className="text-5xl">🧮</span>
                <h3 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 mt-2">Math Challenge</h3>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Quick-fire addition and subtraction facts. Solve as many as you can!</p>
              </div>
              <button
                onClick={() => { setActiveGame('math'); startMathGame(); }}
                className="w-full py-3 bg-brand-blue hover:bg-brand-blue-dark text-white font-extrabold text-sm rounded-2xl shadow-md transition-all"
                id="play-math-game-btn"
              >
                Play Math Facts
              </button>
            </div>

            {/* Game 2: Memory Match */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-4xl border border-sky-100 dark:border-slate-700/50 shadow-playful flex flex-col justify-between space-y-4 hover-scale">
              <div className="space-y-2">
                <span className="text-5xl">🐱</span>
                <h3 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 mt-2">Memory Match</h3>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Find pairs of identical animal cards. How fast can you solve the board?</p>
              </div>
              <button
                onClick={() => { setActiveGame('memory'); initMemoryGame(); }}
                className="w-full py-3 bg-brand-green hover:bg-brand-green-dark text-white font-extrabold text-sm rounded-2xl shadow-md transition-all"
                id="play-memory-game-btn"
              >
                Play Memory Match
              </button>
            </div>

            {/* Game 3: Typing Speed */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-4xl border border-sky-100 dark:border-slate-700/50 shadow-playful flex flex-col justify-between space-y-4 hover-scale">
              <div className="space-y-2">
                <span className="text-5xl">⌨️</span>
                <h3 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 mt-2">Typing Challenge</h3>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Type educational science and coding terms correctly within the time limit.</p>
              </div>
              <button
                onClick={() => { setActiveGame('typing'); startTypingGame(); }}
                className="w-full py-3 bg-brand-purple hover:bg-brand-purple-dark text-white font-extrabold text-sm rounded-2xl shadow-md transition-all"
                id="play-typing-game-btn"
              >
                Play Typing Speed
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- GAMEPLAY CONTAINERS --- */}
      {activeGame === 'math' && (
        <div className="max-w-xl mx-auto bg-white dark:bg-slate-800 rounded-4xl border border-sky-100 dark:border-slate-700 shadow-playful p-8 space-y-8">
          
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4">
            <h2 className="font-black text-xl text-slate-800 dark:text-slate-100 flex items-center">🧮 Math Explorer</h2>
            <button
              onClick={() => setActiveGame(null)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 font-bold text-xs text-slate-500 rounded-xl"
              id="exit-math-game"
            >
              Quit Game
            </button>
          </div>

          <div className="flex justify-between text-sm font-extrabold text-slate-400">
            <span>Score: <span className="text-emerald-500">{mathScore}</span></span>
            <span>High Score: <span className="text-amber-500">{mathHigh}</span></span>
            <span>Rounds Remaining: {mathLeft}</span>
          </div>

          {currentMathQuestion ? (
            <div className="space-y-6 text-center">
              <div className="text-5xl font-black bg-slate-50 dark:bg-slate-900 py-10 rounded-3xl border border-slate-100 dark:border-slate-800 text-brand-blue tracking-tight">
                {currentMathQuestion.text}
              </div>

              <form onSubmit={handleMathSubmit} className="space-y-4">
                <input
                  type="number"
                  value={mathInput}
                  onChange={(e) => setMathInput(e.target.value)}
                  placeholder="Type answer here"
                  autoFocus
                  className="w-full text-center px-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-2xl font-black text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
                
                <button
                  type="submit"
                  className="w-full py-3.5 bg-brand-blue text-white font-extrabold rounded-2xl shadow hover:bg-brand-blue-dark transition-all text-base"
                  id="submit-math-answer"
                >
                  Check Answer
                </button>
              </form>

              {mathFeedback && (
                <div className={`font-extrabold text-lg animate-bounce ${mathFeedback.includes('🎉') ? 'text-emerald-500' : 'text-red-500'}`}>
                  {mathFeedback}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">Round Over!</h3>
              <div className="text-lg font-bold text-slate-500">Points won this round: <span className="text-emerald-500">+{mathScore} XP</span></div>
              <button
                onClick={startMathGame}
                className="px-8 py-3.5 bg-brand-blue text-white font-extrabold rounded-2xl shadow hover:bg-brand-blue-dark transition-all"
                id="restart-math-game"
              >
                Play Again
              </button>
            </div>
          )}

        </div>
      )}

      {activeGame === 'memory' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-4xl border border-sky-100 dark:border-slate-700 shadow-playful p-8 space-y-8">
          
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4">
            <h2 className="font-black text-xl text-slate-800 dark:text-slate-100 flex items-center">🐱 Memory Cards</h2>
            <button
              onClick={() => setActiveGame(null)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 font-bold text-xs text-slate-500 rounded-xl"
              id="exit-memory-game"
            >
              Quit Game
            </button>
          </div>

          <div className="flex justify-between text-sm font-extrabold text-slate-400">
            <span>Moves: {memoryMoves}</span>
            <span>Matched: {matchedCards.length / 2} / {emojis.length} pairs</span>
          </div>

          {!memorySolved ? (
            <div className="grid grid-cols-4 gap-4 justify-center">
              {cards.map((card) => {
                const isFlipped = flippedCards.includes(card.id) || matchedCards.includes(card.id);
                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className={`aspect-square rounded-2xl border-2 flex items-center justify-center text-4xl shadow-sm transition-all transform ${
                      isFlipped
                        ? 'bg-sky-50 dark:bg-slate-900 border-brand-blue scale-100'
                        : 'bg-gradient-to-tr from-brand-blue to-brand-purple border-transparent text-transparent hover:scale-105 active:scale-95'
                    }`}
                    id={`memory-card-${card.id}`}
                  >
                    {isFlipped ? card.emoji : '❓'}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center space-y-6">
              <span className="text-7xl block animate-bounce">🎉</span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">Board Cleared!</h3>
              <p className="text-slate-500 font-semibold">Solved in {memoryMoves} moves. Awarded <span className="text-emerald-500">+50 XP</span> coins!</p>
              <button
                onClick={initMemoryGame}
                className="px-8 py-3.5 bg-brand-green text-white font-extrabold rounded-2xl shadow hover:bg-brand-green-dark transition-all"
                id="restart-memory-game"
              >
                Play Again
              </button>
            </div>
          )}

        </div>
      )}

      {activeGame === 'typing' && (
        <div className="max-w-xl mx-auto bg-white dark:bg-slate-800 rounded-4xl border border-sky-100 dark:border-slate-700 shadow-playful p-8 space-y-8">
          
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4">
            <h2 className="font-black text-xl text-slate-800 dark:text-slate-100 flex items-center">⌨️ Typing Challenge</h2>
            <button
              onClick={() => setActiveGame(null)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 font-bold text-xs text-slate-500 rounded-xl"
              id="exit-typing-game"
            >
              Quit Game
            </button>
          </div>

          <div className="flex justify-between text-sm font-extrabold text-slate-400">
            <span>Score: <span className="text-emerald-500">{typingScore}</span></span>
            <span className="flex items-center text-rose-500">Timer: {typingTimer}s</span>
          </div>

          {typingActive ? (
            <div className="space-y-6 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Type the word below:</span>
              <div className="text-4xl md:text-5xl font-black text-brand-purple tracking-widest uppercase py-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                {typingWordsList[activeWordIdx]}
              </div>

              <input
                type="text"
                value={typingInput}
                onChange={handleTypeChange}
                placeholder="Type here..."
                autoFocus
                className="w-full text-center px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xl font-bold tracking-widest text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple uppercase"
              />
            </div>
          ) : (
            <div className="text-center space-y-6 animate-pulse-slow">
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">Time is Up!</h3>
              <div className="text-lg font-bold text-slate-500">Score reached: <span className="text-emerald-500">{typingScore} XP</span></div>
              <button
                onClick={startTypingGame}
                className="px-8 py-3.5 bg-brand-purple text-white font-extrabold rounded-2xl shadow hover:bg-brand-purple-dark transition-all"
                id="restart-typing-game"
              >
                Start Challenge
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
