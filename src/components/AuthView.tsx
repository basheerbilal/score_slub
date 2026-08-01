/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, ShieldAlert, Key, UserCheck, AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthViewProps {
  onLogin: (user: UserType) => void;
  onNavigate: (view: string) => void;
  initialMode?: 'login' | 'register';
}

export default function AuthView({ onLogin, onNavigate, initialMode = 'login' }: AuthViewProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (mode === 'login') {
      if (!email || !password) {
        setErrorMsg('Please enter both your email and password.');
        return;
      }

      // Check pre-defined mock accounts
      if (email === 'admin@elysian.com') {
        onLogin({
          id: 1,
          username: 'Arthur Admin',
          name: 'Arthur Admin',
          email: 'admin@elysian.com',
          role: 'admin',
          created_at: new Date().toISOString(),
          contact_number: '+44 7911 123456',
          addresses: ['10 Elysian Lane, London']
        });
        onNavigate('admin');
      } else if (email === 'customer@elysian.com' || email.includes('@')) {
        onLogin({
          id: 2,
          username: username || email.split('@')[0],
          name: name || 'John Supporter',
          email: email,
          role: 'customer',
          created_at: new Date().toISOString(),
          contact_number: contactNumber || '+44 7911 987654',
          addresses: ['45 Stadium Road, Manchester']
        });
        onNavigate('shop');
      } else {
        setErrorMsg('Invalid login credentials. Use one of our quick-test accounts below!');
      }
    } else {
      if (!name || !username || !email || !password || !contactNumber) {
        setErrorMsg('Please fill in all registration inputs.');
        return;
      }

      // Client-side validations
      if (!email.includes('@') || !email.includes('.')) {
        setErrorMsg('Please enter a valid email address (must contain @ and .).');
        return;
      }

      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }

      const phoneRegex = /^\+?[0-9\s\-]{7,15}$/;
      if (!phoneRegex.test(contactNumber.replace(/\s+/g, ''))) {
        setErrorMsg('Please enter a valid numeric contact number (7-15 digits).');
        return;
      }

      onLogin({
        id: Math.floor(Math.random() * 1000) + 10,
        username,
        name,
        email,
        role: 'customer',
        created_at: new Date().toISOString(),
        contact_number: contactNumber,
        addresses: []
      });
      onNavigate('shop');
    }
  };

  const handleQuickLogin = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      onLogin({
        id: 1,
        username: 'Arthur Admin',
        email: 'admin@elysian.com',
        role: 'admin',
        created_at: new Date().toISOString()
      });
      onNavigate('admin');
    } else {
      onLogin({
        id: 2,
        username: 'John Supporter',
        email: 'customer@elysian.com',
        role: 'customer',
        created_at: new Date().toISOString()
      });
      onNavigate('shop');
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 py-6 sm:py-12 animate-fade-in" id="auth-view-container">
      {/* Visual Header card */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_40%)]"></div>
        <div className="text-center space-y-2 relative z-10">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
            <Key className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {mode === 'login' ? 'Elysian Club Login' : 'Register Fan Account'}
          </h1>
          <p className="text-slate-400 text-xs">
            {mode === 'login' ? 'Sign in to access your cart history and orders.' : 'Sign up to purchase tickets and exclusive products.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4 relative z-10">
          {mode === 'register' && (
            <>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Username</label>
                <input
                  type="text"
                  placeholder="e.g. janesmith"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Contact Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +44 7911 123456"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white"
                  required
                />
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              placeholder="e.g. customer@elysian.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white"
              required
            />
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl flex items-center gap-2 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 sm:py-2.5 rounded-xl text-xs transition duration-200 min-h-[44px] flex items-center justify-center"
            id="auth-submit-btn"
          >
            {mode === 'login' ? 'Authenticate Account' : 'Register Fan Profile'}
          </button>
        </form>

        {/* Toggle link */}
        <div className="text-center text-xs text-slate-400 relative z-10">
          {mode === 'login' ? (
            <span>
              Don't have a fan account?{' '}
              <button onClick={() => setMode('register')} className="text-emerald-400 hover:underline font-semibold px-2.5 py-1.5 -mx-2.5 -my-1.5 inline-block cursor-pointer">
                Create Profile
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button onClick={() => setMode('login')} className="text-emerald-400 hover:underline font-semibold px-2.5 py-1.5 -mx-2.5 -my-1.5 inline-block cursor-pointer">
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Quick Test Accounts Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold font-mono text-amber-500 uppercase tracking-widest flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          Quick Test Environment Credentials
        </h3>
        <p className="text-slate-400 text-xs">
          Select one of the prepared accounts below to bypass manual entry and test specific application roles:
        </p>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => handleQuickLogin('admin')}
            className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 px-4 py-3 rounded-xl text-xs transition text-left flex flex-col justify-between h-20"
            id="quick-login-admin"
          >
            <span className="font-bold">🔑 Administrator Account</span>
            <span className="text-[10px] font-mono text-slate-400 truncate">admin@elysian.com</span>
          </button>

          <button
            onClick={() => handleQuickLogin('customer')}
            className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-xs transition text-left flex flex-col justify-between h-20"
            id="quick-login-customer"
          >
            <span className="font-bold">👤 Customer Supporter</span>
            <span className="text-[10px] font-mono text-slate-400 truncate">customer@elysian.com</span>
          </button>
        </div>
      </div>
    </div>
  );
}
