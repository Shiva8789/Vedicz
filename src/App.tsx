/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginSignup from './components/LoginSignup';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import ImageStudio from './components/ImageStudio';
import AdminDashboard from './components/AdminDashboard';
import SettingsModal from './components/SettingsModal';
import { ChatSession, Message, User, Attachment } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState<'chat' | 'image' | 'admin'>('chat');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [user, setUser] = useState<User | null>(null);

  // Chats states
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize: Load session from LocalStorage
  useEffect(() => {
    // Load theme
    const savedTheme = localStorage.getItem('nexus_theme');
    if (savedTheme) {
      setTheme(savedTheme as 'dark' | 'light');
    }

    // Load logged-in user
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser) as User;
        if (parsed.role === 'admin' && (parsed.name.includes('Demo') || parsed.name.includes('Admin'))) {
          parsed.name = 'Shiva Chauhan';
          parsed.email = 'shivac917067@gmail.com';
        }
        setUser(parsed);
        setView('dashboard');
      } catch (e) {
        console.error(e);
      }
    } else {
      // Default admin user Shiva Chauhan
      const defaultUser: User = {
        id: 'usr-admin-1',
        email: 'shivac917067@gmail.com',
        name: 'Shiva Chauhan',
        avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120',
        role: 'admin',
        subscription: 'premium',
        createdAt: new Date().toISOString(),
        chatCount: 142,
        totalTokensUsed: 512000
      };
      setUser(defaultUser);
      localStorage.setItem('nexus_user', JSON.stringify(defaultUser));
      setView('dashboard');
    }

    // Load existing chats
    const savedChats = localStorage.getItem('nexus_chats');
    if (savedChats) {
      try {
        const parsed = JSON.parse(savedChats) as ChatSession[];
        setChats(parsed);
        if (parsed.length > 0) {
          setActiveChatId(parsed[0].id);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Sync theme with HTML document class for dark/light transitions
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('nexus_theme', theme);
  }, [theme]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('nexus_user');
    setUser(null);
    setView('landing');
    setActiveTab('chat');
  };

  // Handle successful login
  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('dashboard');

    // Create a default session if no chats exist
    if (chats.length === 0) {
      const defaultChat: ChatSession = {
        id: 'chat-init-default',
        title: "Platform Overview Chat",
        userId: loggedInUser.id,
        messages: [
          {
            id: 'msg-init-1',
            role: 'model',
            content: `Welcome back, **${loggedInUser.name}**! I am **VedixAI**, your highly premium connected workspace companion.\n\nHere are some of the actions we can complete together:\n- **SSE Streams:** Real-time text streams with Typing animations.\n- **Multimodal Uploads:** Drag and drop **PDFs, Word documents, text files, or images** directly into the input bar to chat with them.\n- **Image Studio:** Synthesize high-fidelity digital art using our specialized tab.\n- **Speech Output:** Synthesize warm voices reading responses aloud utilizing Gemini TTS.\n- **Control Panel:** Check detailed usage metrics or toggle **Admin Mode** in Settings to audit the organization's workloads.\n\nWhat are we building today?`,
            timestamp: new Date().toISOString()
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        model: 'gemini-3.5-flash'
      };
      const updatedChats = [defaultChat];
      setChats(updatedChats);
      setActiveChatId(defaultChat.id);
      localStorage.setItem('nexus_chats', JSON.stringify(updatedChats));
    }
  };

  // Create a brand new chat session
  const handleCreateChat = () => {
    if (!user) return;
    const newChatId = 'chat-' + Math.random().toString(36).substr(2, 9);
    const newChat: ChatSession = {
      id: newChatId,
      title: `Prompt Session ${chats.length + 1}`,
      userId: user.id,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      model: chats.length > 0 ? chats[0].model : 'gemini-3.5-flash'
    };
    const updated = [newChat, ...chats];
    setChats(updated);
    setActiveChatId(newChatId);
    localStorage.setItem('nexus_chats', JSON.stringify(updated));
  };

  // Delete an existing chat session
  const handleDeleteChat = (id: string) => {
    const updated = chats.filter(c => c.id !== id);
    setChats(updated);
    localStorage.setItem('nexus_chats', JSON.stringify(updated));
    if (activeChatId === id) {
      setActiveChatId(updated.length > 0 ? updated[0].id : null);
    }
  };

  // Rename a chat title
  const handleRenameChat = (id: string, newTitle: string) => {
    const updated = chats.map(c => {
      if (c.id === id) {
        return { ...c, title: newTitle, updatedAt: new Date().toISOString() };
      }
      return c;
    });
    setChats(updated);
    localStorage.setItem('nexus_chats', JSON.stringify(updated));
  };

  // Update active model for a chat
  const handleUpdateModel = (model: string) => {
    if (!activeChatId) return;
    const updated = chats.map(c => {
      if (c.id === activeChatId) {
        return { ...c, model };
      }
      return c;
    });
    setChats(updated);
    localStorage.setItem('nexus_chats', JSON.stringify(updated));
  };

  // Edit an existing message (Resubmits and truncates chat history after this message)
  const handleEditMessage = async (messageId: string, newContent: string) => {
    if (!activeChatId || !user) return;
    const currentChat = chats.find(c => c.id === activeChatId);
    if (!currentChat) return;

    // Find the message index
    const msgIndex = currentChat.messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return;

    // Truncate history after this user message
    const updatedMessages = currentChat.messages.slice(0, msgIndex);
    
    // Create edited message
    const editedMsg: Message = {
      id: messageId,
      role: 'user',
      content: newContent,
      timestamp: new Date().toISOString(),
      edited: true
    };
    
    updatedMessages.push(editedMsg);

    // Save chat state before streaming starts
    const updatedChats = chats.map(c => {
      if (c.id === activeChatId) {
        return { ...c, messages: updatedMessages, updatedAt: new Date().toISOString() };
      }
      return c;
    });
    setChats(updatedChats);
    localStorage.setItem('nexus_chats', JSON.stringify(updatedChats));

    // Trigger AI generation stream
    triggerStreamGeneration(editedMsg, updatedMessages.slice(0, -1), currentChat.model);
  };

  // Regenerate a message response (Resubmits preceding prompt, truncates after it)
  const handleRegenerateMessage = (messageId: string) => {
    if (!activeChatId || !user) return;
    const currentChat = chats.find(c => c.id === activeChatId);
    if (!currentChat) return;

    const msgIndex = currentChat.messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return;

    // Find the user prompt preceding this model response
    let userPromptIndex = -1;
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (currentChat.messages[i].role === 'user') {
        userPromptIndex = i;
        break;
      }
    }

    if (userPromptIndex === -1) return;

    // Truncate history up to user prompt
    const precedingHistory = currentChat.messages.slice(0, userPromptIndex);
    const userPrompt = currentChat.messages[userPromptIndex];
    
    // Truncate active list to user prompt
    const truncatedMessages = [...precedingHistory, userPrompt];

    const updatedChats = chats.map(c => {
      if (c.id === activeChatId) {
        return { ...c, messages: truncatedMessages, updatedAt: new Date().toISOString() };
      }
      return c;
    });
    setChats(updatedChats);
    localStorage.setItem('nexus_chats', JSON.stringify(updatedChats));

    // Trigger AI stream
    triggerStreamGeneration(userPrompt, precedingHistory, currentChat.model);
  };

  // Send a brand new message in the chat session
  const handleSendMessage = (content: string, attachments: Attachment[]) => {
    if (!activeChatId || !user) return;
    const activeChat = chats.find(c => c.id === activeChatId);
    if (!activeChat) return;

    const userMsg: Message = {
      id: 'msg-user-' + Math.random().toString(36).substr(2, 9),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      attachments
    };

    // Auto rename prompt title if it is default title
    let currentTitle = activeChat.title;
    if (currentTitle.startsWith("Prompt Session") && activeChat.messages.length === 0) {
      currentTitle = content.substring(0, 30) + (content.length > 30 ? "..." : "");
    }

    const updatedMessages = [...activeChat.messages, userMsg];

    const updatedChats = chats.map(c => {
      if (c.id === activeChatId) {
        return { 
          ...c, 
          title: currentTitle, 
          messages: updatedMessages, 
          updatedAt: new Date().toISOString() 
        };
      }
      return c;
    });
    setChats(updatedChats);
    localStorage.setItem('nexus_chats', JSON.stringify(updatedChats));

    // Trigger AI stream
    triggerStreamGeneration(userMsg, activeChat.messages, activeChat.model);
  };

  // Trigger stream call to server-side Gemini API
  const triggerStreamGeneration = async (currentMsg: Message, history: Message[], model: string) => {
    if (!activeChatId || !user) return;
    setIsStreaming(true);

    const modelMsgId = 'msg-model-' + Math.random().toString(36).substr(2, 9);
    
    // Add an empty model response bubble ready for streaming increments
    const initialModelMsg: Message = {
      id: modelMsgId,
      role: 'model',
      content: '',
      timestamp: new Date().toISOString()
    };

    // Pre-inject the message into active state
    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return { ...c, messages: [...c.messages, initialModelMsg] };
      }
      return c;
    }));

    let accumulatedContent = '';

    try {
      const customKey = localStorage.getItem('nexus_gemini_api_key') || '';
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': customKey
        },
        body: JSON.stringify({
          message: currentMsg,
          history: history,
          model: model,
          customApiKey: customKey,
          systemInstruction: "You are VedixAI, an AI assistant created for Shiva Chauhan. Provide short, concise, highly accurate, and direct answers in plain text according strictly to the query. Avoid extra details, unnecessary fluff, or conversational filler. Do NOT put answers in code blocks (```) unless the user explicitly asks for code or programming scripts."
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader!.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);

        // Split chunks by SSE packets
        const lines = chunkValue.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr === '[DONE]') {
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                accumulatedContent += parsed.text;
                
                // Incrementally update current message
                setChats(prev => prev.map(c => {
                  if (c.id === activeChatId) {
                    return {
                      ...c,
                      messages: c.messages.map(m => {
                        if (m.id === modelMsgId) {
                          return { ...m, content: accumulatedContent };
                        }
                        return m;
                      })
                    };
                  }
                  return c;
                }));
              } else if (parsed.error) {
                accumulatedContent += `\n\n[Error from Gemini Engine: ${parsed.error}]`;
                updateModelMessage(modelMsgId, accumulatedContent);
              }
            } catch (e) {
              // chunk incomplete, wait for next buffer merge
            }
          }
        }
      }

      // Finish streaming, commit chats, update metrics
      setIsStreaming(false);
      commitFinalMessageState();
      incrementUserTokens(accumulatedContent.length / 4);

    } catch (error: any) {
      console.error(error);
      setIsStreaming(false);
      accumulatedContent += `\n\n[System Network Connection Error: ${error.message || 'Check terminal logs'}]`;
      updateModelMessage(modelMsgId, accumulatedContent);
      commitFinalMessageState();
    }
  };

  const updateModelMessage = (msgId: string, content: string) => {
    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          messages: c.messages.map(m => {
            if (m.id === msgId) {
              return { ...m, content };
            }
            return m;
          })
        };
      }
      return c;
    }));
  };

  const commitFinalMessageState = () => {
    setChats(currentChats => {
      localStorage.setItem('nexus_chats', JSON.stringify(currentChats));
      return currentChats;
    });
  };

  const incrementUserTokens = (approxTokens: number) => {
    if (!user) return;
    const added = Math.ceil(approxTokens);
    const updated: User = {
      ...user,
      chatCount: user.chatCount + 1,
      totalTokensUsed: user.totalTokensUsed + added
    };
    setUser(updated);
    localStorage.setItem('nexus_user', JSON.stringify(updated));
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('nexus_user', JSON.stringify(updatedUser));
  };

  const activeChat = chats.find(c => c.id === activeChatId) || null;

  return (
    <div className={`min-h-screen flex flex-col font-sans overflow-hidden relative transition-colors duration-300 ${theme === 'dark' ? 'bg-[#050508] text-[#e2e8f0]' : 'bg-[#f8fafc] text-[#0f172a]'}`}>
      {/* Interactive Mesh Gradient background for Frosted Glass theme */}
      <div className={theme === 'dark' ? 'mesh-bg' : 'mesh-bg-light'} />

      <AnimatePresence mode="wait">
        
        {/* LANDING VIEW */}
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            <LandingPage
              theme={theme}
              setTheme={setTheme}
              onGetStarted={() => setView('auth')}
              onLoginClick={() => setView('auth')}
            />
          </motion.div>
        )}

        {/* AUTHENTICATION VIEW */}
        {view === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            <LoginSignup
              theme={theme}
              onBack={() => setView('landing')}
              onSuccess={handleLoginSuccess}
            />
          </motion.div>
        )}

        {/* DASHBOARD USER SPACE */}
        {view === 'dashboard' && user && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex h-screen overflow-hidden"
          >
            {/* Sidebar navigation */}
            <Sidebar
              user={user}
              chats={chats}
              activeChatId={activeChatId}
              onSelectChat={setActiveChatId}
              onCreateChat={handleCreateChat}
              onDeleteChat={handleDeleteChat}
              onRenameChat={handleRenameChat}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              theme={theme}
              setTheme={setTheme}
              onLogout={handleLogout}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />

            {/* Main Application Area (Dynamic based on Tab) */}
            <main className="flex-1 h-full flex flex-col min-w-0 overflow-hidden relative">
              {activeTab === 'chat' && (
                <ChatInterface
                  user={user}
                  chat={activeChat}
                  onSendMessage={handleSendMessage}
                  onRegenerateMessage={handleRegenerateMessage}
                  onEditMessage={handleEditMessage}
                  isStreaming={isStreaming}
                  theme={theme}
                  onUpdateModel={handleUpdateModel}
                />
              )}

              {activeTab === 'image' && (
                <ImageStudio theme={theme} />
              )}

              {activeTab === 'admin' && user.role === 'admin' && (
                <AdminDashboard theme={theme} />
              )}
            </main>

            {/* Profile Settings Modal */}
            {isSettingsOpen && (
              <SettingsModal
                user={user}
                onClose={() => setIsSettingsOpen(false)}
                onUpdateUser={handleUpdateProfile}
                theme={theme}
                setTheme={setTheme}
              />
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
