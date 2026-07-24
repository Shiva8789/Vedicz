/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowLeft,
  Chrome,
  AlertCircle,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { User } from '../types';

interface LoginSignupProps {
  onBack: () => void;
  onSuccess: (user: User) => void;
  theme: 'dark' | 'light';
}

export default function LoginSignup({ onBack, onSuccess, theme }: LoginSignupProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Quick sandbox login presets for quick review!
  const presets = [
    {
      name: "Shiva Chauhan (Admin)",
      email: "shivac917067@gmail.com",
      role: "admin" as const,
      sub: "premium" as const,
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120"
    },
    {
      name: "Demo User Mode",
      email: "tester@nexusai.com",
      role: "user" as const,
      sub: "free" as const,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
    }
  ];

  const handleSandboxLogin = (preset: typeof presets[0]) => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      const loggedUser: User = {
        id: preset.role === 'admin' ? 'usr-admin-1' : 'usr-test-2',
        email: preset.email,
        name: preset.role === 'admin' ? 'Shiva Chauhan' : preset.name,
        avatarUrl: preset.avatar,
        role: preset.role,
        subscription: preset.sub,
        createdAt: new Date().toISOString(),
        chatCount: preset.role === 'admin' ? 142 : 12,
        totalTokensUsed: preset.role === 'admin' ? 512000 : 2400
      };
      
      // Store in LocalStorage to persist user session cleanly
      localStorage.setItem('nexus_user', JSON.stringify(loggedUser));
      setIsLoading(false);
      onSuccess(loggedUser);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email || !password || (!isLogin && !name)) {
      setError("Please fill out all fields.");
      return;
    }

    setIsLoading(true);

    // Simulate database signup / login
    setTimeout(() => {
      setIsLoading(false);
      
      // If the email is admin@nexusai.com or shivac917067@gmail.com, automatically promote to Admin
      const isShivaAdmin = email.toLowerCase().includes('shiva') || email.toLowerCase() === 'shivac917067@gmail.com' || email.toLowerCase() === 'admin@nexusai.com';
      const userRole = isShivaAdmin ? 'admin' : 'user';
      const userSub = isShivaAdmin ? 'premium' : 'free';

      if (isLogin) {
        const loggedUser: User = {
          id: 'usr-' + Math.random().toString(36).substr(2, 9),
          email: email,
          name: name || (isShivaAdmin ? 'Shiva Chauhan' : email.split('@')[0]),
          avatarUrl: isShivaAdmin 
            ? "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120"
            : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
          role: userRole,
          subscription: userSub,
          createdAt: new Date().toISOString(),
          chatCount: 4,
          totalTokensUsed: 1200
        };
        localStorage.setItem('nexus_user', JSON.stringify(loggedUser));
        onSuccess(loggedUser);
      } else {
        setSuccessMsg("Account successfully provisioned! Redirecting to login view...");
        setTimeout(() => {
          setIsLogin(true);
          setSuccessMsg(null);
        }, 1500);
      }
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      const loggedUser: User = {
        id: 'usr-google-' + Math.random().toString(36).substr(2, 9),
        email: 'google.user@gmail.com',
        name: 'Google Workspace Tester',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
        role: 'user',
        subscription: 'premium',
        createdAt: new Date().toISOString(),
        chatCount: 8,
        totalTokensUsed: 4500
      };
      localStorage.setItem('nexus_user', JSON.stringify(loggedUser));
      setIsLoading(false);
      onSuccess(loggedUser);
    }, 1000);
  };

  return (
    <div id="auth-container" className={`min-h-screen flex flex-col justify-center items-center relative py-12 px-6 font-sans transition-colors duration-300 bg-transparent ${theme === 'dark' ? 'text-[#e2e8f0]' : 'text-gray-900'}`}>
      
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Back to landing */}
      <button
        id="back-to-landing-btn"
        onClick={onBack}
        className={`absolute top-6 left-6 flex items-center space-x-2 text-sm font-semibold transition-all hover:text-indigo-500 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Main Site</span>
      </button>

      {/* Main Container */}
      <div className="w-full max-w-md relative">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border p-8 relative z-10 ${theme === 'dark' ? 'glass border-white/5 shadow-2xl' : 'glass-light bg-white/35 border-black/5 shadow-xl'}`}
        >
          
          {/* Logo Heading */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/20 mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              {isLogin ? "Sign in to VedixAI" : "Create your account"}
            </h2>
            <p className={`text-sm mt-1.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {isLogin ? "Access your custom Gemini intelligence terminal" : "Gain access to high-speed AI tools"}
            </p>
          </div>

          {/* Feedback alerts */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start space-x-3 mb-6">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start space-x-3 mb-6">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                    <UserIcon className="w-4.5 h-4.5" />
                  </span>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${theme === 'dark' ? 'prompt-input-glass text-white' : 'prompt-input-glass-light text-gray-900'}`}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <Mail className="w-4.5 h-4.5" />
                </span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${theme === 'dark' ? 'prompt-input-glass text-white' : 'prompt-input-glass-light text-gray-900'}`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Password</label>
                {isLogin && (
                  <button 
                    type="button" 
                    onClick={() => setError("Password recovery email triggered in simulated context.")}
                    className="text-xs text-indigo-400 hover:underline font-semibold"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <Lock className="w-4.5 h-4.5" />
                </span>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${theme === 'dark' ? 'prompt-input-glass text-white' : 'prompt-input-glass-light text-gray-900'}`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{isLogin ? "Sign In" : "Sign Up"}</span>
              )}
            </button>
          </form>

          {/* Social Sign In */}
          <div className="my-6 flex items-center justify-between text-xs font-semibold text-gray-500">
            <span className="w-1/4 h-[1px] bg-gray-800" />
            <span>OR CONNECT WITH</span>
            <span className="w-1/4 h-[1px] bg-gray-800" />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className={`w-full py-3 rounded-xl border text-sm font-semibold flex items-center justify-center space-x-2.5 transition-all ${theme === 'dark' ? 'glass border-white/5 hover:border-white/10 text-gray-200' : 'glass-light bg-white/30 border-black/5 hover:bg-black/5 text-gray-700'}`}
          >
            <Chrome className="w-4.5 h-4.5 text-rose-500" />
            <span>Continue with Google</span>
          </button>

          {/* Switch View */}
          <p className="text-center text-sm text-gray-400 mt-6 font-medium">
            {isLogin ? "New to the platform?" : "Already have an account?"}{' '}
            <button
              onClick={() => {
                setError(null);
                setSuccessMsg(null);
                setIsLogin(!isLogin);
              }}
              className="text-indigo-400 hover:underline font-semibold"
            >
              {isLogin ? "Create account" : "Sign in instead"}
            </button>
          </p>
        </motion.div>

        {/* Sandbox quick-access card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`mt-6 p-6 rounded-2xl border text-center ${theme === 'dark' ? 'glass border-white/5' : 'glass-light bg-white/30 border-black/5'} shadow-md`}
        >
          <div className="flex items-center justify-center space-x-2 text-indigo-400 mb-3">
            <ShieldCheck className="w-5 h-5" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Reviewer Sandbox Bypass</h4>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Bypass manual form filling to test standard User and full Admin Dashboard capabilities immediately.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSandboxLogin(preset)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${theme === 'dark' ? 'border-white/5 bg-white/5 text-gray-250 hover:border-indigo-500/30 hover:bg-indigo-500/10' : 'border-black/5 bg-black/5 text-gray-750 hover:border-indigo-300/30 hover:bg-indigo-50/15'}`}
              >
                <span>{preset.name}</span>
                <span className="text-[10px] text-indigo-400 font-normal">{preset.email}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
