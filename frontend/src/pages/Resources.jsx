import React, { useState, useEffect } from 'react';
import { Download, Calendar, CheckSquare, Sparkles, BookOpen } from 'lucide-react';

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState('');

  // Study planner items
  const [planner, setPlanner] = useState([
    { id: 1, task: 'Complete Scratch Lesson 2', day: 'Monday', done: false },
    { id: 2, task: 'Math fractions coloring sheet', day: 'Tuesday', done: false },
    { id: 3, task: 'Space voyagers quiz challenge', day: 'Thursday', done: false },
    { id: 4, task: 'Play Memory Match 3 times', day: 'Friday', done: false }
  ]);
  const [newTask, setNewTask] = useState('');
  const [newTaskDay, setNewTaskDay] = useState('Monday');

  const categories = ['Mathematics', 'Science', 'English', 'Coding for Kids', 'General Knowledge'];

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filterCat) queryParams.append('category', filterCat);
        const res = await fetch(`/api/resources?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setResources(data.resources);
        }
      } catch (err) {
        console.warn("⚠️ API failed. Launching offline static worksheets.");
        const mockResources = [
          { _id: 'r1', title: 'Fun Math Worksheets: Fractions Coloring', description: 'Printable color-by-numbers fractions workbook for elementary students.', category: 'Mathematics', type: 'worksheet', url: '#', size: '1.4 MB', downloadsCount: 154 },
          { _id: 'r2', title: 'Scratch Cheat Sheet: Block Categories Reference', description: 'A 1-page quick PDF reference of all block color definitions and syntax.', category: 'Coding for Kids', type: 'pdf', url: '#', size: '800 KB', downloadsCount: 92 },
          { _id: 'r3', title: 'Solar System Study Planner & Fact Card Set', description: 'Beautiful printable cards about all planets and moons for memorization.', category: 'Science', type: 'pdf', url: '#', size: '2.5 MB', downloadsCount: 78 }
        ];
        
        let filtered = mockResources;
        if (filterCat) filtered = filtered.filter(r => r.category === filterCat);
        setResources(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [filterCat]);

  const handleDownload = async (resourceId) => {
    try {
      await fetch(`/api/resources/${resourceId}/download`, { method: 'POST' });
    } catch (err) {
      console.warn("⚠️ Offline download counter simulation.");
    }
    
    setResources(prev => prev.map(r => r._id === resourceId ? { ...r, downloadsCount: r.downloadsCount + 1 } : r));
    alert("📥 Download Started! File saved to your local device.");
  };

  const handleTogglePlanner = (id) => {
    setPlanner(prev => prev.map(p => p.id === id ? { ...p, done: !p.done } : p));
  };

  const handleAddPlanner = (e) => {
    e.preventDefault();
    if (!newTask) return;
    const item = {
      id: Date.now(),
      task: newTask,
      day: newTaskDay,
      done: false
    };
    setPlanner([...planner, item]);
    setNewTask('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      
      {/* Intro */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <span className="text-4xl">📂</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100">Study Resources</h1>
        <p className="text-slate-500 font-semibold">Printable worksheets, notes, cheatsheets, and personalized study planners.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Worksheets Downloads */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-sky-100 dark:border-slate-800 pb-4">
            <h2 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 flex items-center">
              <BookOpen className="w-5.5 h-5.5 mr-1.5 text-brand-blue" /> Worksheet Library
            </h2>

            {/* Category dropdown filter */}
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="">All Topics</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {resources.map((res) => (
                <div
                  key={res._id}
                  className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-sky-100 dark:border-slate-700/50 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover-scale"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20 dark:text-sky-300 text-[10px] font-black uppercase tracking-wider">
                        {res.category}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">📄 {res.size}</span>
                    </div>
                    <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 leading-tight">{res.title}</h3>
                    <p className="text-xs font-semibold text-slate-400 line-clamp-2 leading-relaxed">{res.description}</p>
                  </div>

                  <button
                    onClick={() => handleDownload(res._id)}
                    className="min-w-[130px] px-4 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1.5 shadow-md self-stretch sm:self-center"
                    id={`download-resource-${res._id}`}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download ({res.downloadsCount})</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Study Planner & Daily Tips */}
        <div className="space-y-8">
          
          {/* Study Planner widget */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-4xl border border-sky-100 dark:border-slate-700/50 shadow-playful space-y-6">
            <h2 className="font-black text-lg text-slate-800 dark:text-slate-100 flex items-center">
              <Calendar className="w-5.5 h-5.5 mr-2 text-brand-orange" /> Weekly Planner
            </h2>

            {/* Form */}
            <form onSubmit={handleAddPlanner} className="space-y-3">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add planner item..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/20 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
              <div className="flex space-x-2">
                <select
                  value={newTaskDay}
                  onChange={(e) => setNewTaskDay(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:outline-none"
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-blue text-white rounded-xl text-xs font-extrabold shadow"
                  id="add-planner-item-btn"
                >
                  Add Task
                </button>
              </div>
            </form>

            {/* Checklist */}
            <div className="space-y-3.5 pt-2 max-h-72 overflow-y-auto">
              {planner.map((p) => (
                <div key={p.id} className="flex items-start space-x-3 text-sm">
                  <input
                    type="checkbox"
                    checked={p.done}
                    onChange={() => handleTogglePlanner(p.id)}
                    className="mt-0.5 w-4.5 h-4.5 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                    id={`planner-check-${p.id}`}
                  />
                  <div className="text-left leading-snug">
                    <span className={`block font-bold ${p.done ? 'line-through text-slate-300 dark:text-slate-600' : 'text-slate-700 dark:text-slate-200'}`}>
                      {p.task}
                    </span>
                    <span className="text-[10px] font-black text-brand-orange uppercase">{p.day}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Study Tips */}
          <div className="bg-amber-50 dark:bg-amber-950/10 p-6 rounded-4xl border border-amber-200/30 dark:border-amber-950/30 space-y-4">
            <h3 className="font-extrabold text-amber-700 dark:text-amber-300 text-base flex items-center">
              <Sparkles className="w-5 h-5 mr-1.5 fill-amber-500 text-amber-500 animate-pulse" /> Study Tip of the Day
            </h3>
            <p className="text-xs font-semibold text-amber-900/70 dark:text-amber-400/80 leading-relaxed">
              💡 <strong>The Pomodoro Trick:</strong> Study coding or arithmetic for 25 minutes, then stand up and play a round of Memory Match for 5 minutes! Breaks help your brain organize memory channels much faster.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
