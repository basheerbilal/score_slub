/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShieldCheck, CheckCircle, CreditCard, Lock } from 'lucide-react';
import { CartItem, Product, User as UserType } from '../types';

interface CartViewProps {
  cart: CartItem[];
  onUpdateQty: (productId: number, qty: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onPlaceOrder: (name: string, email: string, address: string) => void;
  currentUser: UserType | null;
  onNavigate: (view: string) => void;
}

export default function CartView({
  cart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
  currentUser,
  onNavigate
}: CartViewProps) {
  const [checkoutForm, setCheckoutForm] = useState({
    name: currentUser?.username || '',
    email: currentUser?.email || '',
    address: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  const [orderCompleted, setOrderCompleted] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<number | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 10.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Place order dynamically
    const orderId = Math.floor(Math.random() * 900000) + 100000;
    onPlaceOrder(checkoutForm.name, checkoutForm.email, checkoutForm.address);
    setCompletedOrderId(orderId);
    setOrderCompleted(true);
    onClearCart();
  };

  if (orderCompleted) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 py-12 animate-fade-in" id="order-success-screen">
        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/5">
          <CheckCircle className="w-10 h-10 animate-bounce" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Order Placed Successfully!</h1>
          <p className="text-slate-400 text-sm">
            Thank you for supporting Elysian FC. Your receipt was logged into our orders repository.
          </p>
        </div>

        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 max-w-md mx-auto text-left space-y-4">
          <div className="flex justify-between border-b border-slate-900 pb-2.5 text-xs text-slate-400 font-mono">
            <span>Transaction ID:</span>
            <span className="text-white font-bold">#ORD-{completedOrderId}</span>
          </div>
          <div className="flex justify-between border-b border-slate-900 pb-2.5 text-xs text-slate-400 font-mono">
            <span>Delivery Custodian:</span>
            <span className="text-white font-bold">{checkoutForm.name}</span>
          </div>
          <div className="flex justify-between border-b border-slate-900 pb-2.5 text-xs text-slate-400 font-mono">
            <span>Contact Logged:</span>
            <span className="text-white font-bold truncate max-w-[200px]">{checkoutForm.email}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>Total amount charged:</span>
            <span className="text-emerald-400 font-bold font-mono">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <button
            onClick={() => onNavigate('shop')}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs transition min-h-[44px] flex items-center justify-center"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold px-6 py-3 rounded-xl border border-slate-800 hover:border-slate-700 transition text-xs min-h-[44px] flex items-center justify-center"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" id="cart-view-container">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <ShoppingCart className="text-emerald-500 w-8 h-8" />
          Your Shopping Cart
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Review merchandise, adjust size/order counts, and complete transaction checkouts.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-16 text-center space-y-6 max-w-xl mx-auto">
          <ShoppingCart className="w-16 h-16 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Your Cart is Empty</h3>
            <p className="text-slate-400 text-xs">
              Looks like you haven't added any Elysian FC items to your cart yet.
            </p>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs transition inline-flex items-center justify-center gap-2 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Club Store
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest mb-2">Cart Checklist</h2>
            {cart.map((item) => (
              <div
                key={item.product_id}
                className="bg-slate-950/70 border border-slate-850 rounded-2xl p-4 flex gap-4 items-center justify-between"
                id={`cart-item-${item.product_id}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex-shrink-0">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm leading-snug line-clamp-1">{item.product.name}</h4>
                    <span className="text-emerald-400 text-xs font-mono font-bold block mt-0.5">${item.product.price.toFixed(2)}</span>
                    <span className="text-slate-500 text-[10px] font-mono tracking-wider block mt-0.5">Category: {item.product.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Quantity adjustment */}
                  <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
                    <button
                      onClick={() => onUpdateQty(item.product_id, item.quantity - 1)}
                      className="p-2.5 sm:p-1 text-slate-400 hover:text-white transition rounded min-h-[38px] sm:min-h-0 min-w-[38px] sm:min-w-0 flex items-center justify-center"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2.5 text-xs text-white font-bold font-mono">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQty(item.product_id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="p-2.5 sm:p-1 text-slate-400 hover:text-white transition rounded disabled:text-slate-700 min-h-[38px] sm:min-h-0 min-w-[38px] sm:min-w-0 flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => onRemoveItem(item.product_id)}
                    className="p-3 sm:p-2 bg-slate-900 text-red-400 hover:text-red-300 rounded-xl border border-slate-800 hover:border-red-950/40 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Panel */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-sm font-bold font-mono text-slate-400 uppercase tracking-widest mb-3">Order Summary</h2>
              <div className="space-y-2.5 border-b border-slate-850 pb-4 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping:</span>
                  <span className="font-mono font-semibold text-white">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tax (8% VAT):</span>
                  <span className="font-mono font-semibold text-white">${tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between pt-4 text-sm font-bold">
                <span className="text-white">Total Charge:</span>
                <span className="text-emerald-400 font-mono text-lg">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Secure Checkout Form */}
            <form onSubmit={handleCheckoutSubmit} className="space-y-4 border-t border-slate-850 pt-4">
              <h3 className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Secure Checkout Gateway
              </h3>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Recipient Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={checkoutForm.name}
                  onChange={(e) => setCheckoutForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Recipient Email</label>
                <input
                  type="email"
                  placeholder="e.g. alex@gmail.com"
                  value={checkoutForm.email}
                  onChange={(e) => setCheckoutForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Shipping Address</label>
                <input
                  type="text"
                  placeholder="123 King's Road, London, UK"
                  value={checkoutForm.address}
                  onChange={(e) => setCheckoutForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              {/* Payment Details */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5 text-white font-semibold">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                    Supporter Payment Cleared
                  </span>
                  <span>VISA / MC accepted</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={checkoutForm.cardNumber}
                    onChange={(e) => setCheckoutForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                    className="col-span-2 w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 focus:outline-none rounded-lg px-3 py-1.5 text-[11px] text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={checkoutForm.cardExpiry}
                    onChange={(e) => setCheckoutForm(prev => ({ ...prev, cardExpiry: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 focus:outline-none rounded-lg px-3 py-1.5 text-[11px] text-white"
                    required
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    value={checkoutForm.cardCvv}
                    onChange={(e) => setCheckoutForm(prev => ({ ...prev, cardCvv: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 focus:outline-none rounded-lg px-3 py-1.5 text-[11px] text-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 sm:py-3 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 min-h-[44px]"
                id="place-order-btn"
              >
                <ShieldCheck className="w-4 h-4" />
                Authorize Payment & Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
