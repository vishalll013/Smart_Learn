import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Users, BookOpen, AlertCircle, FileText, Trash2, Key } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, studentsCount: 0, parentsCount: 0, teachersCount: 0, coursesCount: 0, quizzesCount: 0, announcementsCount: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [userList, setUserList] = useState([]);
  
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/admin', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setRecentActivity(data.recentActivity);
      }

      // Fetch user lists
      const uRes = await fetch('/api/auth/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const uData = await uRes.json();
      if (uData.success) {
        setUserList(uData.users);
      }
    } catch (err) {
      console.warn("⚠️ API offline. Launching admin diagnostics fallbacks.");
      
      // Mock metrics fallback
      setStats({
        totalUsers: 4,
        studentsCount: 1,
        parentsCount: 1,
        teachersCount: 1,
        coursesCount: 3,
        quizzesCount: 3,
        announcementsCount: 3
      });

      setRecentActivity([
        { studentName: 'Timmy Parker', type: 'Quiz Completed', details: 'Completed "Fractions Discovery Quiz" with score 2/2', date: new Date().toISOString() },
        { studentName: 'Timmy Parker', type: 'Certificate Earned', details: 'Earned certificate for "Fun with Fractions & Numbers"', date: new Date().toISOString() }
      ]);

      setUserList([
        { _id: '1', name: 'Super Admin', email: 'admin@smartlearn.com', role: 'admin' },
        { _id: '2', name: 'Ms. Emily Harris', email: 'teacher@smartlearn.com', role: 'teacher' },
        { _id: '3', name: 'Robert Parker', email: 'parent@smartlearn.com', role: 'parent' },
        { _id: '4', name: 'Timmy Parker', email: 'student@smartlearn.com', role: 'student' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("⚠️ Are you sure you want to remove this user from the system?")) {
      try {
        const res = await fetch(`/api/auth/users/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        if (data.success) {
          alert("👤 User removed successfully!");
          fetchAdminData();
        }
      } catch (err) {
        console.warn("⚠️ API offline. Simulating user deletion locally.");
        setUserList(prev => prev.filter(u => u._id !== userId));
        alert("👤 User deleted locally (Mock Mode)!");
      }
    }
  };

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4">
        <span className="text-4xl block">🛑</span>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Access Restricted</h2>
        <p className="text-slate-500 font-semibold">Please sign in as an Admin to inspect the Admin Dashboard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-12">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-sky-100 dark:border-slate-800 pb-6">
        <div className="text-left space-y-1">
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">Admin Control Console</h1>
          <p className="text-sm font-semibold text-slate-500">Monitor system analytics, database logs, and manage user memberships.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-blue mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Columns: User list table & analytics */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Analytics Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Members', val: stats.totalUsers, col: 'text-brand-blue bg-white dark:bg-slate-800' },
                { label: 'Total Students', val: stats.studentsCount, col: 'text-brand-orange bg-white dark:bg-slate-800' },
                { label: 'Total Courses', val: stats.coursesCount, col: 'text-brand-green bg-white dark:bg-slate-800' },
                { label: 'Announcements', val: stats.announcementsCount, col: 'text-brand-purple bg-white dark:bg-slate-800' }
              ].map((st, i) => (
                <div key={i} className={`p-5 rounded-3xl border border-sky-100 dark:border-slate-700/50 shadow-sm flex flex-col items-center text-center ${st.col}`}>
                  <span className="block text-2xl font-black">{st.val}</span>
                  <span className="block text-[10px] font-bold text-slate-400 mt-1">{st.label}</span>
                </div>
              ))}
            </div>

            {/* Manage Users table */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center">
                <Users className="w-5.5 h-5.5 mr-2 text-brand-blue" /> System User Directory
              </h2>

              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-sky-100 dark:border-slate-700/50 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm font-semibold border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-bold">
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                    {userList.map((usr) => (
                      <tr key={usr._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/10">
                        <td className="p-4 font-extrabold flex items-center space-x-2">
                          <span>{usr.role === 'student' ? '👦' : usr.role === 'parent' ? '👩' : usr.role === 'teacher' ? '👩‍🏫' : '⚙️'}</span>
                          <span>{usr.name}</span>
                        </td>
                        <td className="p-4 text-slate-500 dark:text-slate-400 font-bold">{usr.email}</td>
                        <td className="p-4 capitalize">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            usr.role === 'admin' ? 'bg-red-100 text-red-700' : usr.role === 'teacher' ? 'bg-purple-100 text-purple-700' : usr.role === 'parent' ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-brand-blue'
                          }`}>
                            {usr.role}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {usr.role !== 'admin' ? (
                            <button
                              onClick={() => handleDeleteUser(usr._id)}
                              className="p-2 bg-rose-50 dark:bg-rose-950/20 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950 rounded-xl transition-all"
                              title="Delete user"
                              id={`delete-user-btn-${usr._id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-600">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column: Recent Activity Logs */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-4xl border border-sky-100 dark:border-slate-700/50 shadow-playful space-y-6">
              <h3 className="font-black text-lg text-slate-800 dark:text-slate-100 flex items-center">
                <FileText className="w-5.5 h-5.5 mr-2 text-brand-purple" /> Recent Activity Feed
              </h3>

              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between items-center text-slate-400 font-extrabold">
                      <span className="text-slate-700 dark:text-slate-200">{activity.studentName}</span>
                      <span>{new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="font-black text-brand-blue">{activity.type}</div>
                    <p className="text-slate-500 font-semibold leading-relaxed mt-1">{activity.details}</p>
                  </div>
                ))}
                {recentActivity.length === 0 && (
                  <div className="text-center text-slate-400 font-bold py-10 text-sm">No recent quiz or progress activity logged.</div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
