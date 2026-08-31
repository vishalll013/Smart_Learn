import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Award, CheckCircle, Clock, BookOpen, Flame, Bell, Settings, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ParentDashboard() {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChildIdx, setActiveChildIdx] = useState(0);

  // Settings states
  const [emailWeekly, setEmailWeekly] = useState(true);
  const [notifyBadges, setNotifyBadges] = useState(true);

  useEffect(() => {
    const fetchParentData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await fetch('/api/dashboard/parent', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setChildren(data.children);
        }
      } catch (err) {
        console.warn("⚠️ API failed. Launching parent monitoring fallbacks.");
        
        // Mock fallback statistics matching Timmy's default seeded profile
        setChildren([
          {
            childId: 'mock-student-id',
            name: 'Timmy Parker',
            email: 'student@smartlearn.com',
            points: 240,
            streak: 5,
            badges: [
              { name: 'First Step', description: 'Completed your first lesson!', icon: '🎯' },
              { name: 'Curious Mind', description: 'Completed 5 lessons!', icon: '📚' }
            ],
            courseProgress: [
              { courseId: { title: 'Coding Adventures with Scratch', category: 'Coding for Kids' }, progressPercent: 33 },
              { courseId: { title: 'Fun with Fractions & Numbers', category: 'Mathematics' }, progressPercent: 100 }
            ],
            quizHistory: [
              { quizTitle: 'Fractions Discovery Quiz', score: 2, maxScore: 2, completedAt: new Date().toISOString() }
            ],
            gameHistory: [
              { gameName: 'Math Explorer', score: 85 },
              { gameName: 'Memory Match', score: 120 }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchParentData();
  }, [user]);

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4">
        <span className="text-4xl block">🛑</span>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Access Restricted</h2>
        <p className="text-slate-500 font-semibold">Please sign in as a Parent to inspect the Parent Dashboard.</p>
      </div>
    );
  }

  const activeChild = children[activeChildIdx];

  // Map quiz history to simple Recharts chart dataset
  const chartData = activeChild?.quizHistory.map((item, idx) => ({
    name: `Quiz ${idx + 1}`,
    Score: Math.round((item.score / item.maxScore) * 100)
  })) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-sky-100 dark:border-slate-800 pb-6">
        <div className="text-left space-y-1">
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">Parent Dashboard</h1>
          <p className="text-sm font-semibold text-slate-500">Monitor your children's learning speeds, milestones, and test scores.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-blue mx-auto"></div>
        </div>
      ) : children.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-4xl border border-sky-100 dark:border-slate-700/50 p-8 shadow-sm">
          <span className="text-5xl block mb-4">👩‍👦</span>
          <h3 className="font-extrabold text-xl text-slate-800 dark:text-slate-100">No children linked</h3>
          <p className="text-slate-500 font-semibold mt-1">Students can input your email during sign up to link accounts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Children list & analytics charts */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Active Child Stats card */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-4xl border border-sky-100 dark:border-slate-700/50 shadow-playful space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-4">
                <div className="flex items-center space-x-3.5">
                  <span className="text-4xl">👦</span>
                  <div className="text-left leading-tight">
                    <h2 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">{activeChild.name}</h2>
                    <span className="text-xs font-semibold text-slate-400">{activeChild.email}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="bg-amber-50 dark:bg-amber-950/20 px-3.5 py-1.5 rounded-xl text-amber-500 font-extrabold text-xs flex items-center space-x-1 border border-amber-100/50 dark:border-slate-800">
                    <Flame className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{activeChild.streak} Days streak</span>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 px-3.5 py-1.5 rounded-xl text-emerald-500 font-extrabold text-xs flex items-center space-x-1 border border-emerald-100/50 dark:border-slate-800">
                    <Award className="w-3.5 h-3.5" />
                    <span>{activeChild.points} XP Coins</span>
                  </div>
                </div>
              </div>

              {/* Progress list */}
              <div className="space-y-4 text-left">
                <h3 className="font-black text-sm text-slate-400 uppercase tracking-wider">Course Progression</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeChild.courseProgress.map((cp, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between text-xs font-extrabold text-slate-500 mb-1.5 leading-tight">
                        <span className="line-clamp-1">{cp.courseId?.title}</span>
                        <span>{cp.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-brand-blue h-full" style={{ width: `${cp.progressPercent}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance charts */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-4xl border border-sky-100 dark:border-slate-700/50 shadow-playful space-y-6">
              <h3 className="font-black text-lg text-slate-800 dark:text-slate-100 flex items-center">
                <TrendingUp className="w-5.5 h-5.5 mr-2 text-brand-blue" /> Quiz Score timeline
              </h3>

              {chartData.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="Score" stroke="#0284c7" strokeWidth={3} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 font-bold text-sm">No quizzes completed yet by {activeChild.name}.</div>
              )}
            </div>

          </div>

          {/* Right Column: Settings & AI recommendations */}
          <div className="space-y-10">
            
            {/* Recommendations */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-4xl border border-sky-100 dark:border-slate-700/50 shadow-playful space-y-4">
              <h3 className="font-black text-base text-slate-800 dark:text-slate-100">🚀 Recommendations</h3>
              <p className="text-xs font-semibold text-slate-400 leading-relaxed">Based on {activeChild.name}'s progress in Math fractions, we recommend starting the Coding Adventures Scratch course to exercise arithmetic logic.</p>
            </div>

            {/* Parent Notification Preferences */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-4xl border border-sky-100 dark:border-slate-700/50 shadow-playful space-y-6">
              <h3 className="font-black text-lg text-slate-800 dark:text-slate-100 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-slate-400" /> Notifications Settings
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <span className="block font-extrabold text-sm text-slate-700 dark:text-slate-200">Email Weekly Reports</span>
                    <span className="block text-[10px] font-bold text-slate-400">Receive summary progress every Friday</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailWeekly}
                    onChange={() => setEmailWeekly(!emailWeekly)}
                    className="w-4.5 h-4.5 rounded text-brand-blue border-slate-300 focus:ring-brand-blue"
                    id="pref-weekly-email"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <span className="block font-extrabold text-sm text-slate-700 dark:text-slate-200">Badge Awards Alert</span>
                    <span className="block text-[10px] font-bold text-slate-400">Notification when child unlocks badges</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyBadges}
                    onChange={() => setNotifyBadges(!notifyBadges)}
                    className="w-4.5 h-4.5 rounded text-brand-blue border-slate-300 focus:ring-brand-blue"
                    id="pref-badge-alert"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
