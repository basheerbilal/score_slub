/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, MapPin, Phone, MessageSquare, Send, Star, ShieldCheck, Sparkles, Award } from 'lucide-react';
import { Feedback } from '../types';

interface ContactUsViewProps {
  onSubmitFeedback: (feedback: Omit<Feedback, 'id' | 'created_at'>) => void;
}

export default function ContactUsView({ onSubmitFeedback }: ContactUsViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    onSubmitFeedback({
      name,
      email,
      subject: subject || 'General Query',
      message,
      rating
    });

    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setRating(5);

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="space-y-8 animate-fade-in" id="contact-us-view-container">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <span className="text-[10px] font-mono font-black uppercase tracking-widest text-emerald-400">CONTACT & FEEDBACK</span>
        <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
          <MessageSquare className="text-emerald-500 w-8 h-8" />
          Contact Us & Feedback
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
          Get in touch with the Aptech Limited development group or submit your experience rating and suggestions to the club administrators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Info Sidebar Column */}
        <div className="md:col-span-5 bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.04),transparent_40%)] pointer-events-none"></div>
          
          <div className="space-y-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <div className="w-full h-full bg-slate-950 rounded-[8px] flex items-center justify-center text-emerald-400">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[10px] font-mono font-black uppercase text-slate-500 tracking-wider block">OFFICIAL PUBLISHER</span>
            <h3 className="text-xl font-extrabold text-white tracking-tight">Elysian FC Dev Team</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              This official SoccerClub Web Application has been certified by Aptech Limited and complies with all release parameters of the 2026 digital product specifications.
            </p>
          </div>

          <div className="space-y-4 border-t border-slate-900 pt-5 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Email Address</span>
                <span className="text-xs text-slate-300 font-bold font-mono">support@elysianfc.com</span>
                <span className="text-[10px] text-slate-500 block">contact@aptech-limited.com</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Physical Headquarters</span>
                <span className="text-xs text-slate-300 font-bold block">Elysian Arena Stadium Complex</span>
                <span className="text-[10px] text-slate-400 font-medium">12 Arena Boulevard, Manchester, UK</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Support Hotline</span>
                <span className="text-xs text-slate-300 font-bold font-mono">+44 (0) 20 7946 0192</span>
                <span className="text-[10px] text-slate-500 block">Mon-Fri • 9:00 AM - 6:00 PM GMT</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/70 p-4 border border-slate-850 rounded-2xl relative z-10">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Product License Verification
            </span>
            <p className="text-[10px] text-slate-500 leading-normal">
              Licensed under @Aptech Limited 2026. This platform strictly respects global privacy architectures and sports statistics licenses.
            </p>
          </div>
        </div>

        {/* Feedback / Contact Form */}
        <div className="md:col-span-7 bg-slate-950/30 border border-slate-850/60 p-6 sm:p-8 rounded-3xl shadow-lg backdrop-blur-sm space-y-6">
          <div>
            <h3 className="text-xl font-extrabold text-white tracking-tight">Submit Fan Feedback</h3>
            <p className="text-xs text-slate-400 mt-1">
              Share your user experience with club administrators. We read and verify every single comment submitted.
            </p>
          </div>

          {submitted && (
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-4 text-emerald-400 text-xs animate-fade-in shadow-inner">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                <CheckCircle2Icon className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <strong className="block font-extrabold text-white text-sm">Feedback Filed Successfully!</strong>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Thank you. Administrators can audit your ratings inside the secure control panel!</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Supporter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 transition"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. supporter@elysian.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 transition"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Subject Matter</label>
              <input
                type="text"
                placeholder="e.g. Mobile application UI bug report"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Experience Rating</label>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition transform hover:scale-120 cursor-pointer focus:outline-none flex items-center justify-center"
                    >
                      <Star
                        className={`w-6 h-6 transition-all duration-200 ${
                          star <= rating 
                            ? 'text-emerald-400 fill-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.3)]' 
                            : 'text-slate-700 hover:text-slate-500'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {/* Real-time score label indicator */}
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/10">
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Outstanding!'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Your Message</label>
              <textarea
                placeholder="Type your feedback message in full detail here..."
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 transition resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-tr from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-extrabold py-3.5 rounded-xl text-xs transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/15 hover:scale-[1.01] active:scale-[0.99] min-h-[44px]"
            >
              <Send className="w-4 h-4" /> Submit Feedback Form
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Helper local component for success checkmark icon
function CheckCircle2Icon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
