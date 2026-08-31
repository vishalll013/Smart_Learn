import React, { useState } from 'react';
import { Send, MapPin, Phone, Mail, HelpCircle, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', role: 'parent', message: '' });
  const [submitted, setSubmitted] = useState(false);

  // Chat window state
  const [showChat, setShowChat] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: 'Hi there! I am Sparky, your SmartLearn assistant. Ask me anything about courses, quizzes, or streaks!' }
  ]);

  const [activeFaq, setActiveFaq] = useState(null);
  const faqs = [
    { q: 'Is SmartLearn safe for children?', a: 'Yes! SmartLearn is 100% kid-safe. We do not display public chats between children, and parent accounts monitor everything from their private dashboard.' },
    { q: 'How do children earn badges?', a: 'Children earn badges by completing lesson modules, getting 100% scores on quizzes, and maintaining study streaks (like logging in 5 days in a row).' },
    { q: 'Can a teacher add custom courses?', a: 'Absolutely! Teachers can use their custom dashboard to upload reading chapters, link YouTube videos, compile quizzes, and award marks.' },
    { q: 'How can I print my completion certificate?', a: 'Once a student achieves 100% completion in any course, a downloadable PDF certificate will instantly appear on their Student Dashboard.' }
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', role: 'parent', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatMsg) return;

    const userMsg = { sender: 'user', text: chatMsg };
    setChatHistory(prev => [...prev, userMsg]);
    setChatMsg('');

    // Simulated reply
    setTimeout(() => {
      let botReply = "I'm still learning! You can contact our support team at support@smartlearn.com for direct help.";
      const query = chatMsg.toLowerCase();
      if (query.includes('streak') || query.includes('fire')) {
        botReply = "🔥 Streaks increase every day you log in and complete at least one lesson! Don't miss a day or it resets!";
      } else if (query.includes('badge') || query.includes('points')) {
        botReply = "👑 You earn 15 points per lesson, 10 points per quiz question correct, and special badges for milestones!";
      } else if (query.includes('login') || query.includes('password')) {
        botReply = "🔐 You can use our demo credentials to test roles: student@smartlearn.com or parent@smartlearn.com with password 'password123'.";
      }

      setChatHistory(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      
      {/* Intro */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
        <span className="text-4xl">📞</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100">Get in Touch</h1>
        <p className="text-slate-500 font-semibold">Have questions? We are here to help students, parents, and teachers 24/7!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        
        {/* Left Column: Form */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-4xl border border-sky-100 dark:border-slate-700 shadow-playful space-y-6">
          <h2 className="font-extrabold text-2xl text-slate-800 dark:text-slate-100">Send us a Message</h2>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@email.com"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400">I am a...</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none"
              >
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="teacher">Teacher</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400">Your Message</label>
              <textarea
                required
                rows="4"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="How can we help you?"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-brand-blue hover:bg-brand-blue-dark text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2"
              id="submit-contact-form"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>

          {submitted && (
            <div className="text-sm font-extrabold text-emerald-500 text-center animate-bounce">
              🎉 Message Sent! We will get back to you within 24 hours.
            </div>
          )}
        </div>

        {/* Right Column: Physical Info & Map */}
        <div className="space-y-8 flex flex-col justify-between">
          
          <div className="bg-white dark:bg-slate-800 p-8 rounded-4xl border border-sky-100 dark:border-slate-700 shadow-playful space-y-6">
            <h2 className="font-extrabold text-xl text-slate-800 dark:text-slate-100">Contact Details</h2>
            
            <div className="space-y-4 font-semibold text-slate-500 dark:text-slate-300">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-brand-blue" />
                <span>123 Learning Boulevard, Education City, CA 94016</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-brand-green" />
                <span>+1 (800) 555-LEARN</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-brand-orange" />
                <span>support@smartlearn.com</span>
              </div>
            </div>
          </div>

          {/* Interactive Map Mock */}
          <div className="h-64 rounded-4xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-playful relative bg-sky-100 dark:bg-slate-900 flex items-center justify-center">
            {/* Grid Pattern Backdrop */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c710_1px,transparent_1px),linear-gradient(to_bottom,#0284c710_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            <div className="relative z-10 p-6 text-center space-y-2">
              <span className="text-4xl animate-bounce-slow block">📍</span>
              <h4 className="font-extrabold text-slate-800 dark:text-slate-100">SmartLearn Global HQ</h4>
              <p className="text-xs font-bold text-slate-400">123 Learning Boulevard, San Francisco, CA</p>
              <span className="inline-block px-3 py-1 bg-white dark:bg-slate-800 text-[10px] font-black text-brand-blue rounded-full border border-sky-100 dark:border-slate-700 shadow">
                Mock Interactive Map
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* FAQs Section */}
      <div className="max-w-4xl mx-auto space-y-6 mb-20">
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 text-center mb-8 flex items-center justify-center">
          <HelpCircle className="w-6 h-6 mr-1.5 text-brand-blue" /> Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isActive = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-sky-50 dark:border-slate-700/50 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(isActive ? null : idx)}
                  className="w-full p-5 text-left font-extrabold text-base text-slate-700 dark:text-slate-200 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isActive ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>

                {isActive && (
                  <div className="px-5 pb-5 pt-1 text-sm font-semibold text-slate-400 dark:text-slate-400 border-t border-slate-50 dark:border-slate-700/30 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {!showChat ? (
          <button
            onClick={() => setShowChat(true)}
            className="p-4 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple text-white shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
            title="Chat with Sparky"
            id="open-chat-bot-btn"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        ) : (
          <div className="w-80 h-96 rounded-3xl bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-blue to-brand-purple p-4 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">⚡</span>
                <div className="text-left">
                  <span className="block font-extrabold text-sm">Sparky</span>
                  <span className="block text-[10px] font-bold text-sky-200">Online Assistant</span>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-white hover:text-slate-200 font-extrabold text-xs"
                id="close-chat-bot-btn"
              >
                ✕
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-grow p-4 overflow-y-auto space-y-3.5 text-xs">
              {chatHistory.map((c, i) => (
                <div key={i} className={`flex ${c.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[80%] font-semibold leading-relaxed ${
                    c.sender === 'user'
                      ? 'bg-brand-blue text-white rounded-tr-none'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-tl-none'
                  }`}>
                    {c.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-slate-100 dark:border-slate-700 flex gap-2">
              <input
                type="text"
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                placeholder="Ask Sparky..."
                className="flex-grow pl-3 pr-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 bg-brand-blue text-white rounded-xl text-xs font-bold shadow"
                id="send-chat-message-btn"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
