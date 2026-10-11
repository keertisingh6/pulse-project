import React, { useState } from 'react';
import { usePulse } from '../context/PulseContext';
import { 
  Plus, Check, X, Shield, Lock, Globe, Smartphone, 
  Trash2, AlertCircle, Sparkles, Filter, CheckCircle2, 
  Eye, ToggleLeft, ToggleRight, Laptop, Clock, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BlockedItem {
  id: string;
  name: string;
  category: 'social' | 'entertainment' | 'gaming' | 'shopping' | 'custom';
  domain: string;
  isApp: boolean;
  blocked: boolean;
  timesBlockedToday: number;
  iconBg: string;
  iconText: string;
}

const INITIAL_BLOCK_LIST: BlockedItem[] = [
  { id: 'b1', name: 'Instagram', category: 'social', domain: 'instagram.com', isApp: true, blocked: true, timesBlockedToday: 14, iconBg: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600', iconText: 'IG' },
  { id: 'b2', name: 'YouTube', category: 'entertainment', domain: 'youtube.com', isApp: true, blocked: true, timesBlockedToday: 8, iconBg: 'bg-red-600', iconText: 'YT' },
  { id: 'b3', name: 'Reddit', category: 'social', domain: 'reddit.com', isApp: true, blocked: true, timesBlockedToday: 5, iconBg: 'bg-orange-500', iconText: 'RD' },
  { id: 'b4', name: 'X / Twitter', category: 'social', domain: 'x.com', isApp: false, blocked: true, timesBlockedToday: 11, iconBg: 'bg-black text-white', iconText: '𝕏' },
  { id: 'b5', name: 'Netflix', category: 'entertainment', domain: 'netflix.com', isApp: true, blocked: false, timesBlockedToday: 2, iconBg: 'bg-red-800', iconText: 'N' },
  { id: 'b6', name: 'TikTok', category: 'social', domain: 'tiktok.com', isApp: true, blocked: true, timesBlockedToday: 19, iconBg: 'bg-slate-900', iconText: 'TT' },
];

export const BlockListView: React.FC = () => {
  const { state } = usePulse();
  const [items, setItems] = useState<BlockedItem[]>(() => {
    const saved = localStorage.getItem('pulse_block_list');
    return saved ? JSON.parse(saved) : INITIAL_BLOCK_LIST;
  });

  const [strictMode, setStrictMode] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDomain, setNewItemDomain] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<BlockedItem['category']>('social');
  const [newItemIsApp, setNewItemIsApp] = useState(false);

  const saveItems = (updated: BlockedItem[]) => {
    setItems(updated);
    localStorage.setItem('pulse_block_list', JSON.stringify(updated));
  };

  const toggleBlock = (id: string) => {
    const updated = items.map(item => 
      item.id === id ? { ...item, blocked: !item.blocked } : item
    );
    saveItems(updated);
  };

  const removeItem = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    saveItems(updated);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const colors = [
      'bg-indigo-600', 'bg-emerald-600', 'bg-rose-600', 
      'bg-amber-600', 'bg-cyan-600', 'bg-violet-600'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const created: BlockedItem = {
      id: 'b_' + Date.now(),
      name: newItemName.trim(),
      category: newItemCategory,
      domain: newItemDomain.trim() || `${newItemName.toLowerCase().replace(/\s+/g, '')}.com`,
      isApp: newItemIsApp,
      blocked: true,
      timesBlockedToday: 0,
      iconBg: randomColor,
      iconText: newItemName.substring(0, 2).toUpperCase(),
    };

    saveItems([...items, created]);
    setNewItemName('');
    setNewItemDomain('');
    setShowAddModal(false);
  };

  const totalIntercepts = items.reduce((sum, i) => sum + (i.blocked ? i.timesBlockedToday : 0), 0);
  const activeBlockedCount = items.filter(i => i.blocked).length;

  return (
    <div className="space-y-6">
      
      {/* Header Banner matching FocusMate design */}
      <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Distraction Shield & App Blocker</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1B] tracking-tight">
            Curated Block List
          </h2>
          <p className="text-xs md:text-sm text-[#1A1A1B]/60 max-w-xl">
            Block addictive feeds, doomscrolling sites, and desktop notifications during active study blocks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#FAF9F6] border border-[#EBE9E0] px-4 py-2 rounded-2xl">
            <span className="text-xs font-semibold text-[#1A1A1B]">Strict Mode</span>
            <button
              onClick={() => setStrictMode(!strictMode)}
              className="text-[#7C9070] cursor-pointer hover:opacity-80 transition-opacity"
            >
              {strictMode ? (
                <ToggleRight className="w-6 h-6 text-[#7C9070]" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-slate-400" />
              )}
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#7C9070] hover:bg-[#6c7d61] text-white rounded-2xl font-bold text-xs shadow-sm shadow-[#7C9070]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Website or App</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#EBE9E0] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#1A1A1B]/50 uppercase tracking-wider">Active Blocks</span>
            <Shield className="w-4 h-4 text-[#7C9070]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#1A1A1B]">
            {activeBlockedCount} <span className="text-xs text-[#1A1A1B]/40 font-normal">of {items.length} apps & sites</span>
          </div>
        </div>

        <div className="bg-white border border-[#EBE9E0] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#1A1A1B]/50 uppercase tracking-wider">Intercepts Today</span>
            <Lock className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-600">
            {totalIntercepts} <span className="text-xs text-[#1A1A1B]/40 font-normal">distraction attempts spared</span>
          </div>
        </div>

        <div className="bg-white border border-[#EBE9E0] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#1A1A1B]/50 uppercase tracking-wider">Time Saved</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-700">
            ~{Math.round(totalIntercepts * 4.5)} <span className="text-xs text-[#1A1A1B]/40 font-normal">minutes recovered</span>
          </div>
        </div>
      </div>

      {/* Block List Grid */}
      <div className="bg-white border border-[#EBE9E0] rounded-[2rem] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EBE9E0]">
          <div>
            <h3 className="font-bold text-base text-[#1A1A1B]">Enforced Distraction Rules</h3>
            <p className="text-xs text-[#1A1A1B]/50">Toggling off allows temporary access during designated break windows.</p>
          </div>
          <span className="text-xs font-mono font-semibold text-[#7C9070] bg-[#7C9070]/10 px-2.5 py-1 rounded-full">
            {activeBlockedCount} Enforced
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map(item => (
            <div 
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                item.blocked 
                  ? 'border-[#EBE9E0] bg-[#FAF9F6] hover:bg-[#F5F1E9]' 
                  : 'border-slate-100 bg-white opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs ${item.iconBg}`}>
                  {item.iconText}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1A1A1B] truncate">{item.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-[#EBE9E0] text-[#1A1A1B]/60">
                      {item.isApp ? 'App' : 'Web'}
                    </span>
                  </div>
                  <p className="text-xs text-[#1A1A1B]/50 truncate font-mono">
                    {item.domain} • <span className="text-rose-600 font-semibold">{item.timesBlockedToday} blocked today</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleBlock(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    item.blocked 
                      ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {item.blocked ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                  <span>{item.blocked ? 'Blocked' : 'Allowed'}</span>
                </button>

                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded-lg cursor-pointer"
                  title="Remove from list"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Item Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#EBE9E0] space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <Shield className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-lg text-[#1A1A1B]">Add Block Target</h3>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1B]/70 mb-1">Target Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Reddit, Discord, Steam"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EBE9E0] bg-[#FAF9F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#7C9070]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1B]/70 mb-1">Domain or URL</label>
                  <input
                    type="text"
                    placeholder="e.g. reddit.com or discord.com"
                    value={newItemDomain}
                    onChange={(e) => setNewItemDomain(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EBE9E0] bg-[#FAF9F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#7C9070]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1B]/70 mb-1">Category</label>
                    <select
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#EBE9E0] bg-[#FAF9F6] text-xs font-semibold focus:outline-none"
                    >
                      <option value="social">Social Media</option>
                      <option value="entertainment">Streaming & Video</option>
                      <option value="gaming">Gaming</option>
                      <option value="shopping">Shopping</option>
                      <option value="custom">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1B]/70 mb-1">Platform</label>
                    <select
                      value={newItemIsApp ? 'app' : 'web'}
                      onChange={(e) => setNewItemIsApp(e.target.value === 'app')}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#EBE9E0] bg-[#FAF9F6] text-xs font-semibold focus:outline-none"
                    >
                      <option value="web">Web Browser</option>
                      <option value="app">Desktop App</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#1A1A1B]/60 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#7C9070] hover:bg-[#6c7d61] text-white shadow-sm cursor-pointer"
                  >
                    Add to Block List
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
