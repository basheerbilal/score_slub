/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Award, Flame, Zap, Shield, ArrowLeftRight, Check, Sparkles } from 'lucide-react';
import { Player } from '../types';
import { motion } from 'motion/react';

interface PlayerCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerA: Player | null;
  playerB: Player | null;
  players: Player[];
  onSelectPlayerA: (id: number | null) => void;
  onSelectPlayerB: (id: number | null) => void;
}

export interface PlayerStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physicality: number;
  overallRating: number;
}

export function getPlayerStats(player: Player): PlayerStats {
  // Deterministic stat generation using player.id, goals, assists and position
  const seed = (player.id * 7) % 10; // 0 to 9
  
  let basePace = 75;
  let baseShooting = 60;
  let basePassing = 65;
  let baseDribbling = 70;
  let baseDefending = 50;
  let basePhysicality = 70;

  switch (player.position) {
    case 'Goalkeeper':
      basePace = 55;
      baseShooting = 15;
      basePassing = 60;
      baseDribbling = 45;
      baseDefending = 85; // GK reflexes / positioning
      basePhysicality = 80;
      break;
    case 'Defender':
      basePace = 76;
      baseShooting = 45;
      basePassing = 70;
      baseDribbling = 65;
      baseDefending = 86;
      basePhysicality = 84;
      break;
    case 'Midfielder':
      basePace = 80;
      baseShooting = 70;
      basePassing = 85;
      baseDribbling = 82;
      baseDefending = 68;
      basePhysicality = 74;
      break;
    case 'Forward':
      basePace = 88;
      baseShooting = 84;
      basePassing = 74;
      baseDribbling = 85;
      baseDefending = 35;
      basePhysicality = 72;
      break;
  }

  const goalsBonus = Math.min(10, player.goals * 2);
  const assistsBonus = Math.min(10, player.assists * 2.5);

  const pace = Math.min(99, Math.max(40, basePace + (seed % 3) - 1));
  const shooting = Math.min(99, Math.max(15, baseShooting + goalsBonus + (seed % 4) - 2));
  const passing = Math.min(99, Math.max(30, basePassing + assistsBonus + (seed % 3) - 1));
  const dribbling = Math.min(99, Math.max(35, baseDribbling + Math.floor(assistsBonus/2) + (seed % 3) - 1));
  const defending = Math.min(99, Math.max(20, baseDefending + (seed % 4) - 2));
  const physicality = Math.min(99, Math.max(50, basePhysicality + (seed % 3) - 1));

  let overallRating = 75;
  if (player.position === 'Goalkeeper') {
    overallRating = Math.round((defending * 0.7) + (physicality * 0.2) + (passing * 0.1));
  } else if (player.position === 'Defender') {
    overallRating = Math.round((defending * 0.5) + (physicality * 0.25) + (passing * 0.15) + (pace * 0.1));
  } else if (player.position === 'Midfielder') {
    overallRating = Math.round((passing * 0.4) + (dribbling * 0.25) + (shooting * 0.15) + (pace * 0.1) + (defending * 0.1));
  } else if (player.position === 'Forward') {
    overallRating = Math.round((shooting * 0.45) + (pace * 0.25) + (dribbling * 0.2) + (passing * 0.1));
  }

  return {
    pace,
    shooting,
    passing,
    dribbling,
    defending,
    physicality,
    overallRating: Math.min(99, Math.max(65, overallRating + Math.floor(goalsBonus / 3)))
  };
}

export default function PlayerCompareModal({
  isOpen,
  onClose,
  playerA,
  playerB,
  players,
  onSelectPlayerA,
  onSelectPlayerB,
}: PlayerCompareModalProps) {
  if (!isOpen) return null;

  const statsA = playerA ? getPlayerStats(playerA) : null;
  const statsB = playerB ? getPlayerStats(playerB) : null;

  const compareStats = [
    { label: 'Overall Rating', key: 'overallRating', icon: <Award className="w-4 h-4 text-amber-400" /> },
    { label: 'Pace / Speed', key: 'pace', icon: <Zap className="w-4 h-4 text-yellow-500" /> },
    { label: 'Shooting Accuracy', key: 'shooting', icon: <Flame className="w-4 h-4 text-red-500" /> },
    { label: 'Passing Quality', key: 'passing', icon: <ArrowLeftRight className="w-4 h-4 text-emerald-400" /> },
    { label: 'Dribbling Skill', key: 'dribbling', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
    { label: 'Defending Prowess', key: 'defending', icon: <Shield className="w-4 h-4 text-blue-400" /> },
    { label: 'Physicality & Stamina', key: 'physicality', icon: <Flame className="w-4 h-4 text-orange-500" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6" id="compare-modal-portal">
      {/* Dark Overlay Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity cursor-pointer" 
        onClick={onClose}
        id="compare-modal-backdrop"
      />

      {/* Modal Container */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-10 p-5 sm:p-8 space-y-6 flex flex-col justify-between" id="compare-modal-card">
        {/* Subtle Decorative Lights */}
        <div className="absolute top-0 left-1/4 w-96 h-40 bg-emerald-500/5 blur-[100px] pointer-events-none -z-10 rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-40 bg-purple-500/5 blur-[100px] pointer-events-none -z-10 rounded-full" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition min-h-[44px] sm:min-h-0 min-w-[44px] sm:min-w-0 flex items-center justify-center cursor-pointer"
          title="Close Comparison"
          id="compare-modal-close-btn"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 border-b border-slate-900 pb-5">
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-emerald-400">Tactical Comparison Hub</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            <ArrowLeftRight className="text-emerald-500 w-6 h-6 animate-pulse" />
            Side-by-Side Analysis
          </h2>
          <p className="text-slate-400 text-xs max-w-lg mx-auto">
            Review detailed attributes, derived rating indices, and direct season accomplishments to decide your starting squad roster.
          </p>
        </div>

        {/* Dropdown Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-900">
          <div>
            <label className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block font-bold mb-1.5">
              Player A
            </label>
            <select
              value={playerA?.id || ''}
              onChange={(e) => onSelectPlayerA(Number(e.target.value) || null)}
              className="w-full bg-slate-950 text-slate-200 font-sans text-xs border border-slate-800 rounded-xl px-3 py-2.5 focus:border-emerald-500/50 outline-none cursor-pointer appearance-none"
              id="select-player-a-modal"
            >
              <option value="">-- Choose first player --</option>
              {players.map(p => (
                <option key={p.id} value={p.id} disabled={p.id === playerB?.id}>
                  #{p.jersey_number} - {p.name} ({p.position})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block font-bold mb-1.5">
              Player B
            </label>
            <select
              value={playerB?.id || ''}
              onChange={(e) => onSelectPlayerB(Number(e.target.value) || null)}
              className="w-full bg-slate-950 text-slate-200 font-sans text-xs border border-slate-800 rounded-xl px-3 py-2.5 focus:border-emerald-500/50 outline-none cursor-pointer appearance-none"
              id="select-player-b-modal"
            >
              <option value="">-- Choose second player --</option>
              {players.map(p => (
                <option key={p.id} value={p.id} disabled={p.id === playerA?.id}>
                  #{p.jersey_number} - {p.name} ({p.position})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch pt-2">
          
          {/* Player A Detailed Card */}
          <div className="md:col-span-4 bg-slate-900/30 border border-slate-900 p-5 rounded-2xl flex flex-col justify-between space-y-4 text-center relative overflow-hidden group">
            {playerA ? (
              <>
                <div className="absolute top-3 right-3 bg-slate-950/90 border border-slate-800 text-emerald-400 font-mono font-black text-xs px-2.5 py-1 rounded-full">
                  #{playerA.jersey_number}
                </div>
                <div className="space-y-3">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-950 border-2 border-emerald-500/30 mx-auto relative group-hover:scale-105 transition-all duration-300">
                    <img src={playerA.image_url} alt={playerA.name} className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white truncate">{playerA.name}</h3>
                    <span className="text-xs text-slate-400 mt-0.5 block">{playerA.nationality}</span>
                    <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md mt-1 inline-block uppercase">
                      {playerA.position}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center pt-4 border-t border-slate-900">
                  <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-900">
                    <span className="text-[9px] font-mono uppercase text-slate-500 block">Season Goals</span>
                    <span className="text-white text-base font-black font-mono">{playerA.goals}</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-900">
                    <span className="text-[9px] font-mono uppercase text-slate-500 block">Assists</span>
                    <span className="text-white text-base font-black font-mono">{playerA.assists}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-12 font-mono">
                <span>Please select Player A above</span>
              </div>
            )}
          </div>

          {/* Central Side-by-Side Attribute Comparison (4 cols) */}
          <div className="md:col-span-4 flex flex-col justify-center space-y-4">
            {playerA && playerB && statsA && statsB ? (
              <div className="space-y-3.5">
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 text-center font-bold">
                  Derived Attributes
                </div>
                {compareStats.map((stat) => {
                  const valA = statsA[stat.key as keyof PlayerStats] || 0;
                  const valB = statsB[stat.key as keyof PlayerStats] || 0;
                  const total = valA + valB || 1;
                  const percentageA = (valA / total) * 100;
                  const percentageB = (valB / total) * 100;

                  return (
                    <div key={stat.key} className="space-y-1" id={`compare-stat-row-${stat.key}`}>
                      <div className="flex justify-between items-center text-[11px] font-mono text-slate-300">
                        <span className={`font-bold ${valA > valB ? 'text-emerald-400 font-black' : 'text-slate-400'}`}>
                          {valA}
                        </span>
                        <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1">
                          {stat.icon}
                          {stat.label}
                        </span>
                        <span className={`font-bold ${valB > valA ? 'text-emerald-400 font-black' : 'text-slate-400'}`}>
                          {valB}
                        </span>
                      </div>
                      <div className="flex h-1.5 items-center w-full gap-1 bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-l-full transition-all duration-500 ${valA >= valB ? 'bg-emerald-500' : 'bg-slate-700'}`}
                          style={{ width: `${percentageA}%` }}
                        />
                        <div 
                          className={`h-full rounded-r-full transition-all duration-500 ${valB >= valA ? 'bg-emerald-500' : 'bg-slate-700'}`}
                          style={{ width: `${percentageB}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-slate-500 text-xs py-8 font-mono">
                Select both players to unlock derived tactical index comparisons.
              </div>
            )}
          </div>

          {/* Player B Detailed Card */}
          <div className="md:col-span-4 bg-slate-900/30 border border-slate-900 p-5 rounded-2xl flex flex-col justify-between space-y-4 text-center relative overflow-hidden group">
            {playerB ? (
              <>
                <div className="absolute top-3 right-3 bg-slate-950/90 border border-slate-800 text-emerald-400 font-mono font-black text-xs px-2.5 py-1 rounded-full">
                  #{playerB.jersey_number}
                </div>
                <div className="space-y-3">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-950 border-2 border-emerald-500/30 mx-auto relative group-hover:scale-105 transition-all duration-300">
                    <img src={playerB.image_url} alt={playerB.name} className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white truncate">{playerB.name}</h3>
                    <span className="text-xs text-slate-400 mt-0.5 block">{playerB.nationality}</span>
                    <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md mt-1 inline-block uppercase">
                      {playerB.position}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center pt-4 border-t border-slate-900">
                  <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-900">
                    <span className="text-[9px] font-mono uppercase text-slate-500 block">Season Goals</span>
                    <span className="text-white text-base font-black font-mono">{playerB.goals}</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-900">
                    <span className="text-[9px] font-mono uppercase text-slate-500 block">Assists</span>
                    <span className="text-white text-base font-black font-mono">{playerB.assists}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-12 font-mono">
                <span>Please select Player B above</span>
              </div>
            )}
          </div>

        </div>

        {/* Tactical Recommendation Block */}
        {playerA && playerB && statsA && statsB && (
          <div className="bg-slate-900/35 border border-slate-850 p-4 rounded-2xl flex items-start gap-3.5 relative overflow-hidden">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 flex-shrink-0 mt-0.5">
              <Award className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Manager Recommendation</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {statsA.overallRating === statsB.overallRating ? (
                  <span>Both <strong className="text-white">{playerA.name}</strong> and <strong className="text-white">{playerB.name}</strong> carry an identical tactical rating profile (<strong className="text-emerald-400 font-mono font-bold">{statsA.overallRating} OVR</strong>). Base selection on physical fatigue and current team chemistry.</span>
                ) : statsA.overallRating > statsB.overallRating ? (
                  <span>Based on dynamic season goals, assists, and derived attributes, <strong className="text-white">{playerA.name}</strong> leads the comparison scorecard with a rating of <strong className="text-emerald-400 font-mono font-bold">{statsA.overallRating} OVR</strong> vs <strong className="text-slate-400 font-mono font-bold">{statsB.overallRating} B</strong>. Consider starting {playerA.name} as your premium choice.</span>
                ) : (
                  <span>Based on dynamic season goals, assists, and derived attributes, <strong className="text-white">{playerB.name}</strong> leads the comparison scorecard with a rating of <strong className="text-emerald-400 font-mono font-bold">{statsB.overallRating} OVR</strong> vs <strong className="text-slate-400 font-mono font-bold">{statsA.overallRating} A</strong>. Consider starting {playerB.name} as your premium choice.</span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Modal Footer actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-900">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition cursor-pointer min-h-[44px] sm:min-h-0"
            id="compare-modal-close-action"
          >
            Close Hub
          </button>
        </div>
      </div>
    </div>
  );
}
