/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Image as ImageIcon, 
  ShieldAlert, 
  Settings, 
  LogOut, 
  Search, 
  Trash2, 
  Edit3, 
  Check, 
  X,
  Sparkles,
  BarChart,
  User as UserIcon,
  HelpCircle
} from 'lucide-react';
import { ChatSession, User } from '../types';

interface SidebarProps {
  user: User;
  chats: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onCreateChat: () => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, newTitle: string) => void;
  activeTab: 'chat' | 'image' | 'admin';
  setActiveTab: (tab: 'chat' | 'image' | 'admin') => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  onLogout: () => void;
  onOpenSettings: () => void;
}

export default function Sidebar({
  user,
  chats,
  activeChatId,
  onSelectChat,
  onCreateChat,
  onDeleteChat,
  onRenameChat,
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  onLogout,
  onOpenSettings
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState('');

  // Filter chats by search query
  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startRename = (chat: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setRenameTitle(chat.title);
  };

  const cancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(null);
  };

  const submitRename = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (renameTitle.trim()) {
      onRenameChat(chatId, renameTitle.trim());
    }
    setEditingChatId(null);
  };

  return (
    <aside 
      id="sidebar-panel"
      className={`w-80 flex flex-col justify-between shrink-0 z-20 border-r transition-all duration-300 ${theme === 'dark' ? 'glass-dark border-white/5 text-gray-200' : 'glass-dark-light border-black/5 text-gray-800'}`}
    >
      {/* Top Section */}
      <div className="flex flex-col flex-1 min-h-0">
        
        {/* Brand / Logo */}
        <div className={`h-16 flex items-center justify-between px-6 border-b ${theme === 'dark' ? 'border-white/5' : 'border-black/5'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white shadow-md">
              <span className="text-sm font-bold">V</span>
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Vedix AI
            </span>
          </div>

          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'}`}>
            {user.role === 'admin' ? 'Admin' : user.subscription.toUpperCase()}
          </span>
        </div>

        {/* Primary Action Button */}
        <div className="p-4">
          <button
            id="sidebar-new-chat-btn"
            onClick={() => {
              setActiveTab('chat');
              onCreateChat();
            }}
            className={`w-full py-3 px-4 rounded-xl text-sm font-medium flex items-center justify-center space-x-2 hover:bg-white/10 transition-all cursor-pointer ${theme === 'dark' ? 'glass text-white' : 'glass-light text-gray-900 bg-white/30'}`}
          >
            <Plus className="w-4 h-4" />
            <span>New Chat Session</span>
          </button>
        </div>

        {/* Tab Navigation (Main Apps) */}
        <div className="px-4 space-y-1 mb-3">
          <button
            id="tab-chat"
            onClick={() => setActiveTab('chat')}
            className={`w-full py-2.5 px-4 rounded-xl flex items-center space-x-3 text-sm font-semibold transition-all ${activeTab === 'chat' ? (theme === 'dark' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-indigo-500/15 text-indigo-700 border border-indigo-500/20') : (theme === 'dark' ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-black/5 text-gray-600')}`}
          >
            <MessageSquare className="w-4.5 h-4.5 text-indigo-400" />
            <span>AI Chatbot</span>
          </button>

          <button
            id="tab-image"
            onClick={() => setActiveTab('image')}
            className={`w-full py-2.5 px-4 rounded-xl flex items-center space-x-3 text-sm font-semibold transition-all ${activeTab === 'image' ? (theme === 'dark' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-indigo-500/15 text-indigo-700 border border-indigo-500/20') : (theme === 'dark' ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-black/5 text-gray-600')}`}
          >
            <ImageIcon className="w-4.5 h-4.5 text-purple-400" />
            <span>Image Studio</span>
          </button>

          {user.role === 'admin' && (
            <button
              id="tab-admin"
              onClick={() => setActiveTab('admin')}
              className={`w-full py-2.5 px-4 rounded-xl flex items-center space-x-3 text-sm font-semibold transition-all ${activeTab === 'admin' ? (theme === 'dark' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-indigo-500/15 text-indigo-700 border border-indigo-500/20') : (theme === 'dark' ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-black/5 text-gray-600')}`}
            >
              <ShieldAlert className="w-4.5 h-4.5 text-rose-400" />
              <span>Admin Dashboard</span>
            </button>
          )}
        </div>

        {/* Chat History Header & Search */}
        {activeTab === 'chat' && (
          <div className={`flex-1 flex flex-col min-h-0 border-t ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} pt-4`}>
            <div className="px-4 mb-3">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chats..."
                  className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs outline-none transition-all ${theme === 'dark' ? 'prompt-input-glass text-white focus:border-white/20' : 'prompt-input-glass-light text-gray-900 focus:border-black/20'}`}
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-1.5 custom-scrollbar">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-1">Recent Chats</p>
              {filteredChats.length === 0 ? (
                <p className="text-xs text-center text-gray-500 py-6">No chat sessions found.</p>
              ) : (
                filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => {
                      setActiveTab('chat');
                      onSelectChat(chat.id);
                    }}
                    className={`group relative rounded-xl py-2.5 px-3 flex items-center justify-between cursor-pointer border transition-all ${activeChatId === chat.id ? (theme === 'dark' ? 'bg-white/10 border-white/20 text-white shadow-sm' : 'bg-black/5 border-black/10 text-gray-950') : (theme === 'dark' ? 'bg-white/2 border-transparent hover:bg-white/5 text-gray-400' : 'bg-black/2 border-transparent hover:bg-black/5 text-gray-600')}`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                      <MessageSquare className="w-4 h-4 flex-shrink-0 text-indigo-400/80" />
                      {editingChatId === chat.id ? (
                        <input
                          autoFocus
                          type="text"
                          value={renameTitle}
                          onChange={(e) => setRenameTitle(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') submitRename(chat.id, e as any);
                            if (e.key === 'Escape') cancelRename(e as any);
                          }}
                          className="bg-transparent border-b border-indigo-500 outline-none text-xs text-white flex-1 py-0.5"
                        />
                      ) : (
                        <span className={`text-xs font-semibold truncate flex-1 leading-tight ${activeChatId === chat.id ? (theme === 'dark' ? 'text-white' : 'text-gray-900') : 'text-slate-300'}`}>
                          {chat.title}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingChatId === chat.id ? (
                        <>
                          <button
                            onClick={(e) => submitRename(chat.id, e)}
                            className="p-1 text-emerald-400 hover:bg-emerald-500/10 rounded"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => cancelRename(e)}
                            className="p-1 text-rose-400 hover:bg-rose-500/10 rounded"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={(e) => startRename(chat, e)}
                            className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
                            title="Rename"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteChat(chat.id);
                            }}
                            className="p-1 hover:bg-rose-500/10 rounded text-slate-400 hover:text-rose-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className={`p-4 border-t ${theme === 'dark' ? 'border-white/5' : 'border-black/5'}`}>
        
        {/* Token stats placeholder */}
        <div className={`p-3 rounded-xl mb-4 border ${theme === 'dark' ? 'glass-card border-white/5' : 'glass-card-light border-black/5 bg-white/40'}`}>
          <div className="flex justify-between items-center text-xs font-semibold text-gray-400 mb-1.5">
            <span className="flex items-center space-x-1.5">
              <BarChart className="w-3.5 h-3.5 text-indigo-400" />
              <span>Token Usage Balance</span>
            </span>
            <span className="text-indigo-400">84%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5 mb-1 overflow-hidden">
            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '84%' }} />
          </div>
          <p className="text-[10px] text-gray-500 font-medium">
            {user.totalTokensUsed.toLocaleString()} / {user.subscription === 'free' ? '5,000' : 'Unlimited'} tokens
          </p>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <img 
              src={user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120"} 
              alt="Avatar" 
              className="w-8 h-8 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold truncate text-slate-200 leading-tight">{user.name}</p>
              <p className="text-[10px] text-indigo-400 truncate leading-tight mt-0.5">Pro Plan • Admin</p>
            </div>
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={onOpenSettings}
              className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white"
              title="Settings"
            >
              <Settings className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={onLogout}
              className="p-1.5 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-400"
              title="Sign Out"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
