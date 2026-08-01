/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { History, BookOpen, Layers, Zap, Shield, Sparkles, Award } from 'lucide-react';

export default function SoccerInfoView() {
  const [activeTab, setActiveTab] = useState<'history' | 'rules' | 'field' | 'tactics'>('history');

  return (
    <div className="space-y-8 animate-fade-in" id="soccer-info-view-container">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <span className="text-[10px] font-mono font-black uppercase tracking-widest text-emerald-400">SOCCER MASTERCLASS</span>
        <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
          <BookOpen className="text-emerald-500 w-8 h-8" />
          Soccer Encyclopedia
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
          Dive deep into the legacy, official parameters, tactical methodologies, and regulatory rulebook of the beautiful game.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-slate-950 p-1 rounded-xl border border-slate-800/80 flex flex-wrap gap-1 max-w-2xl">
        {[
          { id: 'history', label: 'History of Soccer', icon: History },
          { id: 'rules', label: 'Laws & Rules', icon: Shield },
          { id: 'field', label: 'Field Markings', icon: Layers },
          { id: 'tactics', label: 'Tricks & Tactics', icon: Zap }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-grow sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Content */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl">
        
        {/* HISTORY CONTENT */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-white">The Origins & Evolution of Association Football</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Soccer's long history dates back thousands of years, evolving from ancient athletic games into the world's most watched and played sport.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400">2ND & 3RD CENTURY BC</span>
                <h4 className="text-sm font-bold text-white">Cuju (Chinese Ball Sport)</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  The earliest recorded competitive game resembling soccer was 'Cuju', played in China during the Han Dynasty. Players kicked a leather ball through an opening in a small net.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400">MID-19TH CENTURY</span>
                <h4 className="text-sm font-bold text-white">The Cambridge Rules</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  In 1848, representatives from Cambridge University codified the first standardized laws. This paved the way for modern passing, prohibiting hands and introducing throw-ins.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400">1863 & BEYOND</span>
                <h4 className="text-sm font-bold text-white">The Football Association (FA)</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  The world's oldest soccer organization was established in London in 1863. FIFA was later formed in Paris in 1904, turning soccer into a globally unified sport.
                </p>
              </div>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-2xl flex items-center gap-4">
              <span className="text-3xl">🏆</span>
              <div>
                <span className="text-white font-bold text-sm block">Global Inception & Elysian FC Legacy</span>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Elysian FC was founded in 1899 amidst the post-industrial soccer boom, serving as a pillar of athletic prowess and fan community loyalty for over a century.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* RULES CONTENT */}
        {activeTab === 'rules' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-white">Core Laws & Official Game Rules</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Matches are governed by the International Football Association Board (IFAB). Here is an overview of the pivotal rules.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">🚩</span>
                  <h4 className="text-sm font-bold text-white">The Offside Rule (Law 11)</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  An attacking player is in an offside position if they are nearer to the opponent’s goal line than both the ball and the second-last opponent when the ball is played to them.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-red-500">🟨 🟥</span>
                  <h4 className="text-sm font-bold text-white">Misconduct & Cards (Law 12)</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Yellow cards represent warnings for unsporting behavior. Red cards are given for violent conduct or receiving two yellows, resulting in immediate player expulsion.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500">🥅</span>
                  <h4 className="text-sm font-bold text-white">Penalty Kicks (Law 14)</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Awarded if a player commits a physical foul inside their own penalty box. The ball is placed on the penalty spot (12 yards out) for a direct duel against the keeper.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">⏱️</span>
                  <h4 className="text-sm font-bold text-white">Match Duration (Law 7)</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Matches are divided into two equal 45-minute halves (90 minutes total). Referees add extra 'stoppage time' to compensate for injuries and dynamic gameplay delays.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* FIELD DETAILS CONTENT */}
        {activeTab === 'field' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-white">Field Dimensions & Pitch Layout</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Standard soccer field markings and dimensions are tightly regulated by FIFA to maintain fair play.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-4">
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-1">
                  <span className="text-xs font-mono font-bold text-emerald-400">DIMENSION GUIDELINES</span>
                  <span className="text-xs text-white font-bold block">Overall Length & Width</span>
                  <p className="text-[11px] text-slate-400">
                    The pitch must be rectangular. Touchlines must be 100-110m (110-120 yards) and goal lines must be 64-75m (70-80 yards) for international matches.
                  </p>
                </div>

                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-1">
                  <span className="text-xs font-mono font-bold text-emerald-400">PENALTY AREA</span>
                  <span className="text-xs text-white font-bold block">Box Specifications</span>
                  <p className="text-[11px] text-slate-400">
                    Extends 16.5m (18 yards) from the goal posts. The goalkeeper is only allowed to touch the ball with their hands inside this specific demarcated zone.
                  </p>
                </div>

                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-1">
                  <span className="text-xs font-mono font-bold text-emerald-400">THE GOAL POSTS</span>
                  <span className="text-xs text-white font-bold block">Goal Sizes</span>
                  <p className="text-[11px] text-slate-400">
                    The distance between the inside of the posts is 7.32m (8 yards), and the distance from the lower edge of the crossbar to the ground is 2.44m (8 feet).
                  </p>
                </div>
              </div>

              {/* Graphical Representation of Field */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-center items-center space-y-4 min-h-[300px] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
                {/* Visual Field Draw */}
                <div className="w-full max-w-[280px] h-44 border-2 border-slate-700/80 rounded relative flex items-center justify-center bg-emerald-950/20">
                  {/* Halfway Line */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-700/80"></div>
                  {/* Center Circle */}
                  <div className="absolute w-12 h-12 rounded-full border-2 border-slate-700/80 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700/80"></div>
                  </div>
                  {/* Penalty Box Left */}
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-10 border-t-2 border-b-2 border-r-2 border-slate-700/80"></div>
                  {/* Penalty Box Right */}
                  <div className="absolute right-0 top-1/4 bottom-1/4 w-10 border-t-2 border-b-2 border-l-2 border-slate-700/80"></div>
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Pitch Layout Blueprint</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Elysian Arena professional grade hybrid grass pitch</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TACTICS CONTENT */}
        {activeTab === 'tactics' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-white">Tactical Formations & Strategic Blueprints</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Modern soccer is a game of high strategic depth. Ranging from historic Tiki-Taka to contemporary Gegenpressing, formations dictate victory.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-2">
                <span className="text-xs font-mono font-bold text-amber-400">THE DYNAMIC ATTACK</span>
                <h4 className="text-sm font-bold text-white">4-3-3 Formation</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Focuses on possession and dominance. Features 4 defenders, 3 midfielders, and 3 forwards. Wingers drag opposition defenders wide to create space for central playmakers and overlapping fullbacks.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400">MIDFIELD SUPREMACY</span>
                <h4 className="text-sm font-bold text-white">3-5-2 Formation</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Grants heavy control of the central park. Requires extremely active wing-backs who sprint up and down to assist both defense and attack. Two central forwards link play directly with the playmaker.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-2">
                <span className="text-xs font-mono font-bold text-amber-400">CONTEMPORARY DOCTRINE</span>
                <h4 className="text-sm font-bold text-white">Gegenpressing</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Developed in Germany. Instructs the team to instantly pressure the opponent upon losing possession, exploiting the disorganization of the opponent during transition states. High physical demands.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400">LEGENDARY STYLE</span>
                <h4 className="text-sm font-bold text-white">Tiki-Taka</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Characterized by short passing, rapid movement, and maintaining possession. Starved of the ball, opponents lose spatial organization, permitting defense-splitting passes from midfield masters.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
