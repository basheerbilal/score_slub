/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Trophy, TrendingUp, Users, Calendar, Sparkles, Star, Target, Shield, 
  ChevronDown, Search, Bell, Moon, LogOut, LayoutDashboard, CalendarDays, 
  ShoppingBag, ClipboardList, MessageSquare, Settings, UsersRound, Plus, 
  Trash2, Edit2, Check, X, ShieldAlert, ArrowUpRight, ArrowDownRight, Award, ShieldCheck, Mail
} from 'lucide-react';
import { Match, Player, Product, Order, Feedback, Team, FifaMoment } from '../types';

interface AdminDashboardProps {
  matches: Match[];
  players: Player[];
  products: Product[];
  orders: Order[];
  feedbacks: Feedback[];
  teams: Team[];
  fifaMoments: FifaMoment[];
  onAddMatch: (match: Omit<Match, 'id'>) => void;
  onUpdateMatchScore: (id: number, homeScore: number, awayScore: number, status: Match['status']) => void;
  onDeleteMatch: (id: number) => void;
  onAddPlayer: (player: Omit<Player, 'id'>) => void;
  onDeletePlayer: (id: number) => void;
  onUpdateStock: (productId: number, newStock: number) => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onDeleteProduct: (id: number) => void;
  onUpdateProduct: (product: Product) => void;
  onUpdateOrderStatus: (id: number, status: Order['status']) => void;
  onAddMoment: (moment: Omit<FifaMoment, 'id'>) => void;
  onUpdateMoment: (updated: FifaMoment) => void;
  onDeleteMoment: (id: number) => void;
  subscribers?: string[];
  onDeleteSubscriber?: (email: string) => void;
}

export default function AdminDashboard({
  matches,
  players,
  products,
  orders,
  feedbacks,
  teams,
  fifaMoments,
  onAddMatch,
  onUpdateMatchScore,
  onDeleteMatch,
  onAddPlayer,
  onDeletePlayer,
  onUpdateStock,
  onAddProduct,
  onDeleteProduct,
  onUpdateProduct,
  onUpdateOrderStatus,
  onAddMoment,
  onUpdateMoment,
  onDeleteMoment,
  subscribers,
  onDeleteSubscriber
}: AdminDashboardProps) {
  
  const [subTab, setSubTab] = useState<'matches' | 'players' | 'products' | 'orders' | 'feedback' | 'moments' | 'subscribers'>('matches');

  // Moments form state
  const [momentForm, setMomentForm] = useState({
    name: '',
    country: 'AR 🇦🇷',
    img: '/moment_arg_player.jpg',
    video_url: '',
    type: 'top' as 'top' | 'celebration'
  });

  const [activeEditingMomentId, setActiveEditingMomentId] = useState<number | null>(null);
  const [editMomentForm, setEditMomentForm] = useState<FifaMoment | null>(null);

  // Match management form states
  const [matchForm, setMatchForm] = useState({
    home_team_id: 1,
    away_team_id: 2,
    home_team_score: 0,
    away_team_score: 0,
    match_date: '',
    status: 'upcoming' as Match['status'],
    stadium: 'Elysian Arena',
    competition: 'Elysian Super League'
  });

  // Player management form states
  const [playerForm, setPlayerForm] = useState({
    name: '',
    jersey_number: 10,
    position: 'Forward' as Player['position'],
    nationality: 'England',
    goals: 0,
    assists: 0,
    team_id: 1,
    image_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=85&crop=entropy'
  });

  // Product management form states
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 45.00,
    image_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&auto=format&fit=crop&q=60',
    category: 'Jerseys' as Product['category'],
    stock: 50
  });

  const [activeEditingMatchId, setActiveEditingMatchId] = useState<number | null>(null);
  const [editScore, setEditScore] = useState({ home: 0, away: 0, status: 'completed' as Match['status'] });

  const [activeEditingProductId, setActiveEditingProductId] = useState<number | null>(null);
  const [editProductForm, setEditProductForm] = useState<Product | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: 'product' | 'player' | 'match' | 'moment' | null;
    id: number | null;
    itemName: string;
  }>({
    isOpen: false,
    type: null,
    id: null,
    itemName: ''
  });

  const handleProductImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm(prev => ({ ...prev, image_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProductImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProductForm(prev => prev ? ({ ...prev, image_url: reader.result as string }) : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlayerImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPlayerForm(prev => ({ ...prev, image_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMomentImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMomentForm(prev => ({ ...prev, img: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const startEditProduct = (p: Product) => {
    setActiveEditingProductId(p.id);
    setEditProductForm({ ...p });
  };

  const handleSaveEditedProduct = () => {
    if (editProductForm) {
      setIsSavingProduct(true);
      setTimeout(() => {
        onUpdateProduct(editProductForm);
        setActiveEditingProductId(null);
        setEditProductForm(null);
        setIsSavingProduct(false);
      }, 750);
    }
  };

  const handleCancelEditProduct = () => {
    setActiveEditingProductId(null);
    setEditProductForm(null);
  };

  const handleCreateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchForm.home_team_id === matchForm.away_team_id) {
      alert("Home team and Away team must be distinct!");
      return;
    }
    onAddMatch({
      ...matchForm,
      match_date: matchForm.match_date ? new Date(matchForm.match_date).toISOString() : new Date().toISOString()
    });
    // Reset
    setMatchForm({
      home_team_id: 1,
      away_team_id: 2,
      home_team_score: 0,
      away_team_score: 0,
      match_date: '',
      status: 'upcoming',
      stadium: 'Elysian Arena',
      competition: 'Elysian Super League'
    });
  };

  const handleCreatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerForm.name) return;
    onAddPlayer(playerForm);
    setPlayerForm({
      name: '',
      jersey_number: 11,
      position: 'Forward',
      nationality: 'England',
      goals: 0,
      assists: 0,
      team_id: 1,
      image_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=85&crop=entropy'
    });
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name) return;
    onAddProduct(productForm);
    setProductForm({
      name: '',
      description: '',
      price: 45.00,
      image_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&auto=format&fit=crop&q=60',
      category: 'Jerseys',
      stock: 50
    });
  };

  const startEditMatch = (m: Match) => {
    setActiveEditingMatchId(m.id);
    setEditScore({ home: m.home_team_score, away: m.away_team_score, status: m.status });
  };

  const saveEditedMatch = (id: number) => {
    onUpdateMatchScore(id, editScore.home, editScore.away, editScore.status);
    setActiveEditingMatchId(null);
  };

  const getTeamName = (id: number) => {
    return teams.find(t => t.id === id)?.name || `Team ${id}`;
  };

  // Confirmation actions
  const executeDelete = () => {
    if (deleteConfirm.id !== null) {
      if (deleteConfirm.type === 'product') {
        onDeleteProduct(deleteConfirm.id);
      } else if (deleteConfirm.type === 'player') {
        onDeletePlayer(deleteConfirm.id);
      } else if (deleteConfirm.type === 'match') {
        onDeleteMatch(deleteConfirm.id);
      } else if (deleteConfirm.type === 'moment') {
        onDeleteMoment(deleteConfirm.id);
      }
    }
    setDeleteConfirm({ isOpen: false, type: null, id: null, itemName: '' });
  };

  return (
    <div className="flex bg-[#030712] min-h-screen text-slate-100 rounded-3xl overflow-hidden border border-slate-900 shadow-2xl" id="admin-dashboard-container">
      
      {/* 1. Left Sidebar Navigation */}
      <aside className="w-64 bg-[#090d16] border-r border-slate-900 flex flex-col justify-between p-5 hidden md:flex">
        <div className="space-y-7">
          {/* Logo Branding */}
          <div className="flex items-center gap-3 pl-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Trophy className="w-4 h-4 text-amber-500" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-white tracking-wider text-xs block uppercase">SOCCER FC</span>
              <span className="text-[8px] font-mono text-slate-500 block tracking-widest uppercase">SOCCER CLUB HUB</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-6">
            <div>
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block pl-2 mb-2">Navigation</span>
              <button className="w-full flex items-center gap-3 px-3 py-2 bg-amber-500/10 text-amber-500 border-l-2 border-amber-500 font-extrabold text-xs rounded-r-xl transition text-left cursor-pointer">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block pl-2 mb-2">Management</span>
              <button 
                onClick={() => setSubTab('matches')} 
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-xl transition text-left cursor-pointer ${
                  subTab === 'matches' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                }`}
              >
                <CalendarDays className="w-4 h-4 text-slate-500" />
                <span>Matches</span>
              </button>
              <button 
                onClick={() => setSubTab('players')} 
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-xl transition text-left cursor-pointer ${
                  subTab === 'players' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                }`}
              >
                <UsersRound className="w-4 h-4 text-slate-500" />
                <span>Squad</span>
              </button>
              <button 
                onClick={() => setSubTab('products')} 
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-xl transition text-left cursor-pointer ${
                  subTab === 'products' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-slate-500" />
                <span>Inventory</span>
              </button>
              <button 
                onClick={() => setSubTab('orders')} 
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-xl transition text-left cursor-pointer ${
                  subTab === 'orders' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                }`}
              >
                <ClipboardList className="w-4 h-4 text-slate-500" />
                <span>Orders</span>
              </button>
              <button 
                onClick={() => setSubTab('feedback')} 
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-xl transition text-left cursor-pointer ${
                  subTab === 'feedback' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span>Feedback</span>
              </button>
              <button 
                onClick={() => setSubTab('moments')} 
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-xl transition text-left cursor-pointer ${
                  subTab === 'moments' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                }`}
              >
                <Sparkles className="w-4 h-4 text-slate-500" />
                <span>Moments</span>
              </button>
              <button 
                onClick={() => setSubTab('subscribers')} 
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-xl transition text-left cursor-pointer ${
                  subTab === 'subscribers' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                }`}
              >
                <Mail className="w-4 h-4 text-slate-500" />
                <span>Subscribers</span>
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block pl-2 mb-2">System</span>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-900/40 text-xs font-bold rounded-xl transition text-left cursor-pointer">
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Settings</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Logout Card */}
        <button 
          onClick={() => window.location.reload()}
          className="w-full flex items-center gap-3 px-3 py-2.5 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-extrabold rounded-xl transition text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Portal</span>
        </button>
      </aside>

      {/* 2. Main Dashboard Content Column */}
      <div className="flex-grow p-6 sm:p-8 space-y-6 overflow-y-auto">
        
        {/* Top Arthur Admin Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-900 pb-5">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search anything... (Ctrl + K)"
              className="w-full bg-[#090d16]/50 border border-slate-850 focus:border-amber-500 focus:outline-none rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-600"
            />
          </div>
          <div className="flex items-center gap-4 self-end sm:self-auto">
            <button className="bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-lg text-amber-500 font-extrabold text-[10px] uppercase tracking-wider">
              ADMIN ACCOUNT
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-xs font-mono">
                AA
              </div>
              <span className="text-slate-300 text-xs font-bold">Arthur Admin</span>
            </div>
            <button className="p-2 rounded-lg bg-slate-900 border border-slate-850 hover:text-white transition">
              <Bell className="w-4 h-4 text-slate-400" />
            </button>
            <button className="p-2 rounded-lg bg-slate-900 border border-slate-850 hover:text-white transition">
              <Moon className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Header Title block */}
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="text-amber-500 w-6 h-6" />
            Admin Dashboard
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Official Club CRM Database, stock inventory management controls, and fan analytics.
          </p>
        </div>

        {/* 3. Top Summary Metrics Cards (4 columns) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#090d16]/60 border border-slate-850 rounded-2xl p-4 space-y-2 relative overflow-hidden">
            <CalendarDays className="absolute right-4 top-4 w-10 h-10 text-slate-500/5" />
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Total Matches</span>
            <div className="flex items-baseline gap-2 pt-1">
              <strong className="text-2xl font-black text-white">{matches.length}</strong>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <ArrowUpRight className="w-2.5 h-2.5" /> 12%
              </span>
            </div>
            <span className="text-[9px] text-slate-500 block">This Season</span>
          </div>

          <div className="bg-[#090d16]/60 border border-slate-850 rounded-2xl p-4 space-y-2 relative overflow-hidden">
            <UsersRound className="absolute right-4 top-4 w-10 h-10 text-slate-500/5" />
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Total Players</span>
            <div className="flex items-baseline gap-2 pt-1">
              <strong className="text-2xl font-black text-white">{players.filter(p => p.team_id === 1).length}</strong>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <ArrowUpRight className="w-2.5 h-2.5" /> 8%
              </span>
            </div>
            <span className="text-[9px] text-slate-500 block">In Squad</span>
          </div>

          <div className="bg-[#090d16]/60 border border-slate-850 rounded-2xl p-4 space-y-2 relative overflow-hidden">
            <ShoppingBag className="absolute right-4 top-4 w-10 h-10 text-slate-500/5" />
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Total Inventory</span>
            <div className="flex items-baseline gap-2 pt-1">
              <strong className="text-2xl font-black text-white">{products.length}</strong>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <ArrowUpRight className="w-2.5 h-2.5" /> 16%
              </span>
            </div>
            <span className="text-[9px] text-slate-500 block">Items in Stock</span>
          </div>

          <div className="bg-[#090d16]/60 border border-slate-850 rounded-2xl p-4 space-y-2 relative overflow-hidden">
            <ClipboardList className="absolute right-4 top-4 w-10 h-10 text-slate-500/5" />
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Total Orders</span>
            <div className="flex items-baseline gap-2 pt-1">
              <strong className="text-2xl font-black text-white">{orders.length}</strong>
              <span className="text-[9px] bg-rose-500/10 text-rose-400 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <ArrowDownRight className="w-2.5 h-2.5" /> 3%
              </span>
            </div>
            <span className="text-[9px] text-slate-500 block">This Month</span>
          </div>

        </div>

        {/* Admin Mobile Tabs Switcher */}
        <div className="md:hidden bg-slate-950 p-1 rounded-xl border border-slate-900 flex overflow-x-auto gap-2">
          {['matches', 'players', 'products', 'orders', 'feedback', 'moments'].map(t => (
            <button
              key={t}
              onClick={() => setSubTab(t as any)}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition whitespace-nowrap ${
                subTab === t ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        <div className="p-1">
          
          {/* Matches subtab content */}
          {subTab === 'matches' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* A. Left column: Schedule New Match Form */}
              <div className="lg:col-span-5 bg-[#090d16]/40 border border-slate-850 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                  <Plus className="text-amber-500 w-4 h-4" />
                  <span className="text-white font-extrabold text-sm uppercase tracking-wider block">Schedule New Match</span>
                </div>

                <form onSubmit={handleCreateMatch} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Home Team</label>
                      <select
                        value={matchForm.home_team_id}
                        onChange={(e) => setMatchForm(prev => ({ ...prev, home_team_id: Number(e.target.value) }))}
                        className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                      >
                        {teams.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Away Team</label>
                      <select
                        value={matchForm.away_team_id}
                        onChange={(e) => setMatchForm(prev => ({ ...prev, away_team_id: Number(e.target.value) }))}
                        className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                      >
                        {teams.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Match Date & Time</label>
                    <input
                      type="datetime-local"
                      value={matchForm.match_date}
                      onChange={(e) => setMatchForm(prev => ({ ...prev, match_date: e.target.value }))}
                      className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Stadium Location</label>
                    <input
                      type="text"
                      value={matchForm.stadium}
                      onChange={(e) => setMatchForm(prev => ({ ...prev, stadium: e.target.value }))}
                      className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 text-xs shadow-lg shadow-amber-500/10"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule Match</span>
                  </button>
                </form>
              </div>

              {/* B. Right column: Active Fixtures Ledger */}
              <div className="lg:col-span-7 bg-[#090d16]/40 border border-slate-850 rounded-3xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                  <span className="text-white font-extrabold text-sm uppercase tracking-wider">Active Fixtures</span>
                  <button className="text-[9px] bg-slate-900 border border-slate-850 px-2.5 py-1 rounded text-slate-400 font-bold hover:text-white transition">
                    View All
                  </button>
                </div>

                <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                  {matches.slice(0, 3).map((match) => (
                    <div 
                      key={match.id} 
                      className="bg-slate-950/70 border border-slate-850 rounded-2xl p-4 flex justify-between items-center gap-4 transition hover:border-slate-800 shadow-sm"
                    >
                      <div className="space-y-2 flex-grow min-w-0">
                        {/* Match info row */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-extrabold text-xs">{getTeamName(match.home_team_id)}</span>
                            <span className="text-[9px] text-slate-500 font-mono">VS</span>
                            <span className="text-white font-extrabold text-xs">{getTeamName(match.away_team_id)}</span>
                          </div>
                        </div>

                        {/* Competition and Date metadata */}
                        <div className="text-[10px] text-slate-500 font-mono font-medium block uppercase tracking-wider">
                          {match.competition} • {match.stadium}
                        </div>

                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[8px] font-mono font-black uppercase tracking-wider ${
                          match.status === 'live' ? 'bg-red-500/10 text-red-400 border border-red-500/25 animate-pulse' :
                          match.status === 'completed' ? 'bg-slate-800 text-slate-400' : 
                          'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                        }`}>
                          {match.status}
                        </span>
                      </div>

                      {/* Controls score edit / icons */}
                      <div className="flex items-center gap-2 text-xs">
                        {activeEditingMatchId === match.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={editScore.home}
                              onChange={(e) => setEditScore(prev => ({ ...prev, home: Number(e.target.value) }))}
                              className="w-8 bg-[#030712] text-center text-white border border-slate-800 py-1 rounded text-xs"
                              min="0"
                            />
                            <span className="text-slate-600 font-bold">:</span>
                            <input
                              type="number"
                              value={editScore.away}
                              onChange={(e) => setEditScore(prev => ({ ...prev, away: Number(e.target.value) }))}
                              className="w-8 bg-[#030712] text-center text-white border border-slate-800 py-1 rounded text-xs"
                              min="0"
                            />
                            <button
                              onClick={() => saveEditedMatch(match.id)}
                              className="p-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 rounded transition"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-white bg-[#030712] px-2.5 py-1 rounded border border-slate-850 shadow-inner">
                              {match.home_team_score} - {match.away_team_score}
                            </span>
                            <button
                              onClick={() => startEditMatch(match)}
                              className="p-2 bg-slate-900 border border-slate-850 text-slate-400 hover:text-white rounded-lg transition"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onDeleteMatch(match.id)}
                              className="p-2 bg-slate-900 border border-slate-850 text-slate-400 hover:text-rose-500 rounded-lg transition"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Fallback tab panels rendering: Squad list, Inventory, Orders, Feedback, Moments */}
          {subTab === 'players' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Squad Register */}
              <div className="lg:col-span-5 bg-[#090d16]/40 border border-slate-850 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                  <Plus className="text-amber-500 w-4 h-4" />
                  <span className="text-white font-extrabold text-sm uppercase tracking-wider block">Register Squad Contract</span>
                </div>
                <form onSubmit={handleCreatePlayer} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Player Name</label>
                    <input
                      type="text"
                      value={playerForm.name}
                      onChange={(e) => setPlayerForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Gabriel Martin"
                      className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Jersey Number</label>
                      <input
                        type="number"
                        value={playerForm.jersey_number}
                        onChange={(e) => setPlayerForm(prev => ({ ...prev, jersey_number: Number(e.target.value) }))}
                        className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                        min="1"
                        max="99"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Squad Position</label>
                      <select
                        value={playerForm.position}
                        onChange={(e) => setPlayerForm(prev => ({ ...prev, position: e.target.value as Player['position'] }))}
                        className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                      >
                        <option value="Goalkeeper">Goalkeeper</option>
                        <option value="Defender">Defender</option>
                        <option value="Midfielder">Midfielder</option>
                        <option value="Forward">Forward</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Nationality</label>
                    <input
                      type="text"
                      value={playerForm.nationality}
                      onChange={(e) => setPlayerForm(prev => ({ ...prev, nationality: e.target.value }))}
                      className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Image Upload</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePlayerImageFileChange}
                        className="w-full text-slate-400 text-[10px]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Or Image URL</label>
                      <input
                        type="text"
                        value={playerForm.image_url.startsWith('data:') ? '' : playerForm.image_url}
                        onChange={(e) => setPlayerForm(prev => ({ ...prev, image_url: e.target.value || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=85&crop=entropy' }))}
                        placeholder="Paste image web URL..."
                        className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                  {playerForm.image_url && (
                    <div className="space-y-1">
                      <span className="text-slate-500 font-mono text-[9px] uppercase tracking-wider block">Image Preview:</span>
                      <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-850 overflow-hidden flex items-center justify-center">
                        <img src={playerForm.image_url} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 text-xs shadow-lg shadow-amber-500/10"
                  >
                    <UsersRound className="w-3.5 h-3.5" />
                    <span>Register Player</span>
                  </button>
                </form>
              </div>

              {/* Roster list */}
              <div className="lg:col-span-7 bg-[#090d16]/40 border border-slate-850 rounded-3xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                  <span className="text-white font-extrabold text-sm uppercase tracking-wider">Club Squad Roster</span>
                </div>
                <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                  {players.filter(p => p.team_id === 1).map(player => (
                    <div
                      key={player.id}
                      className="bg-slate-950/70 border border-slate-850 rounded-2xl p-3 flex justify-between items-center gap-4 transition hover:border-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center">
                          <img src={player.image_url} alt={player.name} className="w-full h-full object-cover object-top" />
                        </div>
                        <div className="text-xs">
                          <span className="text-white font-bold block">{player.name}</span>
                          <span className="text-slate-500 font-mono text-[9px] uppercase tracking-wider block mt-0.5">
                            #{player.jersey_number} • {player.position} • {player.nationality}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onDeletePlayer(player.id)}
                        className="p-2 bg-slate-900 border border-slate-850 text-slate-400 hover:text-rose-500 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Product Inventory Tab */}
          {subTab === 'products' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Add Product Form */}
              <div className="lg:col-span-5 bg-[#090d16]/40 border border-slate-850 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                  <Plus className="text-amber-500 w-4 h-4" />
                  <span className="text-white font-extrabold text-sm uppercase tracking-wider block">Add Club Merchandise</span>
                </div>
                <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Item Title</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Official Away Jersey"
                      className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Product Description</label>
                    <input
                      type="text"
                      value={productForm.description}
                      onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Woven polyester fit kit..."
                      className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Image Upload</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProductImageFileChange}
                        className="w-full text-slate-400 text-[10px]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Or Image URL</label>
                      <input
                        type="text"
                        value={productForm.image_url.startsWith('data:') ? '' : productForm.image_url}
                        onChange={(e) => setProductForm(prev => ({ ...prev, image_url: e.target.value }))}
                        placeholder="Paste image web URL..."
                        className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Price ($)</label>
                      <input
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                        className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                        min="1"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Quantity</label>
                      <input
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm(prev => ({ ...prev, stock: Number(e.target.value) }))}
                        className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                        min="0"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Category</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value as Product['category'] }))}
                        className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                      >
                        <option value="Jerseys">Jerseys</option>
                        <option value="Shoes">Shoes</option>
                        <option value="Equipment">Equipment</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 text-xs shadow-lg shadow-amber-500/10"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Product</span>
                  </button>
                </form>
              </div>

              {/* Inventory list */}
              <div className="lg:col-span-7 bg-[#090d16]/40 border border-slate-850 rounded-3xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                  <span className="text-white font-extrabold text-sm uppercase tracking-wider">Club Inventory Ledger</span>
                </div>
                <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                  {products.map(prod => (
                    <div
                      key={prod.id}
                      className="bg-slate-950/70 border border-slate-850 rounded-2xl p-3.5 flex flex-col gap-3.5 transition hover:border-slate-800 shadow-sm"
                    >
                      {activeEditingProductId === prod.id && editProductForm ? (
                        <div className="space-y-3.5 text-xs w-full">
                          <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                            <span className="font-mono text-[9px] text-amber-500 font-bold uppercase tracking-wider">
                              Editing Product ID: {prod.id}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={handleSaveEditedProduct}
                                className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-lg text-[10px]"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEditProduct}
                                className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-300 font-extrabold rounded-lg text-[10px]"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-bold block">Product Name</label>
                              <input
                                type="text"
                                value={editProductForm.name}
                                onChange={(e) => setEditProductForm(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                                className="w-full bg-[#030712] border border-slate-800 rounded-xl px-2.5 py-1.5 text-white"
                                required
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-bold block">Image Upload / URL</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleEditProductImageFileChange}
                                className="w-full text-slate-400 text-[10px]"
                              />
                              <input
                                type="text"
                                value={editProductForm.image_url.startsWith('data:') ? 'Local Upload Image' : editProductForm.image_url}
                                onChange={(e) => setEditProductForm(prev => prev ? ({ ...prev, image_url: e.target.value }) : null)}
                                className="w-full bg-[#030712] border border-slate-800 rounded-xl px-2.5 py-1.5 text-white mt-1 text-[10px] font-mono"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-4 w-full">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-850 overflow-hidden flex-shrink-0">
                              <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-xs">
                              <span className="text-white font-bold block truncate max-w-[200px]">{prod.name}</span>
                              <span className="text-slate-500 font-mono text-[9px] uppercase tracking-wider block mt-0.5">
                                Category: <strong className="text-slate-450">{prod.category}</strong> • Price: <strong className="text-amber-500">${prod.price.toFixed(2)}</strong>
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-white bg-[#030712] px-2.5 py-1 rounded border border-slate-850 shadow-inner">
                              Stock: {prod.stock}
                            </span>
                            <button
                              onClick={() => startEditProduct(prod)}
                              className="p-2 bg-slate-900 border border-slate-850 text-slate-400 hover:text-white rounded-lg transition"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onDeleteProduct(prod.id)}
                              className="p-2 bg-slate-900 border border-slate-850 text-slate-400 hover:text-rose-500 rounded-lg transition"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Render remaining orders, feedback, moments subtabs fallback widgets */}
          {subTab === 'orders' && (
            <div className="bg-[#090d16]/40 border border-slate-850 rounded-3xl p-6 space-y-4">
              <span className="text-white font-extrabold text-sm uppercase tracking-wider block border-b border-slate-900 pb-2">Sales Orders Audit</span>
              <div className="space-y-3.5 max-h-[420px] overflow-y-auto">
                {orders.map(ord => (
                  <div key={ord.id} className="bg-slate-950/70 border border-slate-850 p-4 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <span className="text-white font-extrabold block">Order #{ord.id}</span>
                      <span className="text-[10px] text-slate-500 font-mono uppercase mt-0.5 block">Total: <strong className="text-amber-500">${ord.total_amount.toFixed(2)}</strong> • Items: {ord.items.length}</span>
                    </div>
                    <select
                      value={ord.status}
                      onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as any)}
                      className="bg-[#030712] border border-slate-800 text-white rounded-xl px-2.5 py-1 cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {subTab === 'feedback' && (
            <div className="bg-[#090d16]/40 border border-slate-850 rounded-3xl p-6 space-y-4">
              <span className="text-white font-extrabold text-sm uppercase tracking-wider block border-b border-slate-900 pb-2">Fan Experience Reviews</span>
              <div className="space-y-3.5 max-h-[420px] overflow-y-auto">
                {feedbacks.map(f => (
                  <div key={f.id} className="bg-slate-950/70 border border-slate-850 p-4 rounded-2xl text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-extrabold text-sm">{f.name} ({f.email})</span>
                      <span className="flex items-center gap-0.5 text-amber-500 font-mono text-[10px] font-bold bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                        ★ {f.rating}/5
                      </span>
                    </div>
                    <span className="text-amber-500 font-mono font-bold text-[9px] uppercase tracking-wider block">{f.subject}</span>
                    <p className="text-slate-400 leading-normal">{f.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {subTab === 'moments' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Add moment */}
              <div className="lg:col-span-5 bg-[#090d16]/40 border border-slate-850 rounded-3xl p-6 space-y-4">
                <span className="text-white font-extrabold text-sm uppercase tracking-wider block border-b border-slate-900 pb-2">Add FIFA Moment</span>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!momentForm.name) return;
                  // Convert plain YouTube watch URL to embed URL
                  let videoUrl = momentForm.video_url.trim();
                  if (videoUrl) {
                    const watchMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                    if (watchMatch) {
                      videoUrl = `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&rel=0`;
                    }
                  }
                  onAddMoment({ ...momentForm, video_url: videoUrl || undefined });
                  setMomentForm({ name: '', country: 'AR 🇦🇷', img: '/moment_arg_player.jpg', video_url: '', type: 'top' });
                }} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Moment Title</label>
                    <input
                      type="text"
                      value={momentForm.name}
                      onChange={(e) => setMomentForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Messi Lifting Trophy"
                      className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-cyan-500/50 focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  {/* YouTube Link - Reorganized to top */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="inline-block w-3 h-3 bg-red-600 rounded-sm text-white text-[7px] flex items-center justify-center font-black">▶</span>
                      YouTube Link (Optional)
                    </label>
                    <input
                      type="text"
                      value={momentForm.video_url}
                      onChange={(e) => setMomentForm(prev => ({ ...prev, video_url: e.target.value }))}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-700 focus:border-cyan-500/50 focus:outline-none transition-colors"
                    />
                    <span className="text-[8px] text-slate-500 font-mono block">
                      Auto-converts watch URLs into embed format
                    </span>
                  </div>

                  {/* Moment Type Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Moment Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setMomentForm(prev => ({ ...prev, type: 'top' }))}
                        className={`flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          momentForm.type === 'top'
                            ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-400'
                            : 'bg-[#030712] border-slate-800 text-slate-500 hover:border-slate-700'
                        }`}
                      >
                        ⚽ Top Moment
                      </button>
                      <button
                        type="button"
                        onClick={() => setMomentForm(prev => ({ ...prev, type: 'celebration' }))}
                        className={`flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          momentForm.type === 'celebration'
                            ? 'bg-pink-500/15 border-pink-500/60 text-pink-400'
                            : 'bg-[#030712] border-slate-800 text-slate-500 hover:border-slate-700'
                        }`}
                      >
                        🎉 Celebration
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Image Upload</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMomentImageFileChange}
                        className="w-full text-slate-400 text-[10px]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Or Image URL</label>
                      <input
                        type="text"
                        value={momentForm.img.startsWith('data:') ? '' : momentForm.img}
                        onChange={(e) => setMomentForm(prev => ({ ...prev, img: e.target.value || '/moment_arg_player.jpg' }))}
                        placeholder="/moment_arg_player.jpg"
                        className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-cyan-500/50 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {momentForm.img && (
                    <div className="space-y-1">
                      <span className="text-slate-500 font-mono text-[9px] uppercase tracking-wider block">Image Preview:</span>
                      <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
                        <img src={momentForm.img} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 text-xs shadow-lg shadow-cyan-500/10"
                  >
                    Create Moment
                  </button>
                </form>
              </div>

              {/* Moments list */}
              <div className="lg:col-span-7 bg-[#090d16]/40 border border-slate-850 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <span className="text-white font-extrabold text-sm uppercase tracking-wider">FIFA Moments Ledger</span>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-bold px-2 py-0.5 rounded font-mono">
                      ⚽ {fifaMoments.filter(m => m.type === 'top').length} Top
                    </span>
                    <span className="bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[9px] font-bold px-2 py-0.5 rounded font-mono">
                      🎉 {fifaMoments.filter(m => m.type === 'celebration').length} Celeb
                    </span>
                  </div>
                </div>
                <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                  {fifaMoments.map(mom => (
                    <div key={mom.id} className="bg-slate-950/70 border border-slate-850 p-3.5 rounded-2xl flex flex-col gap-3 text-xs transition hover:border-slate-800">
                      <div className="flex justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={mom.img} alt={mom.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="text-white font-extrabold block">{mom.name}</span>
                            <span className="text-slate-500 font-mono text-[9px] uppercase tracking-wider mt-0.5 block">{mom.country}</span>
                            {/* Type badge */}
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className={`inline-flex items-center gap-1 text-[8px] font-bold px-1.5 py-0.5 rounded font-mono uppercase tracking-wider border ${
                                mom.type === 'celebration'
                                  ? 'bg-pink-500/15 border-pink-500/30 text-pink-400'
                                  : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                              }`}>
                                {mom.type === 'celebration' ? '🎉 Celebration' : '⚽ Top Moment'}
                              </span>
                              {mom.video_url ? (
                                <span className="inline-flex items-center gap-1 bg-red-600/15 border border-red-600/30 text-red-400 text-[8px] font-bold px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
                                  <span>▶</span> YouTube
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-slate-800/50 border border-slate-700/30 text-slate-500 text-[8px] font-bold px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
                                  No Video
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => onDeleteMoment(mom.id)}
                          className="p-2 bg-slate-900 border border-slate-850 text-slate-400 hover:text-rose-500 rounded-lg transition flex-shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Inline YouTube URL edit */}
                      <div className="flex items-center gap-2 bg-[#030712] border border-slate-800 rounded-xl px-3 py-1.5">
                        <span className="text-[8px] text-red-500 font-black flex-shrink-0">▶</span>
                        <input
                          type="text"
                          defaultValue={mom.video_url || ''}
                          placeholder="Paste YouTube URL to link video..."
                          className="bg-transparent text-slate-300 text-[10px] font-mono placeholder-slate-600 flex-grow focus:outline-none"
                          onBlur={(e) => {
                            let val = e.target.value.trim();
                            if (val) {
                              const watchMatch = val.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                              if (watchMatch) {
                                val = `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&rel=0`;
                              }
                            }
                            onUpdateMoment({ ...mom, video_url: val || undefined });
                          }}
                        />
                        {mom.video_url && (
                          <button
                            onClick={() => onUpdateMoment({ ...mom, video_url: undefined })}
                            className="text-slate-600 hover:text-rose-500 transition flex-shrink-0"
                            title="Remove video link"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {subTab === 'subscribers' && (
            <div className="bg-[#090d16]/40 border border-slate-850 rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                <span className="text-white font-extrabold text-sm uppercase tracking-wider block">Newsletter Subscribers</span>
                <span className="bg-amber-500/10 text-amber-500 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded border border-amber-500/15">
                  {subscribers?.length || 0} Registered
                </span>
              </div>
              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {(subscribers || []).map((email, idx) => (
                  <div key={idx} className="bg-slate-950/70 border border-slate-850 p-4 rounded-2xl flex justify-between items-center text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-white block font-bold">{email}</strong>
                        <span className="text-[9px] text-slate-500 font-mono">Subscriber #{idx + 1} • Live Feed Active</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteSubscriber && onDeleteSubscriber(email)}
                      className="p-2 bg-slate-900 border border-slate-850 text-slate-400 hover:text-rose-500 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {(subscribers || []).length === 0 && (
                  <div className="text-center py-12 text-slate-500 font-mono text-xs">
                    No active newsletter subscribers registered yet.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* 4. Bottom Metrics Cards with mini Sparklines SVG (4 columns) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          
          <div className="bg-[#090d16]/40 border border-slate-850 rounded-2xl p-4 space-y-2 shadow-md">
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Total Revenue</span>
            <strong className="text-xl font-black text-white block">$18,750</strong>
            {/* Sparkline chart SVG */}
            <div className="h-8 w-full pt-1">
              <svg className="w-full h-full text-emerald-500" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0,15 Q15,5 30,12 T60,5 T90,2 T100,10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[8px] text-slate-500 block">This Month</span>
          </div>

          <div className="bg-[#090d16]/40 border border-slate-850 rounded-2xl p-4 space-y-2 shadow-md">
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Merch Sales</span>
            <strong className="text-xl font-black text-white block">$7,250</strong>
            {/* Sparkline chart SVG */}
            <div className="h-8 w-full pt-1">
              <svg className="w-full h-full text-amber-500" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0,18 Q20,10 40,15 T70,8 T90,2 T100,8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[8px] text-slate-500 block">This Month</span>
          </div>

          <div className="bg-[#090d16]/40 border border-slate-850 rounded-2xl p-4 space-y-2 shadow-md">
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">New Members</span>
            <strong className="text-xl font-black text-white block">124</strong>
            {/* Sparkline chart SVG */}
            <div className="h-8 w-full pt-1">
              <svg className="w-full h-full text-purple-500" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0,16 Q20,18 40,10 T70,12 T90,4 T100,2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[8px] text-slate-500 block">This Month</span>
          </div>

          <div className="bg-[#090d16]/40 border border-slate-850 rounded-2xl p-4 space-y-2 shadow-md">
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Feedback Score</span>
            <strong className="text-xl font-black text-white block">4.8 / 5</strong>
            {/* Sparkline chart SVG */}
            <div className="h-8 w-full pt-1">
              <svg className="w-full h-full text-blue-500" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0,12 Q20,10 40,8 T70,6 T90,5 T100,4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[8px] text-slate-500 block">Average Rating</span>
          </div>

        </div>

      </div>

      {/* Delete Confirmation Modal Overlay */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setDeleteConfirm(prev => ({ ...prev, isOpen: false }))} className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="relative bg-[#090d16] border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center z-10 animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <strong className="text-white text-base block font-bold">Are you absolutely sure?</strong>
              <p className="text-slate-400 text-xs leading-normal">
                You are about to delete <strong className="text-white">"{deleteConfirm.itemName}"</strong>. This transaction will revoke all records immediately.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={executeDelete}
                className="flex-grow py-2.5 bg-rose-500 hover:bg-rose-450 text-slate-950 font-extrabold rounded-xl text-xs transition cursor-pointer"
              >
                Confirm Delete
              </button>
              <button 
                onClick={() => setDeleteConfirm(prev => ({ ...prev, isOpen: false }))}
                className="flex-grow py-2.5 bg-slate-900 border border-slate-850 hover:bg-slate-850 text-slate-300 font-extrabold rounded-xl text-xs transition border border-slate-800 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
