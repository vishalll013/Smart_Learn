import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, BookOpen, AlertCircle, FileText, Check, Award, Upload } from 'lucide-react';

export default function TeacherDashboard() {
  const { user } = useAuth();
  
  // Dashboard Analytics
  const [stats, setStats] = useState({ coursesCount: 0, quizzesCount: 0, studentsCount: 0, announcementsCount: 0 });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms State
  const [courseForm, setCourseForm] = useState({
    title: '', category: 'Coding for Kids', description: '', difficulty: 'Beginner', duration: '2 hours',
    lessons: [{ title: 'Welcome Lesson', type: 'reading', content: 'Type lesson chapters here...' }]
  });
  
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '', roleTarget: 'all' });
  const [resourceForm, setResourceForm] = useState({ title: '', description: '', category: 'Mathematics', type: 'pdf', url: 'https://example.com/file.pdf', size: '1.2 MB' });
  
  const [submittedCourse, setSubmittedCourse] = useState(false);
  const [submittedAnnounce, setSubmittedAnnounce] = useState(false);
  const [submittedResource, setSubmittedResource] = useState(false);

  useEffect(() => {
    const fetchTeacherStats = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await fetch('/api/dashboard/teacher', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setStudents(data.students);
        }
      } catch (err) {
        console.warn("⚠️ API offline. Initializing teacher layout templates.");
        
        // Mock fallback statistics matching Timmy's default seeded profile
        setStats({
          coursesCount: 3,
          quizzesCount: 3,
          studentsCount: 1,
          announcementsCount: 2
        });

        setStudents([
          { studentId: 'timmy-id', name: 'Timmy Parker', email: 'student@smartlearn.com', points: 240, completedLessonsTotal: 4, courseEnrolledCount: 2 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherStats();
  }, [user]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setSubmittedCourse(true);
    
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(courseForm)
      });
      const data = await res.json();
      if (data.success) {
        alert("✨ Course published successfully!");
        setCourseForm({
          title: '', category: 'Coding for Kids', description: '', difficulty: 'Beginner', duration: '2 hours',
          lessons: [{ title: 'Welcome Lesson', type: 'reading', content: 'Type lesson chapters here...' }]
        });
      }
    } catch (err) {
      console.warn("⚠️ API offline. Mock simulation course creation.");
      alert("✨ Course published successfully (Mock Mode)!");
      setCourseForm({
        title: '', category: 'Coding for Kids', description: '', difficulty: 'Beginner', duration: '2 hours',
        lessons: [{ title: 'Welcome Lesson', type: 'reading', content: 'Type lesson chapters here...' }]
      });
    } finally {
      setSubmittedCourse(false);
    }
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    setSubmittedAnnounce(true);

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(announcementForm)
      });
      const data = await res.json();
      if (data.success) {
        alert("📣 Announcement published successfully!");
        setAnnouncementForm({ title: '', content: '', roleTarget: 'all' });
      }
    } catch (err) {
      console.warn("⚠️ API offline. Mock announcement simulation.");
      alert("📣 Announcement posted successfully (Mock Mode)!");
      setAnnouncementForm({ title: '', content: '', roleTarget: 'all' });
    } finally {
      setSubmittedAnnounce(false);
    }
  };

  const handlePostResource = async (e) => {
    e.preventDefault();
    setSubmittedResource(true);

    try {
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(resourceForm)
      });
      const data = await res.json();
      if (data.success) {
        alert("📁 Resource worksheet published successfully!");
        setResourceForm({ title: '', description: '', category: 'Mathematics', type: 'pdf', url: 'https://example.com/file.pdf', size: '1.2 MB' });
      }
    } catch (err) {
      console.warn("⚠️ API offline. Mock worksheet upload.");
      alert("📁 Worksheet uploaded successfully (Mock Mode)!");
      setResourceForm({ title: '', description: '', category: 'Mathematics', type: 'pdf', url: 'https://example.com/file.pdf', size: '1.2 MB' });
    } finally {
      setSubmittedResource(false);
    }
  };

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4">
        <span className="text-4xl block">🛑</span>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Access Restricted</h2>
        <p className="text-slate-500 font-semibold">Please sign in as a Teacher to inspect the Teacher Dashboard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-12">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-sky-100 dark:border-slate-800 pb-6">
        <div className="text-left space-y-1">
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">Teacher Central</h1>
          <p className="text-sm font-semibold text-slate-500">Create interactive lessons, upload resources, and monitor student metrics.</p>
        </div>

        {/* Analytics stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'My Courses', val: stats.coursesCount, col: 'text-brand-blue bg-sky-50 dark:bg-sky-950/20' },
            { label: 'Quizzes Created', val: stats.quizzesCount, col: 'text-brand-orange bg-orange-50 dark:bg-orange-950/20' },
            { label: 'Students Enrolled', val: stats.studentsCount, col: 'text-brand-green bg-emerald-50 dark:bg-emerald-950/20' },
            { label: 'Announcements', val: stats.announcementsCount, col: 'text-brand-purple bg-purple-50 dark:bg-purple-950/20' }
          ].map((st, i) => (
            <div key={i} className={`p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center ${st.col}`}>
              <span className="block text-2xl font-black">{st.val}</span>
              <span className="block text-[10px] font-bold text-slate-400">{st.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Columns: Forms creators */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Create Course Form */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-4xl border border-sky-100 dark:border-slate-700/50 shadow-playful space-y-6">
            <h2 className="font-extrabold text-2xl text-slate-800 dark:text-slate-100 flex items-center">
              <Plus className="w-6 h-6 mr-1.5 text-brand-blue" /> Publish New Course
            </h2>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Course Title</label>
                  <input
                    type="text"
                    required
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    placeholder="e.g. Science Beaker Lab"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Category</label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold focus:outline-none text-sm"
                  >
                    {['Mathematics', 'Science', 'English', 'Computer Skills', 'Coding for Kids', 'General Knowledge', 'Environmental Studies', 'Creative Arts'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Difficulty</label>
                  <select
                    value={courseForm.difficulty}
                    onChange={(e) => setCourseForm({ ...courseForm, difficulty: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold focus:outline-none text-sm"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Estimated Duration</label>
                  <input
                    type="text"
                    required
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    placeholder="e.g. 4 hours"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Description</label>
                <textarea
                  required
                  rows="3"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Summarize course goals..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                ></textarea>
              </div>

              <div className="bg-sky-50/50 dark:bg-slate-900 p-4 rounded-2xl border border-sky-100 dark:border-slate-800 space-y-3">
                <span className="block text-xs font-black uppercase text-slate-400">Lesson 1 details:</span>
                <input
                  type="text"
                  required
                  value={courseForm.lessons[0].title}
                  onChange={(e) => {
                    const lessons = [...courseForm.lessons];
                    lessons[0].title = e.target.value;
                    setCourseForm({ ...courseForm, lessons });
                  }}
                  placeholder="Lesson Title"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-semibold focus:outline-none text-xs"
                />
                <textarea
                  required
                  rows="2"
                  value={courseForm.lessons[0].content}
                  onChange={(e) => {
                    const lessons = [...courseForm.lessons];
                    lessons[0].content = e.target.value;
                    setCourseForm({ ...courseForm, lessons });
                  }}
                  placeholder="Lesson content chapters..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-semibold focus:outline-none text-xs"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submittedCourse}
                className="w-full py-3 bg-brand-blue hover:bg-brand-blue-dark text-white font-extrabold text-sm rounded-2xl shadow transition-all flex items-center justify-center space-x-1.5"
                id="submit-new-course"
              >
                {submittedCourse ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Publish Course'}
              </button>
            </form>
          </div>

          {/* Worksheets Upload Form */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-4xl border border-sky-100 dark:border-slate-700/50 shadow-playful space-y-6">
            <h2 className="font-extrabold text-2xl text-slate-800 dark:text-slate-100 flex items-center">
              <Upload className="w-6 h-6 mr-1.5 text-brand-green" /> Upload Free Worksheet
            </h2>

            <form onSubmit={handlePostResource} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Resource Title</label>
                  <input
                    type="text"
                    required
                    value={resourceForm.title}
                    onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                    placeholder="e.g. Fractions Coloring Workbook"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold focus:outline-none text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Category Topic</label>
                  <select
                    value={resourceForm.category}
                    onChange={(e) => setResourceForm({ ...resourceForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold focus:outline-none text-sm"
                  >
                    {['Mathematics', 'Science', 'English', 'Coding for Kids', 'General Knowledge'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Description</label>
                <input
                  type="text"
                  required
                  value={resourceForm.description}
                  onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                  placeholder="Help parents understand printable instructions..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold focus:outline-none text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-green text-white font-extrabold text-sm rounded-2xl shadow transition-all"
                id="submit-new-resource"
              >
                Upload Resource Worksheet
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Students list and Announcement writer */}
        <div className="space-y-10">
          
          {/* Active students roster list */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-4xl border border-sky-100 dark:border-slate-700/50 shadow-playful space-y-6">
            <h3 className="font-black text-lg text-slate-800 dark:text-slate-100 flex items-center">
              <Award className="w-5.5 h-5.5 mr-2 text-brand-orange" /> Enrolled Students
            </h3>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {students.map((st, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                  <div className="text-left leading-tight">
                    <span className="block font-extrabold text-sm text-slate-700 dark:text-slate-200">{st.name}</span>
                    <span className="text-[10px] font-bold text-slate-400">Modules done: {st.completedLessonsTotal}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-brand-orange/10 text-brand-orange text-[10px] font-black">{st.points} XP</span>
                </div>
              ))}
              {students.length === 0 && (
                <div className="text-center text-slate-400 font-bold py-6 text-sm">No students enrolled yet.</div>
              )}
            </div>
          </div>

          {/* Announcement poster form */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-4xl border border-sky-100 dark:border-slate-700/50 shadow-playful space-y-6">
            <h3 className="font-black text-lg text-slate-800 dark:text-slate-100 flex items-center">
              <AlertCircle className="w-5.5 h-5.5 mr-2 text-brand-purple" /> Publish Notice
            </h3>

            <form onSubmit={handlePostAnnouncement} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Title</label>
                <input
                  type="text"
                  required
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                  placeholder="e.g. Weekly Coding Challenge"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Role Target</label>
                <select
                  value={announcementForm.roleTarget}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, roleTarget: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                >
                  <option value="all">Everyone (All)</option>
                  <option value="student">Students Only</option>
                  <option value="parent">Parents Only</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Message Content</label>
                <textarea
                  required
                  rows="3"
                  value={announcementForm.content}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                  placeholder="Post weekly tips..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-extrabold rounded-xl shadow"
                id="submit-announcement"
              >
                Post Announcement
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
