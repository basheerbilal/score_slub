/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Order, OrderItem } from '../types';
import { Settings, UserX, MapPin, Phone, ShieldCheck, Mail, ShieldAlert, Key, Trash, Plus, FileText, Bell, Check, Truck, Clock, Package } from 'lucide-react';

interface SettingsViewProps {
  currentUser: User | null;
  orders: Order[];
  onUpdateProfile: (updated: User) => void;
  onDeleteProfile: () => void;
  onCancelOrder: (orderId: number) => void;
  onNavigate: (view: string) => void;
}

export default function SettingsView({
  currentUser,
  orders,
  onUpdateProfile,
  onDeleteProfile,
  onCancelOrder,
  onNavigate
}: SettingsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'addresses' | 'orders' | 'notifications'>('profile');

  // Profile Form States
  const [name, setName] = useState(currentUser?.name || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [contactNumber, setContactNumber] = useState(currentUser?.contact_number || '');
  const [subscribedToUpdates, setSubscribedToUpdates] = useState(currentUser?.subscribed_to_updates || false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Address states
  const [newAddress, setNewAddress] = useState('');
  const [addresses, setAddresses] = useState<string[]>(currentUser?.addresses || []);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!name || !username || !email || !contactNumber) {
      setErrorMsg('All fields must be filled out.');
      return;
    }

    if (!currentUser) return;

    const updatedUser: User = {
      ...currentUser,
      name,
      username,
      email,
      contact_number: contactNumber,
      addresses,
      subscribed_to_updates: subscribedToUpdates
    };

    onUpdateProfile(updatedUser);
    setSuccessMsg('Your fan profile has been updated successfully!');
  };

  const handleAddAddress = () => {
    if (!newAddress.trim()) return;
    const nextAddresses = [...addresses, newAddress.trim()];
    setAddresses(nextAddresses);
    setNewAddress('');

    if (currentUser) {
      onUpdateProfile({
        ...currentUser,
        addresses: nextAddresses
      });
    }
  };

  const handleRemoveAddress = (index: number) => {
    const nextAddresses = addresses.filter((_, idx) => idx !== index);
    setAddresses(nextAddresses);

    if (currentUser) {
      onUpdateProfile({
        ...currentUser,
        addresses: nextAddresses
      });
    }
  };

  const handleDeleteProfileClick = () => {
    if (window.confirm('Are you absolutely sure you want to delete your fan profile? This action is permanent.')) {
      onDeleteProfile();
    }
  };

  // User-specific orders
  const userOrders = orders.filter(o => o.user_id === currentUser?.id);

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Sign In Required</h2>
        <p className="text-slate-400 text-sm">Please log in with a fan or administrator account to manage settings.</p>
        <button
          onClick={() => onNavigate('login')}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2 rounded-xl text-xs transition cursor-pointer"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" id="settings-view-container">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <span className="text-[10px] font-mono font-black uppercase tracking-widest text-emerald-400">FAN SETTINGS</span>
        <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
          <Settings className="text-emerald-500 w-8 h-8" />
          Settings & Account
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
          Manage your personal details, secure contact methods, saved delivery addresses, and cancel active merchandise orders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Sub-tabs menu */}
        <div className="md:col-span-3 bg-slate-950 rounded-2xl p-4 border border-slate-800/80 space-y-1">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`w-full text-left px-4 py-3 sm:py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2.5 cursor-pointer min-h-[44px] sm:min-h-0 ${
              activeSubTab === 'profile'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Update Profile
          </button>

          <button
            onClick={() => setActiveSubTab('addresses')}
            className={`w-full text-left px-4 py-3 sm:py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2.5 cursor-pointer min-h-[44px] sm:min-h-0 ${
              activeSubTab === 'addresses'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Manage Addresses
          </button>

          <button
            onClick={() => setActiveSubTab('orders')}
            className={`w-full text-left px-4 py-3 sm:py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2.5 cursor-pointer min-h-[44px] sm:min-h-0 ${
              activeSubTab === 'orders'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <FileText className="w-4 h-4" />
            Order History & Cancel
          </button>

          <button
            onClick={() => setActiveSubTab('notifications')}
            className={`w-full text-left px-4 py-3 sm:py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2.5 cursor-pointer min-h-[44px] sm:min-h-0 ${
              activeSubTab === 'notifications'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
            id="tab-match-notifications"
          >
            <Bell className="w-4 h-4" />
            Match Notifications
          </button>

          <div className="pt-4 border-t border-slate-900">
            <button
              onClick={handleDeleteProfileClick}
              className="w-full text-left px-4 py-3 sm:py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition flex items-center gap-2.5 cursor-pointer min-h-[44px] sm:min-h-0"
            >
              <UserX className="w-4 h-4" />
              Delete Profile
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-9 bg-slate-950 border border-slate-800/80 rounded-3xl p-6 sm:p-8">
          
          {/* PROFILE SUB-TAB */}
          {activeSubTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Update Profile Details</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Correct your name, contact phone number, and account username constraints.
                </p>
              </div>

              {successMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-emerald-400 text-xs">
                  {successMsg}
                </div>
              )}

              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-xs">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 hover:border-slate-750 focus:border-emerald-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-wider">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 hover:border-slate-750 focus:border-emerald-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 hover:border-slate-750 focus:border-emerald-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-wider">Contact Number</label>
                    <input
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 hover:border-slate-750 focus:border-emerald-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 sm:py-2.5 rounded-xl text-xs transition cursor-pointer min-h-[44px] sm:min-h-0 flex items-center justify-center"
                  >
                    Save Modifications
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ADDRESSES SUB-TAB */}
          {activeSubTab === 'addresses' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Saved Delivery Addresses</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Add or delete saved delivery addresses for rapid fan merchandise checkouts.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 12 Stadium Lane, London"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="flex-grow bg-slate-900 border border-slate-850 hover:border-slate-750 focus:border-emerald-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddAddress()}
                />
                <button
                  onClick={handleAddAddress}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 sm:px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] sm:min-h-0"
                >
                  <Plus className="w-4 h-4" /> Add Address
                </button>
              </div>

              <div className="space-y-2 pt-2">
                {addresses.length === 0 ? (
                  <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-6 text-center text-slate-500 text-xs">
                    No addresses added yet. Add your address for checkout convenience!
                  </div>
                ) : (
                  addresses.map((addr, index) => (
                    <div key={index} className="bg-slate-900/60 border border-slate-850 p-4 rounded-xl flex items-center justify-between gap-4">
                      <div className="flex items-start gap-2.5 text-xs text-slate-300">
                        <MapPin className="w-4 h-4 text-emerald-400 mt-0.5" />
                        <span>{addr}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveAddress(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2.5 sm:p-1.5 rounded-lg transition min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ORDERS HISTORY & CANCELLATION */}
          {activeSubTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Your Orders & Active Shipments</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Track fan store receipts or trigger a **Cancel Order** request if they are still pending shipment.
                </p>
              </div>

              <div className="space-y-4">
                {userOrders.length === 0 ? (
                  <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-12 text-center text-slate-400 text-xs">
                    You have not placed any store orders yet.
                  </div>
                ) : (
                  userOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-slate-900/60 border border-slate-850 p-5 rounded-2xl space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <span className="text-[10px] font-mono text-slate-500">ORDER ID: #{order.id}</span>
                          <span className="text-slate-300 text-xs font-bold block">Total Amount: ${order.total_amount.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold uppercase tracking-wide px-2 py-0.5 rounded ${
                            order.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {order.status}
                          </span>

                          {order.status === 'pending' && (
                            <button
                              onClick={() => {
                                if (window.confirm('Cancel this pending order? This will restore merchandise stock levels.')) {
                                  onCancelOrder(order.id);
                                }
                              }}
                              className="text-[10px] font-bold font-mono tracking-wide bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 px-4 py-2.5 sm:px-2.5 sm:py-1 rounded transition cursor-pointer min-h-[44px] sm:min-h-0 flex items-center justify-center"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-xs text-slate-400">
                            <span>{item.product_name} <strong className="text-slate-500">x{item.quantity}</strong></span>
                            <span className="font-mono text-slate-300">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Visual Step-Progress Tracker for Order Status */}
                      <div className="bg-slate-950/50 border border-slate-800/60 rounded-2xl p-4 sm:p-5 my-4 space-y-4">
                        <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-wider text-slate-400">
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Shipment Tracking
                          </span>
                          <span className="text-emerald-400 font-bold">Real-time Delivery Pipeline</span>
                        </div>

                        <div className="relative flex items-center justify-between mt-2 px-1">
                          {/* Connector Line (Backdrop) */}
                          <div className="absolute left-[20px] right-[20px] top-[18px] h-0.5 bg-slate-800 -z-10" />
                          {/* Active Connector Line */}
                          <div 
                            className="absolute left-[20px] top-[18px] h-0.5 bg-emerald-500 transition-all duration-500 -z-10"
                            style={{
                              width: order.status === 'pending' 
                                ? '0%' 
                                : order.status === 'shipped' 
                                ? '50%' 
                                : order.status === 'completed' 
                                ? '100%' 
                                : '0%'
                            }}
                          />

                          {/* Step 1: Pending */}
                          <div className="flex flex-col items-center flex-1">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-slate-950 ${
                              order.status === 'cancelled'
                                ? 'border-slate-800 text-slate-600'
                                : order.status === 'pending'
                                ? 'border-amber-500 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                                : 'border-emerald-500 bg-emerald-500 text-slate-950'
                            }`}>
                              {order.status === 'pending' ? (
                                <Clock className="w-4 h-4 animate-pulse" />
                              ) : order.status === 'cancelled' ? (
                                <Clock className="w-4 h-4" />
                              ) : (
                                <Check className="w-4 h-4 stroke-[3px]" />
                              )}
                            </div>
                            <span className={`text-[10px] sm:text-xs font-bold mt-2 transition-colors ${
                              order.status === 'cancelled'
                                ? 'text-slate-600 line-through'
                                : order.status === 'pending'
                                ? 'text-amber-400 font-extrabold'
                                : 'text-emerald-400'
                            }`}>
                              Pending
                            </span>
                            <span className="text-[9px] text-slate-500 hidden sm:block">Awaiting Dispatch</span>
                          </div>

                          {/* Step 2: Shipped */}
                          <div className="flex flex-col items-center flex-1">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-slate-950 ${
                              order.status === 'cancelled'
                                ? 'border-slate-800 text-slate-600'
                                : order.status === 'pending'
                                ? 'border-slate-800 text-slate-600'
                                : order.status === 'shipped'
                                ? 'border-emerald-400 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                                : 'border-emerald-500 bg-emerald-500 text-slate-950'
                            }`}>
                              {order.status === 'completed' ? (
                                <Check className="w-4 h-4 stroke-[3px]" />
                              ) : (
                                <Truck className="w-4 h-4" />
                              )}
                            </div>
                            <span className={`text-[10px] sm:text-xs font-bold mt-2 transition-colors ${
                              order.status === 'cancelled' || order.status === 'pending'
                                ? 'text-slate-600'
                                : order.status === 'shipped'
                                ? 'text-emerald-400 font-extrabold'
                                : 'text-emerald-400'
                            }`}>
                              Shipped
                            </span>
                            <span className="text-[9px] text-slate-500 hidden sm:block">In Transit</span>
                          </div>

                          {/* Step 3: Delivered */}
                          <div className="flex flex-col items-center flex-1">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-slate-950 ${
                              order.status === 'completed'
                                ? 'border-emerald-500 bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                                : 'border-slate-800 text-slate-600'
                            }`}>
                              <Package className="w-4 h-4" />
                            </div>
                            <span className={`text-[10px] sm:text-xs font-bold mt-2 transition-colors ${
                              order.status === 'completed'
                                ? 'text-emerald-400 font-extrabold animate-pulse'
                                : 'text-slate-600'
                            }`}>
                              Delivered
                            </span>
                            <span className="text-[9px] text-slate-500 hidden sm:block">Arrived Safely</span>
                          </div>
                        </div>

                        {order.status === 'cancelled' && (
                          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2 mt-2">
                            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                            <span>This order has been cancelled and refunded. Merchandise stock levels were restored.</span>
                          </div>
                        )}
                      </div>

                      <p className="text-[10px] text-slate-500 font-mono text-right">
                        Ordered On: {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* NOTIFICATIONS SUB-TAB */}
          {activeSubTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Live Match Alerts Hub</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Configure real-time score updates, team line-up notices, and final result notifications.
                </p>
              </div>

              {/* Status Banner */}
              <div className={`p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${
                subscribedToUpdates 
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                  : 'bg-slate-900/40 border-slate-800 text-slate-400'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${subscribedToUpdates ? 'bg-emerald-500/10' : 'bg-slate-950'}`}>
                    <Bell className={`w-5 h-5 ${subscribedToUpdates ? 'text-emerald-400 animate-bounce' : 'text-slate-500'}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {subscribedToUpdates ? 'Active Alerts Enabled' : 'Live Notifications Disabled'}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {subscribedToUpdates 
                        ? 'You will receive on-screen alerts and a home dashboard notification badge during live matches.' 
                        : 'Muted. Turn on match notifications to stay updated on all Elysian FC scores.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const nextVal = !subscribedToUpdates;
                    setSubscribedToUpdates(nextVal);
                    if (currentUser) {
                      onUpdateProfile({
                        ...currentUser,
                        subscribed_to_updates: nextVal
                      });
                    }
                  }}
                  id="btn-toggle-match-subscription"
                  className={`px-5 py-3 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] sm:min-h-0 flex items-center justify-center ${
                    subscribedToUpdates
                      ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
                  }`}
                >
                  {subscribedToUpdates ? 'Mute Updates' : 'Subscribe Now'}
                </button>
              </div>

              {/* Fine-grained options */}
              <div className="space-y-4 pt-4 border-t border-slate-900">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">Alert Preferences</h4>
                
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3.5 bg-slate-900/40 border border-slate-850 rounded-xl cursor-pointer hover:border-slate-800 transition">
                    <input
                      type="checkbox"
                      checked={subscribedToUpdates}
                      disabled={!subscribedToUpdates}
                      onChange={() => {}}
                      className="mt-0.5 rounded border-slate-850 text-emerald-500 focus:ring-emerald-500 bg-slate-950 accent-emerald-500 disabled:opacity-50"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">Goal Alerts</span>
                      <span className="text-[10px] text-slate-500">Instant notification when any team scores a goal.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 bg-slate-900/40 border border-slate-850 rounded-xl cursor-pointer hover:border-slate-800 transition">
                    <input
                      type="checkbox"
                      checked={subscribedToUpdates}
                      disabled={!subscribedToUpdates}
                      onChange={() => {}}
                      className="mt-0.5 rounded border-slate-850 text-emerald-500 focus:ring-emerald-500 bg-slate-950 accent-emerald-500 disabled:opacity-50"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">Match Kickoff & Full-time Whistle</span>
                      <span className="text-[10px] text-slate-500">Alerts when matches commence and finish.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 bg-slate-900/40 border border-slate-850 rounded-xl cursor-pointer hover:border-slate-800 transition opacity-60">
                    <input
                      type="checkbox"
                      defaultChecked={false}
                      disabled={true}
                      onChange={() => {}}
                      className="mt-0.5 rounded border-slate-850 text-emerald-500 focus:ring-emerald-500 bg-slate-950 accent-emerald-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-400 block flex items-center gap-1.5">
                        SMS Notifications <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded font-bold uppercase">PRO</span>
                      </span>
                      <span className="text-[10px] text-slate-500">Receive text alerts directly to your contact number.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
