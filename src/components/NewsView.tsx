/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Newspaper, Calendar, User, ArrowRight, Search, SlidersHorizontal, Star, X, MapPin } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: 'Club News' | 'Match Report' | 'Transfer Rumours' | 'League Updates';
  image_url: string;
  readTime: string;
}

export default function NewsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const initialArticles: Article[] = [
    {
      id: 1,
      title: 'Elysian FC Announce Groundbreaking Stadium Expansion Project',
      excerpt: 'Elysian Arena capacity set to increase by 15,000 seats with state-of-the-art hybrid turf technology.',
      content: 'Elysian FC has today unveiled comprehensive blueprints for the expansion of the legendary Elysian Arena. The board has approved a multi-million budget that will expand capacity to 55,000, introducing carbon-neutral canopy architectures, solar panel feeds, and premium hospitality boxes. Construction begins at the end of the current season, with absolute zero disruption to scheduled first-team fixtures. Manager and squad members have expressed immense enthusiasm about playing in front of an even larger home crowd next season!',
      author: 'David Vance',
      date: '2026-07-12',
      category: 'Club News',
      image_url: '/news_stadium.jpg',
      readTime: '4 min read'
    },
    {
      id: 2,
      title: 'Elysian FC Clinch Thrilling 4-3 Victory Against Rangers',
      excerpt: 'A historic hat-trick by Lucas Drake secures critical three points in the championship race.',
      content: 'Under heavy rain at the Rangers Arena, Elysian FC put on a masterclass of offensive resilience. Trailing 2-0 early in the first half, Lucas Drake sparked a breathtaking comeback, converting two penalty kicks and landing a stunning 89th-minute volley to seal the 4-3 victory. The win solidifies our position in the top half of the league standings, with manager praising the unbreakable spirit and tactical discipline shown by the entire defensive squad during a tense final ten minutes of extra time.',
      author: 'Marcus Sterling',
      date: '2026-07-10',
      category: 'Match Report',
      image_url: '/news_victory.jpg',
      readTime: '6 min read'
    },
    {
      id: 3,
      title: 'Transfer Update: Creative Midfielder Rumoured to Join Club',
      excerpt: 'Reports suggest contract negotiations are underway with Spanish international maestro.',
      content: 'With the mid-season transfer window approaching, speculation is heating up. Sources close to the club indicate that Elysian FC scouts have held secret introductory meetings in Madrid. The target is reportedly a highly creative 24-year-old playmaker renowned for splitting low-block defenses. When questioned, the head coach smiled and commented that Elysian is always looking to enrich the team roster with elite tactical masterminds.',
      author: 'Sarah Cross',
      date: '2026-07-08',
      category: 'Transfer Rumours',
      image_url: '/news_transfer.jpg',
      readTime: '3 min read'
    },
    {
      id: 4,
      title: 'Super League Regulatory Framework Changes Announced',
      excerpt: 'IFAB introduces severe offside rules changes and tactical penalty adjustments.',
      content: 'The International Football Association Board (IFAB) has published a revised regulatory framework starting next month. The changes seek to accelerate match pacing by limiting goalkeeper delay times and simplifying handball evaluations inside the penalty zone. Elysian FC trainers are already conducting specialized practice runs to ensure our squad adapts flawlessly to these rules before matchday 12.',
      author: 'FIFA Press Office',
      date: '2026-07-05',
      category: 'League Updates',
      image_url: '/news_league.jpg',
      readTime: '5 min read'
    }
  ];

  // Filtering & Search
  const filteredArticles = initialArticles
    .filter(a => {
      const matchSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = activeCategory === 'All' || a.category === activeCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

  return (
    <div className="space-y-8 animate-fade-in" id="news-view-container">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-emerald-400">LATEST EXCERPTS & BLOGS</span>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
            <Newspaper className="text-emerald-500 w-8 h-8" />
            News & Press Room
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            Stay up to date with match analysis, transfer targets, stadium renovations, and official press bulletins from the Elysian FC board.
          </p>
        </div>

        {/* Categories filters inside visual container */}
        <div className="bg-slate-950 p-1 rounded-xl border border-slate-800/80 flex flex-wrap gap-1">
          {['All', 'Club News', 'Match Report', 'Transfer Rumours', 'League Updates'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Control Bar: Search and Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-slate-950 p-4 border border-slate-800/80 rounded-2xl">
        <div className="sm:col-span-8 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search press articles, reporters, or key updates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:outline-none rounded-xl pl-10 pr-4 py-2 text-xs text-white"
          />
        </div>

        <div className="sm:col-span-4 flex items-center gap-2.5 justify-end">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="text-[11px] text-slate-400 font-mono">Sort:</span>
          <select
            value={sortOrder}
            onChange={(e: any) => setSortOrder(e.target.value)}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="news-grid-cards">
        {filteredArticles.length === 0 ? (
          <div className="md:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
            No articles found matching search query or category filters.
          </div>
        ) : (
          filteredArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="bg-slate-950/70 border border-slate-800/80 rounded-3xl overflow-hidden hover:border-emerald-500/30 shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:-translate-y-1"
            >
              <div>
                {/* Visual Thumbnail */}
                <div className="h-48 overflow-hidden relative bg-slate-900">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10 opacity-70"></div>
                  <img
                    src={article.image_url}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
                  />
                  <span className="absolute top-4 left-4 z-20 bg-emerald-500 text-slate-950 text-[9px] font-mono tracking-widest uppercase font-black px-2.5 py-1 rounded-md">
                    {article.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      {new Date(article.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      {article.author}
                    </span>
                  </div>

                  <h3 className="text-white font-extrabold text-base tracking-tight group-hover:text-emerald-400 transition">
                    {article.title}
                  </h3>

                  <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-slate-900/40 flex justify-between items-center">
                <span className="text-[10px] font-mono text-slate-500">{article.readTime}</span>
                <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1 group-hover:underline">
                  Read Article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ARTICLE DETAIL MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 z-30 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white p-2 rounded-xl transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Banner Photo */}
            <div className="h-56 overflow-hidden relative bg-slate-900">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
              <img
                src={selectedArticle.image_url}
                alt={selectedArticle.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80"
              />
              <span className="absolute bottom-4 left-6 z-20 bg-emerald-500 text-slate-950 text-[10px] font-mono tracking-widest uppercase font-black px-2.5 py-1 rounded-md">
                {selectedArticle.category}
              </span>
            </div>

            {/* Text Content */}
            <div className="p-6 sm:p-8 space-y-4 max-h-[50vh] overflow-y-auto">
              <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  {new Date(selectedArticle.date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  By {selectedArticle.author}
                </span>
                <span className="text-slate-500">• {selectedArticle.readTime}</span>
              </div>

              <h2 className="text-xl font-black text-white tracking-tight leading-snug">
                {selectedArticle.title}
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {selectedArticle.content}
              </p>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-850 flex justify-between items-center px-6">
              <span className="text-[10px] font-mono text-slate-500">© Elysian FC Press Room</span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
