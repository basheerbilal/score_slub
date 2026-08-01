/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import MatchesView from './components/MatchesView';
import PlayersView from './components/PlayersView';
import ShopView from './components/ShopView';
import CartView from './components/CartView';
import AuthView from './components/AuthView';
import AdminDashboard from './components/AdminDashboard';
import SettingsView from './components/SettingsView';
import SoccerInfoView from './components/SoccerInfoView';
import StatisticsView from './components/StatisticsView';
import NewsView from './components/NewsView';
import ContactUsView from './components/ContactUsView';
import { motion, AnimatePresence } from 'motion/react';

import {
  initialTeams,
  initialPlayers,
  initialMatches,
  initialProducts,
  initialFeedback,
  initialOrders,
  initialFifaMoments
} from './initialData';

import { Match, Player, Product, Order, Feedback, CartItem, User, Team, FifaMoment } from './types';
import { Sparkles, Trophy, Calendar, HelpCircle, Terminal, Heart, Code } from 'lucide-react';
import { fetchFootballData } from './footballApi';

export default function App() {
  // Ensure local storage is initialized with static mock values
  useEffect(() => {
    const currentVersion = '2'; // increment when initialData schema changes
    const storedVersion = localStorage.getItem('soccer_data_version');

    if (!localStorage.getItem('soccer_init') || storedVersion !== currentVersion) {
      localStorage.setItem('soccer_teams', JSON.stringify(initialTeams));
      localStorage.setItem('soccer_players', JSON.stringify(initialPlayers));
      localStorage.setItem('soccer_matches', JSON.stringify(initialMatches));
      localStorage.setItem('soccer_products', JSON.stringify(initialProducts));
      localStorage.setItem('soccer_feedbacks', JSON.stringify(initialFeedback));
      localStorage.setItem('soccer_orders', JSON.stringify(initialOrders));
      localStorage.setItem('soccer_fifa_moments', JSON.stringify(initialFifaMoments));
      localStorage.setItem('soccer_cart', JSON.stringify([]));
      localStorage.setItem('soccer_init', 'true');
      localStorage.setItem('soccer_data_version', currentVersion);
    }
  }, []);

  // Background Auto-Sync real-time matches on mount + polling interval
  useEffect(() => {
    const doSync = async () => {
      const savedProvider = (localStorage.getItem('soccer_api_provider') as any) || 'football-data';
      const savedKey = localStorage.getItem('soccer_api_key') || import.meta.env.VITE_FOOTBALL_API_KEY || '4c31696fe9264598a88a7d1691481b40';
      if (!savedKey) return;
      try {
        const result = await fetchFootballData(savedProvider, savedKey);
        setMatches(result.matches);
        setTeams(result.teams);
        localStorage.setItem('soccer_matches', JSON.stringify(result.matches));
        localStorage.setItem('soccer_teams', JSON.stringify(result.teams));
        localStorage.setItem('soccer_api_synced', 'true');
        localStorage.setItem('soccer_last_sync', new Date().toISOString());
      } catch (error) {
        console.warn("Auto-sync of matches failed. Using local cached matches.", error);
      }
    };

    // Initial sync on mount
    doSync();

    // Poll every 30s when live matches exist, else every 5 minutes
    const getLiveInterval = () => {
      const cached = localStorage.getItem('soccer_matches');
      const parsed = cached ? JSON.parse(cached) : [];
      const hasLive = parsed.some((m: any) => m.status === 'live');
      return hasLive ? 30_000 : 300_000;
    };

    let intervalId: ReturnType<typeof setInterval>;
    const scheduleNext = () => {
      intervalId = setTimeout(async () => {
        await doSync();
        scheduleNext();
      }, getLiveInterval());
    };
    scheduleNext();

    return () => clearTimeout(intervalId);
  }, []);

  // State handles loading from local storage
  const [teams, setTeams] = useState<Team[]>(() => {
    const raw = localStorage.getItem('soccer_teams');
    return raw ? JSON.parse(raw) : initialTeams;
  });

  const [players, setPlayers] = useState<Player[]>(() => {
    const raw = localStorage.getItem('soccer_players');
    if (raw) {
      try {
        const parsed: Player[] = JSON.parse(raw);
        if (parsed.some(p => p.image_url.includes('unsplash.com') || p.image_url.includes('wikipedia.org') || p.name === 'Leo Sterling')) {
          localStorage.setItem('soccer_players', JSON.stringify(initialPlayers));
          return initialPlayers;
        }
        let updated = false;
        const migrated = parsed.map((p) => {
          const initialMatch = initialPlayers.find(ip => ip.id === p.id);
          if (initialMatch && (p.image_url !== initialMatch.image_url || p.name !== initialMatch.name)) {
            updated = true;
            return { ...p, name: initialMatch.name, image_url: initialMatch.image_url, nationality: initialMatch.nationality, goals: initialMatch.goals, assists: initialMatch.assists, jersey_number: initialMatch.jersey_number };
          }
          return p;
        });
        if (updated) {
          localStorage.setItem('soccer_players', JSON.stringify(migrated));
          return migrated;
        }
        return parsed;
      } catch (e) {
        return initialPlayers;
      }
    }
    return initialPlayers;
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const raw = localStorage.getItem('soccer_matches');
    return raw ? JSON.parse(raw) : initialMatches;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const raw = localStorage.getItem('soccer_products');
    return raw ? JSON.parse(raw) : initialProducts;
  });

  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => {
    const raw = localStorage.getItem('soccer_feedbacks');
    return raw ? JSON.parse(raw) : initialFeedback;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const raw = localStorage.getItem('soccer_orders');
    return raw ? JSON.parse(raw) : initialOrders;
  });

  const [fifaMoments, setFifaMoments] = useState<FifaMoment[]>(() => {
    const raw = localStorage.getItem('soccer_fifa_moments');
    return raw ? JSON.parse(raw) : initialFifaMoments;
  });

  const handleAddMoment = (moment: Omit<FifaMoment, 'id'>) => {
    const nextId = fifaMoments.length > 0 ? Math.max(...fifaMoments.map(m => m.id)) + 1 : 1;
    const nextMoments = [...fifaMoments, { ...moment, id: nextId }];
    setFifaMoments(nextMoments);
    saveToStorage('soccer_fifa_moments', nextMoments);
  };

  const handleUpdateMoment = (updated: FifaMoment) => {
    const nextMoments = fifaMoments.map(m => m.id === updated.id ? updated : m);
    setFifaMoments(nextMoments);
    saveToStorage('soccer_fifa_moments', nextMoments);
  };

  const handleDeleteMoment = (id: number) => {
    const nextMoments = fifaMoments.filter(m => m.id !== id);
    setFifaMoments(nextMoments);
    saveToStorage('soccer_fifa_moments', nextMoments);
  };

  const [subscribers, setSubscribers] = useState<string[]>(() => {
    const raw = localStorage.getItem('soccer_subscribers');
    return raw ? JSON.parse(raw) : ['basheerbilal@gmail.com', 'supporter.fans@elysian.com'];
  });

  const handleSubscribe = (email: string) => {
    if (!subscribers.includes(email)) {
      const nextSubscribers = [...subscribers, email];
      setSubscribers(nextSubscribers);
      localStorage.setItem('soccer_subscribers', JSON.stringify(nextSubscribers));
    }
  };

  const handleDeleteSubscriber = (email: string) => {
    const nextSubscribers = subscribers.filter(s => s !== email);
    setSubscribers(nextSubscribers);
    localStorage.setItem('soccer_subscribers', JSON.stringify(nextSubscribers));
  };

  const [cart, setCart] = useState<CartItem[]>(() => {
    const raw = localStorage.getItem('soccer_cart');
    return raw ? JSON.parse(raw) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('soccer_user');
    return raw ? JSON.parse(raw) : null;
  });

  // UI state handles
  const [currentView, setCurrentView] = useState<string>('home');

  // Synchronizers
  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Auth handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    saveToStorage('soccer_user', user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('soccer_user');
    if (currentView === 'admin') {
      setCurrentView('home');
    }
  };

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    const nextCart = [...cart];
    const index = nextCart.findIndex(item => item.product_id === product.id);
    if (index > -1) {
      nextCart[index].quantity += 1;
    } else {
      nextCart.push({ product_id: product.id, product, quantity: 1 });
    }
    setCart(nextCart);
    saveToStorage('soccer_cart', nextCart);
  };

  const handleUpdateCartQty = (productId: number, qty: number) => {
    if (qty <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    const nextCart = cart.map(item => {
      if (item.product_id === productId) {
        return { ...item, quantity: qty };
      }
      return item;
    });
    setCart(nextCart);
    saveToStorage('soccer_cart', nextCart);
  };

  const handleRemoveCartItem = (productId: number) => {
    const nextCart = cart.filter(item => item.product_id !== productId);
    setCart(nextCart);
    saveToStorage('soccer_cart', nextCart);
  };

  const handleClearCart = () => {
    setCart([]);
    saveToStorage('soccer_cart', []);
  };

  const handlePlaceOrder = (name: string, email: string, address: string) => {
    const orderItems = cart.map((item, idx) => ({
      id: idx + 1,
      order_id: orders.length + 1001,
      product_id: item.product_id,
      product_name: item.product.name,
      quantity: item.quantity,
      price: item.product.price
    }));

    const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const newOrder: Order = {
      id: orders.length + 1001,
      user_id: currentUser ? currentUser.id : null,
      customer_name: name,
      customer_email: email,
      total_amount: totalAmount + (totalAmount > 100 ? 0 : 10) + (totalAmount * 0.08),
      status: 'pending',
      created_at: new Date().toISOString(),
      items: orderItems
    };

    const nextOrders = [newOrder, ...orders];
    setOrders(nextOrders);
    saveToStorage('soccer_orders', nextOrders);

    // Subtract product stock
    const nextProducts = products.map(prod => {
      const cartItem = cart.find(c => c.product_id === prod.id);
      if (cartItem) {
        return { ...prod, stock: Math.max(0, prod.stock - cartItem.quantity) };
      }
      return prod;
    });
    setProducts(nextProducts);
    saveToStorage('soccer_products', nextProducts);
  };

  // Feedback Submission
  const handleSubmitFeedback = (fb: Omit<Feedback, 'id' | 'created_at'>) => {
    const newFeedback: Feedback = {
      ...fb,
      id: feedbacks.length + 1,
      created_at: new Date().toISOString()
    };
    const nextFeedbacks = [newFeedback, ...feedbacks];
    setFeedbacks(nextFeedbacks);
    saveToStorage('soccer_feedbacks', nextFeedbacks);
  };

  // User Settings Handlers
  const handleUpdateProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    saveToStorage('soccer_user', updatedUser);
  };

  const handleDeleteProfile = () => {
    setCurrentUser(null);
    localStorage.removeItem('soccer_user');
    setCurrentView('home');
  };

  const handleCancelOrder = (orderId: number) => {
    const nextOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: 'cancelled' as any };
      }
      return order;
    });
    setOrders(nextOrders);
    saveToStorage('soccer_orders', nextOrders);

    const orderToCancel = orders.find(o => o.id === orderId);
    if (orderToCancel) {
      const nextProducts = products.map(prod => {
        const item = orderToCancel.items.find(i => i.product_id === prod.id);
        if (item) {
          return { ...prod, stock: prod.stock + item.quantity };
        }
        return prod;
      });
      setProducts(nextProducts);
      saveToStorage('soccer_products', nextProducts);
    }
  };

  const handleUpdateOrderStatus = (orderId: number, status: Order['status'] | 'cancelled') => {
    const nextOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: status as any };
      }
      return order;
    });
    setOrders(nextOrders);
    saveToStorage('soccer_orders', nextOrders);

    // If order was transitioned to cancelled, restore stock levels if it wasn't already cancelled
    if (status === 'cancelled') {
      const orderToCancel = orders.find(o => o.id === orderId);
      if (orderToCancel && orderToCancel.status !== 'cancelled') {
        const nextProducts = products.map(prod => {
          const item = orderToCancel.items.find(i => i.product_id === prod.id);
          if (item) {
            return { ...prod, stock: prod.stock + item.quantity };
          }
          return prod;
        });
        setProducts(nextProducts);
        saveToStorage('soccer_products', nextProducts);
      }
    }
  };

  const handleSyncMatches = (newMatches: Match[], newTeams: Team[]) => {
    setMatches(newMatches);
    setTeams(newTeams);
    saveToStorage('soccer_matches', newMatches);
    saveToStorage('soccer_teams', newTeams);
  };

  const handleResetMatches = () => {
    setMatches(initialMatches);
    setTeams(initialTeams);
    saveToStorage('soccer_matches', initialMatches);
    saveToStorage('soccer_teams', initialTeams);
    localStorage.removeItem('soccer_match_predictions');
  };

  // Admin Matches Crud
  const handleAddMatch = (match: Omit<Match, 'id'>) => {
    const newMatch: Match = {
      ...match,
      id: matches.length > 0 ? Math.max(...matches.map(m => m.id)) + 1 : 1
    };
    const nextMatches = [newMatch, ...matches];
    setMatches(nextMatches);
    saveToStorage('soccer_matches', nextMatches);
  };

  const handleUpdateMatchScore = (id: number, homeScore: number, awayScore: number, status: Match['status']) => {
    const nextMatches = matches.map(m => {
      if (m.id === id) {
        return { ...m, home_team_score: homeScore, away_team_score: awayScore, status };
      }
      return m;
    });
    setMatches(nextMatches);
    saveToStorage('soccer_matches', nextMatches);
  };

  const handleDeleteMatch = (id: number) => {
    const nextMatches = matches.filter(m => m.id !== id);
    setMatches(nextMatches);
    saveToStorage('soccer_matches', nextMatches);
  };

  // Admin Players Crud
  const handleAddPlayer = (p: Omit<Player, 'id'>) => {
    const newPlayer: Player = {
      ...p,
      id: players.length > 0 ? Math.max(...players.map(pl => pl.id)) + 1 : 1
    };
    const nextPlayers = [newPlayer, ...players];
    setPlayers(nextPlayers);
    saveToStorage('soccer_players', nextPlayers);
  };

  const handleDeletePlayer = (id: number) => {
    const nextPlayers = players.filter(p => p.id !== id);
    setPlayers(nextPlayers);
    saveToStorage('soccer_players', nextPlayers);
  };

  // Admin Stock modifier
  const handleUpdateStock = (productId: number, stock: number) => {
    const nextProducts = products.map(p => {
      if (p.id === productId) {
        return { ...p, stock: Math.max(0, stock) };
      }
      return p;
    });
    setProducts(nextProducts);
    saveToStorage('soccer_products', nextProducts);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    const nextProducts = products.map(p => p.id === updatedProd.id ? updatedProd : p);
    setProducts(nextProducts);
    saveToStorage('soccer_products', nextProducts);
  };

  const handleDeleteProduct = (productId: number) => {
    const nextProducts = products.filter(p => p.id !== productId);
    setProducts(nextProducts);
    saveToStorage('soccer_products', nextProducts);
  };

  const handleAddProduct = (p: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...p,
      id: products.length > 0 ? Math.max(...products.map(pr => pr.id)) + 1 : 1
    };
    const nextProducts = [newProduct, ...products];
    setProducts(nextProducts);
    saveToStorage('soccer_products', nextProducts);
  };

  return (
    <div className="min-h-screen bg-gradient-sport cyber-grid text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950" id="app-root">
      {/* 1. Header Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        cart={cart}
        currentView={currentView}
        onNavigate={setCurrentView}
      />

      {/* 2. Main Page Layout Grid */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28 md:pb-8 space-y-8" id="app-main-content">
        
        {/* Primary Screen rendering depending on currentView */}
        <div id="active-view-frame" className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {currentView === 'home' && (
                <HomeView
                  matches={matches}
                  products={products}
                  teams={teams}
                  fifaMoments={fifaMoments}
                  currentUser={currentUser}
                  onNavigate={setCurrentView}
                  onSubmitFeedback={handleSubmitFeedback}
                  onSubscribe={handleSubscribe}
                />
              )}

              {currentView === 'matches' && (
                <MatchesView
                  matches={matches}
                  teams={teams}
                  players={players}
                  currentUser={currentUser}
                  onNavigate={setCurrentView}
                  onSyncMatches={handleSyncMatches}
                  onResetMatches={handleResetMatches}
                />
              )}

              {currentView === 'players' && (
                <PlayersView
                  players={players}
                  teams={teams}
                  currentUser={currentUser}
                  onNavigate={setCurrentView}
                />
              )}

              {currentView === 'shop' && (
                <ShopView
                  products={products}
                  onAddToCart={handleAddToCart}
                  currentUser={currentUser}
                  onNavigate={setCurrentView}
                />
              )}

              {currentView === 'cart' && (
                <CartView
                  cart={cart}
                  onUpdateQty={handleUpdateCartQty}
                  onRemoveItem={handleRemoveCartItem}
                  onClearCart={handleClearCart}
                  onPlaceOrder={handlePlaceOrder}
                  currentUser={currentUser}
                  onNavigate={setCurrentView}
                />
              )}

              {currentView === 'login' && (
                <AuthView
                  onLogin={handleLogin}
                  onNavigate={setCurrentView}
                  initialMode="login"
                />
              )}

              {currentView === 'register' && (
                <AuthView
                  onLogin={handleLogin}
                  onNavigate={setCurrentView}
                  initialMode="register"
                />
              )}

              {currentView === 'admin' && (
                <AdminDashboard
                  matches={matches}
                  players={players}
                  products={products}
                  orders={orders}
                  feedbacks={feedbacks}
                  teams={teams}
                  fifaMoments={fifaMoments}
                  subscribers={subscribers}
                  onDeleteSubscriber={handleDeleteSubscriber}
                  onAddMatch={handleAddMatch}
                  onUpdateMatchScore={handleUpdateMatchScore}
                  onDeleteMatch={handleDeleteMatch}
                  onAddPlayer={handleAddPlayer}
                  onDeletePlayer={handleDeletePlayer}
                  onUpdateStock={handleUpdateStock}
                  onAddProduct={handleAddProduct}
                  onDeleteProduct={handleDeleteProduct}
                  onUpdateProduct={handleUpdateProduct}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onAddMoment={handleAddMoment}
                  onUpdateMoment={handleUpdateMoment}
                  onDeleteMoment={handleDeleteMoment}
                />
              )}

              {currentView === 'info' && (
                <SoccerInfoView />
              )}

              {currentView === 'stats' && (
                <StatisticsView
                  players={players}
                  teams={teams}
                  matches={matches}
                  onNavigate={setCurrentView}
                />
              )}

              {currentView === 'news' && (
                <NewsView />
              )}

              {currentView === 'contact' && (
                <ContactUsView
                  onSubmitFeedback={handleSubmitFeedback}
                />
              )}

              {currentView === 'settings' && currentUser && (
                <SettingsView
                  currentUser={currentUser}
                  orders={orders}
                  onUpdateProfile={handleUpdateProfile}
                  onDeleteProfile={handleDeleteProfile}
                  onCancelOrder={handleCancelOrder}
                  onNavigate={setCurrentView}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* 3. Global Footer */}
      <footer className="relative bg-slate-950 border-t border-slate-900 py-16 mt-16 overflow-hidden" id="app-footer">
        {/* Soft Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 border-b border-slate-900 pb-12">
            
            {/* Column 1: Brand */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
                <span className="font-black text-white tracking-wider text-lg">ELYSIAN FC</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                Official supporters portal for Elysian FC. Built on top of clean REST architecture, MySQL relational constraints, and React component state.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-[10px] font-bold font-mono tracking-widest text-slate-400 uppercase">Club Quick Links</h4>
              <ul className="grid grid-cols-1 gap-2 text-xs text-slate-400">
                <li>
                  <button onClick={() => setCurrentView('matches')} className="hover:text-emerald-400 transition text-left cursor-pointer flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-emerald-400 transition-all"></span>
                    Fixtures & Schedules
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('players')} className="hover:text-emerald-400 transition text-left cursor-pointer flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-emerald-400 transition-all"></span>
                    First Team Squad
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('shop')} className="hover:text-emerald-400 transition text-left cursor-pointer flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-emerald-400 transition-all"></span>
                    Official Fan Shop
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('stats')} className="hover:text-emerald-400 transition text-left cursor-pointer flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-emerald-400 transition-all"></span>
                    Statistical Hub
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('info')} className="hover:text-emerald-400 transition text-left cursor-pointer flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-emerald-400 transition-all"></span>
                    Soccer Laws
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Dev Environment */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-[10px] font-bold font-mono tracking-widest text-slate-400 uppercase">Environment</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Toggle the <strong className="text-emerald-400">Code Workspace</strong> button in the header at any time to inspect project sources, schema definitions, and secure APIs.
              </p>
            </div>

            {/* Column 4: Gatekeeper */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-[10px] font-bold font-mono tracking-widest text-slate-400 uppercase">Admin Gatekeeper</h4>
              <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-850 text-[11px] text-slate-400 space-y-1.5 shadow-inner">
                <span className="text-amber-500 font-mono font-bold text-[9px] uppercase tracking-wider block">Testing Credentials</span>
                <div className="space-y-1 font-mono text-[10px]">
                  <div>User: <strong className="text-slate-200">admin@elysian.com</strong></div>
                  <div>Role: <strong className="text-amber-400/90">administrator</strong></div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Footer Section */}
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <p>© 2026 Elysian FC Soccer Club. All rights reserved.</p>
            <div className="flex items-center gap-2 font-medium">
              <span>Crafted with</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>for Soccer Club Fans</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
