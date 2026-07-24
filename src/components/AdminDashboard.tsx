/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  Cpu, 
  DollarSign, 
  ShieldCheck, 
  Plus, 
  ArrowUpRight, 
  Check, 
  X,
  Lock,
  UserCheck,
  TrendingUp,
  BarChart2,
  ListFilter,
  CheckCircle,
  TrendingDown
} from 'lucide-react';
import { AdminAnalytics, User } from '../types';

interface AdminDashboardProps {
  theme: 'dark' | 'light';
}

export default function AdminDashboard({ theme }: AdminDashboardProps) {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'metrics' | 'logs'>('users');

  // Simulated activity logging
  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  useEffect(() => {
    // Fetch analytics data
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/admin/analytics');
        const data = await res.json();
        setAnalytics(data);

        // Prepopulate users with some premium demo accounts
        setUsersList([
          { id: 'usr-admin-1', name: "Shiva Chauhan", email: "shivac917067@gmail.com", role: "admin", subscription: "premium", chatCount: 142, tokens: 512000, status: "Active" },
          { id: 'usr-test-2', name: "Demo User Mode", email: "tester@nexusai.com", role: "user", subscription: "free", chatCount: 12, tokens: 2400, status: "Active" },
          { id: 'usr-user-3', name: "Sarah Connor", email: "sarah.c@skyline.org", role: "user", subscription: "enterprise", chatCount: 452, tokens: 1890000, status: "Active" },
          { id: 'usr-user-4', name: "Tony Stark", email: "tony@starkintl.com", role: "user", subscription: "premium", chatCount: 984, tokens: 4122000, status: "Active" },
          { id: 'usr-user-5', name: "Peter Parker", email: "spidey@dailybugle.com", role: "user", subscription: "free", chatCount: 5, tokens: 1200, status: "Active" },
          { id: 'usr-user-6', name: "Bruce Wayne", email: "bruce@waynecorp.com", role: "user", subscription: "enterprise", chatCount: 2045, tokens: 8140000, status: "Active" }
        ]);

        setActivityLogs([
          { time: "09:28 AM", event: "User tony@starkintl.com compiled dynamic React UI component (1,402 tokens)", type: "chat" },
          { time: "09:25 AM", event: "User tester@nexusai.com created new chat session ID 'chat-92a'", type: "session" },
          { time: "09:18 AM", event: "Admin upgraded subscription tier for bruce@waynecorp.com to Enterprise", type: "system" },
          { time: "09:12 AM", event: "User spidey@dailybugle.com triggered digital art synthesis (aspect 1:1)", type: "image" },
          { time: "09:05 AM", event: "SSE streaming connection opened by sarah.c@skyline.org (gemini-3.1-pro)", type: "chat" }
        ]);

        setIsLoading(false);
      } catch (e) {
        console.error(e);
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleRoleToggle = (userId: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        const nextRole = u.role === 'admin' ? 'user' : 'admin';
        addLog(`System updated role of ${u.email} to ${nextRole.toUpperCase()}`, 'system');
        return { ...u, role: nextRole };
      }
      return u;
    }));
  };

  const handleSubUpdate = (userId: string, tier: 'free' | 'basic' | 'premium' | 'enterprise') => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        addLog(`System updated subscription of ${u.email} to ${tier.toUpperCase()}`, 'system');
        return { ...u, subscription: tier };
      }
      return u;
    }));
  };

  const addLog = (event: string, type: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivityLogs(prev => [{ time: timeStr, event, type }, ...prev]);
  };

  if (isLoading || !analytics) {
    return (
      <div className="flex-1 flex items-center justify-center bg-transparent">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`flex-1 overflow-y-auto p-6 sm:p-10 transition-colors duration-300 bg-transparent ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
      
      {/* Header and KPI Summary Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Intelligence Control Center</h1>
          <p className="text-xs text-gray-500">Real-time usage audits, user subscriptions, and API latency checks.</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>ADMINISTRATOR IDENTITY AUTHENTICATED</span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Active User Nodes", count: analytics.totalUsers.toLocaleString(), change: "+12.4% MoM", positive: true, icon: <Users className="w-5 h-5 text-indigo-400" /> },
          { label: "Total Chat Sessions", count: analytics.totalChats.toLocaleString(), change: "+18.2% MoM", positive: true, icon: <MessageSquare className="w-5 h-5 text-emerald-400" /> },
          { label: "Synthesized Tokens", count: (analytics.totalTokens / 1000000).toFixed(2) + "M", change: "+24.5% MoM", positive: true, icon: <Cpu className="w-5 h-5 text-rose-400" /> },
          { label: "Monthly Recurring Revenue", count: "$" + analytics.totalRevenue.toLocaleString(), change: "-2.1% MoM", positive: false, icon: <DollarSign className="w-5 h-5 text-amber-400" /> }
        ].map((kpi, idx) => (
          <div 
            key={idx}
            className={`p-6 rounded-2xl border ${theme === 'dark' ? 'glass border-white/5' : 'glass-light bg-white/35 border-black/5'}`}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{kpi.label}</span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'}`}>
                {kpi.icon}
              </div>
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight mb-2">{kpi.count}</h3>
            <div className="flex items-center space-x-1 text-xs">
              {kpi.positive ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
              )}
              <span className={kpi.positive ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>{kpi.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Bento Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Users / Settings Tables */}
        <div className={`lg:col-span-2 rounded-2xl border p-6 flex flex-col justify-between ${theme === 'dark' ? 'glass border-white/5' : 'glass-light bg-white/35 border-black/5'}`}>
          <div className="flex items-center justify-between border-b border-gray-800/10 dark:border-gray-800/50 pb-4 mb-6">
            <div className="flex space-x-4">
              <button 
                onClick={() => setActiveTab('users')}
                className={`text-sm font-bold pb-2 border-b-2 transition-all ${activeTab === 'users' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-500 hover:text-white'}`}
              >
                User & Accounts Manager
              </button>
              <button 
                onClick={() => setActiveTab('metrics')}
                className={`text-sm font-bold pb-2 border-b-2 transition-all ${activeTab === 'metrics' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-500 hover:text-white'}`}
              >
                Engine Metrics
              </button>
            </div>
          </div>

          {activeTab === 'users' ? (
            /* User Listing and modification controls */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-800/10 dark:border-gray-800/50">
                    <th className="py-3 font-bold uppercase tracking-wider text-gray-400">Node Profile</th>
                    <th className="py-3 font-bold uppercase tracking-wider text-gray-400">Identity Role</th>
                    <th className="py-3 font-bold uppercase tracking-wider text-gray-400">Subscription Tier</th>
                    <th className="py-3 font-bold uppercase tracking-wider text-gray-400">Activity Load</th>
                    <th className="py-3 font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/10 dark:divide-gray-800/40">
                  {usersList.map((usr) => (
                    <tr key={usr.id} className="hover:bg-gray-500/5 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <img src={usr.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120"} alt="Avatar" className="w-8 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
                          <div>
                            <p className="font-bold text-gray-200">{usr.name}</p>
                            <p className="text-[10px] text-gray-500">{usr.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <button 
                          onClick={() => handleRoleToggle(usr.id)}
                          className={`px-2.5 py-1 rounded-md font-bold uppercase text-[9px] border transition-all ${usr.role === 'admin' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-indigo-500/30 hover:text-indigo-400'}`}
                          title="Toggle Admin Privilege"
                        >
                          {usr.role}
                        </button>
                      </td>
                      <td className="py-4">
                        <select
                          value={usr.subscription}
                          onChange={(e: any) => handleSubUpdate(usr.id, e.target.value)}
                          className={`rounded-lg px-2 py-1 text-[11px] font-semibold outline-none border ${theme === 'dark' ? 'prompt-input-glass text-white focus:border-indigo-500' : 'prompt-input-glass-light text-gray-900 focus:border-indigo-500'}`}
                        >
                          <option value="free">FREE</option>
                          <option value="basic">BASIC</option>
                          <option value="premium">PREMIUM</option>
                          <option value="enterprise">ENTERPRISE</option>
                        </select>
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="font-bold text-gray-200">{usr.chatCount} chats</p>
                          <p className="text-[10px] text-gray-500">{usr.tokens.toLocaleString()} tokens</p>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Model distribution progress bars and engine loads */
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-sm mb-3">Model Queries Breakdown</h3>
                <div className="space-y-4">
                  {analytics.modelPopularity.map((pop, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>{pop.model}</span>
                        <span className="text-indigo-400">{pop.count.toLocaleString()} queries</span>
                      </div>
                      <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${(pop.count / 90000) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm mb-3">Database Synchronization Status</h3>
                <div className={`p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-start space-x-3`}>
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">Sync Integrity: 100%</p>
                    <p className="text-xs text-gray-400">All local storage sessions and tokens compiled perfectly in memory state.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Real-time System Logs and distribution graph */}
        <div className="space-y-8">
          
          {/* Subscription Tier Distribution */}
          <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'glass border-white/5' : 'glass-light bg-white/35 border-black/5'}`}>
            <h3 className="font-bold text-sm mb-4">Subscription Tiers Distribution</h3>
            <div className="space-y-3">
              {[
                { name: 'Enterprise (Annual)', count: analytics.activeTierDistribution.enterprise, color: 'bg-indigo-500', pct: 15 },
                { name: 'Premium (Monthly)', count: analytics.activeTierDistribution.premium, color: 'bg-purple-500', pct: 30 },
                { name: 'Basic Core', count: analytics.activeTierDistribution.basic, color: 'bg-pink-500', pct: 20 },
                { name: 'Free Tier', count: analytics.activeTierDistribution.free, color: 'bg-gray-600', pct: 35 }
              ].map((tier, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-300">{tier.name}</span>
                    <span className="font-mono text-gray-400 font-bold">{tier.count.toLocaleString()} nodes ({tier.pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-850 h-1.5 rounded-full overflow-hidden">
                    <div className={`${tier.color} h-1.5 rounded-full`} style={{ width: `${tier.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Simulated Activity Audit Trail */}
          <div className={`rounded-2xl border p-6 flex flex-col justify-between h-96 ${theme === 'dark' ? 'glass border-white/5' : 'glass-light bg-white/35 border-black/5'}`}>
            <div>
              <h3 className="font-bold text-sm mb-4">Live Session Audits</h3>
              <div className="space-y-4 max-y-64 overflow-y-auto custom-scrollbar pr-1">
                {activityLogs.map((log, i) => (
                  <div key={i} className="flex items-start space-x-3 text-[11px] leading-normal border-b border-gray-800/10 dark:border-gray-800/40 pb-2.5">
                    <span className="font-mono text-gray-500 shrink-0 font-semibold">{log.time}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-300 break-words">{log.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
