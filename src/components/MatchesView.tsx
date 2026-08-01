/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Trophy, ShieldCheck, Search, X, 
  ChevronLeft, ChevronRight, Settings, Play, Info, 
  Award, Eye, AlertCircle, RefreshCw, Loader2, ArrowRight
} from 'lucide-react';
import { Match, Team, Player, User as UserType } from '../types';
import { fetchFootballData } from '../footballApi';

interface MatchesViewProps {
  matches: Match[];
  teams: Team[];
  players: Player[];
  currentUser: UserType | null;
  onNavigate: (view: string) => void;
  onSyncMatches?: (matches: Match[], teams: Team[]) => void;
  onResetMatches?: () => void;
}

export default function MatchesView({ 
  matches, 
  teams, 
  players,
  currentUser, 
  onNavigate,
  onSyncMatches,
  onResetMatches
}: MatchesViewProps) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync state management
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [apiProvider, setApiProvider] = useState<'football-data' | 'api-football'>(() => {
    return (localStorage.getItem('soccer_api_provider') as any) || 'football-data';
  });
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('soccer_api_key') || import.meta.env.VITE_FOOTBALL_API_KEY || '4c31696fe9264598a88a7d1691481b40';
  });
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Accordion details toggle
  const [expandedMatchId, setExpandedMatchId] = useState<number | null>(null);

  const handleSync = async () => {
    if (!apiKey.trim()) {
      setSyncError('Please enter a valid API key.');
      return;
    }
    setSyncing(true);
    setSyncError(null);
    setSyncSuccess(false);

    try {
      const result = await fetchFootballData(apiProvider, apiKey);
      if (onSyncMatches) {
        onSyncMatches(result.matches, result.teams);
      }
      localStorage.setItem('soccer_api_provider', apiProvider);
      localStorage.setItem('soccer_api_key', apiKey);
      localStorage.setItem('soccer_api_synced', 'true');
      setSyncSuccess(true);
      setTimeout(() => {
        setShowSyncModal(false);
        setSyncSuccess(false);
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setSyncError(err.message || 'Connection failed. Please check your credentials or API limits.');
    } finally {
      setSyncing(false);
    }
  };

  const handleReset = () => {
    if (onResetMatches) {
      onResetMatches();
    }
    localStorage.removeItem('soccer_api_synced');
  };

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
    return <span className={`select-none flex items-center justify-center ${className}`}>{logoMap[id] || "⚽"}</span>;
  };

  // Next match countdown values
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 20,
    minutes: 9,
    seconds: 32
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        else if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        else if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        else if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filtered lists matching search / tab
  const filteredMatches = matches.filter(m => {
    const searchStr = `${getTeamName(m.home_team_id)} vs ${getTeamName(m.away_team_id)} ${m.stadium} ${m.competition}`.toLowerCase();
    const matchesSearch = searchStr.includes(searchQuery.toLowerCase());

    const matchesTab = filter === 'all' || 
                       (filter === 'upcoming' && m.status === 'upcoming') ||
                       (filter === 'live' && m.status === 'live') ||
                       (filter === 'completed' && m.status === 'completed');

    return matchesSearch && matchesTab;
  });

  const liveCount = matches.filter(m => m.status === 'live').length;
  const upcomingCount = matches.filter(m => m.status === 'upcoming').length;
  const completedCount = matches.filter(m => m.status === 'completed').length;

  return (
    <div className="flex bg-[#030712] min-h-screen text-slate-100 rounded-3xl overflow-hidden border border-slate-900 shadow-2xl" id="matches-view-container">
      
      {/* 1. Left Sidebar Matches Navigation (Matching Standings layout) */}
      <aside className="w-60 bg-[#090d16] border-r border-slate-900 flex flex-col justify-between p-5 hidden md:flex shrink-0">
        <div className="space-y-6">
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block pl-2">Fixtures Navigation</span>
          <nav className="space-y-1">
            <button 
              onClick={() => onNavigate('home')}
              className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-900/40 text-xs font-bold rounded-xl transition text-left cursor-pointer"
            >
              <Info className="w-4 h-4 text-slate-500" />
              <span>Overview</span>
            </button>
            <button 
              onClick={() => onNavigate('matches')}
              className="w-full flex items-center gap-3 px-3 py-2 bg-purple-500/10 text-purple-400 border-l-2 border-purple-500 text-xs font-extrabold rounded-r-xl transition text-left cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Fixtures & Results</span>
            </button>
            <button 
              onClick={() => onNavigate('stats')}
              className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-900/40 text-xs font-bold rounded-xl transition text-left cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-slate-500" />
              <span>League Table</span>
            </button>
            <button 
              onClick={() => onNavigate('stats')}
              className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-900/40 text-xs font-bold rounded-xl transition text-left cursor-pointer"
            >
              <Award className="w-4 h-4 text-slate-500" />
              <span>Top Scorers</span>
            </button>
            <button 
              onClick={() => onNavigate('stats')}
              className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-900/40 text-xs font-bold rounded-xl transition text-left cursor-pointer"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              <span>Team Stats</span>
            </button>
            <button 
              onClick={() => onNavigate('players')}
              className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-900/40 text-xs font-bold rounded-xl transition text-left cursor-pointer"
            >
              <UsersRoundIcon className="w-4 h-4 text-slate-500" />
              <span>Players</span>
            </button>
          </nav>
        </div>

        {/* Lower Promo Card (Visual Purple ball widget) */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-900 p-4 space-y-3 shadow-inner">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1),transparent_80%)]"></div>
          <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/25 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/10">
            <span className="text-xl">⚽</span>
          </div>
          <div className="text-center space-y-1 relative z-10">
            <strong className="text-[11px] text-white block font-extrabold uppercase">Soccer FC</strong>
            <span className="text-[9px] text-slate-500 block leading-tight">Rise. Compete. Conquer.</span>
          </div>
          <button 
            onClick={() => onNavigate('players')}
            className="w-full py-1.5 rounded-lg bg-[#090d16] hover:bg-slate-900 border border-slate-850 text-[9px] font-extrabold text-slate-300 transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>View Club Profile</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </button>
        </div>
      </aside>

      {/* 2. Main Content Frame (Right column) */}
      <div className="flex-grow p-6 sm:p-8 space-y-6 overflow-y-auto">
        
        {/* Header Title & Switcher Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-5">
          <div>
            <span className="text-[9px] font-mono font-bold text-purple-400 uppercase tracking-widest block">FIXTURES & RESULTS</span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-0.5">
              Fixtures & Results
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">
              Track official club league schedules, active match scores, and dynamic tournament statistics.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
            <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-850 flex gap-1 shadow-inner">
              {(['all', 'live', 'upcoming', 'completed'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition whitespace-nowrap cursor-pointer ${
                    filter === tab
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 bg-transparent'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {/* Settings button to trigger API Sync modal */}
            <button 
              onClick={() => setShowSyncModal(true)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-850 hover:text-white transition"
              title="API Sync Settings"
            >
              <Settings className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* 3. Top Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#090d16]/50 border border-slate-850 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Total Matches</span>
              <strong className="text-lg font-black text-white block mt-0.5">{matches.length}</strong>
              <span className="text-[8px] text-slate-500">This Season</span>
            </div>
          </div>

          <div className="bg-[#090d16]/50 border border-slate-850 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Live Matches</span>
              <strong className="text-lg font-black text-white block mt-0.5">{liveCount}</strong>
              <span className="text-[8px] text-slate-500">Right Now</span>
            </div>
          </div>

          <div className="bg-[#090d16]/50 border border-slate-850 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Upcoming</span>
              <strong className="text-lg font-black text-white block mt-0.5">{upcomingCount}</strong>
              <span className="text-[8px] text-slate-500">Next Match</span>
            </div>
          </div>

          <div className="bg-[#090d16]/50 border border-slate-850 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Completed</span>
              <strong className="text-lg font-black text-white block mt-0.5">{completedCount}</strong>
              <span className="text-[8px] text-slate-500">So Far</span>
            </div>
          </div>

        </div>

        {/* 4. World Cup Live Match Countdown Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl h-[280px] sm:h-[320px] flex items-center justify-center">
          {/* Banner Graphic background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.12),transparent_75%)] pointer-events-none z-0"></div>
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] z-0"></div>
          
          <div className="text-center space-y-6 relative z-10 px-4">
            <div className="space-y-1">
              <span className="text-[9px] font-mono font-black text-purple-400 uppercase tracking-widest block">
                NEXT MATCH • MATCH 537588 • FIFA WORLD CUP
              </span>
              
              {/* Teams & Flags Row */}
              <div className="flex items-center justify-center gap-6 mt-3">
                <div className="flex items-center gap-3.5">
                  <span className="text-3xl">{renderTeamLogo(7, "w-10 h-10")}</span>
                  <span className="text-white text-xl sm:text-3xl font-black font-sans uppercase">England</span>
                </div>
                <span className="text-slate-500 font-mono font-bold text-xs uppercase bg-slate-900 border border-slate-850 px-2 py-0.5 rounded-lg">VS</span>
                <div className="flex items-center gap-3.5">
                  <span className="text-white text-xl sm:text-3xl font-black font-sans uppercase">Argentina</span>
                  <span className="text-3xl">{renderTeamLogo(8, "w-10 h-10")}</span>
                </div>
              </div>
            </div>

            {/* Countdown digital display clock (Pink timer design) */}
            <div className="flex items-center justify-center gap-4 text-3xl sm:text-5xl font-mono font-black text-purple-400">
              <div className="flex flex-col items-center">
                <span>{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="text-[8px] text-slate-500 font-mono tracking-wider mt-1 block">DAYS</span>
              </div>
              <span>:</span>
              <div className="flex flex-col items-center">
                <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[8px] text-slate-500 font-mono tracking-wider mt-1 block">HOURS</span>
              </div>
              <span>:</span>
              <div className="flex flex-col items-center">
                <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[8px] text-slate-500 font-mono tracking-wider mt-1 block">MINUTES</span>
              </div>
              <span>:</span>
              <div className="flex flex-col items-center">
                <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-[8px] text-slate-500 font-mono tracking-wider mt-1 block">SECONDS</span>
              </div>
            </div>

            {/* Kick-off details metadata & Action buttons */}
            <div className="space-y-4 pt-1">
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  Kick-off: Wednesday, July 15, 2026
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" />
                  12:00 PM (Local Time)
                </span>
              </div>

              <div className="flex items-center justify-center gap-3.5">
                <button 
                  onClick={() => onNavigate('news')}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold px-6 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition text-xs shadow-lg shadow-purple-500/15 cursor-pointer"
                >
                  <span>Match Preview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => onNavigate('stats')}
                  className="bg-transparent hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold px-6 py-2.5 rounded-xl transition text-xs cursor-pointer"
                >
                  <span>View Tournament</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Bottom Fixtures lists (Twin grids) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Column A: Recent Results (Completed) */}
          <div className="bg-[#090d16]/30 border border-slate-850 rounded-3xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-900 pb-2">
              <span className="text-white font-extrabold text-sm uppercase tracking-wider block">Recent Results</span>
              <button 
                onClick={() => setFilter('completed')}
                className="text-[10px] text-purple-400 hover:text-purple-300 font-bold cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {matches.filter(m => m.status === 'completed').length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">No completed matches available.</div>
              ) : (
                matches.filter(m => m.status === 'completed').slice(0, 3).map(m => (
                  <div key={m.id} className="bg-slate-950/70 border border-slate-850/60 p-3.5 rounded-2xl flex justify-between items-center text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span>{renderTeamLogo(m.home_team_id, "w-4 h-4")}</span>
                          <span className="text-white font-bold">{getTeamName(m.home_team_id)}</span>
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono">VS</span>
                        <div className="flex items-center gap-1.5">
                          <span>{renderTeamLogo(m.away_team_id, "w-4 h-4")}</span>
                          <span className="text-white font-bold">{getTeamName(m.away_team_id)}</span>
                        </div>
                      </div>
                      <span className="text-[8px] text-slate-500 font-mono uppercase tracking-wider block">{m.competition}</span>
                    </div>
                    <span className="font-mono font-black text-sm text-white bg-[#030712] px-2.5 py-1 rounded border border-slate-900 shadow-inner">
                      {m.home_team_score} - {m.away_team_score}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column B: Upcoming Matches */}
          <div className="bg-[#090d16]/30 border border-slate-850 rounded-3xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-900 pb-2">
              <span className="text-white font-extrabold text-sm uppercase tracking-wider block">Upcoming Matches</span>
              <button 
                onClick={() => setFilter('upcoming')}
                className="text-[10px] text-purple-400 hover:text-purple-300 font-bold cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {matches.filter(m => m.status === 'upcoming').length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">No upcoming matches scheduled.</div>
              ) : (
                matches.filter(m => m.status === 'upcoming').slice(0, 3).map(m => (
                  <div key={m.id} className="bg-slate-950/70 border border-slate-850/60 p-3.5 rounded-2xl flex justify-between items-center text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span>{renderTeamLogo(m.home_team_id, "w-4 h-4")}</span>
                          <span className="text-white font-bold">{getTeamName(m.home_team_id)}</span>
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono">VS</span>
                        <div className="flex items-center gap-1.5">
                          <span>{renderTeamLogo(m.away_team_id, "w-4 h-4")}</span>
                          <span className="text-white font-bold">{getTeamName(m.away_team_id)}</span>
                        </div>
                      </div>
                      <span className="text-[8px] text-slate-500 font-mono uppercase tracking-wider block">{m.competition}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-purple-400 font-mono font-bold text-[10px] block">
                        {new Date(m.match_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-slate-500 font-mono text-[9px] block">
                        {new Date(m.match_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Sync API configuration modal popup */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowSyncModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="relative bg-[#090d16] border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl z-10 animate-scale-up text-xs">
            <div className="flex justify-between items-center border-b border-slate-900 pb-2.5">
              <span className="text-white font-extrabold text-sm uppercase tracking-wider flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-purple-400" />
                API Connection Sync
              </span>
              <button 
                onClick={() => setShowSyncModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">API Provider</label>
                <select
                  value={apiProvider}
                  onChange={(e) => setApiProvider(e.target.value as any)}
                  className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3 py-2 text-white text-xs cursor-pointer focus:outline-none focus:border-purple-500"
                >
                  <option value="football-data">Football-Data.org API v4</option>
                  <option value="api-football">API-Football (RapidAPI)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Security Token Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter API Key/Token..."
                  className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              {syncError && (
                <div className="bg-rose-500/10 border border-rose-500/35 p-3 rounded-xl flex items-center gap-2 text-rose-450">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{syncError}</span>
                </div>
              )}

              {syncSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/35 p-3 rounded-xl flex items-center gap-2 text-emerald-405 font-bold">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <span>Schedules Synced Successfully!</span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="flex-grow py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-extrabold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-purple-500/10"
                >
                  {syncing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Syncing...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Fetch Live Schedules</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
                  title="Reset to local backup"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Temporary inline component representation for sidebar
function UsersRoundIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
