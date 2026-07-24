/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Cpu, 
  MessageSquare, 
  Image as ImageIcon, 
  Mic, 
  Shield, 
  ChevronDown, 
  ArrowRight,
  Mail,
  Phone,
  CheckCircle,
  HelpCircle,
  BarChart2
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLoginClick: () => void;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
}

export default function LandingPage({ onGetStarted, onLoginClick, theme, setTheme }: LandingPageProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('monthly');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6 text-indigo-500" />,
      title: "Real-time SSE Streaming",
      desc: "Instant typing feedback with ultra-low latency response stream from Google's advanced Gemini models."
    },
    {
      icon: <ImageIcon className="w-6 h-6 text-emerald-500" />,
      title: "AI Image Generation",
      desc: "Produce high-fidelity visuals directly from text using modern image generation technology."
    },
    {
      icon: <Mic className="w-6 h-6 text-amber-500" />,
      title: "Voice Output & TTS",
      desc: "Natural-sounding voice synthesis that reads AI responses aloud, paired with voice dictation input."
    },
    {
      icon: <Cpu className="w-6 h-6 text-rose-500" />,
      title: "Multimodal Document Reading",
      desc: "Seamless support for PDF, DOCX, TXT, and images. Upload any document to chat and summarize instantly."
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-purple-500" />,
      title: "Usage & Token Metrics",
      desc: "Track prompt and completion tokens, image credits, and subscription status on a neat dashboard."
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      title: "Role-Based Administration",
      desc: "Comprehensive Admin Dashboard for tracking subscription tiers, token analytics, and system performance."
    }
  ];

  const pricingTiers = [
    {
      name: "Free",
      price: 0,
      description: "Explore the core features of AI.",
      features: [
        "Access to Gemini 3.5 Flash",
        "100 text messages per day",
        "Standard latency response",
        "Web search grounding",
        "Standard support"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Premium",
      price: billingPeriod === 'monthly' ? 20 : 16,
      description: "Unleash maximum productivity and power.",
      features: [
        "Unrestricted High-speed chats",
        "Access to Pro reasoning models",
        "High-fidelity Image generation",
        "Document uploads (PDF, Word)",
        "Advanced TTS voice engines",
        "Priority 24/7 support"
      ],
      cta: "Upgrade to Premium",
      popular: true
    },
    {
      name: "Enterprise",
      price: billingPeriod === 'monthly' ? 49 : 39,
      description: "For teams requiring secure collaboration.",
      features: [
        "Everything in Premium tier",
        "Admin control panel",
        "Custom API integration endpoints",
        "Relational database sync",
        "SLA guaranteed uptime",
        "Dedicated Account Executive"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const faqs = [
    {
      q: "What is Vedix AI?",
      a: "It's an ultra-premium, full-stack chatbot platform utilizing Google's state-of-the-art Gemini 3 series models. It provides real-time streaming text answers, document analysis, high-fidelity image generation, voice transcription, and beautiful usage analytics."
    },
    {
      q: "How does document upload work?",
      a: "You can drag and drop PDF, DOCX, TXT files, or images into the chat bar. Images are analyzed as multimodal visual parts by the model, while documents are parsed to build prompt context automatically."
    },
    {
      q: "Can I generate high-quality images?",
      a: "Yes! The image generation tab uses Gemini image generation models to turn text prompts into high-quality digital art, complete with aspect ratio customization and immediate download controls."
    },
    {
      q: "Is there voice synthesis?",
      a: "Absolutely. Click the speaker icon on any assistant message to synthesize a warm, premium voice reading the response aloud, utilizing Gemini's TTS model."
    },
    {
      q: "How do I access the Admin Dashboard?",
      a: "Sign in with an admin email account (e.g., admin@nexusai.com or toggle Admin Mode inside settings) to access extensive metrics on user accounts, token counts, active subscriptions, and popular models."
    }
  ];

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.message) {
      setContactSubmitted(true);
      setTimeout(() => {
        setContactSubmitted(false);
        setContactForm({ name: '', email: '', message: '' });
      }, 4000);
    }
  };

  return (
    <div id="landing-container" className={`min-h-screen transition-colors duration-300 font-sans bg-transparent ${theme === 'dark' ? 'text-[#e2e8f0]' : 'text-[#0f172a]'}`}>
      
      {/* Navigation Header */}
      <header id="nav-header" className={`sticky top-0 z-50 backdrop-blur-md border-b ${theme === 'dark' ? 'glass-dark border-white/5 text-white bg-[#050508]/20' : 'glass-light border-black/5 text-gray-950 bg-white/30'} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              VedixAI
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="#features" className={`hover:text-indigo-500 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Features</a>
            <a href="#pricing" className={`hover:text-indigo-500 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Pricing</a>
            <a href="#faq" className={`hover:text-indigo-500 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>FAQ</a>
            <a href="#contact" className={`hover:text-indigo-500 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Contact</a>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Dark / Light Toggle */}
            <button
              id="theme-toggle"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-lg border transition-all ${theme === 'dark' ? 'border-white/5 bg-white/5 text-amber-400 hover:bg-white/10' : 'border-black/5 bg-black/5 text-indigo-600 hover:bg-black/10'}`}
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M6.343 12a6 6 0 1112 0 6 6 0 01-12 0z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>

            <button
              id="nav-login-btn"
              onClick={onLoginClick}
              className={`text-sm font-semibold px-4 py-2 hover:text-indigo-500 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Log in
            </button>
            <button
              id="nav-signup-btn"
              onClick={onGetStarted}
              className="text-sm font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-600/30 transition-all duration-300"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative pt-20 pb-24 overflow-hidden px-6">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none animate-pulse" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-xs font-semibold text-indigo-400 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Introducing Gemini 3.5 High-Speed Core</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-8 leading-[1.1]"
          >
            A Premium Intelligence Suite <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              Engineered For Excellence
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Experience instant AI streams, multimodal document integration, high-fidelity image generation, and speech synthesis—all bound inside a highly polished design.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-5"
          >
            <button
              id="hero-primary-btn"
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold flex items-center justify-center space-x-2.5 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-600/35 hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>Initialize Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#features"
              className={`w-full sm:w-auto px-8 py-4 rounded-xl font-semibold border hover:-translate-y-0.5 transition-all duration-300 text-center ${theme === 'dark' ? 'border-gray-800 bg-[#101726] text-gray-200 hover:bg-[#161f33] hover:border-gray-700' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              Explore Capabilities
            </a>
          </motion.div>

          {/* Clean UI Screenshot Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 relative"
          >
            <div className={`rounded-2xl border p-2.5 ${theme === 'dark' ? 'glass border-white/5' : 'glass-light bg-white/30 border-black/5'} shadow-2xl overflow-hidden`}>
              <div className={`rounded-xl border h-96 w-full relative flex flex-col overflow-hidden ${theme === 'dark' ? 'bg-transparent border-white/5' : 'bg-transparent border-black/5'}`}>
                {/* Simulated Header */}
                <div className={`flex items-center justify-between px-5 py-3 border-b ${theme === 'dark' ? 'bg-white/2 border-white/5' : 'bg-black/2 border-black/5'}`}>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <div className={`text-xs font-mono py-1 px-3 rounded-md ${theme === 'dark' ? 'bg-white/5 text-gray-400' : 'bg-black/5 text-gray-600'}`}>
                    workspace_session.ts
                  </div>
                  <div className="w-16" />
                </div>
                {/* Simulated Chat Area */}
                <div className="flex-1 p-6 flex flex-col justify-end space-y-4 text-left">
                  <div className="max-w-md bg-indigo-500 text-white rounded-2xl rounded-tr-none px-4 py-3 ml-auto text-sm shadow-md">
                    Analyze the latest metrics on quantum computing speedups and output a styled markdown table.
                  </div>
                  <div className={`max-w-xl rounded-2xl rounded-tl-none px-4 py-3 text-sm shadow-sm flex items-start space-x-3 ${theme === 'dark' ? 'bg-white/5 text-gray-300' : 'bg-white/50 text-gray-700'}`}>
                    <div className="w-6 h-6 rounded-md bg-indigo-500 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">AI</div>
                    <div className="space-y-2 flex-1">
                      <p className="font-semibold text-indigo-400">Gemini 3.5 Flash</p>
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-750">
                            <th className="py-1 font-bold">Metric</th>
                            <th className="py-1 font-bold">Speedup</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="py-1">Fourier Transform</td>
                            <td className="py-1 text-emerald-400 font-mono">Exponential (O(2^N))</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className={`py-24 border-t ${theme === 'dark' ? 'border-white/5 bg-transparent' : 'border-black/5 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              A Symphony of Modern AI Features
            </h2>
            <p className={`text-base sm:text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Every capability is integrated into a single seamless, highly interactive web application designed with the user in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <div 
                key={idx}
                className={`p-8 rounded-2xl border hover:shadow-lg transition-all duration-300 ${theme === 'dark' ? 'glass hover:bg-white/10' : 'glass-light bg-white/30 hover:bg-black/5 border-black/5 hover:border-black/10'}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-sm`}>
                  {feat.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 tracking-tight">{feat.title}</h3>
                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Flexible, Transparent Pricing</h2>
            <p className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Upgrade to unleash premium tokens, custom files, and unlimited streaming answers.
            </p>

            {/* Monthly / Annually toggle */}
            <div className="flex items-center justify-center mt-8 space-x-4">
              <span className={`text-sm font-semibold ${billingPeriod === 'monthly' ? 'text-indigo-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Monthly</span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annually' : 'monthly')}
                className={`relative w-14 h-8 rounded-full p-1 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#182133]' : 'bg-gray-300'}`}
              >
                <div className={`w-6 h-6 rounded-full bg-indigo-500 transition-all duration-300 transform ${billingPeriod === 'annually' ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
              <span className={`text-sm font-semibold flex items-center ${billingPeriod === 'annually' ? 'text-indigo-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Annually
                <span className="ml-2 px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 font-bold">Save 20%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {pricingTiers.map((tier, idx) => (
              <div 
                key={idx}
                className={`p-8 rounded-2xl border relative flex flex-col justify-between transition-all duration-300 ${tier.popular ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-xl scale-105 z-10 bg-gradient-to-b ' + (theme === 'dark' ? 'from-white/10 to-white/2 backdrop-blur-md' : 'from-indigo-50/70 to-white/80') : (theme === 'dark' ? 'glass hover:bg-white/10' : 'glass-light bg-white/30 hover:bg-black/5')}`}
              >
                {tier.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-bold tracking-tight mb-2">{tier.name}</h3>
                  <p className={`text-xs mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{tier.description}</p>
                  <div className="flex items-baseline mb-8">
                    <span className="text-4xl font-extrabold tracking-tight">${tier.price}</span>
                    <span className={`text-sm ml-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>/ month</span>
                  </div>
                  <ul className="space-y-4 mb-8 text-sm">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={onGetStarted}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${tier.popular ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : (theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-800')}`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className={`py-24 border-t ${theme === 'dark' ? 'border-white/5 bg-transparent' : 'border-black/5 bg-transparent'}`}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Everything you need to know about the platform's features, limits, and backend setup.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className={`rounded-xl border transition-all ${theme === 'dark' ? 'glass hover:bg-white/5' : 'glass-light bg-white/30 border-black/5'}`}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full py-5 px-6 flex items-center justify-between text-left font-semibold hover:text-indigo-500 transition-colors"
                >
                  <span className="flex items-center space-x-3">
                    <HelpCircle className="w-5 h-5 text-indigo-400" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${activeFaq === idx ? 'transform rotate-180 text-indigo-500' : 'text-gray-400'}`} />
                </button>
                {activeFaq === idx && (
                  <div className={`px-6 pb-6 pt-1 text-sm leading-relaxed border-t ${theme === 'dark' ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-600'}`}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 relative max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
          
          {/* Contact Details */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">Get In Touch</h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Have complex enterprise integration questions? Reach out to our engineers.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Us</p>
                  <a href="mailto:sc276309@gmail.com" className="text-sm font-semibold hover:text-indigo-400 transition-colors">sc276309@gmail.com</a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Call Us</p>
                  <a href="tel:+919170672781" className="text-sm font-semibold hover:text-emerald-400 transition-colors">+91 9170672781</a>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className={`md:col-span-3 p-8 rounded-2xl border ${theme === 'dark' ? 'glass border-white/5' : 'glass-light bg-white/30 border-black/5'} shadow-lg`}>
            {contactSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">Message Transmitted</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Thank you! Our engineering team will review your prompt and contact you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitContact} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Full Name</label>
                    <input
                      required
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Jane Doe"
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${theme === 'dark' ? 'prompt-input-glass text-white' : 'prompt-input-glass-light text-gray-900'}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Address</label>
                    <input
                      required
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="jane@example.com"
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${theme === 'dark' ? 'prompt-input-glass text-white' : 'prompt-input-glass-light text-gray-900'}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Your Message</label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Describe how we can help your team integrate AI..."
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all resize-none ${theme === 'dark' ? 'prompt-input-glass text-white' : 'prompt-input-glass-light text-gray-900'}`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-600/20 transition-all duration-300"
                >
                  <span>Submit Message</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-6 border-t text-center text-xs ${theme === 'dark' ? 'border-gray-900 bg-[#070b13] text-gray-500' : 'border-gray-200 bg-gray-100 text-gray-600'}`}>
        <p>© {new Date().getFullYear()} VedixAI. Crafted for maximum performance and elegance.</p>
        <div className="flex justify-center space-x-6 mt-4 font-semibold text-indigo-400">
          <a href="#features" className="hover:underline">Privacy Policy</a>
          <a href="#pricing" className="hover:underline">Terms of Service</a>
          <a href="#faq" className="hover:underline">Documentation</a>
        </div>
      </footer>
    </div>
  );
}
