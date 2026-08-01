/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Star, Send, Calendar, MapPin, Award, ArrowRight, 
  Sparkles, AlertCircle, CheckCircle, Trophy, Shield, 
  Bell, ChevronLeft, ChevronRight, Play, Eye, ShoppingCart, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Match, Product, Feedback, Team, User, FifaMoment } from '../types';

interface TickerScoreProps {
  score: number;
}

function TickerScore({ score }: TickerScoreProps) {
  return (
    <span className="relative overflow-hidden inline-flex items-center justify-center min-w-[12px] h-4 leading-none">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={score}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="absolute font-mono font-bold text-white text-xs"
        >
          {score}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

interface HomeViewProps {
  matches: Match[];
  products: Product[];
  feedbacks: Feedback[];
  teams: Team[];
  currentUser: User | null;
  fifaMoments: FifaMoment[];
  onNavigate: (view: string) => void;
  onSubmitFeedback: (feedback: Omit<Feedback, 'id' | 'created_at'>) => void;
  onSubscribe?: (email: string) => void;
}

export default function HomeView({
  matches,
  products,
  feedbacks,
  teams,
  currentUser,
  fifaMoments,
  onNavigate,
  onSubmitFeedback,
  onSubscribe
}: HomeViewProps) {
  const getTeamName = (id: number) => {
    return teams.find(t => t.id === id)?.name || `Team ${id}`;
  };

  const renderTeamLogo = (id: number, className = "w-5 h-5") => {
    const logoMap: { [key: number]: string } = {
      1: "👑", // Elysian FC
      2: "🦁", // Titan United
      3: "⚡", // Apex Athletic
      4: "🔱", // Trident FC
      5: "⚔️", // Vanguard City
      6: "🌟", // Zenith Rovers
      7: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", // England
      8: "🇦🇷", // Argentina
      9: "🇧🇷", // Brazil
      10: "🇫🇷", // France
      11: "🇪🇸", // Spain
      12: "🇩🇪", // Germany
      13: "🇮🇹", // Italy
      14: "🇳🇱", // Netherlands
      15: "🇵🇹", // Portugal
      16: "🇺🇾", // Uruguay
      17: "🇧🇪", // Belgium
      18: "🇭🇷"  // Croatia
    };

    const logo = logoMap[id] || "⚽";

    // Standard high-quality flags or emojis
    return <span className={`select-none flex items-center justify-center ${className}`}>{logo}</span>;
  };

  // Find live and upcoming matches to guarantee 3 spotlight cards are always rendered
  const liveMatch = matches.find(m => m.status === 'live');
  const liveMatches = matches.filter(m => m.status === 'live');
  const upcomingList = matches
    .filter(m => m.status === 'upcoming')
    .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime());
  const completedList = matches
    .filter(m => m.status === 'completed')
    .sort((a, b) => new Date(b.match_date).getTime() - new Date(a.match_date).getTime());

  const spotlightMatches = [
    ...liveMatches,
    ...upcomingList,
    ...completedList
  ].slice(0, 3);

  // Moments category tabs
  const [momentsTab, setMomentsTab] = useState<'top' | 'celebration'>('top');

  // Video modal state
  const [videoModal, setVideoModal] = useState<{ url: string; name: string } | null>(null);

  // Filter moments by type field directly
  const topMoments = fifaMoments.filter(m => m.type === 'top');
  const celebrationMoments = fifaMoments.filter(m => m.type === 'celebration');
  const filteredMoments = momentsTab === 'top' ? topMoments : celebrationMoments;

  // Countdown timer logic to match mockup (05 Days 20 Hrs 09 Mins)
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 20,
    minutes: 9,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Feedback form state
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    rating: 5
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSubscribeSuccess, setShowSubscribeSuccess] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');

  // Live match simulator timer (just ticking random game time)
  const [gameMinute, setGameMinute] = useState(72);
  useEffect(() => {
    if (liveMatch) {
      const interval = setInterval(() => {
        setGameMinute(prev => (prev < 90 ? prev + 1 : 72));
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [liveMatch]);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!feedbackForm.name || !feedbackForm.email || !feedbackForm.subject || !feedbackForm.message) {
      setErrorMsg('Please complete all fields before submitting.');
      return;
    }

    onSubmitFeedback({
      name: feedbackForm.name,
      email: feedbackForm.email,
      subject: feedbackForm.subject,
      message: feedbackForm.message,
      rating: feedbackForm.rating
    });

    setIsSubmitted(true);
    setFeedbackForm({
      name: '',
      email: '',
      subject: '',
      message: '',
      rating: 5
    });

    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="space-y-8 animate-fade-in" id="home-view-container">

      {/* ── Video Modal ── */}
      {videoModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          onClick={() => setVideoModal(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-amber-500/10"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setVideoModal(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-slate-950/80 border border-slate-700 text-white flex items-center justify-center hover:bg-red-600 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            {/* Title */}
            <div className="absolute top-3 left-3 z-10 bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800 text-[11px] font-mono font-bold text-amber-500">
              ⚽ {videoModal.name}
            </div>
            <iframe
              src={videoModal.url}
              title={videoModal.name}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Main Page Columns Grid (Col 12: Main 8, Sidebar 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8/12): Hero, Moments, Shop Preview */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* A. Golden Trophy Hero Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl h-[360px] sm:h-[400px] flex items-center" id="home-hero">
            {/* Background & Visual Centerpiece */}
            <div className="absolute inset-0 z-0">
              <img 
                src="/gold_trophy.jpg" 
                alt="Golden World Cup Trophy" 
                className="w-full h-full object-cover object-center opacity-40 scale-105"
              />
              {/* Radial Masks */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.08),transparent_50%)]"></div>
            </div>

            {/* Left Content Text */}
            <div className="relative z-10 px-6 sm:px-12 max-w-lg space-y-4">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-amber-500">FIFA WORLD CUP 2026™</span>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight font-serif text-shadow-glow">
                THE WORLD <br />
                IS WATCHING
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed max-w-sm">
                Honor. Glory. The Elysian Way. Relive football history, prediction tools, and verified fan merchandise.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('matches')}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 text-xs hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <span>View Match Center</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Next Match Widget Overlay (Aligned Right) */}
            <div className="absolute bottom-6 right-6 hidden sm:block z-20 max-w-[260px]">
              <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-2xl text-center">
                <div className="text-[8px] font-mono font-black text-slate-500 uppercase tracking-widest">
                  NEXT MATCH • GROUP STAGE
                </div>
                
                {/* Team logos & vs */}
                <div className="flex items-center justify-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-xl">{renderTeamLogo(7, "w-8 h-8")}</span>
                    <span className="text-[10px] text-white font-extrabold mt-1">ENG</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono font-bold">VS</span>
                  <div className="flex flex-col items-center">
                    <span className="text-xl">{renderTeamLogo(8, "w-8 h-8")}</span>
                    <span className="text-[10px] text-white font-extrabold mt-1">ARG</span>
                  </div>
                </div>

                {/* Ticking Countdown Clock */}
                <div className="grid grid-cols-4 gap-1.5 border-t border-slate-900 pt-2.5 text-center">
                  <div>
                    <span className="text-white font-mono font-black text-sm block">
                      {String(timeLeft.days).padStart(2, '0')}
                    </span>
                    <span className="text-[7px] text-slate-500 font-mono block">DAYS</span>
                  </div>
                  <div>
                    <span className="text-white font-mono font-black text-sm block">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[7px] text-slate-500 font-mono block">HRS</span>
                  </div>
                  <div>
                    <span className="text-white font-mono font-black text-sm block">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[7px] text-slate-500 font-mono block">MINS</span>
                  </div>
                  <div>
                    <span className="text-white font-mono font-black text-sm block">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[7px] text-slate-500 font-mono block">SECS</span>
                  </div>
                </div>

                {/* Match Details Date */}
                <div className="text-[9px] font-mono font-semibold text-slate-500 pt-1">
                  15 JUL 2026 • 12:00 PM
                </div>
              </div>
            </div>
          </div>

          {/* B. Redesigned FIFA Moments Slider */}
          <div className="space-y-4" id="fifa-moments-section">
            <div className="flex items-end justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  FIFA World Cup™ Moments
                </h2>
                <div className="flex gap-2 mt-2">
                  {/* Top Moments tab */}
                  <button
                    onClick={() => setMomentsTab('top')}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition flex items-center gap-1.5 ${
                      momentsTab === 'top'
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-white bg-slate-900'
                    }`}
                  >
                    <Trophy className="w-3 h-3" />
                    Top Moments
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ml-0.5 ${
                      momentsTab === 'top' ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {topMoments.length}
                    </span>
                  </button>

                  {/* Celebrations tab */}
                  <button
                    onClick={() => setMomentsTab('celebration')}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition flex items-center gap-1.5 ${
                      momentsTab === 'celebration'
                        ? 'bg-pink-500 text-white'
                        : 'text-slate-400 hover:text-white bg-slate-900'
                    }`}
                  >
                    🎉 Celebrations
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ml-0.5 ${
                      momentsTab === 'celebration' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {celebrationMoments.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Slider Arrow Indicators */}
              <div className="flex gap-1.5">
                <button 
                  onClick={() => document.getElementById('moments-carousel')?.scrollBy({ left: -220, behavior: 'smooth' })}
                  className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer flex items-center justify-center"
                  title="Scroll left"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => document.getElementById('moments-carousel')?.scrollBy({ left: 220, behavior: 'smooth' })}
                  className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer flex items-center justify-center"
                  title="Scroll right"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Slider list */}
            <div 
              id="moments-carousel" 
              className="flex gap-4 overflow-x-auto scrollbar-none pb-2"
            >
              {filteredMoments.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-slate-500 text-xs font-mono gap-2">
                  <span className="text-3xl">{momentsTab === 'celebration' ? '🎉' : '🏆'}</span>
                  <span>No {momentsTab === 'celebration' ? 'celebration' : 'top'} moments yet — add from Admin Panel!</span>
                </div>
              )}
              {filteredMoments.map(m => (
                <div
                  key={m.id}
                  className={`relative w-[180px] h-[240px] rounded-2xl overflow-hidden shadow-lg group flex-shrink-0 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                    m.type === 'celebration'
                      ? 'border border-pink-500/40 hover:border-pink-400 hover:shadow-pink-500/20 hover:shadow-xl'
                      : 'border border-amber-500/30 hover:border-amber-400 hover:shadow-amber-500/20 hover:shadow-xl'
                  }`}
                  onClick={() => m.video_url && setVideoModal({ url: m.video_url, name: m.name })}
                >
                  <img
                    src={m.img}
                    alt={m.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${
                    m.type === 'celebration'
                      ? 'from-pink-950/80 via-slate-950/20 to-transparent'
                      : 'from-slate-950 via-slate-950/20 to-transparent'
                  }`} />

                  {/* Type badge top-right */}
                  <span className={`absolute top-2.5 right-2.5 backdrop-blur-md text-[8px] font-mono font-black tracking-wider px-2 py-0.5 rounded border ${
                    m.type === 'celebration'
                      ? 'bg-pink-500/90 text-white border-pink-400'
                      : 'bg-amber-500/90 text-slate-950 border-amber-400'
                  }`}>
                    {m.type === 'celebration' ? '🎉 CELEB' : '⚽ TOP'}
                  </span>

                  {/* Play button on hover */}
                  {m.video_url && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300 ${
                        m.type === 'celebration'
                          ? 'bg-pink-500/95 shadow-pink-500/40'
                          : 'bg-amber-500/95 shadow-amber-500/40'
                      }`}>
                        <Play className="w-6 h-6 fill-white text-white ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Bottom info */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10">
                    <span className="text-white font-extrabold text-xs block truncate drop-shadow-md">
                      {m.name}
                    </span>
                    <span className="text-[10px] text-slate-300 font-medium mt-0.5 block">
                      {m.country}
                    </span>
                    {m.video_url && (
                      <span className={`text-[8px] font-mono mt-0.5 flex items-center gap-1 ${
                        m.type === 'celebration' ? 'text-pink-400/80' : 'text-amber-500/70'
                      }`}>
                        ▶ Tap to watch
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* C. Redesigned Supporter Shop Row */}
          <div className="space-y-4" id="home-store-spotlight">
            <div className="flex items-end justify-between border-b border-slate-800 pb-2">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Official Supporter Shop</h2>
                <p className="text-slate-400 text-xs mt-0.5">High-quality athletic jerseys, custom training footwear, and winter gear.</p>
              </div>
              <button
                onClick={() => onNavigate('shop')}
                className="text-amber-500 hover:text-amber-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>View Store</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {products.slice(0, 3).map((prod) => (
                <div
                  key={prod.id}
                  className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden hover:border-slate-700 transition duration-300 flex flex-col justify-between group shadow-lg"
                  id={`teaser-product-${prod.id}`}
                >
                  <div className="h-36 overflow-hidden relative bg-slate-900 flex items-center justify-center">
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-3 flex-grow flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="text-white font-extrabold text-xs tracking-tight line-clamp-1 group-hover:text-amber-500 transition">{prod.name}</h4>
                      <p className="text-slate-400 text-[10px] line-clamp-1 mt-0.5 leading-normal">{prod.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-white font-mono font-bold text-xs">${prod.price.toFixed(2)}</span>
                      <button
                        onClick={() => onNavigate('shop')}
                        className="w-8 h-8 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center cursor-pointer transition active:scale-90"
                        title="Add to Bag"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (4/12): Sidebar widgets */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Widget 1: Live Now */}
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4.5 space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-500/5 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
              <span className="text-white font-extrabold text-xs tracking-wider flex items-center gap-1.5 uppercase">
                Live Now
              </span>
              {liveMatches.length > 0 ? (
                <span className="text-[9px] bg-red-600 text-white font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="w-1 h-1 rounded-full bg-white"></span>
                  LIVE
                </span>
              ) : (
                <span className="text-[9px] bg-slate-700 text-slate-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  NO LIVE
                </span>
              )}
            </div>

            <div className="space-y-3.5">
              {liveMatches.length > 0 ? (
                liveMatches.slice(0, 2).map((lm) => (
                  <div key={lm.id}>
                    <div className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider mb-2">
                      {lm.competition || 'Live Match'}
                    </div>
                    <div className="flex justify-between items-center bg-slate-950/70 p-3 rounded-xl border border-slate-850">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {renderTeamLogo(lm.home_team_id, "w-5 h-5")}
                          <span className="text-xs text-slate-200 font-bold">{getTeamName(lm.home_team_id)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {renderTeamLogo(lm.away_team_id, "w-5 h-5")}
                          <span className="text-xs text-slate-200 font-bold">{getTeamName(lm.away_team_id)}</span>
                        </div>
                      </div>
                      <div className="text-right space-y-2 font-mono font-black text-sm pr-1">
                        <TickerScore score={lm.home_team_score} />
                        <TickerScore score={lm.away_team_score} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1.5">
                      <span className="text-red-400 font-bold animate-pulse">{gameMinute}'</span>
                      <span className="text-slate-400 font-bold">{lm.stadium || 'Stadium'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                    FIFA World Cup 2026™
                  </div>
                  <div className="flex justify-between items-center bg-slate-950/70 p-3 rounded-xl border border-slate-850">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{renderTeamLogo(9, "w-5 h-5")}</span>
                        <span className="text-xs text-slate-200 font-bold">Brazil</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-base">{renderTeamLogo(10, "w-5 h-5")}</span>
                        <span className="text-xs text-slate-200 font-bold">France</span>
                      </div>
                    </div>
                    <div className="text-right space-y-2 font-mono font-black text-sm pr-1">
                      <div className="text-slate-400">-</div>
                      <div className="text-slate-400">-</div>
                    </div>
                  </div>
                  <div className="text-center text-[9px] font-mono text-slate-600 pt-1">
                    No live matches right now
                  </div>
                </>
              )}

              {/* Last sync timestamp */}
              <div className="text-[8px] font-mono text-slate-600 text-right pt-1 border-t border-slate-900">
                Auto-refresh: {liveMatches.length > 0 ? '30s' : '5min'} •{' '}
                {localStorage.getItem('soccer_last_sync')
                  ? `Updated ${new Date(localStorage.getItem('soccer_last_sync')!).toLocaleTimeString()}`
                  : 'Syncing...'}
              </div>
            </div>
          </div>

          {/* Widget 2: Tournament Standings */}
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4.5 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
              <span className="text-white font-extrabold text-xs tracking-wider uppercase">Tournament Standings</span>
              <button 
                onClick={() => onNavigate('stats')}
                className="text-[10px] text-amber-500 hover:text-amber-400 font-bold flex items-center gap-0.5 transition cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Group C</span>
              <table className="w-full text-[11px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-850 text-slate-500 font-mono font-bold text-[9px] uppercase tracking-wider">
                    <th className="pb-1.5 text-center w-6">#</th>
                    <th className="pb-1.5">Team</th>
                    <th className="pb-1.5 text-center w-8">P</th>
                    <th className="pb-1.5 text-center w-8">GD</th>
                    <th className="pb-1.5 text-center w-8">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/30">
                  <tr className="text-slate-300">
                    <td className="py-2 text-center font-bold text-slate-500">1</td>
                    <td className="py-2 font-bold flex items-center gap-1.5">
                      <span>{renderTeamLogo(9, "w-4 h-4")}</span>
                      <span>Brazil</span>
                    </td>
                    <td className="py-2 text-center font-mono">2</td>
                    <td className="py-2 text-center font-mono text-emerald-400 font-bold">+3</td>
                    <td className="py-2 text-center font-mono font-bold text-white">6</td>
                  </tr>
                  <tr className="bg-amber-500/5 text-amber-400/90 border-l border-amber-500">
                    <td className="py-2 text-center font-bold">2</td>
                    <td className="py-2 font-black flex items-center gap-1.5 pl-1.5">
                      <span>{renderTeamLogo(7, "w-4 h-4")}</span>
                      <span>England</span>
                    </td>
                    <td className="py-2 text-center font-mono font-bold">2</td>
                    <td className="py-2 text-center font-mono text-emerald-400 font-bold">+2</td>
                    <td className="py-2 text-center font-mono font-black text-amber-500">4</td>
                  </tr>
                  <tr className="text-slate-300">
                    <td className="py-2 text-center font-bold text-slate-500">3</td>
                    <td className="py-2 flex items-center gap-1.5">
                      <span>{renderTeamLogo(10, "w-4 h-4")}</span>
                      <span>France</span>
                    </td>
                    <td className="py-2 text-center font-mono">2</td>
                    <td className="py-2 text-center font-mono text-rose-400/90">-1</td>
                    <td className="py-2 text-center font-mono font-bold text-slate-400">2</td>
                  </tr>
                  <tr className="text-slate-300">
                    <td className="py-2 text-center font-bold text-slate-500">4</td>
                    <td className="py-2 flex items-center gap-1.5">
                      <span>{renderTeamLogo(18, "w-4 h-4")}</span>
                      <span>Australia</span>
                    </td>
                    <td className="py-2 text-center font-mono">2</td>
                    <td className="py-2 text-center font-mono text-rose-400/90">-4</td>
                    <td className="py-2 text-center font-mono font-bold text-slate-400">1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Widget 3: Match Day Hub */}
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4.5 space-y-4 shadow-xl">
            <div className="flex items-center gap-1.5 border-b border-slate-850 pb-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span className="text-white font-extrabold text-xs tracking-wider uppercase">Match Day Hub</span>
            </div>

            <div className="space-y-2">
              {/* Option 1 */}
              <button 
                onClick={() => onNavigate('matches')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-850 hover:border-slate-800 text-left transition cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-white font-bold text-xs block group-hover:text-amber-500 transition">Match Preview</span>
                    <span className="text-[9px] text-slate-500 block">Analysis & Predictions</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-500 transition" />
              </button>

              {/* Option 2 */}
              <button 
                onClick={() => onNavigate('news')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-850 hover:border-slate-800 text-left transition cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-white font-bold text-xs block group-hover:text-amber-500 transition">Team News</span>
                    <span className="text-[9px] text-slate-500 block">Injury & Lineup Updates</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-500 transition" />
              </button>

              {/* Option 3 */}
              <button 
                onClick={() => onNavigate('info')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-850 hover:border-slate-800 text-left transition cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-white font-bold text-xs block group-hover:text-amber-500 transition">Fan Zone</span>
                    <span className="text-[9px] text-slate-500 block">Polls, Quizzes & More</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-500 transition" />
              </button>
            </div>

            <button
              onClick={() => onNavigate('matches')}
              className="w-full py-2.5 rounded-xl border border-slate-800 hover:border-slate-750 bg-slate-950/60 hover:bg-slate-950 text-slate-300 hover:text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Go to Match Day Hub</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          {/* Widget 4: Stay Updated */}
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4.5 space-y-4 shadow-xl">
            <div className="space-y-1">
              <span className="text-white font-extrabold text-xs tracking-wider uppercase block">Stay Updated</span>
              <p className="text-slate-500 text-[10px] leading-relaxed">Get the latest news, match updates and exclusive content.</p>
            </div>

            <form 
              onSubmit={(e) => { 
                e.preventDefault(); 
                onSubscribe && onSubscribe(subscribeEmail); 
                setShowSubscribeSuccess(true); 
                setSubscribeEmail('');
              }} 
              className="space-y-2"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 focus:border-amber-500 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 transition"
                required
              />
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center"
              >
                Subscribe
              </button>
            </form>
          </div>

        </aside>

      </div>

      {/* 4. Contact & Interactive Feedback Box */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl" id="home-feedback-section">
        {/* Decorative background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.06),transparent_45%)] pointer-events-none"></div>
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
          
          {/* Left Side: Brand Context */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400">
                  <Award className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif">
                We Value Your <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-300">Feedback</span>
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                We strive to deliver the ultimate experiences to our club fans and players. If you have concerns, reviews, or queries about our matches, tickets, or merchandise, fill out the form here. 
              </p>
            </div>

            <div className="bg-slate-950/70 p-4.5 rounded-2xl border border-slate-850 space-y-2 shadow-inner">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 text-[11px] font-mono font-bold uppercase tracking-wider block">Testing Hint</span>
              </div>
              <p className="text-slate-400 text-xs leading-normal">
                Submissions update the database dynamically! You can submit feedback here, then toggle the <strong className="text-emerald-400">Admin Panel</strong> to see your entry updated live.
              </p>
            </div>
          </div>

          {/* Right Side: Form Inputs */}
          <div className="lg:col-span-7 bg-slate-950/30 border border-slate-850/60 p-6 sm:p-8 rounded-2xl shadow-lg backdrop-blur-sm">
            {isSubmitted ? (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-8 text-center space-y-4 h-full flex flex-col justify-center items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-400 animate-bounce" />
                </div>
                <h4 className="text-white font-extrabold text-lg">Thank You for Submitting!</h4>
                <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
                  Your feedback has been appended to the database. Administrators will audit your comments shortly in the control portal.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Full Name</label>
                    <input
                      type="text"
                      value={feedbackForm.name}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Liam Smith"
                      className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 transition"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Email Address</label>
                    <input
                      type="email"
                      value={feedbackForm.email}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="e.g. liam@example.com"
                      className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 transition"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Subject / Topic</label>
                  <input
                    type="text"
                    value={feedbackForm.subject}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="e.g. Jersey fitting inquiry"
                    className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 transition"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Rating (1-5 Stars)</label>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          type="button"
                          key={num}
                          onClick={() => setFeedbackForm(prev => ({ ...prev, rating: num }))}
                          className="focus:outline-none transition transform hover:scale-120 cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 transition-all duration-200 ${
                              num <= feedbackForm.rating
                                ? 'text-emerald-400 fill-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.3)]'
                                : 'text-slate-700 hover:text-slate-500'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {/* Score Label Description */}
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/10">
                      {feedbackForm.rating === 1 && 'Poor'}
                      {feedbackForm.rating === 2 && 'Fair'}
                      {feedbackForm.rating === 3 && 'Good'}
                      {feedbackForm.rating === 4 && 'Very Good'}
                      {feedbackForm.rating === 5 && 'Outstanding!'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Detailed Review Comments</label>
                  <textarea
                    rows={4}
                    value={feedbackForm.message}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Enter your message here..."
                    className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 transition resize-none"
                    required
                  ></textarea>
                </div>

                {errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2 text-xs text-red-400">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="bg-gradient-to-tr from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/15 text-xs w-full cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                  id="submit-feedback-btn"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Feedback Entry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Subscribe Success Premium Popup Modal */}
      {showSubscribeSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowSubscribeSuccess(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="relative bg-[#090d16] border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center z-10 animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto">
              <CheckCircle className="w-6 h-6 text-amber-500 animate-bounce" />
            </div>
            <div className="space-y-1">
              <strong className="text-white text-base block font-bold">Subscribed Successfully!</strong>
              <p className="text-slate-400 text-xs leading-normal">
                You have been registered to our official news feed catalog. We will dispatch match alerts and promo alerts shortly!
              </p>
            </div>
            <div className="pt-2">
              <button 
                onClick={() => setShowSubscribeSuccess(false)}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs transition cursor-pointer"
              >
                Awesome!
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
