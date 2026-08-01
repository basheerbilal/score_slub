/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingCart, LogIn, LogOut, ShieldAlert, Calendar, Users, ShoppingBag, Home, BarChart2, BookOpen, Newspaper, Mail, Settings } from 'lucide-react';
import { User, CartItem } from '../types';

interface NavbarProps {
  currentUser: User | null;
  onLogout: () => void;
  cart: CartItem[];
  currentView: string;
  onNavigate: (view: string) => void;
}

export default function Navbar({
  currentUser,
  onLogout,
  cart,
  currentView,
  onNavigate
}: NavbarProps) {
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'matches', label: 'Matches', icon: Calendar },
    { id: 'players', label: 'Squad', icon: Users },
    { id: 'stats', label: 'Stats', icon: BarChart2 },
    { id: 'info', label: 'Laws', icon: BookOpen },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'shop', label: 'Store', icon: ShoppingBag },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111008 50%, #0d0d0d 100%)' }}
      id="app-header"
    >
      {/* Gold shimmer top border */}
      <div
        className="h-[2px] w-full"
        style={{ background: 'linear-gradient(90deg, transparent, #b8860b, #ffd700, #daa520, #ffd700, #b8860b, transparent)' }}
      />

      {/* Scrolling ticker bar */}
      <div
        className="overflow-hidden py-1.5 relative"
        style={{ background: 'linear-gradient(90deg, #001f24, #00363d, #001f24)' }}
        id="top-ticker-bar"
      >
        <div className="flex items-center animate-[marquee_30s_linear_infinite] whitespace-nowrap gap-0">
          {[
            { icon: '⚽', text: 'FIFA World Cup 2026™ — Live Matches & Real-Time Scores' },
            { icon: '🏆', text: 'Soccer FC — Your Official Club Hub' },
            { icon: '🛒', text: 'Members get 10% OFF in the Store — Shop Now' },
            { icon: '📅', text: 'Next Match: England vs Argentina — Jul 18, 2026' },
            { icon: '🌟', text: 'Squad Updates Available — Check the Squad Page' },
            { icon: '🔴', text: 'Live Scores Auto-Refresh Every 30 Seconds' },
          ].concat([
            { icon: '⚽', text: 'FIFA World Cup 2026™ — Live Matches & Real-Time Scores' },
            { icon: '🏆', text: 'Soccer FC — Your Official Club Hub' },
            { icon: '🛒', text: 'Members get 10% OFF in the Store — Shop Now' },
            { icon: '📅', text: 'Next Match: England vs Argentina — Jul 18, 2026' },
            { icon: '🌟', text: 'Squad Updates Available — Check the Squad Page' },
            { icon: '🔴', text: 'Live Scores Auto-Refresh Every 30 Seconds' },
          ]).map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 font-semibold text-[10px] sm:text-xs mx-8"
              style={{ color: '#00f0ff' }}>
              <span>{item.icon}</span>
              <span>{item.text}</span>
              <span className="mx-4" style={{ color: '#009fab' }}>◆</span>
            </span>
          ))}
        </div>
        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-16 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to right, #001f24, transparent)' }} />
        <div className="absolute inset-y-0 right-0 w-16 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to left, #001f24, transparent)' }} />
      </div>

      {/* Gold divider line replaced with cyan/pink gamer line */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.25), rgba(255,0,127,0.4), rgba(0,240,255,0.25), transparent)' }} />

      {/* Main navbar */}
      <div
        className="backdrop-blur-md"
        style={{ background: 'linear-gradient(180deg, rgba(6,7,12,0.97) 0%, rgba(13,15,23,0.95) 100%)', borderBottom: '1px solid rgba(0,240,255,0.15)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo Brand */}
            <div
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
              onClick={() => onNavigate('home')}
              id="navbar-brand"
            >
              <div className="relative">
                {/* Glow ring behind logo */}
                <div
                  className="absolute inset-0 rounded-full blur-md opacity-60 group-hover:opacity-90 transition-opacity duration-300"
                  style={{ background: 'radial-gradient(circle, #00f0ff, #ff007f, transparent)' }}
                />
                <img
                  src="/logonav.png"
                  alt="Soccer Club Hub Logo"
                  className="relative w-11 h-11 sm:w-13 sm:h-13 object-contain flex-shrink-0 drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.6))' }}
                />
              </div>
              <div className="leading-none">
                <span
                  className="font-black text-base sm:text-lg tracking-wider block"
                  style={{
                    background: 'linear-gradient(135deg, #00f0ff, #ffffff, #ff007f)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 8px rgba(0,240,255,0.3)',
                    letterSpacing: '0.08em'
                  }}
                >
                  SOCCER
                </span>
                <span
                  className="text-[9px] tracking-[0.3em] uppercase hidden sm:block font-bold"
                  style={{ color: '#ff007f' }}
                >
                  Club Hub
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-0.5" id="navbar-menu">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className="flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200 relative group"
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(0,240,255,0.12), rgba(255,0,127,0.05))'
                        : 'transparent',
                      color: isActive ? '#00f0ff' : '#7a87bd',
                      border: isActive ? '1px solid rgba(0,240,255,0.3)' : '1px solid transparent',
                    }}
                    id={`nav-link-${item.id}`}
                  >
                    {/* Hover glow */}
                    {!isActive && (
                      <span
                        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.05), transparent)' }}
                      />
                    )}
                    {/* Active bottom bar */}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[2px] rounded-full"
                        style={{ background: 'linear-gradient(90deg, transparent, #00f0ff, transparent)' }}
                      />
                    )}
                    <Icon
                      className="w-3.5 h-3.5 lg:w-4 lg:h-4 relative z-10 transition-colors duration-200"
                      style={{ color: isActive ? '#00f0ff' : '#4a5480' }}
                    />
                    <span className="hidden md:inline relative z-10 group-hover:text-cyan-300 transition-colors duration-200">
                      {item.label}
                    </span>
                  </button>
                );
              })}

              {/* Admin Link */}
              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => onNavigate('admin')}
                  className="flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all duration-200 relative"
                  style={{
                    background: currentView === 'admin'
                      ? 'linear-gradient(135deg, #3a0000, #200000)'
                      : 'transparent',
                    color: currentView === 'admin' ? '#ff6b6b' : '#cc4444',
                    border: currentView === 'admin' ? '1px solid #cc444450' : '1px solid transparent',
                  }}
                  id="nav-link-admin"
                >
                  <ShieldAlert className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  <span className="hidden md:inline">Admin Panel</span>
                </button>
              )}
            </nav>

            {/* Right Action Items */}
            <div className="flex items-center gap-2 sm:gap-2.5">

              {/* Cart Button */}
              <button
                onClick={() => onNavigate('cart')}
                className="relative p-2 sm:p-2.5 rounded-xl transition-all duration-200"
                style={{
                  background: currentView === 'cart'
                    ? 'linear-gradient(135deg, rgba(0,240,255,0.12), rgba(255,0,127,0.05))'
                    : 'rgba(0,240,255,0.05)',
                  border: currentView === 'cart'
                    ? '1px solid rgba(0,240,255,0.5)'
                    : '1px solid rgba(0,240,255,0.15)',
                  color: currentView === 'cart' ? '#00f0ff' : '#7a87bd',
                }}
                id="nav-cart-btn"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 font-black text-[9px] w-5 h-5 rounded-full flex items-center justify-center border-2 animate-bounce"
                    style={{
                      background: 'linear-gradient(135deg, #00f0ff, #ff007f)',
                      color: '#030306',
                      borderColor: '#030306',
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Settings Button */}
              {currentUser && (
                <button
                  onClick={() => onNavigate('settings')}
                  className="p-2 sm:p-2.5 rounded-xl transition-all duration-200"
                  style={{
                    background: currentView === 'settings'
                      ? 'linear-gradient(135deg, rgba(0,240,255,0.12), rgba(255,0,127,0.05))'
                      : 'rgba(0,240,255,0.05)',
                    border: currentView === 'settings'
                      ? '1px solid rgba(0,240,255,0.5)'
                      : '1px solid rgba(0,240,255,0.15)',
                    color: currentView === 'settings' ? '#00f0ff' : '#7a87bd',
                  }}
                  id="nav-settings-btn"
                  title="Account Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
              )}

              {/* Auth Buttons */}
              {currentUser ? (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 text-xs px-3.5 py-2.5 rounded-xl font-semibold transition-all duration-200 cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #2a0000, #1a0000)',
                    color: '#ff6b6b',
                    border: '1px solid #cc444430',
                  }}
                  id="nav-logout-btn"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('login')}
                  className="flex items-center gap-1.5 text-xs px-4 py-2.5 rounded-xl font-bold transition-all duration-300 cursor-pointer"
                  style={{
                    background: currentView === 'login' || currentView === 'register'
                      ? 'linear-gradient(135deg, #00f0ff, #ff007f)'
                      : 'linear-gradient(135deg, rgba(0,240,255,0.08), rgba(255,0,127,0.04))',
                    color: currentView === 'login' || currentView === 'register'
                      ? '#030306'
                      : '#00f0ff',
                    border: '1px solid rgba(0,240,255,0.4)',
                    boxShadow: '0 0 12px rgba(0,240,255,0.2)',
                  }}
                  id="nav-login-btn"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gold shimmer bottom border replaced with cyber line */}
      <div
        className="h-[1px] w-full"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.2), rgba(255,0,127,0.3), rgba(0,240,255,0.2), transparent)' }}
      />

      {/* Mobile Bottom Navigation */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-lg px-2 py-2 z-50 flex items-center justify-start overflow-x-auto scrollbar-none select-none"
        style={{
          background: 'linear-gradient(180deg, rgba(6,7,12,0.97) 0%, rgba(3,3,6,0.99) 100%)',
          borderTop: '1px solid rgba(0,240,255,0.2)',
          boxShadow: '0 -8px 30px rgba(0,0,0,0.8), 0 -1px 0 rgba(0,240,255,0.1)',
        }}
      >
        <div className="flex items-center gap-1 w-max px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 min-h-[44px] rounded-xl transition-all duration-200 cursor-pointer flex-shrink-0"
                style={{
                  background: isActive ? 'linear-gradient(135deg, rgba(0,240,255,0.1), rgba(255,0,127,0.05))' : 'transparent',
                  border: isActive ? '1px solid rgba(0,240,255,0.3)' : '1px solid transparent',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <Icon
                  className="w-4.5 h-4.5 transition-all duration-200"
                  style={{ color: isActive ? '#00f0ff' : '#4a5480' }}
                />
                <span
                  className="text-[9px] font-mono tracking-tight font-bold"
                  style={{ color: isActive ? '#00f0ff' : '#4a5480' }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className="flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 min-h-[44px] rounded-xl transition-all duration-200 cursor-pointer flex-shrink-0"
              style={{
                background: currentView === 'admin' ? 'linear-gradient(135deg, #2a0000, #1a0000)' : 'transparent',
                border: currentView === 'admin' ? '1px solid #cc444440' : '1px solid transparent',
              }}
            >
              <ShieldAlert
                className="w-4.5 h-4.5"
                style={{ color: currentView === 'admin' ? '#ff6b6b' : '#7a3a3a' }}
              />
              <span
                className="text-[9px] font-mono tracking-tight"
                style={{ color: currentView === 'admin' ? '#ff6b6b' : '#7a3a3a' }}
              >
                Admin
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
