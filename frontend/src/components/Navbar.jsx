import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Menu, X, Rocket, Award, Flame, User, LogOut, GraduationCap, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, logout, changeRoleDirectly } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleChange = (role) => {
    changeRoleDirectly(role);
    setShowRoleSwitcher(false);
    // Redirect to the appropriate dashboard
    if (role === 'student') navigate('/dashboard/student');
    else if (role === 'parent') navigate('/dashboard/parent');
    else if (role === 'teacher') navigate('/dashboard/teacher');
    else if (role === 'admin') navigate('/dashboard/admin');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Courses', path: '/courses' },
    { label: 'Interactive', path: '/interactive' },
    { label: 'Quizzes', path: '/quizzes' },
    { label: 'Games', path: '/games' },
    { label: 'Resources', path: '/resources' },
    { label: 'Contact', path: '/contact' },
  ];

  const getDashboardPath = (role) => {
    switch (role) {
      case 'student': return '/dashboard/student';
      case 'parent': return '/dashboard/parent';
      case 'teacher': return '/dashboard/teacher';
      case 'admin': return '/dashboard/admin';
      default: return '/';
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-sky-100 dark:border-slate-800 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-tr from-brand-blue to-brand-purple p-2.5 rounded-2xl text-white transform group-hover:rotate-12 transition-transform duration-300 shadow-md">
              <Rocket className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">
              SmartLearn
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-base font-bold transition-all duration-200 px-3 py-2 rounded-xl ${
                    isActive
                      ? 'text-brand-blue bg-brand-blue-light dark:bg-slate-800 dark:text-sky-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-brand-blue hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side Options (Auth + Theme Toggle) */}
          <div className="hidden lg:flex items-center space-x-4">
            
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 font-bold border border-amber-200/40 hover:bg-amber-100 transition-colors"
                id="role-demo-dropdown"
              >
                <GraduationCap className="w-5 h-5" />
                <span>Demo Account</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showRoleSwitcher && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-lg py-2 z-50">
                  <div className="px-3 py-1.5 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    Switch Active Role
                  </div>
                  {['student', 'parent', 'teacher', 'admin'].map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleChange(role)}
                      className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-700 capitalize flex items-center space-x-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-brand-blue"></span>
                      <span>{role} Dashboard</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile Info / Login */}
            {user ? (
              <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800 p-1.5 pr-4 rounded-full border border-slate-200/30">
                {/* Avatar / Link to Dashboard */}
                <Link
                  to={getDashboardPath(user.role)}
                  className="w-10 h-10 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue flex items-center justify-center font-black border border-brand-blue/20"
                >
                  {user.role === 'student' ? '👦' : user.role === 'parent' ? '👩' : user.role === 'teacher' ? '👩‍🏫' : '⚙️'}
                </Link>

                <div className="flex flex-col text-left">
                  <Link to={getDashboardPath(user.role)} className="text-sm font-extrabold text-slate-700 dark:text-slate-200 leading-tight hover:text-brand-blue">
                    {user.name.split(' ')[0]}
                  </Link>
                  <span className="text-xs font-medium text-slate-400 capitalize">{user.role}</span>
                </div>

                {user.role === 'student' && (
                  <div className="flex items-center space-x-2.5 ml-2 border-l border-slate-200 dark:border-slate-700 pl-3">
                    <div className="flex items-center text-amber-500 font-black text-sm" title="Streak Days">
                      <Flame className="w-4 h-4 fill-amber-500 mr-0.5 animate-pulse" />
                      <span>{user.streak || 0}</span>
                    </div>
                    <div className="flex items-center text-emerald-500 font-black text-sm" title="Coins/Points">
                      <Award className="w-4 h-4 mr-0.5" />
                      <span>{user.points || 0}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors ml-2"
                  title="Logout"
                  id="logout-btn"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-6 py-2.5 rounded-2xl bg-brand-blue text-white font-bold hover:bg-brand-blue-dark shadow-md hover:scale-105 active:scale-95 transition-all text-sm"
                  id="login-nav-btn"
                >
                  Login / Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center space-x-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none"
              aria-label="Toggle Mobile Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="xl:hidden bg-white dark:bg-slate-900 border-t border-sky-100 dark:border-slate-800 py-4 px-6 space-y-3 shadow-inner">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:text-brand-blue hover:bg-sky-50 dark:hover:bg-slate-800 text-base"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-col space-y-3">
            {/* Quick Demo Switcher Mobile */}
            <div className="bg-amber-50/50 dark:bg-amber-950/10 p-3 rounded-2xl border border-amber-100 dark:border-slate-800">
              <span className="block text-xs font-extrabold text-amber-700 dark:text-amber-400 mb-2">Switch Active Demo Role:</span>
              <div className="grid grid-cols-2 gap-2">
                {['student', 'parent', 'teacher', 'admin'].map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      handleRoleChange(role);
                      setIsOpen(false);
                    }}
                    className="py-2 text-center text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-sky-50 border border-slate-100 dark:border-slate-700 capitalize"
                  >
                    {role} Dashboard
                  </button>
                ))}
              </div>
            </div>

            {user ? (
              <div className="flex flex-col space-y-3 px-4 py-2">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">👦</span>
                  <div className="text-left">
                    <div className="text-sm font-extrabold text-slate-700 dark:text-slate-200">{user.name}</div>
                    <div className="text-xs font-bold text-slate-400 capitalize">{user.role}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm">
                  {user.role === 'student' && (
                    <>
                      <span className="flex items-center text-amber-500 font-extrabold">
                        <Flame className="w-4 h-4 fill-amber-500 mr-1" />
                        Streak: {user.streak}
                      </span>
                      <span className="flex items-center text-emerald-500 font-extrabold">
                        <Award className="w-4 h-4 mr-1" />
                        Points: {user.points}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={getDashboardPath(user.role)}
                    onClick={() => setIsOpen(false)}
                    className="flex-1 text-center py-2.5 rounded-xl bg-brand-blue text-white font-bold text-sm shadow-md"
                  >
                    My Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                      navigate('/login');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-red-500 dark:text-red-400 font-bold text-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center py-3 rounded-xl bg-brand-blue text-white font-bold text-sm shadow-md"
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
