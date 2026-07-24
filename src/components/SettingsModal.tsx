/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  User as UserIcon, 
  Volume2, 
  CreditCard, 
  Database, 
  Check, 
  Lock,
  Sparkles,
  Award
} from 'lucide-react';
import { User } from '../types';

interface SettingsModalProps {
  user: User;
  onClose: () => void;
  onUpdateUser: (updated: User) => void;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
}

export default function SettingsModal({
  user,
  onClose,
  onUpdateUser,
  theme,
  setTheme
}: SettingsModalProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'billing' | 'voice' | 'system'>('profile');
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatarUrl || '');
  const [voice, setVoice] = useState('Zephyr');
  const [sandboxRole, setSandboxRole] = useState(user.role);
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('nexus_gemini_api_key') || '');
  const [keySaved, setKeySaved] = useState(false);

  const handleSaveApiKey = () => {
    localStorage.setItem('nexus_gemini_api_key', geminiApiKey.trim());
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 3000);
  };

  const handleSaveProfile = () => {
    const updated: User = {
      ...user,
      name: name.trim() || user.name,
      avatarUrl: avatar.trim() || user.avatarUrl,
      role: sandboxRole
    };
    onUpdateUser(updated);
    alert("Profile saved successfully!");
  };

  const handleTierUpgrade = (tier: User['subscription']) => {
    const updated: User = {
      ...user,
      subscription: tier
    };
    onUpdateUser(updated);
    alert(`Successfully switched subscription to ${tier.toUpperCase()}!`);
  };

  const systemVoices = [
    { id: 'Zephyr', lang: 'en-US', gender: 'Warm male' },
    { id: 'Kore', lang: 'en-US', gender: 'Cheerful female' },
    { id: 'Puck', lang: 'en-US', gender: 'Playful male' },
    { id: 'Charon', lang: 'en-US', gender: 'Serious male' },
    { id: 'Fenrir', lang: 'en-US', gender: 'Deep male' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      
      {/* Outer Card container */}
      <div className={`w-full max-w-2xl rounded-2xl border flex flex-col sm:flex-row overflow-hidden shadow-2xl transition-all ${theme === 'dark' ? 'glass border-white/5 text-gray-100' : 'glass-light bg-white/35 border-black/5 text-gray-900'}`}>
        
        {/* Modal Sidebar Navigation */}
        <div className={`w-full sm:w-48 p-6 shrink-0 border-r ${theme === 'dark' ? 'border-white/5 bg-white/2' : 'border-black/5 bg-black/2'}`}>
          <div className="flex items-center space-x-2 mb-6">
            <Settings className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-sm uppercase tracking-wider">Settings</h3>
          </div>

          <div className="flex sm:flex-col gap-1.5 overflow-x-auto sm:overflow-x-visible">
            {[
              { id: 'profile', label: 'User Profile', icon: <UserIcon className="w-4 h-4" /> },
              { id: 'billing', label: 'Billing & Tiers', icon: <CreditCard className="w-4 h-4" /> },
              { id: 'voice', label: 'Voice & TTS', icon: <Volume2 className="w-4 h-4" /> },
              { id: 'system', label: 'System Details', icon: <Database className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`py-2 px-3 rounded-xl flex items-center space-x-2.5 text-xs font-semibold whitespace-nowrap transition-all ${activeSubTab === tab.id ? 'bg-indigo-500 text-white shadow-md' : 'hover:bg-gray-800/10 dark:hover:bg-gray-800/30 text-gray-400'}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body Content (Right Side) */}
        <div className="flex-1 p-6 flex flex-col justify-between min-h-[400px]">
          <div>
            <div className="flex justify-between items-start mb-6">
              <h4 className="font-extrabold text-lg capitalize">{activeSubTab} Preferences</h4>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-rose-500/10 text-gray-400 hover:text-rose-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub Tabs Panel implementation */}
            {activeSubTab === 'profile' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs outline-none ${theme === 'dark' ? 'prompt-input-glass text-white' : 'prompt-input-glass-light text-gray-900'}`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Avatar URL</label>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs outline-none ${theme === 'dark' ? 'prompt-input-glass text-white' : 'prompt-input-glass-light text-gray-900'}`}
                  />
                </div>

                {/* Sandbox privilege toggler */}
                <div className="p-4 rounded-xl border border-indigo-500/10 bg-indigo-500/5 space-y-3 mt-4">
                  <div className="flex items-center space-x-2 text-indigo-400">
                    <Award className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Sandbox Role Switch</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-normal">
                    Quickly promote yourself to Admin or return to User mode. Great for testing user dashboard and administration panels.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setSandboxRole('user')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${sandboxRole === 'user' ? 'bg-indigo-500 text-white border-indigo-500' : 'border-white/5 bg-white/5 hover:bg-white/10 text-gray-300'}`}
                    >
                      User Mode
                    </button>
                    <button
                      type="button"
                      onClick={() => setSandboxRole('admin')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${sandboxRole === 'admin' ? 'bg-indigo-500 text-white border-indigo-500' : 'border-white/5 bg-white/5 hover:bg-white/10 text-gray-300'}`}
                    >
                      Admin Mode
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'billing' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-400 mb-2">Switch subscription tiers instantly to test platform volume capabilities.</p>
                
                <div className="space-y-2.5">
                  {[
                    { id: 'free', label: 'Free Tier', desc: '100 requests per day, standard latency', active: user.subscription === 'free' },
                    { id: 'premium', label: 'Premium Suite', desc: 'Unlimited requests, high-speed image generation', active: user.subscription === 'premium' },
                    { id: 'enterprise', label: 'Enterprise Stack', desc: 'Admin roles, custom relational DB, dedicated SLA support', active: user.subscription === 'enterprise' }
                  ].map((tier) => (
                    <div 
                      key={tier.id}
                      onClick={() => handleTierUpgrade(tier.id as any)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${tier.active ? 'border-indigo-500 bg-indigo-500/15' : 'border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/10'}`}
                    >
                      <div>
                        <p className="text-xs font-bold text-gray-200">{tier.label}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{tier.desc}</p>
                      </div>
                      {tier.active ? (
                        <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <span className="text-[10px] text-indigo-400 font-bold uppercase hover:underline">Activate</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSubTab === 'voice' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-400 mb-2">Select your default Google Gemini Text-to-Speech voice actor.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {systemVoices.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => setVoice(v.id)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${voice === v.id ? 'border-indigo-500 bg-indigo-500/15' : 'border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/10'}`}
                    >
                      <div>
                        <p className="text-xs font-bold text-gray-200">{v.id}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{v.gender} ({v.lang})</p>
                      </div>
                      {voice === v.id && (
                        <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSubTab === 'system' && (
              <div className="space-y-4 text-xs leading-relaxed text-gray-400">
                {/* Gemini API Key Configuration Block */}
                <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'border-indigo-500/20 bg-indigo-500/5' : 'border-indigo-200 bg-indigo-50/50'} space-y-3`}>
                  <div className="flex items-center space-x-2 text-indigo-400">
                    <Lock className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Gemini API Key Setup</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Paste your custom Google Gemini API Key here if deploying on Vercel, Netlify, or running locally without environment variables.
                  </p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="password"
                      placeholder="AIzaSy..."
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                      className={`flex-1 px-3 py-2 rounded-xl border text-xs outline-none font-mono ${theme === 'dark' ? 'prompt-input-glass text-white' : 'prompt-input-glass-light text-gray-900'}`}
                    />
                    <button
                      type="button"
                      onClick={handleSaveApiKey}
                      className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs transition-all shadow-md flex items-center space-x-1"
                    >
                      {keySaved ? <Check className="w-3.5 h-3.5" /> : null}
                      <span>{keySaved ? 'Saved!' : 'Save Key'}</span>
                    </button>
                  </div>
                  {keySaved && (
                    <p className="text-[10px] text-emerald-400 font-medium">
                      API Key saved to browser storage! All requests will now automatically use this key.
                    </p>
                  )}
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-white/2 space-y-2">
                  <div className="flex items-center space-x-1.5 text-indigo-400 font-bold uppercase tracking-wider mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>System Specifications</span>
                  </div>
                  <p><strong className="text-gray-300">Frontend Stack:</strong> React + TypeScript + Tailwind CSS</p>
                  <p><strong className="text-gray-300">Backend Server:</strong> Node.js Express served on port 3000</p>
                  <p><strong className="text-gray-300">AI Integration:</strong> Google GenAI Developer SDK (@google/genai)</p>
                  <p><strong className="text-gray-300">Deployment Ready:</strong> Vercel + Cloud Run compatible</p>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons at the bottom of Modal */}
          <div className="flex justify-end space-x-2 border-t border-gray-800/10 dark:border-gray-800/50 pt-4">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-bold ${theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Close
            </button>
            {activeSubTab === 'profile' && (
              <button
                onClick={handleSaveProfile}
                className="px-5 py-2 rounded-xl bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/15"
              >
                Save Profile
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
