import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Mail, Send, Heart } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-t border-sky-100 dark:border-slate-800 transition-colors duration-300">
      
      {/* Top Wave Divider for playful kid themes */}
      <div className="w-full bg-[#f0f9ff] dark:bg-[#0f172a] h-6 overflow-hidden">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full fill-white dark:fill-slate-900">
          <path d="M985.6,92.8C1061.4,91,1110,64,1152,32V120H0V0C48,32,100,64,192,64c120,0,180-64,300-64C612,0,672,64,792,64c64,0,136-16,193.6-28.8L985.6,92.8z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Info and Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-brand-blue p-2 rounded-xl text-white">
                <Rocket className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">
                SmartLearn
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Interactive, gamified learning designed to empower students (ages 6–16), keep parents informed, and help teachers build classrooms.
            </p>
            <div className="text-xs text-slate-400">
              © {new Date().getFullYear()} SmartLearn Platform. All Rights Reserved.
            </div>
          </div>

          {/* Column 2: Links */}
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-4">Learn More</h3>
            <ul className="space-y-2.5 font-bold text-sm">
              <li>
                <Link to="/about" className="hover:text-brand-blue transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-brand-blue transition-colors">Explore Courses</Link>
              </li>
              <li>
                <Link to="/interactive" className="hover:text-brand-blue transition-colors">Interactive Activities</Link>
              </li>
              <li>
                <Link to="/quizzes" className="hover:text-brand-blue transition-colors">Quiz Center</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Dashboard Links */}
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-4">Portals</h3>
            <ul className="space-y-2.5 font-bold text-sm">
              <li>
                <Link to="/dashboard/student" className="hover:text-brand-blue transition-colors">Student Dashboard</Link>
              </li>
              <li>
                <Link to="/dashboard/parent" className="hover:text-brand-blue transition-colors">Parent Dashboard</Link>
              </li>
              <li>
                <Link to="/dashboard/teacher" className="hover:text-brand-blue transition-colors">Teacher Dashboard</Link>
              </li>
              <li>
                <Link to="/dashboard/admin" className="hover:text-brand-blue transition-colors">Admin Console</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-4">Join our Newsletter</h3>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Get monthly updates on free learning worksheets, planner PDFs, and math/coding tips.
            </p>
            <form onSubmit={handleSubscribe} className="relative flex">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter parent email"
                className="w-full pl-4 pr-12 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue text-slate-700 dark:text-slate-200 font-bold"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bg-brand-blue hover:bg-brand-blue-dark text-white p-2 rounded-xl transition-all"
                aria-label="Submit Newsletter"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            {subscribed && (
              <span className="block text-xs font-bold text-emerald-500 animate-bounce">
                🎉 Subscribed! Welcome to the family!
              </span>
            )}
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-100 dark:border-slate-800 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">
            Made with <Heart className="w-3.5 h-3.5 inline text-rose-500 fill-rose-500 mr-0.5 animate-pulse" /> for Young Explorers everywhere.
          </span>
          <div className="flex space-x-4 mt-4 md:mt-0 text-xs font-bold text-slate-400">
            <Link to="/contact" className="hover:underline">Support</Link>
            <span>•</span>
            <Link to="/about" className="hover:underline">Privacy Policy</Link>
            <span>•</span>
            <Link to="/about" className="hover:underline">Terms of Use</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
