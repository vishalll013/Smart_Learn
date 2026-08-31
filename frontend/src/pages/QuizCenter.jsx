import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, Timer, CheckCircle, XCircle, RefreshCw, Trophy, Zap, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuizCenter() {
  const { user, addPoints, awardBadge } = useAuth();
  
  const [quizzes, setQuizzes] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Quiz taking state
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]); // Student answers array
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerInstance, setTimerInstance] = useState(null);

  // Score display state
  const [showResults, setShowResults] = useState(false);
  const [resultsData, setResultsData] = useState(null);
  const [badgeUnlocked, setBadgeUnlocked] = useState(null);

  // Fetch quizzes and leaderboard
  useEffect(() => {
    const fetchQuizData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/quizzes');
        const data = await res.json();
        if (data.success) {
          setQuizzes(data.quizzes);
        }

        const lRes = await fetch('/api/quizzes/leaderboard');
        const lData = await lRes.json();
        if (lData.success) {
          setLeaderboard(lData.leaders);
        }
      } catch (err) {
        console.warn("⚠️ API failed. Launching offline Quiz Center configurations.");
        
        // Mock fallback quizzes
        const mockQuizzes = [
          {
            _id: 'q1',
            title: 'Scratch Coding Basics',
            category: 'Coding for Kids',
            difficulty: 'Beginner',
            timeLimitSeconds: 60,
            questions: [
              { questionText: 'What color are Motion blocks in Scratch?', options: ['Green', 'Blue', 'Purple', 'Orange'], correctAnswerIndex: 1, explanation: 'Motion blocks are colored blue and allow sprites to rotate or change coordinate position.' },
              { questionText: 'Which block is used to repeat commands forever?', options: ['If-Then block', 'Repeat 10 block', 'Forever block', 'Wait 1 Sec block'], correctAnswerIndex: 2, explanation: 'The Forever loop runs the blocks placed inside it continuously until the stop button is pressed.' },
              { questionText: 'What represents the background stage of a Scratch project?', options: ['Sprite', 'Costume', 'Backdrop', 'Block'], correctAnswerIndex: 2, explanation: 'Backdrops are images displayed on the stage background.' }
            ]
          },
          {
            _id: 'q2',
            title: 'Fractions Discovery Quiz',
            category: 'Mathematics',
            difficulty: 'Beginner',
            timeLimitSeconds: 45,
            questions: [
              { questionText: 'What is the top number of a fraction called?', options: ['Denominator', 'Integers', 'Numerator', 'Division'], correctAnswerIndex: 2, explanation: 'The top number is the Numerator representing selected parts. The bottom is the Denominator.' },
              { questionText: 'If you eat 3 out of 8 slices of a pizza, what fraction did you eat?', options: ['3/8', '8/3', '5/8', '1/3'], correctAnswerIndex: 0, explanation: '3 represents the parts eaten (numerator) and 8 represents total parts (denominator), giving 3/8.' }
            ]
          },
          {
            _id: 'q3',
            title: 'Solar System Voyage Quiz',
            category: 'Science',
            difficulty: 'Intermediate',
            timeLimitSeconds: 90,
            questions: [
              { questionText: 'Which planet is closest to the Sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], correctAnswerIndex: 2, explanation: 'Mercury orbits closest to the Sun, completing a year in just 88 Earth days.' },
              { questionText: 'What is the largest planet in our solar system?', options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'], correctAnswerIndex: 1, explanation: 'Jupiter is a massive gas giant, larger than all other planets combined.' },
              { questionText: 'Which planet is famous for its gorgeous rings?', options: ['Mars', 'Jupiter', 'Saturn', 'Mercury'], correctAnswerIndex: 2, explanation: 'Saturn features spectacular rings composed of trillions of ice chunks and rock particles.' }
            ]
          }
        ];
        setQuizzes(mockQuizzes);

        // Mock leaderboard
        const mockLeaders = [
          { name: 'Alice Miller', points: 420, streak: 8, badges: [1, 2, 3] },
          { name: 'Timmy Parker', points: 340, streak: 5, badges: [1, 2] },
          { name: 'Zack Chen', points: 290, streak: 4, badges: [1] },
          { name: 'Lucy Brown', points: 260, streak: 3, badges: [1] },
          { name: 'Sarah Jenkins', points: 240, streak: 5, badges: [1, 2] }
        ];
        setLeaderboard(mockLeaders);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  // Timer Hook
  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (quizStarted && timeLeft === 0) {
      // Auto-submit when timer hits zero
      handleSubmitQuiz(true);
    }
  }, [quizStarted, timeLeft]);

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setAnswers(Array(quiz.questions.length).fill(null));
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setTimeLeft(quiz.timeLimitSeconds);
    setQuizStarted(true);
    setShowResults(false);
    setResultsData(null);
    setBadgeUnlocked(null);
  };

  const handleSelectAnswer = (optIndex) => {
    setSelectedAnswer(optIndex);
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIdx] = optIndex;
    setAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < activeQuiz.questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedAnswer(answers[currentQuestionIdx + 1]); // Load pre-selected answer if backtracked
    } else {
      // Last question completed, submit quiz
      handleSubmitQuiz(false);
    }
  };

  const handleSubmitQuiz = async (timeExpired = false) => {
    setQuizStarted(false);
    const finalAnswers = answers.map(a => a === null ? -1 : a); // Replace unanswered with invalid index

    try {
      const res = await fetch(`/api/quizzes/${activeQuiz._id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ answers: finalAnswers })
      });
      const data = await res.json();
      
      if (data.success) {
        setResultsData(data);
        setShowResults(true);
        if (data.badgeAwarded) {
          awardBadge(data.badgeAwarded);
          setBadgeUnlocked(data.badgeAwarded);
        }
        addPoints(data.pointsEarned || 30);
      }
    } catch (err) {
      console.warn("⚠️ API submission failed. Simulating local scoring.");
      
      // Local evaluation fallback
      let correctCount = 0;
      const feedback = activeQuiz.questions.map((q, idx) => {
        const studentAnswer = finalAnswers[idx];
        const isCorrect = studentAnswer === q.correctAnswerIndex;
        if (isCorrect) correctCount++;
        return {
          questionText: q.questionText,
          options: q.options,
          studentAnswer,
          correctAnswer: q.correctAnswerIndex,
          isCorrect,
          explanation: q.explanation
        };
      });

      const maxScore = activeQuiz.questions.length;
      const scorePercent = Math.round((correctCount / maxScore) * 100);
      const pointsEarned = 10 + correctCount * 10 + (correctCount === maxScore ? 30 : 0);

      const localResult = {
        score: correctCount,
        maxScore,
        scorePercent,
        feedback,
        pointsEarned
      };

      setResultsData(localResult);
      setShowResults(true);
      addPoints(pointsEarned);

      // Local badge trigger
      if (correctCount === maxScore) {
        const perfectBadge = { name: 'Quiz Champ', description: 'Scored 100% on a quiz!', icon: '👑' };
        awardBadge(perfectBadge);
        setBadgeUnlocked(perfectBadge);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Quiz Dashboard Mode (Quiz selection & leaderboard) */}
      {!quizStarted && !showResults && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-left">
          
          {/* Left / Middle: Quiz List */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-1.5">
              <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">Quiz Center</h1>
              <p className="text-slate-500 font-semibold">Test your speed, solve multiple-choice answers, and win points!</p>
            </div>

            {loading ? (
              <div className="py-20 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-blue mx-auto"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-sky-100 dark:border-slate-700/50 shadow-sm flex flex-col justify-between space-y-4 hover-scale"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 uppercase tracking-wider">{quiz.difficulty}</span>
                        <span>⏱️ {quiz.timeLimitSeconds}s</span>
                      </div>
                      <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 leading-tight">{quiz.title}</h3>
                      <span className="block text-xs font-bold text-brand-blue">{quiz.category}</span>
                    </div>

                    <button
                      onClick={() => handleStartQuiz(quiz)}
                      className="w-full py-3 bg-brand-blue hover:bg-brand-blue-dark text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center space-x-1.5"
                      id={`start-quiz-${quiz._id}`}
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      <span>Start Quiz</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Leaderboard */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-4xl border border-sky-100 dark:border-slate-700/50 shadow-playful">
              <h2 className="font-black text-xl text-slate-800 dark:text-slate-100 mb-6 flex items-center">
                <Trophy className="w-5.5 h-5.5 text-amber-500 fill-amber-500 mr-2" /> Top Leaders
              </h2>
              
              <div className="space-y-4">
                {leaderboard.map((lead, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                        idx === 0 ? 'bg-amber-400 text-white' : idx === 1 ? 'bg-slate-300 text-slate-700' : 'bg-orange-200 text-orange-800'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="font-extrabold text-sm text-slate-700 dark:text-slate-200">{lead.name}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-emerald-500 font-extrabold text-sm">
                      <Award className="w-4 h-4" />
                      <span>{lead.points} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Quiz Active Solving Mode */}
      {quizStarted && activeQuiz && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-4xl border-2 border-sky-100 dark:border-slate-700 shadow-playful p-8 text-left space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-brand-blue uppercase">{activeQuiz.category}</span>
              <h2 className="font-black text-lg text-slate-800 dark:text-slate-100 leading-tight">{activeQuiz.title}</h2>
            </div>
            <div className="flex items-center space-x-1.5 px-4 py-2 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-2xl font-black text-sm">
              <Timer className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </div>
          </div>

          {/* Question Index Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-400">
              <span>Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}</span>
              <span>{Math.round(((currentQuestionIdx) / activeQuiz.questions.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-brand-blue h-full transition-all duration-300"
                style={{ width: `${((currentQuestionIdx + 1) / activeQuiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Text */}
          <h3 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 leading-snug">
            {activeQuiz.questions[currentQuestionIdx].questionText}
          </h3>

          {/* Answer Options list */}
          <div className="grid grid-cols-1 gap-4">
            {activeQuiz.questions[currentQuestionIdx].options.map((opt, oIdx) => (
              <button
                key={oIdx}
                onClick={() => handleSelectAnswer(oIdx)}
                className={`p-5 rounded-2xl border-2 text-left font-bold transition-all flex items-center space-x-3.5 ${
                  selectedAnswer === oIdx
                    ? 'border-brand-blue bg-sky-50/50 dark:bg-slate-900 text-brand-blue'
                    : 'border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-700 dark:text-slate-300'
                }`}
                id={`quiz-option-btn-${oIdx}`}
              >
                <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-black">
                  {String.fromCharCode(65 + oIdx)}
                </span>
                <span className="text-base">{opt}</span>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={() => { if (currentQuestionIdx > 0) { setCurrentQuestionIdx(currentQuestionIdx - 1); setSelectedAnswer(answers[currentQuestionIdx - 1]); } }}
              disabled={currentQuestionIdx === 0}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                currentQuestionIdx === 0 
                  ? 'bg-slate-50 dark:bg-slate-900 text-slate-300 cursor-not-allowed' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
              id="quiz-back-btn"
            >
              Back
            </button>

            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className={`px-6 py-2.5 rounded-xl font-extrabold text-sm transition-all shadow ${
                selectedAnswer === null 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-brand-blue hover:bg-brand-blue-dark text-white'
              }`}
              id="quiz-next-btn"
            >
              {currentQuestionIdx === activeQuiz.questions.length - 1 ? 'Submit answers' : 'Next Question'}
            </button>
          </div>
        </div>
      )}

      {/* Quiz Result feedback overview */}
      {showResults && resultsData && activeQuiz && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-4xl border-2 border-sky-100 dark:border-slate-700 shadow-playful p-8 text-left space-y-8">
          
          <div className="text-center space-y-4">
            <span className="text-7xl block animate-bounce-slow">🏆</span>
            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100">Quiz Completed!</h2>
            <div className="flex justify-center items-center space-x-6 bg-slate-50 dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 w-fit mx-auto">
              <div className="text-center px-4">
                <span className="block text-xs font-bold text-slate-400">Your Score</span>
                <span className="block text-3xl font-black text-brand-blue">{resultsData.score} / {resultsData.maxScore}</span>
              </div>
              <div className="text-center px-4 border-l border-slate-200 dark:border-slate-700">
                <span className="block text-xs font-bold text-slate-400">Score Percent</span>
                <span className="block text-3xl font-black text-brand-green">{resultsData.scorePercent}%</span>
              </div>
              <div className="text-center px-4 border-l border-slate-200 dark:border-slate-700">
                <span className="block text-xs font-bold text-slate-400">Points Gained</span>
                <span className="block text-3xl font-black text-amber-500">+{resultsData.pointsEarned} XP</span>
              </div>
            </div>
          </div>

          {/* Details breakdown */}
          <div className="space-y-6">
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Answers Review:</h3>
            <div className="space-y-4">
              {resultsData.feedback.map((item, idx) => (
                <div key={idx} className="p-5 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-2.5">
                  <div className="flex items-center space-x-2">
                    {item.isCorrect ? (
                      <CheckCircle className="w-5.5 h-5.5 text-emerald-500 fill-current" />
                    ) : (
                      <XCircle className="w-5.5 h-5.5 text-rose-500 fill-current" />
                    )}
                    <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Question {idx + 1}: {item.questionText}</span>
                  </div>
                  
                  <div className="text-xs font-bold pl-8 space-y-1 text-slate-500">
                    <div>Your answer: <span className={item.isCorrect ? 'text-emerald-500' : 'text-rose-500'}>{item.studentAnswer === -1 ? 'None' : item.options[item.studentAnswer]}</span></div>
                    <div>Correct answer: <span className="text-emerald-500">{item.options[item.correctAnswer]}</span></div>
                    {item.explanation && (
                      <div className="mt-2.5 bg-sky-50/50 dark:bg-slate-900 p-3 rounded-xl border border-sky-100/50 dark:border-slate-800 text-slate-500 font-semibold leading-relaxed">
                        💡 {item.explanation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Close CTA */}
          <button
            onClick={() => { setShowResults(false); setResultsData(null); setActiveQuiz(null); }}
            className="w-full py-3 bg-brand-blue hover:bg-brand-blue-dark text-white font-extrabold text-sm rounded-2xl shadow transition-all flex items-center justify-center space-x-1.5"
            id="finish-results-btn"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Back to Quiz Center</span>
          </button>
        </div>
      )}

      {/* Badge Unlocked Notification popup */}
      <AnimatePresence>
        {badgeUnlocked && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-5xl border-4 border-amber-400 shadow-2xl text-center max-w-sm space-y-5"
            >
              <span className="text-7xl block animate-bounce-slow">{badgeUnlocked.icon}</span>
              <div className="space-y-1">
                <span className="text-xs font-extrabold text-amber-500 uppercase tracking-wider block">New Achievements unlocked!</span>
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{badgeUnlocked.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-semibold">{badgeUnlocked.description}</p>
              </div>
              <button
                onClick={() => setBadgeUnlocked(null)}
                className="w-full py-3 bg-brand-blue hover:bg-brand-blue-dark text-white font-extrabold text-sm rounded-2xl shadow"
                id="close-achievement-popup-btn"
              >
                Awesome!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
