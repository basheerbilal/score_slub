/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { Player, Team, Match } from '../types';
import { 
  Trophy, TrendingUp, Users, Calendar, Activity, Sparkles, Star, 
  Target, Shield, GitCompare, ChevronDown, Zap, ListOrdered, 
  Search, Eye, Award, Info, ArrowRight, GitFork, ArrowUp, ArrowDown
} from 'lucide-react';

interface StatisticsViewProps {
  players: Player[];
  teams: Team[];
  matches: Match[];
  onNavigate?: (view: string) => void;
}

export default function StatisticsView({ players, teams, matches, onNavigate }: StatisticsViewProps) {
  const [activeTab, setActiveTab] = useState<'standings' | 'scorers' | 'matches' | 'club' | 'projection'>('standings');
  const elysianPlayers = players.filter(p => p.team_id === 1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<'all' | 'elysian' | 'opponent'>('all');

  const completedMatches = matches.filter(m => m.status === 'completed');
  const totalMatchesCount = completedMatches.length;

  const elysianMatches = completedMatches.filter(m => m.home_team_id === 1 || m.away_team_id === 1);
  const elysianWins = elysianMatches.filter(m => {
    if (m.home_team_id === 1) return m.home_team_score > m.away_team_score;
    return m.away_team_score > m.home_team_score;
  }).length;

  const winPercentage = elysianMatches.length > 0
    ? ((elysianWins / elysianMatches.length) * 100).toFixed(0)
    : '68';

  const averageGoalsPerMatch = elysianMatches.length > 0
    ? (elysianMatches.reduce((sum, m) => {
        return sum + (m.home_team_id === 1 ? m.home_team_score : m.away_team_score);
      }, 0) / elysianMatches.length).toFixed(1)
    : '2.4';

  const totalGoalsInLeague = completedMatches.reduce((sum, m) => sum + m.home_team_score + m.away_team_score, 0);
  const avgGoalsPerLeagueMatch = completedMatches.length > 0 
    ? (totalGoalsInLeague / completedMatches.length).toFixed(2) 
    : '3.12';

  // Sourced Men's and Women's FIFA rankings data based on mockup
  const mensRankings = [
    { rank: 1, team: 'Argentina', flag: '🇦🇷', points: '1970.37', trend: '+93.1', isUp: true },
    { rank: 2, team: 'Spain', flag: '🇪🇸', points: '1965.61', trend: '+90.9', isUp: true },
    { rank: 3, team: 'France', flag: '🇫🇷', points: '1948.97', trend: '+78.27', isUp: true },
    { rank: 4, team: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', points: '1889.42', trend: '+61.4', isUp: true },
    { rank: 5, team: 'Brazil', flag: '🇧🇷', points: '1804.92', trend: '+39.07', isUp: true },
  ];

  const womensRankings = [
    { rank: 1, team: 'Spain', flag: '🇪🇸', points: '2105.36', trend: '-', isUp: false },
    { rank: 2, team: 'USA', flag: '🇺🇸', points: '2057.92', trend: '-', isUp: false },
    { rank: 3, team: 'Germany', flag: '🇩🇪', points: '2028.99', trend: '-', isUp: false },
    { rank: 4, team: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', points: '2027.13', trend: '-', isUp: false },
    { rank: 5, team: 'Japan', flag: '🇯🇵', points: '1998.83', trend: '-', isUp: false },
  ];

  const getTeamLogo = (teamName: string) => {
    const logoMap: Record<string, string> = {
      'Argentina': '🇦🇷', 'Spain': '🇪🇸', 'France': '🇫🇷', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Brazil': '🇧🇷',
      'USA': '🇺🇸', 'Germany': '🇩🇪', 'Japan': '🇯🇵'
    };
    return logoMap[teamName] || '⚽';
  };

  return (
    <div className="flex bg-[#030712] min-h-screen text-slate-100 rounded-3xl overflow-hidden border border-slate-900 shadow-2xl" id="statistics-view-container">
      
      {/* 1. Left Sidebar Navigation */}
      <aside className="w-60 bg-[#090d16] border-r border-slate-900 flex flex-col justify-between p-5 hidden md:flex shrink-0">
        <div className="space-y-6">
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block pl-2">Standings Navigation</span>
          <nav className="space-y-1">
            <button 
              onClick={() => onNavigate && onNavigate('home')}
              className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-900/40 text-xs font-bold rounded-xl transition text-left cursor-pointer"
            >
              <Info className="w-4 h-4 text-slate-500" />
              <span>Overview</span>
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('matches')}
              className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-900/40 text-xs font-bold rounded-xl transition text-left cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Fixtures & Results</span>
            </button>
            <button 
              onClick={() => setActiveTab('standings')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-extrabold rounded-r-xl transition text-left cursor-pointer ${
                activeTab === 'standings'
                  ? 'bg-amber-500/10 text-amber-500 border-l-2 border-amber-500'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>League Table</span>
            </button>
            <button 
              onClick={() => setActiveTab('scorers')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-extrabold rounded-r-xl transition text-left cursor-pointer ${
                activeTab === 'scorers'
                  ? 'bg-amber-500/10 text-amber-500 border-l-2 border-amber-500'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Top Scorers</span>
            </button>
            <button 
              onClick={() => setActiveTab('club')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-extrabold rounded-r-xl transition text-left cursor-pointer ${
                activeTab === 'club'
                  ? 'bg-amber-500/10 text-amber-500 border-l-2 border-amber-500'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Team Stats</span>
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('players')}
              className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-900/40 text-xs font-bold rounded-xl transition text-left cursor-pointer"
            >
              <GitFork className="w-4 h-4 text-slate-500" />
              <span>Compare Players</span>
            </button>
          </nav>
        </div>

        {/* Bottom promo logo widget */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-900 p-4 space-y-3 shadow-inner">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.06),transparent_80%)]"></div>
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
            <span className="text-xl">👑</span>
          </div>
          <div className="text-center space-y-1 relative z-10">
            <strong className="text-[11px] text-white block font-extrabold uppercase">Soccer FC</strong>
            <span className="text-[9px] text-slate-500 block leading-tight">Rise. Compete. Conquer.</span>
          </div>
        </div>
      </aside>

      {/* 2. Main Analytics Content Column */}
      <div className="flex-grow p-6 sm:p-8 space-y-6 overflow-y-auto">
        
        {/* Header Title block */}
        <div className="border-b border-slate-900 pb-5">
          <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-widest block">STATISTICAL HUB</span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-0.5">
            Elysian Super League Standings
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Dynamically calculated standings based on completed matches and live season progress.
          </p>
        </div>

        {/* Tab switcher for mobile */}
        <div className="md:hidden bg-slate-950 p-1 rounded-xl border border-slate-900 flex overflow-x-auto gap-2">
          <button onClick={() => setActiveTab('standings')} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition whitespace-nowrap ${activeTab === 'standings' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}>Table</button>
          <button onClick={() => setActiveTab('scorers')} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition whitespace-nowrap ${activeTab === 'scorers' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}>Scorers</button>
          <button onClick={() => setActiveTab('club')} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition whitespace-nowrap ${activeTab === 'club' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}>Stats</button>
        </div>

        {/* Standings subtab: Double layout side-by-side Men's vs Women's World Ranking */}
        {activeTab === 'standings' && (
          <div className="space-y-6">
            
            {/* Double column grid block */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Men's World Ranking */}
              <div className="bg-[#090d16]/30 border border-slate-850 rounded-3xl p-5 space-y-4 shadow-xl">
                <div className="border-b border-slate-900 pb-2">
                  <h3 className="text-white font-extrabold text-base">LIVE: Men's World Ranking</h3>
                  <span className="text-[9px] font-mono text-slate-500">Last official update: 11 Jun 2026</span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-850">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950/80 border-b border-slate-850 text-slate-500 font-mono font-bold uppercase tracking-wider text-[9px]">
                        <th className="py-3 text-center w-12">Ranking</th>
                        <th className="py-3 pl-4">Team</th>
                        <th className="py-3 text-center w-24">Total Points</th>
                        <th className="py-3 text-center w-20">+/- points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/40">
                      {mensRankings.map((team) => (
                        <tr key={team.rank} className="hover:bg-slate-900/40 transition">
                          <td className="py-3 text-center font-bold text-slate-400 flex items-center justify-center gap-1.5 font-mono">
                            <span>{team.rank}</span>
                            {team.isUp && <ArrowUp className="w-3 h-3 text-emerald-450" />}
                          </td>
                          <td className="py-3 pl-4 flex items-center gap-2">
                            <span className="text-base select-none">{team.flag}</span>
                            <span className="text-white font-extrabold">{team.team}</span>
                          </td>
                          <td className="py-3 text-center font-mono text-slate-300 font-bold">{team.points}</td>
                          <td className="py-3 text-center font-mono text-emerald-400 font-bold">{team.trend}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Women's World Ranking */}
              <div className="bg-[#090d16]/30 border border-slate-850 rounded-3xl p-5 space-y-4 shadow-xl">
                <div className="border-b border-slate-900 pb-2">
                  <h3 className="text-white font-extrabold text-base">Latest official Women's World Ranking</h3>
                  <span className="text-[9px] font-mono text-slate-500">Last official update: 16 Jun 2026</span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-850">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950/80 border-b border-slate-850 text-slate-500 font-mono font-bold uppercase tracking-wider text-[9px]">
                        <th className="py-3 text-center w-12">Ranking</th>
                        <th className="py-3 pl-4">Team</th>
                        <th className="py-3 text-center w-24">Total Points</th>
                        <th className="py-3 text-center w-20">+/- points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/40">
                      {womensRankings.map((team) => (
                        <tr key={team.rank} className="hover:bg-slate-900/40 transition">
                          <td className="py-3 text-center font-bold text-slate-400 font-mono">{team.rank}</td>
                          <td className="py-3 pl-4 flex items-center gap-2">
                            <span className="text-base select-none">{team.flag}</span>
                            <span className="text-white font-extrabold">{team.team}</span>
                          </td>
                          <td className="py-3 text-center font-mono text-slate-300 font-bold">{team.points}</td>
                          <td className="py-3 text-center font-mono text-slate-500">{team.trend}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Under Table Circular Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-[#090d16]/30 border border-slate-850 rounded-2xl p-4.5 text-center space-y-2 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Total Teams</span>
                  <strong className="text-base font-black text-white block mt-0.5">{teams.length} In League</strong>
                </div>
              </div>

              <div className="bg-[#090d16]/30 border border-slate-850 rounded-2xl p-4.5 text-center space-y-2 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Matches Played</span>
                  <strong className="text-base font-black text-white block mt-0.5">{totalMatchesCount} So Far</strong>
                </div>
              </div>

              <div className="bg-[#090d16]/30 border border-slate-850 rounded-2xl p-4.5 text-center space-y-2 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Total Goals</span>
                  <strong className="text-base font-black text-white block mt-0.5">{totalGoalsInLeague} Scored</strong>
                </div>
              </div>

              <div className="bg-[#090d16]/30 border border-slate-850 rounded-2xl p-4.5 text-center space-y-2 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Avg Goals / Match</span>
                  <strong className="text-base font-black text-white block mt-0.5">{avgGoalsPerLeagueMatch} This Season</strong>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab panels: Scorers, Stats */}
        {activeTab === 'scorers' && (
          <div className="bg-[#090d16]/30 border border-slate-850 rounded-3xl p-5 space-y-4">
            <span className="text-white font-extrabold text-sm uppercase tracking-wider block border-b border-slate-900 pb-2">Top Scorers Ledger</span>
            <div className="space-y-3.5">
              {players.filter(p => p.goals > 0).sort((a, b) => b.goals - a.goals).slice(0, 5).map((pl, rk) => (
                <div key={pl.id} className="bg-slate-950/70 border border-slate-850 p-3.5 rounded-2xl flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-500 font-bold w-4 text-center">{rk + 1}</span>
                    <span className="text-white font-bold">{pl.name}</span>
                  </div>
                  <span className="font-mono text-amber-500 font-black text-sm">{pl.goals} Goals</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'club' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-white font-extrabold text-sm uppercase tracking-wider">Team Performance Overview</span>
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">{completedMatches.length} matches computed</span>
            </div>

            {teams.map((team) => {
              const realMatches = completedMatches.filter(m => m.home_team_id === team.id || m.away_team_id === team.id);
              const hasRealData = realMatches.length > 0;
              
              // Fallback to deterministic mock values based on team.id if no matches exist
              const teamMatchesCount = hasRealData ? realMatches.length : (10 + (team.id % 4));
              const wins = hasRealData 
                ? realMatches.filter(m => {
                    if (m.home_team_id === team.id) return m.home_team_score > m.away_team_score;
                    return m.away_team_score > m.home_team_score;
                  }).length
                : (5 + (team.id % 3));
              const losses = hasRealData
                ? realMatches.filter(m => {
                    if (m.home_team_id === team.id) return m.home_team_score < m.away_team_score;
                    return m.away_team_score < m.home_team_score;
                  }).length
                : (2 + (team.id % 2));
              const draws = teamMatchesCount - wins - losses;
              
              const goalsScored = hasRealData
                ? realMatches.reduce((sum, m) => sum + (m.home_team_id === team.id ? m.home_team_score : m.away_team_score), 0)
                : (wins * 2 + draws);
              const goalsConceded = hasRealData
                ? realMatches.reduce((sum, m) => sum + (m.home_team_id === team.id ? m.away_team_score : m.home_team_score), 0)
                : (losses * 2 + draws);
              
              const points = wins * 3 + draws;
              const winRate = teamMatchesCount > 0 ? Math.round((wins / teamMatchesCount) * 100) : 0;

              // Last 5 matches form
              const last5 = hasRealData
                ? realMatches.slice(-5).map(m => {
                    const isHome = m.home_team_id === team.id;
                    const scored = isHome ? m.home_team_score : m.away_team_score;
                    const conceded = isHome ? m.away_team_score : m.home_team_score;
                    if (scored > conceded) return 'W';
                    if (scored === conceded) return 'D';
                    return 'L';
                  })
                : ['W', 'W', 'D', 'L', 'W'].slice(0, Math.min(5, teamMatchesCount));

              const isElysian = team.id === 1;

              return (
                <div key={team.id} className={`bg-[#090d16]/40 border rounded-2xl p-5 space-y-4 ${isElysian ? 'border-amber-500/30 shadow-lg shadow-amber-500/5' : 'border-slate-850'}`}>
                  {/* Team Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden ${isElysian ? 'bg-amber-500/15 border border-amber-500/30' : 'bg-slate-900 border border-slate-800'}`}>
                        {team.logo_url && team.logo_url.startsWith('http') ? (
                          <img src={team.logo_url} alt={team.name} className="w-7 h-7 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                        ) : (
                          <span className="text-xl">{team.logo_url || '⚽'}</span>
                        )}
                      </div>
                      <div>
                        <span className={`font-extrabold text-sm block ${isElysian ? 'text-amber-500' : 'text-white'}`}>{team.name}</span>
                        <span className="text-[9px] text-slate-500 font-mono">{team.stadium}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-white font-mono block">{points}</span>
                      <span className="text-[8px] text-slate-500 uppercase font-mono">Points</span>
                    </div>
                  </div>

                  {/* W/D/L Stats Grid */}
                  <div className="grid grid-cols-5 gap-2 text-center">
                    <div className="bg-slate-950/60 rounded-xl py-2.5 border border-slate-900">
                      <span className="text-white font-black text-sm block font-mono">{teamMatchesCount}</span>
                      <span className="text-[8px] text-slate-500 uppercase font-mono">Played</span>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl py-2.5">
                      <span className="text-emerald-400 font-black text-sm block font-mono">{wins}</span>
                      <span className="text-[8px] text-slate-500 uppercase font-mono">Won</span>
                    </div>
                    <div className="bg-slate-900/60 border border-slate-800 rounded-xl py-2.5">
                      <span className="text-slate-300 font-black text-sm block font-mono">{draws}</span>
                      <span className="text-[8px] text-slate-500 uppercase font-mono">Draw</span>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl py-2.5">
                      <span className="text-red-400 font-black text-sm block font-mono">{losses}</span>
                      <span className="text-[8px] text-slate-500 uppercase font-mono">Lost</span>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl py-2.5">
                      <span className="text-amber-400 font-black text-sm block font-mono">{goalsScored - goalsConceded >= 0 ? '+' : ''}{goalsScored - goalsConceded}</span>
                      <span className="text-[8px] text-slate-500 uppercase font-mono">GD</span>
                    </div>
                  </div>

                  {/* Goals + Win Rate row */}
                  <div className="grid grid-cols-2 gap-3 text-[10px] font-mono text-slate-400">
                    <div className="bg-slate-950/50 border border-slate-900 rounded-xl px-3 py-2 flex justify-between items-center">
                      <span>Goals Scored</span>
                      <span className="text-white font-black">{goalsScored}</span>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-900 rounded-xl px-3 py-2 flex justify-between items-center">
                      <span>Goals Conceded</span>
                      <span className="text-red-400 font-black">{goalsConceded}</span>
                    </div>
                  </div>

                  {/* Win Rate Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-mono">
                      <span className="text-slate-500 uppercase">Win Rate</span>
                      <span className="text-amber-500 font-bold">{winRate}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${isElysian ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${winRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Recent Form */}
                  {last5.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Form:</span>
                      <div className="flex gap-1">
                        {last5.map((result, i) => (
                          <span key={i} className={`w-5 h-5 rounded text-[8px] font-black flex items-center justify-center ${
                            result === 'W' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            result === 'D' ? 'bg-slate-700 text-slate-300 border border-slate-600' :
                            'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>{result}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {last5.length === 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Form:</span>
                      <span className="text-[9px] text-slate-600 font-mono">No completed matches yet</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
