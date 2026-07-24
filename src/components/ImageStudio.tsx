/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  ImageIcon, 
  Maximize2, 
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Clock,
  Trash2,
  X
} from 'lucide-react';

interface GeneratedImage {
  id: string;
  prompt: string;
  aspectRatio: string;
  imageUrl: string;
  timestamp: string;
}

interface ImageStudioProps {
  theme: 'dark' | 'light';
}

export default function ImageStudio({ theme }: ImageStudioProps) {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isLoading, setIsLoading] = useState(false);
  const [activeImage, setActiveImage] = useState<GeneratedImage | null>(null);
  const [gallery, setGallery] = useState<GeneratedImage[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Status updates while loading to keep user engaged
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingPhrases = [
    "Establishing link to Gemini Image Engine...",
    "Analyzing semantic descriptors in prompt...",
    "Injecting spatial parameters and stylistic filters...",
    "Synthesizing pixel diffusion matrix...",
    "Upscaling asset channels to high-fidelity PNG..."
  ];

  useEffect(() => {
    // Load existing generated images from localStorage
    const saved = localStorage.getItem('nexus_generated_images');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as GeneratedImage[];
        setGallery(parsed);
        if (parsed.length > 0) {
          setActiveImage(parsed[0]);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => (prev < loadingPhrases.length - 1 ? prev + 1 : prev));
      }, 2500);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const saveToGallery = (newImg: GeneratedImage) => {
    const updated = [newImg, ...gallery];
    setGallery(updated);
    localStorage.setItem('nexus_generated_images', JSON.stringify(updated));
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setActiveImage(null);

    try {
      const customKey = localStorage.getItem('nexus_gemini_api_key') || '';
      const res = await fetch('/api/images/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': customKey
        },
        body: JSON.stringify({ 
          prompt: prompt.trim(), 
          aspectRatio,
          customApiKey: customKey
        })
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        const newImg: GeneratedImage = {
          id: 'img-' + Math.random().toString(36).substr(2, 9),
          prompt: prompt.trim(),
          aspectRatio,
          imageUrl: data.imageUrl,
          timestamp: new Date().toISOString()
        };
        setActiveImage(newImg);
        saveToGallery(newImg);
        setPrompt('');
      } else {
        alert(data.error || "Failed to generate image. Please check API settings.");
      }
    } catch (e: any) {
      console.error(e);
      alert("Error contacting generator: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = (img: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = img.imageUrl;
    link.download = `nexus-art-${img.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyUrl = (img: GeneratedImage) => {
    navigator.clipboard.writeText(img.imageUrl);
    setCopiedId(img.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteFromGallery = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = gallery.filter(img => img.id !== id);
    setGallery(updated);
    localStorage.setItem('nexus_generated_images', JSON.stringify(updated));
    if (activeImage?.id === id) {
      setActiveImage(updated.length > 0 ? updated[0] : null);
    }
  };

  return (
    <div className={`flex-1 flex flex-col md:flex-row h-full overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-transparent text-[#e2e8f0]' : 'bg-transparent text-gray-900'}`}>
      
      {/* Control Panel (Left Side) */}
      <div className={`w-full md:w-96 flex flex-col justify-between shrink-0 overflow-y-auto p-6 border-r ${theme === 'dark' ? 'glass border-white/5' : 'glass-light border-black/5 bg-white/20'}`}>
        <div className="space-y-6">
          
          {/* Header */}
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <ImageIcon className="w-4 h-4" />
              </div>
              <h2 className="font-extrabold text-lg">AI Image Studio</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Synthesize premium digital assets, graphics, and illustrations using Gemini's high-speed image generation.
            </p>
          </div>

          {/* Prompt input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Describe Your Vision</label>
            <textarea
              required
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A serene mountain landscape at sunset, photorealistic, cinematic volumetric lighting, vaporwave aesthetic, ultra-detailed PNG..."
              className={`w-full p-3.5 rounded-xl border text-sm outline-none transition-all resize-none ${theme === 'dark' ? 'prompt-input-glass focus:border-indigo-500 text-white' : 'prompt-input-glass-light focus:border-indigo-500 text-gray-900'}`}
            />
          </div>

          {/* Aspect Ratio choice */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Aspect Ratio</label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { name: '1:1', ratio: 'square' },
                { name: '3:4', ratio: 'portrait' },
                { name: '4:3', ratio: 'landscape' },
                { name: '9:16', ratio: 'story' },
                { name: '16:9', ratio: 'widescreen' }
              ].map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setAspectRatio(item.name)}
                  className={`py-2 px-1 rounded-lg border text-xs font-bold transition-all text-center flex flex-col items-center justify-center space-y-1.5 ${aspectRatio === item.name ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : (theme === 'dark' ? 'border-white/5 bg-white/2 text-gray-400 hover:border-white/10' : 'border-black/5 bg-black/2 text-gray-600 hover:border-black/10')}`}
                >
                  <span className="text-[10px] uppercase font-bold text-slate-500 leading-none">{item.ratio}</span>
                  <span className="leading-none">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Core generation button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/20 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
          >
            {isLoading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            <span>{isLoading ? "Generating Asset..." : "Generate Asset"}</span>
          </button>
        </div>

        {/* Local storage gallery checklist */}
        <div className={`border-t ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} pt-6 mt-6`}>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Studio Session Assets</span>
          </p>
          <div className="grid grid-cols-3 gap-2.5 max-h-48 overflow-y-auto custom-scrollbar">
            {gallery.length === 0 ? (
              <p className="text-[10px] text-gray-500 col-span-3 text-center py-4">Gallery is empty.</p>
            ) : (
              gallery.map((img) => (
                <div 
                  key={img.id}
                  onClick={() => setActiveImage(img)}
                  className={`group relative aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all ${activeImage?.id === img.id ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-white/5 hover:border-white/10'}`}
                >
                  <img src={img.imageUrl} alt={img.prompt} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={(e) => deleteFromGallery(img.id, e)}
                      className="p-1 rounded bg-rose-500 text-white hover:bg-rose-600"
                      title="Delete asset"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Stage Playground (Right Side) */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-hidden bg-transparent">
        
        {/* Ambient background blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

        {isLoading ? (
          /* Detailed loading states with statuses */
          <div className="max-w-md text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white mx-auto shadow-2xl shadow-indigo-500/20 animate-pulse">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-lg text-white">Synthesizing Digital Asset</h3>
              <p className="text-xs text-indigo-400 font-mono animate-pulse">{loadingPhrases[loadingStep]}</p>
            </div>
          </div>
        ) : activeImage ? (
          /* Active Image presentation with full utilities */
          <div className="max-w-2xl w-full flex flex-col items-center space-y-6">
            <div className={`relative max-h-[60vh] rounded-2xl overflow-hidden shadow-2xl border flex items-center justify-center p-1.5 ${theme === 'dark' ? 'code-block-glass' : 'code-block-glass-light'}`}>
              <img 
                src={activeImage.imageUrl} 
                alt={activeImage.prompt} 
                className="rounded-xl object-contain max-h-[50vh] max-w-full"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 right-4 flex items-center space-x-2 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setFullscreenImage(activeImage.imageUrl)}
                  className="p-2.5 bg-black/60 hover:bg-black/80 rounded-xl text-white backdrop-blur-md"
                  title="Fullscreen preview"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Metadata Panel */}
            <div className={`w-full border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${theme === 'dark' ? 'glass-card border-white/5' : 'glass-card-light border-black/5 bg-white/40'}`}>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">PROMPT SUMMARY</p>
                <p className={`text-xs font-semibold leading-relaxed line-clamp-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>{activeImage.prompt}</p>
                <p className="text-[10px] text-gray-500 mt-1 font-semibold font-mono">Aspect Ratio: {activeImage.aspectRatio} | 24-bit RGB PNG</p>
              </div>

              <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => copyUrl(activeImage)}
                  className={`flex-1 sm:flex-none py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 ${theme === 'dark' ? 'glass text-gray-300 border-white/10 hover:bg-white/10' : 'glass-light text-gray-700 border-black/10 hover:bg-black/5'}`}
                >
                  {copiedId === activeImage.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Base64 Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Base64</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => downloadImage(activeImage)}
                  className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-xs font-semibold flex items-center justify-center space-x-1.5 text-white shadow-lg shadow-indigo-500/15"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Art</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Clean empty stage state */
          <div className="max-w-sm text-center space-y-4">
            <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto ${theme === 'dark' ? 'glass border-white/5 text-gray-400' : 'glass-light border-black/5 text-gray-500'}`}>
              <ImageIcon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className={`font-extrabold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Art Studio Stage</h3>
              <p className="text-xs text-gray-500">
                Type in an aesthetic visual prompt and select your desired aspect ratio to populate the stage.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Image Preview Dialog */}
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6">
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <img src={fullscreenImage} alt="Fullscreen view" className="max-w-full max-h-full rounded-lg object-contain" referrerPolicy="no-referrer" />
        </div>
      )}

    </div>
  );
}
