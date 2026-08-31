import React from 'react';
import { Target, Heart, Eye, Award, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  const values = [
    { title: 'Playful Learning', desc: 'Education is best when it feels like play. We embed interactive tasks to reward curiosities.', icon: Sparkles, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' },
    { title: 'Secure Environment', desc: 'Child protection is paramount. Our database uses role restrictions keeping children safe.', icon: Heart, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20' },
    { title: 'Gamified Growth', desc: 'Streaks, badges, and scores encourage students to stay regular with daily study targets.', icon: Award, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
    { title: 'Parent Alignment', desc: 'Keeping parents connected. Weekly emails and statistics grids keep monitoring transparent.', icon: BookOpen, color: 'text-brand-blue bg-sky-50 dark:bg-sky-950/20' },
  ];

  const teachers = [
    { name: 'Ms. Emily Harris', subject: 'Coding & Robotics', icon: '👩‍💻', bio: 'Former software developer passionate about teaching block logic and Scratch code structure to children.' },
    { name: 'Dr. Marcus Vance', subject: 'Physics & Astronomy', icon: '👨‍🚀', bio: 'Astrophysics PhD who excels at explaining outer space cycles and planetary orbits with easy visual tools.' },
    { name: 'Mrs. Clara Croft', subject: 'Elementary Math', icon: '👩‍🏫', bio: 'Over 12 years of public teaching experience. Dedicated to fractions, patterns, and geometric art.' }
  ];

  const methodologySteps = [
    { num: '1', title: 'Interactive Lesson', desc: 'Watch educational videos or read structured, child-friendly chapters.' },
    { num: '2', title: 'Playful Challenge', desc: 'Play Math or Logic matching games to practice concepts with high scores.' },
    { num: '3', title: 'Knowledge Check', desc: 'Attempt timed multiple-choice quizzes to verify retention and earn points.' },
    { num: '4', title: 'Unlock Badges', desc: 'Collect visual trophies, increment streaks, and download completion certificates.' }
  ];

  return (
    <div className="space-y-20 pb-20 overflow-x-hidden">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-sky-100 to-transparent dark:from-slate-900/50 py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue font-bold text-sm">
            About SmartLearn
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100">
            Inspiring the Next Generation of Thinkers
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
            SmartLearn is a digital platform designed for kids ages 6–16, providing gamified science, math, and coding courses. We connect parents, teachers, and students to build healthy habits.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-4xl border border-sky-100 dark:border-slate-700/50 shadow-playful space-y-4">
          <div className="p-3 bg-brand-blue/10 text-brand-blue rounded-2xl w-fit">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Our Mission</h2>
          <p className="text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
            To make high-quality educational resources engaging, colorful, and accessible to children worldwide. We believe standard learning methods can be upgraded with interactive games and quizzes.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-4xl border border-sky-100 dark:border-slate-700/50 shadow-playful space-y-4">
          <div className="p-3 bg-brand-green/10 text-brand-green rounded-2xl w-fit">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Our Vision</h2>
          <p className="text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
            To create a global classroom environment where children discover logical fields naturally, build software algorithms early, and earn achievements that build confidence.
          </p>
        </div>
      </section>

      {/* Why Smart Learn? (Values) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">Why Choose SmartLearn?</h2>
          <p className="text-slate-500 font-semibold mt-2">The core pillars of our kid-friendly ecosystem</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-sky-100 dark:border-slate-700/50 shadow-sm space-y-3.5 hover-scale">
                <div className={`p-3 rounded-2xl w-fit ${v.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">{v.title}</h3>
                <p className="text-sm font-semibold text-slate-400 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Methodology Section */}
      <section className="bg-sky-50/50 dark:bg-slate-800/20 py-16 px-4 border-y border-sky-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">Our Learning Methodology</h2>
            <p className="text-slate-500 font-semibold mt-2">A structured progress path to encourage child independence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {methodologySteps.map((step) => (
              <div key={step.num} className="relative bg-white dark:bg-slate-800 p-6 rounded-3xl border border-sky-100 dark:border-slate-700 shadow-sm space-y-3">
                <span className="absolute -top-4 right-4 bg-gradient-to-tr from-brand-blue to-brand-purple text-white font-black text-xl w-10 h-10 rounded-full flex items-center justify-center shadow-md">
                  {step.num}
                </span>
                <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 pt-2">{step.title}</h3>
                <p className="text-sm font-semibold text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet our Teachers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">Meet Our Expert Teachers</h2>
          <p className="text-slate-500 font-semibold mt-2">Inspiring educators driving our curriculum creations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {teachers.map((teacher) => (
            <div key={teacher.name} className="bg-white dark:bg-slate-800 p-6 rounded-4xl border border-sky-100 dark:border-slate-700/50 shadow-playful hover-scale flex flex-col items-center text-center">
              <span className="text-6xl mb-4 block" role="img" aria-label="teacher profile">{teacher.icon}</span>
              <h3 className="font-extrabold text-xl text-slate-800 dark:text-slate-100">{teacher.name}</h3>
              <span className="px-3 py-1 bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20 dark:text-sky-300 font-bold text-xs rounded-full mt-1.5 mb-4">
                {teacher.subject}
              </span>
              <p className="text-sm font-semibold text-slate-400 leading-relaxed">
                {teacher.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
