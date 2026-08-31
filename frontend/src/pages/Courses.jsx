import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Star, Play, CheckCircle, BookOpen, Clock, X, Award, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Courses() {
  const { user, addPoints, awardBadge } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  
  // Active course for detailed lesson viewer
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [badgeAwarded, setBadgeAwarded] = useState(null);
  
  const categories = [
    'Mathematics',
    'Science',
    'English',
    'Computer Skills',
    'Coding for Kids',
    'General Knowledge',
    'Environmental Studies',
    'Creative Arts'
  ];

  // Fetch courses on mount & filter changes
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (category) queryParams.append('category', category);
        if (difficulty) queryParams.append('difficulty', difficulty);
        if (search) queryParams.append('search', search);

        const res = await fetch(`/api/courses?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setCourses(data.courses);
        }
      } catch (err) {
        console.warn("⚠️ API failed. Loading offline course data.");
        // Static mock fallback data
        const mockCourses = [
          {
            _id: 'mock-c-1',
            title: 'Coding Adventures with Scratch',
            category: 'Coding for Kids',
            description: 'Learn block-based coding and build your very first interactive story and games with Scratch!',
            difficulty: 'Beginner',
            duration: '3 hours',
            thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=400&auto=format&fit=crop',
            lessons: [
              { _id: 'l1', title: 'Welcome to Scratch Interface', type: 'video', content: 'In this video lesson, we explore the Scratch editor. Learn about the Sprite Stage, Block Palettes, and Script Area. Discover how dragging blocks controls character movement.', videoUrl: 'https://www.youtube.com/embed/t894eG_2aY4', durationMinutes: 10 },
              { _id: 'l2', title: 'Your First Motion Blocks', type: 'reading', content: 'Learn how to make your cat sprite walk, bounce off edges, and rotate! Motion blocks are colored blue and allow you to set positions and turns. Exercise: Try moving 50 steps!', durationMinutes: 12 },
              { _id: 'l3', title: 'Loops and Events Control', type: 'interactive', content: 'Get control of timing! Using "when green flag clicked" starts the program, and "forever" loops repeat scripts infinitely. Let us link key presses to controls.', durationMinutes: 15 }
            ]
          },
          {
            _id: 'mock-c-2',
            title: 'Fun with Fractions & Numbers',
            category: 'Mathematics',
            description: 'Understand fractions through visuals, pizza diagrams, and interactive fraction sliders!',
            difficulty: 'Beginner',
            duration: '2 hours',
            thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=400&auto=format&fit=crop',
            lessons: [
              { _id: 'l4', title: 'What is a Fraction?', type: 'reading', content: 'A fraction represents a part of a whole. It consists of a numerator (top number) and a denominator (bottom number). Imagine a pizza cut into 4 slices: 1 slice is 1/4 of the pizza!', durationMinutes: 15 },
              { _id: 'l5', title: 'Numerator vs Denominator', type: 'video', content: 'Watch this visual explanation to see how numerator and denominators change as parts are colored or removed.', videoUrl: 'https://www.youtube.com/embed/n0FZhQ_GkKw', durationMinutes: 8 }
            ]
          },
          {
            _id: 'mock-c-3',
            title: 'Space Explorers: Our Solar System',
            category: 'Science',
            description: 'Launch into orbit and explore the sun, rocky planets, gas giants, and moons in our solar system!',
            difficulty: 'Intermediate',
            duration: '4 hours',
            thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop',
            lessons: [
              { _id: 'l6', title: 'Our Star: The Sun', type: 'reading', content: 'The sun is a hot ball of glowing gases at the heart of our solar system. Its gravity holds everything in orbit. Without the sun, life on Earth would not exist!', durationMinutes: 15 },
              { _id: 'l7', title: 'The Inner Rocky Planets', type: 'reading', content: 'Learn about Mercury, Venus, Earth, and Mars. They are rocky, dense, and closest to the sun. Earth is the only planet containing liquid oceans and living creatures!', durationMinutes: 20 },
              { _id: 'l8', title: 'The Gas Giants', type: 'video', content: 'Take a virtual tour of Jupiter, Saturn, Uranus, and Neptune. These massive cold gas spheres feature large wind storms and icy ring tracks.', videoUrl: 'https://www.youtube.com/embed/libKVRa01L8', durationMinutes: 15 }
            ]
          }
        ];
        
        // Filter locally
        let filtered = mockCourses;
        if (category) filtered = filtered.filter(c => c.category === category);
        if (difficulty) filtered = filtered.filter(c => c.difficulty === difficulty);
        if (search) filtered = filtered.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
        
        setCourses(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [category, difficulty, search]);

  const handleStartLearning = (course) => {
    setActiveCourse(course);
    setActiveLesson(course.lessons[0]);
    
    // Pull completed lessons from database profile if available
    if (user && user.role === 'student') {
      // Simulate/pull local completions from state or localStorage
      const saved = localStorage.getItem(`completed_lessons_${user.id}_${course._id}`);
      setCompletedLessons(saved ? JSON.parse(saved) : []);
    } else {
      setCompletedLessons([]);
    }
  };

  const handleCompleteLesson = async (lessonId) => {
    if (!user) {
      alert("Please login as a Student to save your progress!");
      return;
    }
    if (user.role !== 'student') {
      alert("Only Student accounts can mark lessons as complete and earn points!");
      return;
    }

    // Try posting progress to DB
    try {
      const res = await fetch(`/api/courses/${activeCourse._id}/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        if (!completedLessons.includes(lessonId)) {
          const nextArr = [...completedLessons, lessonId];
          setCompletedLessons(nextArr);
          localStorage.setItem(`completed_lessons_${user.id}_${activeCourse._id}`, JSON.stringify(nextArr));
        }
        if (data.badgeAwarded) {
          setBadgeAwarded(data.badgeAwarded);
        }
        addPoints(data.pointsGained || 15);
      }
    } catch (err) {
      console.warn("⚠️ API offline, recording completion locally.");
      if (!completedLessons.includes(lessonId)) {
        const nextArr = [...completedLessons, lessonId];
        setCompletedLessons(nextArr);
        localStorage.setItem(`completed_lessons_${user.id}_${activeCourse._id}`, JSON.stringify(nextArr));
        addPoints(15);

        // Simulate local badge trigger
        let localBadge = null;
        const totalCompleted = (JSON.parse(localStorage.getItem('completed_total') || '0')) + 1;
        localStorage.setItem('completed_total', totalCompleted);

        if (totalCompleted === 1) {
          localBadge = { name: 'First Step', description: 'Completed your first lesson!', icon: '🎯' };
        } else if (totalCompleted === 5) {
          localBadge = { name: 'Curious Mind', description: 'Completed 5 lessons!', icon: '📚' };
        }
        
        if (localBadge) {
          awardBadge(localBadge);
          setBadgeAwarded(localBadge);
        }
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Search & Intro */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="text-left space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">Smart Courses</h1>
          <p className="text-slate-500 font-semibold">Choose your next adventure and complete quizzes to earn crowns!</p>
        </div>
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search math, coding, science..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8 justify-start">
        <button
          onClick={() => setCategory('')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
            !category 
              ? 'bg-brand-blue text-white shadow-md' 
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-sky-50'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
              category === cat 
                ? 'bg-brand-blue text-white shadow-md' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-sky-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Difficulty select */}
      <div className="flex items-center space-x-3 mb-10">
        <span className="font-bold text-slate-500 text-sm">Difficulty Level:</span>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue mx-auto"></div>
          <span className="block mt-4 font-bold text-slate-400">Loading your courses...</span>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-4xl border border-sky-100 dark:border-slate-700/50 p-8 shadow-sm">
          <span className="text-5xl block mb-4">🔍</span>
          <h3 className="font-extrabold text-xl text-slate-800 dark:text-slate-100">No courses found</h3>
          <p className="text-slate-500 font-semibold mt-1">Try resetting your search filter options.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white dark:bg-slate-800 rounded-4xl overflow-hidden border border-sky-100 dark:border-slate-700/50 shadow-playful hover-scale flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail */}
                <div className="h-44 relative bg-slate-100 dark:bg-slate-700">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-800/95 text-brand-blue dark:text-sky-300 font-bold text-xs shadow-md">
                    {course.category}
                  </span>
                </div>
                {/* Body */}
                <div className="p-6 text-left space-y-3">
                  <div className="flex items-center justify-between text-xs font-extrabold text-slate-400">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-brand-orange uppercase">{course.difficulty}</span>
                    <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {course.duration}</span>
                  </div>
                  <h3 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 leading-snug line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 line-clamp-3">
                    {course.description}
                  </p>
                </div>
              </div>

              {/* Progress and CTA */}
              <div className="p-6 pt-0 border-t border-slate-50 dark:border-slate-700/40 text-left space-y-4">
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs font-bold text-slate-400">Lessons: {course.lessons?.length || 0} tasks</span>
                  <button
                    onClick={() => handleStartLearning(course)}
                    className="px-5 py-2.5 rounded-2xl bg-brand-blue text-white font-extrabold text-sm shadow-md hover:bg-brand-blue-dark transition-all flex items-center space-x-1.5"
                    id={`start-learning-${course._id}`}
                  >
                    <span>Start Learning</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lesson Drawer Modal */}
      <AnimatePresence>
        {activeCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-slate-900 w-full max-w-4xl h-full rounded-3xl md:rounded-r-none md:rounded-l-4xl shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-brand-blue to-brand-purple p-6 text-white flex items-center justify-between">
                <div className="text-left">
                  <span className="text-xs font-extrabold bg-white/20 px-2 py-0.5 rounded uppercase">{activeCourse.category}</span>
                  <h2 className="font-extrabold text-xl md:text-2xl mt-1">{activeCourse.title}</h2>
                </div>
                <button
                  onClick={() => { setActiveCourse(null); setActiveLesson(null); }}
                  className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white"
                  aria-label="Close Course Drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lesson Viewer Content split */}
              <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
                
                {/* Left: Lessons List */}
                <div className="w-full md:w-80 border-r border-sky-50 dark:border-slate-800 overflow-y-auto p-4 space-y-2">
                  <h3 className="font-extrabold text-slate-400 text-xs uppercase tracking-wider mb-4 px-2">Course Lessons</h3>
                  {activeCourse.lessons?.map((lesson, idx) => {
                    const isCompleted = completedLessons.includes(lesson._id);
                    const isSelected = activeLesson?._id === lesson._id;
                    return (
                      <button
                        key={lesson._id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full text-left p-3.5 rounded-2xl flex items-start space-x-3 transition-all ${
                          isSelected
                            ? 'bg-sky-50 dark:bg-slate-800 border-2 border-brand-blue'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 border-2 border-transparent'
                        }`}
                      >
                        <div className={`mt-0.5 rounded-full p-1 ${isCompleted ? 'text-emerald-500' : 'text-slate-300'}`}>
                          <CheckCircle className="w-5 h-5 fill-current" />
                        </div>
                        <div className="text-left flex-grow">
                          <span className="block text-xs font-bold text-slate-400">Lesson {idx + 1}</span>
                          <span className="block font-bold text-sm text-slate-700 dark:text-slate-200 line-clamp-1">{lesson.title}</span>
                          <span className="text-xs font-semibold text-slate-400 capitalize">🎬 {lesson.type}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Right: Active Lesson Play area */}
                <div className="flex-grow overflow-y-auto p-6 md:p-8 text-left space-y-6">
                  {activeLesson ? (
                    <div className="space-y-6">
                      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                        <span className="px-2 py-0.5 rounded bg-brand-orange/10 text-brand-orange font-extrabold text-xs capitalize">{activeLesson.type} Mode</span>
                        <h2 className="font-extrabold text-2xl text-slate-800 dark:text-slate-100 mt-2">{activeLesson.title}</h2>
                      </div>

                      {/* Video embed */}
                      {activeLesson.type === 'video' && activeLesson.videoUrl && (
                        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                          <iframe
                            title={activeLesson.title}
                            src={activeLesson.videoUrl}
                            className="w-full h-full border-0"
                            allowFullScreen
                          ></iframe>
                        </div>
                      )}

                      {/* Reading content */}
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-sky-100/50 dark:border-slate-700/40 font-medium text-slate-600 dark:text-slate-300 leading-relaxed text-base space-y-4">
                        {activeLesson.content.split('\n').map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>

                      {/* Complete Action Panel */}
                      <div className="flex flex-wrap items-center justify-between gap-4 bg-sky-50/50 dark:bg-slate-800/20 p-5 rounded-3xl border border-sky-100 dark:border-slate-800">
                        <div className="text-left">
                          <span className="block font-extrabold text-slate-800 dark:text-slate-100">Ready to level up?</span>
                          <span className="text-xs font-semibold text-slate-400">Complete this lesson to earn 15 points!</span>
                        </div>
                        {completedLessons.includes(activeLesson._id) ? (
                          <span className="px-5 py-2.5 bg-emerald-500 text-white font-extrabold rounded-2xl text-sm flex items-center space-x-1.5 shadow">
                            <CheckCircle className="w-5 h-5" />
                            <span>Completed!</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCompleteLesson(activeLesson._id)}
                            className="px-6 py-3 bg-brand-green hover:bg-brand-green-dark text-white font-extrabold rounded-2xl text-sm shadow-md flex items-center space-x-1.5 transition-all"
                            id={`complete-lesson-btn-${activeLesson._id}`}
                          >
                            <span>Mark Completed (+15 XP)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                      <BookOpen className="w-12 h-12 mb-3" />
                      <span className="font-bold">Select a lesson to begin.</span>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge Awarded Popups */}
      <AnimatePresence>
        {badgeAwarded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
            <motion.div
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 100 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-5xl border-4 border-amber-400 shadow-2xl text-center max-w-sm space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400"></div>
              <span className="text-7xl block animate-bounce-slow mt-2">{badgeAwarded.icon}</span>
              <div className="space-y-1.5">
                <span className="text-xs font-extrabold text-amber-500 uppercase tracking-widest block">New Badge Earned!</span>
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{badgeAwarded.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-semibold">{badgeAwarded.description}</p>
              </div>
              <button
                onClick={() => setBadgeAwarded(null)}
                className="w-full py-3 rounded-2xl bg-brand-blue text-white font-extrabold text-sm shadow hover:bg-brand-blue-dark transition-all"
                id="close-badge-popup-btn"
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
