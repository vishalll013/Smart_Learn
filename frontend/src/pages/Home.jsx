import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, GraduationCap, Users, BookOpen, Award, CheckCircle, Calendar, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const stats = [
    { label: 'Students Enrolled', value: '15,240+', icon: Users, color: 'bg-blue-500' },
    { label: 'Courses Available', value: '80+', icon: BookOpen, color: 'bg-green-500' },
    { label: 'Quizzes Completed', value: '120k+', icon: Award, color: 'bg-yellow-500' },
    { label: 'Expert Teachers', value: '45+', icon: GraduationCap, color: 'bg-purple-500' },
  ];

  const featuredCourses = [
    {
      title: 'Coding Adventures with Scratch',
      category: 'Coding for Kids',
      level: 'Beginner',
      duration: '3 hours',
      rating: 4.9,
      students: 4890,
      thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=400&auto=format&fit=crop',
    },
    {
      title: 'Space Explorers: Our Solar System',
      category: 'Science',
      level: 'Intermediate',
      duration: '4 hours',
      rating: 4.8,
      students: 3120,
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop',
    },
    {
      title: 'Fun with Fractions & Numbers',
      category: 'Mathematics',
      level: 'Beginner',
      duration: '2 hours',
      rating: 4.7,
      students: 2840,
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=400&auto=format&fit=crop',
    }
  ];

  const testimonials = [
    {
      name: 'Timmy Parker',
      age: 8,
      text: 'SmartLearn helped me write my first program! Now I make cats dance on my screen. I love the points!',
      avatar: '👦',
      color: 'border-blue-400 bg-blue-50/50 dark:bg-blue-950/20'
    },
    {
      name: 'Sarah Jenkins',
      age: 12,
      text: 'The solar system course was amazing! The 3D quiz and cards helped me pass my science quiz at school with an A!',
      avatar: '👧',
      color: 'border-green-400 bg-green-50/50 dark:bg-green-950/20'
    },
    {
      name: 'Mrs. Lisa Cole (Teacher)',
      age: 'Adult',
      text: 'I upload worksheets and monitor progress easily. My classroom engagement has doubled since using SmartLearn.',
      avatar: '👩‍🏫',
      color: 'border-purple-400 bg-purple-50/50 dark:bg-purple-950/20'
    }
  ];

  const upcomingEvents = [
    {
      title: 'Weekly Math Challenge',
      date: 'Monday, July 2nd',
      description: 'Test your calculation speed in Math Explorer and win double points!',
      tag: 'Competition'
    },
    {
      title: 'Virtual Chemistry Lab Day',
      date: 'Wednesday, July 4th',
      description: 'Learn how elements mix to generate colorful results. Live simulation streaming.',
      tag: 'Live Experiment'
    },
    {
      title: 'Scratch Coding Hackathon',
      date: 'Friday, July 6th',
      description: 'Develop a short story game using loops. Certificates issued to all participants.',
      tag: 'Hackathon'
    }
  ];

  return (
    <div className="space-y-20 pb-20 overflow-x-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-sky-100 via-transparent to-transparent dark:from-slate-900/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Hero Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-center lg:text-left"
          >
            <span className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-brand-orange/10 dark:bg-brand-orange/20 text-brand-orange font-bold text-sm">
              <Star className="w-4 h-4 fill-brand-orange" />
              <span>Learn and Level Up!</span>
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
              Learn, Play, and <br />
              <span className="bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent">
                Grow Every Day!
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-semibold max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Explore interactive courses in math, science, and coding. Play games, earn badges, and track your achievements on your personalized student dashboard!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/courses"
                className="w-full sm:w-auto px-8 py-4 rounded-3xl bg-brand-blue text-white font-extrabold text-lg shadow-lg hover:bg-brand-blue-dark hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2"
                id="hero-start-learning-btn"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/games"
                className="w-full sm:w-auto px-8 py-4 rounded-3xl bg-white dark:bg-slate-800 text-brand-blue dark:text-sky-400 font-extrabold text-lg shadow-md border border-sky-100 dark:border-slate-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                id="hero-explore-courses-btn"
              >
                Explore Games
              </Link>
            </div>
          </motion.div>

          {/* Hero Right Animation Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center relative"
          >
            {/* Playful Floating Circles Backdrop */}
            <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-brand-blue/10 dark:bg-brand-blue/5 blur-xl animate-pulse-slow"></div>
            <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-brand-green/10 dark:bg-brand-green/5 blur-xl animate-pulse-slow"></div>

            {/* Simulated interactive kid learning graphic */}
            <div className="relative bg-gradient-to-br from-brand-blue-light to-white dark:from-slate-800 dark:to-slate-900 border-4 border-white dark:border-slate-800 p-8 rounded-5xl shadow-playful w-full max-w-md hover:rotate-2 transition-transform duration-300">
              <div className="flex items-center justify-between border-b border-sky-100 dark:border-slate-800 pb-4 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl">👦</span>
                  <div className="text-left">
                    <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100">Timmy</div>
                    <div className="text-xs font-semibold text-slate-400">Level 4 Coder</div>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-green-light dark:bg-emerald-950/20 text-brand-green text-xs font-bold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Online</span>
                </div>
              </div>

              {/* Progress bars inside card */}
              <div className="space-y-4 text-left">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                    <span>Scratch Coding</span>
                    <span>75% Done</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                    <div className="bg-brand-blue h-full rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                    <span>Math Fractions</span>
                    <span>100% Done</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                    <div className="bg-brand-green h-full rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                {/* Floating badge mocks inside illustration */}
                <div className="flex gap-2 pt-4">
                  <div className="bg-amber-100 dark:bg-amber-950/30 p-2.5 rounded-2xl flex items-center justify-center" title="First Lesson Completed">
                    <span className="text-2xl" role="img" aria-label="Target">🎯</span>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-950/30 p-2.5 rounded-2xl flex items-center justify-center" title="5 Days Streak">
                    <span className="text-2xl" role="img" aria-label="Flame">🔥</span>
                  </div>
                  <div className="bg-sky-100 dark:bg-sky-950/30 p-2.5 rounded-2xl flex items-center justify-center" title="Quiz Master">
                    <span className="text-2xl" role="img" aria-label="Crown">👑</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. Statistical Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-4xl border border-sky-100/50 dark:border-slate-700/30 shadow-playful flex flex-col items-center text-center hover-scale"
              >
                <div className={`${stat.color} text-white p-4 rounded-3xl shadow-md mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-slate-400">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100">
            Featured Courses For You
          </h2>
          <p className="text-slate-500 font-semibold">
            Choose from science voyages, programming logic, and interactive mathematical quizzes to kickstart your study session.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map((course, idx) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-4xl overflow-hidden border border-sky-100 dark:border-slate-700/50 shadow-playful hover-scale flex flex-col"
            >
              {/* Thumbnail */}
              <div className="h-48 overflow-hidden relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-brand-blue dark:text-sky-300 font-bold text-xs">
                  {course.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 text-left flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 uppercase tracking-wider">{course.level}</span>
                    <span>⏱️ {course.duration}</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 line-clamp-1">
                    {course.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center text-yellow-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-yellow-500 mr-1" />
                    <span>{course.rating}</span>
                  </div>
                  <Link
                    to="/courses"
                    className="px-4 py-2.5 rounded-2xl bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue dark:text-sky-300 font-bold text-xs hover:bg-brand-blue hover:text-white transition-all flex items-center space-x-1"
                  >
                    <span>Start Learning</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Student Testimonials */}
      <section className="bg-sky-50/50 dark:bg-slate-800/20 py-16 px-4 sm:px-6 lg:px-8 border-y border-sky-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100">
              Reviews from our Smart Learners
            </h2>
            <p className="text-slate-500 font-semibold mt-2">
              Hear directly from students, teachers, and parents about how SmartLearn is changing standard study routines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className={`p-8 rounded-4xl border-2 shadow-sm flex flex-col justify-between text-left ${t.color}`}
              >
                <p className="font-bold text-slate-600 dark:text-slate-300 italic mb-6">
                  "{t.text}"
                </p>
                <div className="flex items-center space-x-3.5">
                  <span className="text-4xl">{t.avatar}</span>
                  <div>
                    <h4 className="font-extrabold text-slate-800 dark:text-slate-100">{t.name}</h4>
                    <span className="text-xs font-bold text-slate-400 capitalize">
                      {t.age === 'Adult' ? 'Community' : `Age ${t.age}`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Calendar of Events */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-green/10 dark:bg-brand-green/20 text-brand-green font-bold text-xs mb-2">
            <Calendar className="w-4 h-4" />
            <span>Learning Calendar</span>
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100">
            Upcoming Educational Events
          </h2>
        </div>

        <div className="space-y-6 text-left">
          {upcomingEvents.map((event, idx) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-sky-100 dark:border-slate-700/50 shadow-playful flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover-scale"
            >
              <div className="space-y-1.5">
                <span className="px-2.5 py-0.5 rounded-md bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20 dark:text-sky-300 font-extrabold text-xs">
                  {event.tag}
                </span>
                <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">
                  {event.title}
                </h3>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {event.description}
                </p>
              </div>

              <div className="flex flex-col items-start md:items-end justify-center min-w-[140px] text-brand-orange">
                <span className="font-bold text-sm uppercase tracking-wider">Date & Time</span>
                <span className="font-extrabold text-base">{event.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
