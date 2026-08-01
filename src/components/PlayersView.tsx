/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Users, ShieldCheck, Award, GitCompare, ChevronDown, X, Sparkles, ArrowLeftRight } from 'lucide-react';
import { Player, Team, User as UserType } from '../types';
import PlayerCompareModal from './PlayerCompareModal';

interface PlayersViewProps {
  players: Player[];
  teams: Team[];
  currentUser: UserType | null;
  onNavigate: (view: string) => void;
}

export default function PlayersView({ players, teams, currentUser, onNavigate }: PlayersViewProps) {
  const [activeTab, setActiveTab] = useState<'All' | 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward'>('All');
  const [showCompare, setShowCompare] = useState<boolean>(false);
  const [playerAId, setPlayerAId] = useState<number | null>(null);
  const [playerBId, setPlayerBId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const elysianPlayers = players.filter(p => p.team_id === 1);
  const playerA = elysianPlayers.find(p => p.id === playerAId) || null;
  const playerB = elysianPlayers.find(p => p.id === playerBId) || null;

  const handleCompareClick = (player: Player) => {
    setShowCompare(true);
    if (playerAId === player.id) {
      setPlayerAId(null);
    } else if (playerBId === player.id) {
      setPlayerBId(null);
    } else if (!playerAId) {
      setPlayerAId(player.id);
    } else if (!playerBId) {
      setPlayerBId(player.id);
    } else {
      setPlayerAId(playerBId);
      setPlayerBId(player.id);
    }
  };

  const handleToggleCompare = () => {
    const nextVal = !showCompare;
    setShowCompare(nextVal);
    if (nextVal && elysianPlayers.length >= 2) {
      if (!playerAId && !playerBId) {
        setPlayerAId(elysianPlayers[0].id);
        setPlayerBId(elysianPlayers[1].id);
      }
    }
  };

  const filteredPlayers = players.filter(player => {
    // Only showcase soccer club (team_id === 1) as the primary club squad focus
    if (player.team_id !== 1) return false;
    if (activeTab === 'All') return true;
    return player.position === activeTab;
  });

  // Calculate high-fidelity dynamic squad analytics
  const totalGoals = elysianPlayers.reduce((sum, p) => sum + p.goals, 0);
  const totalAssists = elysianPlayers.reduce((sum, p) => sum + p.assists, 0);
  const topScorer = elysianPlayers.reduce((top, p) => (p.goals > (top?.goals || 0) ? p : top), elysianPlayers[0]);
  const playmaker = elysianPlayers.reduce((top, p) => (p.assists > (top?.assists || 0) ? p : top), elysianPlayers[0]);

  return (
    <div className="space-y-8 animate-fade-in" id="players-view-container">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-emerald-400">FIRST TEAM SQUAD</span>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
            <Users className="text-emerald-500 w-8 h-8" />
            soccer club
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            Meet the professional first team squad, review active contracts, goals, assists, and overall stats performance logs.
          </p>
        </div>

        {/* Filters & Action Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Compare Side-by-Side Modal Launcher */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-3 sm:py-2 rounded-xl text-xs font-bold uppercase tracking-wider border bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500/40 hover:border-indigo-400 shadow-lg hover:shadow-indigo-500/15 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 min-h-[44px] sm:min-h-0"
            id="launch-compare-modal-btn"
          >
            <ArrowLeftRight className="w-4 h-4" />
            Compare Side-by-Side
          </button>

          {/* Comparison Studio Toggle */}
          <button
            onClick={handleToggleCompare}
            className={`px-4 py-3 sm:py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 min-h-[44px] sm:min-h-0 ${
              showCompare
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-950 hover:bg-slate-900 text-emerald-400 border-slate-800 hover:border-emerald-500/30'
            }`}
            id="toggle-compare-studio"
          >
            <GitCompare className="w-4 h-4" />
            {showCompare ? 'Close Studio' : 'Compare Squad'}
          </button>

          {/* Filters */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800/80 flex flex-wrap gap-1">
            {(['All', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'] as const).map((pos) => (
              <button
                key={pos}
                onClick={() => setActiveTab(pos)}
                className={`px-4 py-2.5 sm:py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer min-h-[44px] sm:min-h-0 flex items-center justify-center ${
                  activeTab === pos
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
                id={`filter-player-${pos}`}
              >
                {pos === 'All' ? 'Full Squad' : pos + 's'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Head-to-Head Comparison Arena Panel */}
      {showCompare && (
        <div className="bg-slate-950/90 border-2 border-emerald-500/20 rounded-3xl p-6 relative overflow-hidden shadow-2xl animate-fade-in glow-emerald/10" id="player-comparison-panel">
          {/* Subtle Golden Ambient Light */}
          <div className="absolute top-0 right-0 w-80 h-40 bg-emerald-500/5 blur-3xl -z-10 pointer-events-none rounded-full" />
          
          {/* Close button */}
          <button
            onClick={() => setShowCompare(false)}
            className="absolute top-4 right-4 p-3 sm:p-2 rounded-full bg-slate-900 border border-slate-850 text-slate-400 hover:text-white hover:bg-slate-800 transition min-h-[44px] sm:min-h-0 min-w-[44px] sm:min-w-0 flex items-center justify-center"
            title="Close Compare Panel"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-1.5 font-serif">
                Elysian FC Head-to-Head Arena <Sparkles className="w-4 h-4 text-emerald-400" />
              </h2>
              <p className="text-xs text-slate-400">
                Compare and analyze core statistics, positional attributes, and season scorecards.
              </p>
            </div>
          </div>

          {/* Selector Grid */}
          <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-center">
            {/* Player A Select Card */}
            <div className="md:col-span-5 bg-slate-900/60 border border-slate-850 p-4 rounded-2xl flex flex-col space-y-4">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">
                SELECT PLAYER A
              </label>
              <div className="relative">
                <select
                  value={playerAId || ''}
                  onChange={(e) => setPlayerAId(Number(e.target.value) || null)}
                  className="w-full bg-slate-950 text-white font-sans text-xs border border-slate-850 rounded-xl px-3 py-2.5 focus:border-emerald-500/50 outline-none cursor-pointer appearance-none"
                >
                  <option value="">-- Choose first player --</option>
                  {elysianPlayers.map(p => (
                    <option key={p.id} value={p.id}>
                      #{p.jersey_number} - {p.name} ({p.position})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {/* Player A Profile Details */}
              {playerA ? (
                <div className="flex items-center gap-4 animate-fade-in pt-2">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-950 border border-slate-850 relative flex-shrink-0">
                    <img src={playerA.image_url} alt={playerA.name} className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" />
                    <span className="absolute bottom-0 right-0 bg-emerald-500 text-slate-950 text-[8px] font-bold px-1 rounded-tl">
                      #{playerA.jersey_number}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white leading-tight truncate">{playerA.name}</h4>
                    <span className="text-xs text-slate-400 block mt-0.5 truncate">{playerA.nationality}</span>
                    <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/10 mt-1 inline-block">
                      {playerA.position}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-16 flex items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs text-center p-2 font-mono">
                  No player selected
                </div>
              )}
            </div>

            {/* Central VS Break */}
            <div className="md:col-span-1 flex flex-col items-center justify-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-serif font-black text-sm shadow-lg glow-emerald/15">
                VS
              </div>
            </div>

            {/* Player B Select Card */}
            <div className="md:col-span-5 bg-slate-900/60 border border-slate-850 p-4 rounded-2xl flex flex-col space-y-4">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">
                SELECT PLAYER B
              </label>
              <div className="relative">
                <select
                  value={playerBId || ''}
                  onChange={(e) => setPlayerBId(Number(e.target.value) || null)}
                  className="w-full bg-slate-950 text-white font-sans text-xs border border-slate-850 rounded-xl px-3 py-2.5 focus:border-emerald-500/50 outline-none cursor-pointer appearance-none"
                >
                  <option value="">-- Choose second player --</option>
                  {elysianPlayers.map(p => (
                    <option key={p.id} value={p.id}>
                      #{p.jersey_number} - {p.name} ({p.position})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {/* Player B Profile Details */}
              {playerB ? (
                <div className="flex items-center gap-4 animate-fade-in pt-2">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-950 border border-slate-850 relative flex-shrink-0">
                    <img src={playerB.image_url} alt={playerB.name} className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" />
                    <span className="absolute bottom-0 right-0 bg-emerald-500 text-slate-950 text-[8px] font-bold px-1 rounded-tl">
                      #{playerB.jersey_number}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white leading-tight truncate">{playerB.name}</h4>
                    <span className="text-xs text-slate-400 block mt-0.5 truncate">{playerB.nationality}</span>
                    <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/10 mt-1 inline-block">
                      {playerB.position}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-16 flex items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs text-center p-2 font-mono">
                  No player selected
                </div>
              )}
            </div>
          </div>

          {/* side-by-side statistics visualization arena */}
          {playerA && playerB ? (
            <div className="mt-8 pt-6 border-t border-slate-900/60 space-y-6">
              <div className="flex justify-center pb-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-slate-950 font-black hover:scale-[1.02] transition-all duration-300 cursor-pointer shadow-xl flex items-center gap-2"
                  id="modal-trigger-compare-arena"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Launch Side-by-Side Analysis Modal
                </button>
              </div>

              <h3 className="text-[11px] font-mono uppercase tracking-widest text-slate-400 text-center mb-4 block">
                ✦ STATISTICAL HEAD-TO-HEAD MATRIX ✦
              </h3>

              {/* Goals Stats */}
              <div className="space-y-2 bg-slate-900/30 p-4 rounded-2xl border border-slate-850/60">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className={`font-extrabold ${playerA.goals > playerB.goals ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {playerA.goals} Goals {playerA.goals > playerB.goals && '👑'}
                  </span>
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Goals Scored</span>
                  <span className={`font-extrabold ${playerB.goals > playerA.goals ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {playerB.goals > playerA.goals && '👑'} {playerB.goals} Goals
                  </span>
                </div>
                <div className="flex h-3 items-center w-full gap-2">
                  <div className="w-1/2 flex justify-end bg-slate-950 rounded-l-full overflow-hidden h-2.5">
                    <div
                      className={`h-full rounded-l-full transition-all duration-500 ${playerA.goals >= playerB.goals ? 'bg-emerald-500' : 'bg-slate-700'}`}
                      style={{ width: `${Math.max(5, (playerA.goals / Math.max(1, playerA.goals + playerB.goals)) * 100)}%` }}
                    />
                  </div>
                  <div className="w-1/2 flex justify-start bg-slate-950 rounded-r-full overflow-hidden h-2.5">
                    <div
                      className={`h-full rounded-r-full transition-all duration-500 ${playerB.goals >= playerA.goals ? 'bg-emerald-500' : 'bg-slate-700'}`}
                      style={{ width: `${Math.max(5, (playerB.goals / Math.max(1, playerA.goals + playerB.goals)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Assists Stats */}
              <div className="space-y-2 bg-slate-900/30 p-4 rounded-2xl border border-slate-850/60">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className={`font-extrabold ${playerA.assists > playerB.assists ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {playerA.assists} Assists {playerA.assists > playerB.assists && '👑'}
                  </span>
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Goal Assists</span>
                  <span className={`font-extrabold ${playerB.assists > playerA.assists ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {playerB.assists > playerA.assists && '👑'} {playerB.assists} Assists
                  </span>
                </div>
                <div className="flex h-3 items-center w-full gap-2">
                  <div className="w-1/2 flex justify-end bg-slate-950 rounded-l-full overflow-hidden h-2.5">
                    <div
                      className={`h-full rounded-l-full transition-all duration-500 ${playerA.assists >= playerB.assists ? 'bg-emerald-500' : 'bg-slate-700'}`}
                      style={{ width: `${Math.max(5, (playerA.assists / Math.max(1, playerA.assists + playerB.assists)) * 100)}%` }}
                    />
                  </div>
                  <div className="w-1/2 flex justify-start bg-slate-950 rounded-r-full overflow-hidden h-2.5">
                    <div
                      className={`h-full rounded-r-full transition-all duration-500 ${playerB.assists >= playerA.assists ? 'bg-emerald-500' : 'bg-slate-700'}`}
                      style={{ width: `${Math.max(5, (playerB.assists / Math.max(1, playerA.assists + playerB.assists)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Overall Contribution Score */}
              {(() => {
                const scoreA = (playerA.goals * 3) + (playerA.assists * 2);
                const scoreB = (playerB.goals * 3) + (playerB.assists * 2);
                return (
                  <div className="space-y-2 bg-slate-900/30 p-4 rounded-2xl border border-slate-850/60">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className={`font-extrabold ${scoreA > scoreB ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {scoreA} Points {scoreA > scoreB && '👑'}
                      </span>
                      <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Attack Score (G*3 + A*2)</span>
                      <span className={`font-extrabold ${scoreB > scoreA ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {scoreB > scoreA && '👑'} {scoreB} Points
                      </span>
                    </div>
                    <div className="flex h-3 items-center w-full gap-2">
                      <div className="w-1/2 flex justify-end bg-slate-950 rounded-l-full overflow-hidden h-2.5">
                        <div
                          className={`h-full rounded-l-full transition-all duration-500 ${scoreA >= scoreB ? 'bg-gradient-to-l from-emerald-400 to-emerald-600' : 'bg-slate-700'}`}
                          style={{ width: `${Math.max(5, (scoreA / Math.max(1, scoreA + scoreB)) * 100)}%` }}
                        />
                      </div>
                      <div className="w-1/2 flex justify-start bg-slate-950 rounded-r-full overflow-hidden h-2.5">
                        <div
                          className={`h-full rounded-r-full transition-all duration-500 ${scoreB >= scoreA ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-slate-700'}`}
                          style={{ width: `${Math.max(5, (scoreB / Math.max(1, scoreA + scoreB)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Compare advice summary */}
              <div className="bg-slate-900/25 border border-slate-850 p-4 rounded-2xl flex items-center gap-3.5 mt-4">
                <Award className="w-5 h-5 text-emerald-400 flex-shrink-0 animate-pulse" />
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  <strong>Tactical Performance Index:</strong>{' '}
                  {playerA.goals + playerA.assists === playerB.goals + playerB.assists ? (
                    <span>Both <strong>{playerA.name}</strong> and <strong>{playerB.name}</strong> are contributing equally on objective season statistics. Deploy according to tactical squad synergy.</span>
                  ) : playerA.goals + playerA.assists > playerB.goals + playerB.assists ? (
                    <span><strong>{playerA.name}</strong> exhibits higher objective direct goal contributions this season. They remain a premium starting offensive anchor.</span>
                  ) : (
                    <span><strong>{playerB.name}</strong> possesses the upper hand in immediate goal contribution metrics, indicating strong form and high performance impact.</span>
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-8 pt-8 border-t border-slate-900/60 text-center text-slate-500 text-xs font-mono py-8">
              Select two soccer club members above or click "Compare Player" on their cards below to unlock Head-to-Head statistical indices.
            </div>
          )}
        </div>
      )}

      {/* Dynamic Squad Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="squad-analytics-grid">
        <div className="bg-slate-950 border border-slate-800/60 p-4 rounded-2xl flex flex-col justify-between glow-emerald/5 hover:border-slate-700 transition duration-300">
          <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider font-bold">Squad Goals Scored</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{totalGoals}</span>
            <span className="text-xs text-emerald-400 font-medium">This Season</span>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800/60 p-4 rounded-2xl flex flex-col justify-between glow-emerald/5 hover:border-slate-700 transition duration-300">
          <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider font-bold">Squad Goal Assists</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{totalAssists}</span>
            <span className="text-xs text-emerald-400 font-medium">Playmaker Assist</span>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800/60 p-4 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition duration-300">
          <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider font-bold">Leading Scorer</span>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm font-bold text-white truncate max-w-[120px]">{topScorer?.name || 'N/A'}</span>
            <span className="text-xs text-amber-400 font-mono font-extrabold flex-shrink-0 bg-amber-500/10 px-1.5 py-0.5 rounded">
              ★ {topScorer?.goals || 0} G
            </span>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800/60 p-4 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition duration-300">
          <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider font-bold">Creative Maestro</span>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm font-bold text-white truncate max-w-[120px]">{playmaker?.name || 'N/A'}</span>
            <span className="text-xs text-emerald-400 font-mono font-extrabold flex-shrink-0 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              🎯 {playmaker?.assists || 0} A
            </span>
          </div>
        </div>
      </div>

      {/* Admin Quick Link */}
      {currentUser?.role === 'admin' && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div className="text-xs">
              <span className="text-white font-bold block">Administrator Mode Active</span>
              <p className="text-slate-300">You can add, edit, or delete player contracts and details.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('admin')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 sm:px-4 sm:py-2 rounded-xl text-xs transition cursor-pointer min-h-[44px] sm:min-h-0 flex items-center justify-center"
          >
            Manage Squad
          </button>
        </div>
      )}

      {/* Players Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlayers.length === 0 ? (
          <div className="col-span-full bg-slate-950 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            No players found for this position in Elysian FC roster.
          </div>
        ) : (
          filteredPlayers.map((player) => {
            // Calculate a beautiful Contribution Score (goals * 3 + assists * 2)
            const contributionScore = (player.goals * 3) + (player.assists * 2);
            return (
              <div
                key={player.id}
                className="bg-slate-950/70 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-emerald-500/30 hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col justify-between group shadow-lg relative hover:-translate-y-1"
                id={`player-card-${player.id}`}
              >
                {/* Jersey Badge */}
                <div className="absolute top-4 right-4 bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-black w-10 h-10 rounded-full flex items-center justify-center text-sm shadow-md z-30 group-hover:scale-110 transition duration-300">
                  #{player.jersey_number}
                </div>

                {/* Player Image / Background */}
                <div className="h-64 overflow-hidden relative bg-slate-900 flex items-end justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10"></div>
                  <img
                    src={player.image_url}
                    alt={player.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top opacity-100 group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-md">
                      {player.position}
                    </span>
                    <h3 className="text-white font-extrabold text-lg mt-2 tracking-tight group-hover:text-emerald-400 transition">
                      {player.name}
                    </h3>
                    <span className="text-slate-400 text-xs font-medium block mt-0.5">{player.nationality}</span>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="p-4 bg-slate-950 border-t border-slate-900/60 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-850">
                      <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Goals</span>
                      <span className="text-white font-extrabold text-sm block mt-0.5 font-mono">{player.goals}</span>
                    </div>
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-850">
                      <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Assists</span>
                      <span className="text-white font-extrabold text-sm block mt-0.5 font-mono">{player.assists}</span>
                    </div>
                  </div>

                  {/* Micro Contribution Visual Meter */}
                  {player.position !== 'Goalkeeper' && (
                    <div className="pt-2 border-t border-slate-900/40">
                      <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                        <span className="text-slate-500">Attack Contribution</span>
                        <span className="text-emerald-400 font-bold">{contributionScore} pts</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(10, contributionScore * 1.5))}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Compare Action Button */}
                  <div className="pt-2 border-t border-slate-900/40">
                    <button
                      onClick={() => handleCompareClick(player)}
                      className={`w-full text-[11px] font-bold font-mono uppercase tracking-wider py-3 sm:py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 border cursor-pointer min-h-[44px] sm:min-h-0 ${
                        playerAId === player.id || playerBId === player.id
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-inner'
                          : 'bg-slate-900 hover:bg-slate-900/60 border-slate-850 hover:border-emerald-500/30 text-slate-300'
                      }`}
                    >
                      <GitCompare className="w-3.5 h-3.5 text-emerald-400" />
                      {playerAId === player.id
                        ? 'Selected (A)'
                        : playerBId === player.id
                        ? 'Selected (B)'
                        : 'Compare Player'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Side-by-Side Detailed Statistics Comparison Modal */}
      <PlayerCompareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        playerA={playerA}
        playerB={playerB}
        players={elysianPlayers}
        onSelectPlayerA={setPlayerAId}
        onSelectPlayerB={setPlayerBId}
      />
    </div>
  );
}
