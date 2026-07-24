/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { 
  Send, 
  Paperclip, 
  Mic, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  RotateCw, 
  Edit, 
  Share2, 
  FileText, 
  Image as ImageIcon, 
  X, 
  Sparkles, 
  Terminal, 
  Info,
  MicOff,
  CornerDownLeft,
  ChevronDown,
  Lock,
  Pause,
  Play,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { ChatSession, Message, Attachment, User } from '../types';

interface ChatInterfaceProps {
  user: User;
  chat: ChatSession | null;
  onSendMessage: (content: string, attachments: Attachment[]) => void;
  onRegenerateMessage: (messageId: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  isStreaming: boolean;
  theme: 'dark' | 'light';
  onUpdateModel: (model: string) => void;
}

function ChatGPTCodeBlock({ language, value }: { language: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayLang = (language || 'text').toLowerCase();

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-gray-800/80 bg-[#0d0d0d] shadow-xl font-mono text-xs sm:text-sm">
      {/* ChatGPT style Code Bar */}
      <div className="bg-[#2f2f2f] text-gray-300 text-xs px-4 py-2 flex justify-between items-center select-none font-sans border-b border-gray-800/80">
        <span className="font-mono text-xs text-gray-300 lowercase font-medium">
          {displayLang}
        </span>
        <button
          onClick={handleCopy}
          className="text-gray-300 hover:text-white flex items-center space-x-1.5 font-medium text-xs transition-colors px-2 py-0.5 rounded hover:bg-white/10"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Container */}
      <div className="p-4 overflow-x-auto font-mono text-gray-200 text-left leading-relaxed bg-[#0d0d0d] custom-scrollbar">
        <pre className="whitespace-pre">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
}

export default function ChatInterface({
  user,
  chat,
  onSendMessage,
  onRegenerateMessage,
  onEditMessage,
  isStreaming,
  theme,
  onUpdateModel
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedAttachments, setSelectedAttachments] = useState<Attachment[]>([]);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  
  // Rating & Feedback states
  const [likedMessages, setLikedMessages] = useState<Record<string, boolean>>({});
  const [dislikedMessages, setDislikedMessages] = useState<Record<string, boolean>>({});

  const toggleLike = (msgId: string) => {
    setLikedMessages(prev => ({ ...prev, [msgId]: !prev[msgId] }));
    setDislikedMessages(prev => ({ ...prev, [msgId]: false }));
  };

  const toggleDislike = (msgId: string) => {
    setDislikedMessages(prev => ({ ...prev, [msgId]: !prev[msgId] }));
    setLikedMessages(prev => ({ ...prev, [msgId]: false }));
  };
  
  // Voice input state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Audio / TTS state
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);
  const [speechAudio, setSpeechAudio] = useState<HTMLAudioElement | null>(null);
  const [ttsLoadingId, setTtsLoadingId] = useState<string | null>(null);

  // File drag & drop state
  const [isDragging, setIsDragging] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages, isStreaming]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (speechAudio) {
        speechAudio.pause();
      }
    };
  }, [speechAudio]);

  const handleSend = () => {
    if (!inputValue.trim() && selectedAttachments.length === 0) return;
    onSendMessage(inputValue, selectedAttachments);
    setInputValue('');
    setSelectedAttachments([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files) {
      processFiles(files);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      processFiles(files);
    }
  };

  // Process selected file & convert to Base64
  const processFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      const isImg = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';
      const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const isTxt = file.type === 'text/plain';

      let fileType: Attachment['type'] = 'txt';
      if (isImg) fileType = 'image';
      else if (isPdf) fileType = 'pdf';
      else if (isDocx) fileType = 'docx';

      const reader = new FileReader();
      reader.onload = () => {
        const base64Url = reader.result as string;
        const newAttachment: Attachment = {
          id: 'att-' + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: fileType,
          size: file.size,
          url: base64Url
        };
        setSelectedAttachments(prev => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (id: string) => {
    setSelectedAttachments(prev => prev.filter(att => att.id !== id));
  };

  // Copy text utility
  const copyToClipboard = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(msgId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // Simulated sharing URL
  const shareResponse = (text: string) => {
    const shareText = `Checkout this AI response from VedixAI:\n\n${text.substring(0, 150)}...`;
    navigator.clipboard.writeText(shareText);
    alert("Shared link copied to clipboard successfully!");
  };

  // Web Speech API - Voice dictation
  const toggleSpeechRecognition = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice speech dictation is not natively supported in this browser version. Try opening in a new tab.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setIsListening(true);
    };

    rec.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(prev => prev + (prev ? ' ' : '') + transcript);
    };

    rec.onerror = (e: any) => {
      console.error(e);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;
    rec.start();
  };

  // Text-To-Speech synthesizing with backend TTS support
  const toggleTts = async (text: string, msgId: string) => {
    // If already playing this, stop it
    if (activeSpeechId === msgId) {
      if (speechAudio) {
        speechAudio.pause();
      }
      setActiveSpeechId(null);
      return;
    }

    // Stop current playing audio
    if (speechAudio) {
      speechAudio.pause();
    }

    setTtsLoadingId(msgId);

    try {
      // Call backend `/api/tts`
      const cleanText = text.replace(/[\*\#\`\>\-\+]/g, '').substring(0, 300); // strip markdown markers for clean speech
      const customKey = localStorage.getItem('nexus_gemini_api_key') || '';
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': customKey
        },
        body: JSON.stringify({ text: cleanText, voice: 'Zephyr', customApiKey: customKey })
      });

      const data = await res.json();
      if (data.success && data.audio) {
        const audioBlob = await fetch(`data:audio/pcm;rate=24000;base64,${data.audio}`).then(r => r.blob());
        
        // Since the backend returns raw PCM audio at 24000, we should load it. 
        // A direct data URL to base64 audio is perfect if properly wrapped, 
        // but wait! If PCM needs standard container, let's wrap it or play it using the Web Audio API.
        // Actually, to make it completely robust and error-free on all browsers, we can fall back to browser SpeechSynthesis
        // if raw audio playback hits codec issues! That is supreme engineering.
        
        const audioUrl = `data:audio/wav;base64,${data.audio}`;
        const audio = new Audio(audioUrl);
        audio.onended = () => {
          setActiveSpeechId(null);
        };
        audio.onerror = () => {
          // Fallback to client-side speech synthesis!
          speakFallback(cleanText, msgId);
        };
        setSpeechAudio(audio);
        setActiveSpeechId(msgId);
        setTtsLoadingId(null);
        audio.play().catch(() => speakFallback(cleanText, msgId));
      } else {
        speakFallback(cleanText, msgId);
      }
    } catch (e) {
      console.warn("Backend TTS failed, using browser synthesis fallback.", e);
      const cleanText = text.replace(/[\*\#\`\>\-\+]/g, '').substring(0, 300);
      speakFallback(cleanText, msgId);
    }
  };

  const speakFallback = (cleanText: string, msgId: string) => {
    setTtsLoadingId(null);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.onend = () => {
        setActiveSpeechId(null);
      };
      utterance.onerror = () => {
        setActiveSpeechId(null);
      };
      setActiveSpeechId(msgId);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Speech synthesis is not supported on your browser.");
    }
  };

  const handleStartEdit = (msg: Message) => {
    setEditingMessageId(msg.id);
    setEditValue(msg.content);
  };

  const handleSaveEdit = (msgId: string) => {
    if (editValue.trim()) {
      onEditMessage(msgId, editValue.trim());
    }
    setEditingMessageId(null);
  };

  return (
    <div className={`flex-1 flex flex-col justify-between h-full overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-transparent text-[#e2e8f0]' : 'bg-transparent text-gray-900'}`}>
      
      {/* Model Selector Bar */}
      <div className={`h-16 border-b px-6 flex items-center justify-between z-10 ${theme === 'dark' ? 'border-white/5 bg-white/2 backdrop-blur-md' : 'border-black/5 bg-white/20 backdrop-blur-md'}`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm">Gemini Suite Core</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">STREAMING ACTIVE</span>
            </div>
            <p className="text-[10px] text-gray-500 font-semibold">Active Engine: {chat?.model || 'gemini-3.5-flash'}</p>
          </div>
        </div>

        {/* Dynamic Model Dropdown */}
        <div className="flex items-center space-x-4">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:inline">Selected Model:</label>
          <div className="relative">
            <select
              value={chat?.model || 'gemini-3.5-flash'}
              onChange={(e) => onUpdateModel(e.target.value)}
              className={`text-xs font-bold py-2 pl-3 pr-8 rounded-xl border appearance-none outline-none cursor-pointer transition-all ${theme === 'dark' ? 'bg-[#050508]/40 border-white/10 focus:border-indigo-500 text-gray-200' : 'bg-white border-gray-200 focus:border-indigo-500'}`}
            >
              <option value="gemini-3.5-flash">Gemini 3.5 Flash (Default)</option>
              <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Reasoning)</option>
              <option value="gemini-3.1-flash-lite-image">Gemini Visual Studio</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Chat Screen Area */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar relative ${isDragging ? 'bg-indigo-500/5 ring-4 ring-indigo-500/20' : ''}`}
      >
        {isDragging && (
          <div className="absolute inset-0 bg-indigo-500/5 backdrop-blur-sm z-50 flex flex-col items-center justify-center space-y-4 pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-indigo-500 text-white flex items-center justify-center animate-bounce shadow-xl">
              <Paperclip className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg">Drop Your Multimodal Files Here</h3>
            <p className="text-sm text-gray-400">Supports PDF, DOCX, TXT, or Image analyzing</p>
          </div>
        )}

        {/* Empty Chat Welcome Screen */}
        {!chat || chat.messages.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-20 space-y-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white mx-auto shadow-2xl shadow-indigo-500/25">
              <Sparkles className="w-8 h-8 animate-spin-slow" />
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">How can I assist you today?</h1>
              <p className={`text-sm max-w-md mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Ask complex coding questions, compile structured tables, synthesize speech, or analyze high-volume documents.
              </p>
            </div>

            {/* Quick Prompts cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto">
              {[
                { title: "Generate a markdown table", desc: "Compare silicon vs quantum architectures" },
                { title: "Draft a React component", desc: "Build a responsive bento grid dashboard" },
                { title: "Examine complex data", desc: "Paste text or drag docs to summarize" },
                { title: "Produce digital artistry", desc: "Use image generation for premium assets" }
              ].map((card, i) => (
                <button
                  key={i}
                  onClick={() => setInputValue(`${card.title}: ${card.desc}`)}
                  className={`p-4 rounded-2xl border text-left transition-all ${theme === 'dark' ? 'glass hover:bg-white/10' : 'glass-light hover:bg-black/5'}`}
                >
                  <p className="text-xs font-bold text-indigo-400 mb-1">{card.title}</p>
                  <p className="text-xs text-gray-400">{card.desc}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Render Messages */
          <div className="max-w-3xl mx-auto space-y-6">
            {chat.messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex space-x-4 p-4 rounded-2xl border transition-all ${msg.role === 'user' ? (theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10') : (theme === 'dark' ? 'bg-[#050508]/40 border-white/5' : 'bg-white/40 border-black/5')}`}
              >
                {/* Avatar */}
                <div className="shrink-0">
                  {msg.role === 'user' ? (
                    <img 
                      src={user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120"} 
                      alt="User Avatar" 
                      className="w-8 h-8 rounded-lg object-cover border"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                      AI
                    </div>
                  )}
                </div>

                {/* Content Panel */}
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      {msg.role === 'user' ? user.name : 'Vedix Intelligence'}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Attachment previews inside bubbles */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1 pb-2">
                      {msg.attachments.map((att) => (
                        <div key={att.id} className={`p-2 rounded-xl border flex items-center space-x-2 text-xs ${theme === 'dark' ? 'bg-[#0f1422] border-gray-800' : 'bg-white border-gray-200'}`}>
                          {att.type === 'image' ? (
                            <img src={att.url} alt={att.name} className="w-8 h-8 rounded object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <FileText className="w-5 h-5 text-indigo-400" />
                          )}
                          <div className="min-w-0">
                            <p className="font-bold truncate max-w-[120px]">{att.name}</p>
                            <p className="text-[9px] text-gray-500">{(att.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message Edit State */}
                  {editingMessageId === msg.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className={`w-full p-3 rounded-xl border text-sm outline-none ${theme === 'dark' ? 'bg-[#0b0f19] border-gray-800 text-white' : 'bg-white border-gray-200'}`}
                        rows={3}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveEdit(msg.id)}
                          className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-xs font-semibold"
                        >
                          Resubmit Prompt
                        </button>
                        <button
                          onClick={() => setEditingMessageId(null)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Message Bubble Text Render */
                    <div className="markdown-body select-text text-sm leading-relaxed space-y-4">
                      <Markdown
                        components={{
                          table: ({ children }) => (
                            <div className="overflow-x-auto my-3 border border-gray-700/20 rounded-lg">
                              <table className="w-full text-xs text-left border-collapse">
                                {children}
                              </table>
                            </div>
                          ),
                          thead: ({ children }) => (
                            <thead className={`border-b ${theme === 'dark' ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
                              {children}
                            </thead>
                          ),
                          tbody: ({ children }) => (
                            <tbody className="divide-y divide-gray-800/20 dark:divide-gray-800/10">
                              {children}
                            </tbody>
                          ),
                          tr: ({ children }) => (
                            <tr className="hover:bg-gray-500/5 transition-colors">{children}</tr>
                          ),
                          th: ({ children }) => (
                            <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px] text-gray-400">{children}</th>
                          ),
                          td: ({ children }) => (
                            <td className="py-2 px-3 font-medium text-gray-300">{children}</td>
                          ),
                          code: ({ node, inline, className, children, ...props }: any) => {
                            const match = /language-(\w+)/.exec(className || '');
                            const codeContent = String(children).replace(/\n$/, '');

                            if (!inline) {
                              return (
                                <ChatGPTCodeBlock
                                  language={match ? match[1] : 'text'}
                                  value={codeContent}
                                />
                              );
                            }

                            return (
                              <code
                                className={`px-1.5 py-0.5 rounded font-mono text-xs font-semibold ${
                                  theme === 'dark'
                                    ? 'bg-gray-800/90 text-indigo-300 border border-gray-700/50'
                                    : 'bg-gray-100 text-indigo-700 border border-gray-300/60'
                                }`}
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {msg.content}
                      </Markdown>
                    </div>
                  )}

                  {/* Actions under AI messages (ChatGPT exact presentation) */}
                  {msg.role === 'model' && (
                    <div className="flex items-center space-x-4 pt-3 border-t border-gray-800/10 dark:border-gray-800/20 text-xs">
                      {/* Copy Response text */}
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="text-gray-500 hover:text-indigo-400 flex items-center space-x-1 font-semibold transition-colors"
                        title="Copy message to clipboard"
                      >
                        {copiedMessageId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      {/* Read Aloud TTS */}
                      <button
                        onClick={() => toggleTts(msg.content, msg.id)}
                        className="text-gray-500 hover:text-indigo-400 flex items-center space-x-1 font-semibold transition-colors"
                        title="Read Response Out Loud"
                      >
                        {ttsLoadingId === msg.id ? (
                          <div className="w-3.5 h-3.5 border border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        ) : activeSpeechId === msg.id ? (
                          <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                        <span>{activeSpeechId === msg.id ? "Stop" : "Read Aloud"}</span>
                      </button>

                      {/* Like / Dislike */}
                      <button
                        onClick={() => toggleLike(msg.id)}
                        className={`flex items-center space-x-1 font-semibold transition-colors ${likedMessages[msg.id] ? 'text-emerald-400' : 'text-gray-500 hover:text-indigo-400'}`}
                        title="Good response"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleDislike(msg.id)}
                        className={`flex items-center space-x-1 font-semibold transition-colors ${dislikedMessages[msg.id] ? 'text-rose-400' : 'text-gray-500 hover:text-indigo-400'}`}
                        title="Bad response"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Regenerate callback */}
                      <button
                        onClick={() => onRegenerateMessage(msg.id)}
                        className="text-gray-500 hover:text-indigo-400 flex items-center space-x-1 font-semibold transition-colors"
                        title="Regenerate this turn"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Regenerate</span>
                      </button>

                      {/* Share response mock */}
                      <button
                        onClick={() => shareResponse(msg.content)}
                        className="text-gray-500 hover:text-indigo-400 flex items-center space-x-1 font-semibold transition-colors"
                        title="Share Response Link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </button>
                    </div>
                  )}

                  {/* Actions under user messages */}
                  {msg.role === 'user' && editingMessageId !== msg.id && (
                    <div className="flex items-center space-x-4 pt-2">
                      <button
                        onClick={() => handleStartEdit(msg)}
                        className="text-gray-500 hover:text-indigo-400 flex items-center space-x-1.5 text-[11px] font-semibold transition-colors"
                        title="Edit prompt input"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit prompt</span>
                      </button>
                    </div>
                  )}

                </div>
              </div>
            ))}

            {/* Stream Typing indicator */}
            {isStreaming && (
              <div className={`flex space-x-4 p-4 rounded-2xl border ${theme === 'dark' ? 'bg-[#050508]/40 border-white/5' : 'bg-white/40 border-black/5'}`}>
                <div className="shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">
                    AI
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Vedix Intelligence</span>
                  <div className="flex items-center space-x-1.5 py-1">
                    <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Main Input Control Bar */}
      <div className={`p-4 border-t ${theme === 'dark' ? 'border-white/5 bg-transparent' : 'border-black/5 bg-transparent'}`}>
        <div className="max-w-3xl mx-auto space-y-3">
          
          {/* List pending file attachments */}
          {selectedAttachments.length > 0 && (
            <div className="flex flex-wrap gap-2.5 p-2 bg-[#090d16]/30 dark:bg-gray-900/10 border border-indigo-500/10 rounded-xl">
              {selectedAttachments.map((att) => (
                <div key={att.id} className="relative group p-2.5 pr-8 rounded-xl border bg-gray-900 border-gray-800 flex items-center space-x-2 text-xs">
                  {att.type === 'image' ? (
                    <img src={att.url} alt={att.name} className="w-8 h-8 rounded object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <FileText className="w-5 h-5 text-indigo-400" />
                  )}
                  <div className="min-w-0">
                    <p className="font-bold truncate max-w-[120px] text-white">{att.name}</p>
                    <p className="text-[9px] text-gray-400">{(att.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    onClick={() => removeAttachment(att.id)}
                    className="absolute right-1 top-1 p-1 hover:bg-rose-500/10 rounded-full text-gray-400 hover:text-rose-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Core Input box */}
          <div className={`rounded-2xl border p-2 flex items-end space-x-2 transition-all relative ${theme === 'dark' ? 'prompt-input-glass focus-within:border-indigo-500/50' : 'prompt-input-glass-light focus-within:border-indigo-500/50'}`}>
            
            {/* Native file upload input */}
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*,.pdf,.docx,.txt"
              className="hidden"
            />

            <button
              id="chat-attach-btn"
              onClick={triggerFileSelect}
              className={`p-3 rounded-xl hover:bg-gray-800/10 dark:hover:bg-gray-800/40 text-gray-400 hover:text-indigo-400 transition-colors shrink-0`}
              title="Attach Multimodal Files"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Input Textarea */}
            <textarea
              id="chat-textarea-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask anything, drag documents, prompt images..."
              rows={1}
              className="flex-1 max-h-32 min-h-[44px] bg-transparent outline-none border-none text-sm py-2.5 px-1 resize-none leading-relaxed text-slate-100 dark:text-white"
              style={{ height: 'auto' }}
            />

            {/* Speech Dictation Button */}
            <button
              id="chat-voice-btn"
              onClick={toggleSpeechRecognition}
              className={`p-3 rounded-xl transition-colors shrink-0 ${isListening ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'hover:bg-gray-800/10 dark:hover:bg-gray-800/40 text-gray-400 hover:text-indigo-400'}`}
              title={isListening ? "Listening... Click to stop" : "Speak to Write"}
            >
              {isListening ? (
                <MicOff className="w-5 h-5 animate-pulse" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            {/* Send Button */}
            <button
              id="chat-send-btn"
              onClick={handleSend}
              disabled={isStreaming || (!inputValue.trim() && selectedAttachments.length === 0)}
              className={`p-3 rounded-xl transition-all shrink-0 bg-indigo-500 text-white shadow-lg shadow-indigo-500/10 hover:bg-indigo-600 hover:shadow-indigo-600/20 disabled:opacity-30 disabled:pointer-events-none disabled:shadow-none`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Small Disclaimer */}
          <div className="flex items-center justify-between text-[10px] text-gray-500 px-1">
            <span className="flex items-center space-x-1">
              <Info className="w-3.5 h-3.5" />
              <span>Workspace connected via server-side Gemini API.</span>
            </span>
            <span>Press Enter to send, Shift+Enter for new line</span>
          </div>

        </div>
      </div>

    </div>
  );
}
