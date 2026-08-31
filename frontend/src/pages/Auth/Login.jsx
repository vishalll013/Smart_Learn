import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Mail, Lock, User, UserPlus } from 'lucide-react';

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  
  // Forms
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [parentEmail, setParentEmail] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await register(name, email, password, role, parentEmail);
        if (res.success) {
          navigate(getDashboardPath(role));
        } else {
          setError(res.message || 'Registration failed.');
        }
      } else {
        const res = await login(email, password);
        if (res.success) {
          // Fetch role from storage to navigate properly
          const loggedUser = JSON.parse(localStorage.getItem('user'));
          navigate(getDashboardPath(loggedUser.role));
        } else {
          setError(res.message || 'Invalid email or password.');
        }
      }
    } catch (err) {
      setError('Connection refused. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDashboardPath = (userRole) => {
    switch (userRole) {
      case 'student': return '/dashboard/student';
      case 'parent': return '/dashboard/parent';
      case 'teacher': return '/dashboard/teacher';
      case 'admin': return '/dashboard/admin';
      default: return '/';
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 text-left">
      
      {/* Visual Header */}
      <div className="text-center mb-8 space-y-2">
        <span className="text-5xl block animate-bounce-slow">🔐</span>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-slate-500 font-semibold">
          {isRegister ? 'Join our learning adventure!' : 'Sign in to check your streak points.'}
        </p>
      </div>

      {/* Main card */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-4xl border border-sky-100 dark:border-slate-700/50 shadow-playful space-y-6">
        
        {error && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-2xl text-xs font-bold border border-rose-100/50">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Johnny Appleseed"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
              />
            </div>
          </div>

          {isRegister && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">Account Type</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none text-sm"
                >
                  <option value="student">Student Account</option>
                  <option value="parent">Parent Account</option>
                  <option value="teacher">Teacher Account</option>
                </select>
              </div>

              {role === 'student' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Parent Email (Optional linking)</label>
                  <input
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    placeholder="parent@email.com"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                  />
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-blue hover:bg-brand-blue-dark text-white font-extrabold rounded-2xl shadow shadow-brand-blue/30 transition-all flex items-center justify-center space-x-2 text-base mt-6"
            id="auth-submit-btn"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : isRegister ? (
              <>
                <UserPlus className="w-5 h-5" />
                <span>Create Account</span>
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                <span>Secure Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Toggler */}
        <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-xs font-bold text-brand-blue hover:underline"
            id="auth-toggle-mode-btn"
          >
            {isRegister ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>
        </div>
      </div>

      {/* Demo Credentials Alert Info */}
      {!isRegister && (
        <div className="mt-8 p-5 bg-amber-50 dark:bg-amber-950/15 rounded-3xl border border-amber-200/40 dark:border-slate-800 text-xs text-amber-800 dark:text-amber-300 font-semibold leading-relaxed space-y-2">
          <span className="block font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">🔑 Demo Account Credentials:</span>
          <div>👨‍🎓 <strong>Student:</strong> student@smartlearn.com (Password: password123)</div>
          <div>👩‍👦 <strong>Parent:</strong> parent@smartlearn.com (Password: password123)</div>
          <div>👩‍🏫 <strong>Teacher:</strong> teacher@smartlearn.com (Password: password123)</div>
          <div>⚙️ <strong>Admin:</strong> admin@smartlearn.com (Password: password123)</div>
        </div>
      )}

    </div>
  );
}
