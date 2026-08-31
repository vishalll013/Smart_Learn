import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Flame, Award, BookOpen, CheckCircle, Trophy, Calendar, FileText, X } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [badges, setBadges] = useState([]);
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Certificate modal
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await fetch('/api/dashboard/student', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setCourses(data.courseProgress);
          setQuizzes(data.quizHistory);
          setCerts(data.certificates);
          setBadges(data.stats.badges || []);
        }
      } catch (err) {
        console.warn("⚠️ API failed. Launching student metrics fallback.");
        
        // Mock fallback statistics matching Timmy's default seeded profile
        setStats({
          points: user.points || 240,
          streak: user.streak || 5,
          completedLessons: user.completedLessons || 4,
          dailyGoal: 30,
        });

        setCourses([
          {
            courseId: { _id: 'mock-c-1', title: 'Coding Adventures with Scratch', category: 'Coding for Kids', thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=400&auto=format&fit=crop' },
            progressPercent: 33,
            lastAccessed: new Date()
          },
          {
            courseId: { _id: 'mock-c-2', title: 'Fun with Fractions & Numbers', category: 'Mathematics', thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=400&auto=format&fit=crop' },
            progressPercent: 100,
            lastAccessed: new Date()
          }
        ]);

        setQuizzes([
          { quizTitle: 'Fractions Discovery Quiz', score: 2, maxScore: 2, completedAt: new Date().toISOString() }
        ]);

        setBadges(user.badges || [
          { name: 'First Step', description: 'Completed your first lesson!', icon: '🎯' },
          { name: 'Curious Mind', description: 'Completed 5 lessons!', icon: '📚' }
        ]);

        setCerts([
          { courseTitle: 'Fun with Fractions & Numbers', issuedAt: new Date().toISOString(), certificateId: 'CERT-FRACT123' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user]);

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4">
        <span className="text-4xl block">🛑</span>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Access Restricted</h2>
        <p className="text-slate-500 font-semibold">Please sign in as a student to inspect the Student Dashboard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-sky-100 dark:border-slate-800 pb-6">
        <div className="flex items-center space-x-4">
          <span className="text-5xl">👦</span>
          <div className="text-left space-y-1">
            <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">Hey, {user.name}!</h1>
            <p className="text-sm font-semibold text-slate-500">Ready to unlock some badges today? Let's check your stats.</p>
          </div>
        </div>

        {/* Mini stats row */}
        {stats && (
          <div className="flex space-x-4">
            <div className="bg-amber-50 dark:bg-amber-950/20 px-5 py-3 rounded-2xl border border-amber-100 dark:border-slate-800 flex items-center space-x-2">
              <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
              <div className="text-left leading-none">
                <span className="block text-xs font-bold text-slate-400">Streak</span>
                <span className="text-lg font-black text-slate-700 dark:text-amber-300">{stats.streak} Days</span>
              </div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/20 px-5 py-3 rounded-2xl border border-emerald-100 dark:border-slate-800 flex items-center space-x-2">
              <Award className="w-6 h-6 text-emerald-500" />
              <div className="text-left leading-none">
                <span className="block text-xs font-bold text-slate-400">Points</span>
                <span className="text-lg font-black text-slate-700 dark:text-emerald-300">{stats.points} XP</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-blue mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Grid Left: Course progresses & Quizzes */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Courses Progress */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center">
                <BookOpen className="w-5.5 h-5.5 mr-2 text-brand-blue" /> My Enrolled Courses
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-sky-100 dark:border-slate-700/50 shadow-sm flex flex-col justify-between space-y-4 hover-scale">
                    <div className="flex items-center space-x-3.5">
                      <img src={course.courseId?.thumbnail} alt="" className="w-12 h-12 object-cover rounded-xl shadow-inner bg-slate-100" />
                      <div className="text-left leading-tight">
                        <span className="text-[10px] font-black text-slate-400 uppercase">{course.courseId?.category}</span>
                        <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 line-clamp-1">{course.courseId?.title}</h4>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-400">
                        <span>Progress</span>
                        <span>{course.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-brand-blue h-full" style={{ width: `${course.progressPercent}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quiz history */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center">
                <CheckCircle className="w-5.5 h-5.5 mr-2 text-brand-green" /> Quiz Performance
              </h2>

              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-sky-100 dark:border-slate-700/50 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm font-semibold border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-bold">
                      <th className="p-4">Quiz Title</th>
                      <th className="p-4">Attempt Date</th>
                      <th className="p-4 text-right">Score achieved</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {quizzes.map((q, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/10">
                        <td className="p-4 font-extrabold text-slate-800 dark:text-slate-200">{q.quizTitle}</td>
                        <td className="p-4 text-xs text-slate-400">{new Date(q.completedAt).toLocaleDateString()}</td>
                        <td className="p-4 text-right font-black text-brand-green">
                          {q.score} / {q.maxScore}
                        </td>
                      </tr>
                    ))}
                    {quizzes.length === 0 && (
                      <tr>
                        <td colSpan="3" className="p-8 text-center text-slate-400 font-bold">No quizzes attempted yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Main Grid Right: Badges & Certificates */}
          <div className="space-y-10">
            
            {/* Badges */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-4xl border border-sky-100 dark:border-slate-700/50 shadow-playful space-y-6">
              <h3 className="font-black text-lg text-slate-800 dark:text-slate-100 flex items-center">
                <Trophy className="w-5.5 h-5.5 mr-2 text-amber-500 fill-amber-500 animate-pulse" /> Badges Earned
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl text-center space-y-2 hover-scale">
                    <span className="text-4xl block">{badge.icon}</span>
                    <div className="leading-tight">
                      <span className="block font-black text-xs text-slate-800 dark:text-slate-100">{badge.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 leading-none">{badge.description}</span>
                    </div>
                  </div>
                ))}
                {badges.length === 0 && (
                  <div className="col-span-2 text-center text-slate-400 py-6 font-bold text-sm">No badges earned yet. Complete lessons to unlock!</div>
                )}
              </div>
            </div>

            {/* Certificates */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-4xl border border-sky-100 dark:border-slate-700/50 shadow-playful space-y-6">
              <h3 className="font-black text-lg text-slate-800 dark:text-slate-100 flex items-center">
                <FileText className="w-5.5 h-5.5 mr-2 text-brand-purple" /> Course Certificates
              </h3>

              <div className="space-y-3">
                {certs.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCert(c)}
                    className="w-full p-4 rounded-2xl bg-gradient-to-tr from-brand-purple/10 to-brand-purple-light/20 hover:from-brand-purple hover:to-brand-purple-dark text-brand-purple hover:text-white dark:text-purple-300 font-extrabold text-sm text-left flex justify-between items-center transition-all border border-brand-purple/20 shadow-sm"
                    id={`open-cert-btn-${idx}`}
                  >
                    <span>🎓 {c.courseTitle}</span>
                    <span className="text-xs uppercase font-black underline">View Diploma</span>
                  </button>
                ))}
                {certs.length === 0 && (
                  <div className="text-center text-slate-400 py-6 font-bold text-sm">Complete a course 100% to generate diplomas!</div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Diploma Certificate Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <div className="bg-white rounded-5xl border-8 border-amber-400 shadow-2xl p-8 max-w-2xl w-full text-center relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400"></div>
            
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute right-4 top-6 p-2 rounded-full hover:bg-slate-100 text-slate-400"
              aria-label="Close Diploma Modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Certificate Border decoration */}
            <div className="border-4 border-double border-slate-200 p-8 rounded-3xl space-y-6">
              <span className="text-6xl block">🎓</span>
              <span className="text-xs font-black uppercase text-amber-500 tracking-widest block">DIPLOMA OF COMPLETION</span>
              
              <div className="space-y-2">
                <p className="text-xs text-slate-400 font-bold italic">This honors credentials certify that</p>
                <h3 className="text-3xl font-black text-slate-800 font-serif leading-tight">{user.name}</h3>
                <p className="text-xs text-slate-400 font-bold italic">has successfully completed all milestones for the course</p>
              </div>

              <h4 className="text-xl md:text-2xl font-black text-brand-blue leading-snug">{selectedCert.courseTitle}</h4>
              
              <div className="flex justify-between items-end border-t border-slate-100 pt-6 mt-8 text-xs font-bold text-slate-400">
                <div className="text-left">
                  <span>Issued Date</span>
                  <span className="block text-slate-700 mt-0.5">{new Date(selectedCert.issuedAt).toLocaleDateString()}</span>
                </div>
                <div className="text-right">
                  <span>Verification ID</span>
                  <span className="block text-slate-700 mt-0.5 font-mono">{selectedCert.certificateId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
