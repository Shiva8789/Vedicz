/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
  subscription: 'free' | 'basic' | 'premium' | 'enterprise';
  createdAt: string;
  chatCount: number;
  totalTokensUsed: number;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'docx' | 'txt';
  size: number;
  url: string; // Base64 data-URL or local mock URL
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  tokens?: number;
  attachments?: Attachment[];
  edited?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  userId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  model: string;
}

export interface TokenStats {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  imagesGenerated: number;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalChats: number;
  totalTokens: number;
  totalRevenue: number;
  activeTierDistribution: {
    free: number;
    basic: number;
    premium: number;
    enterprise: number;
  };
  monthlyTokenUsage: { month: string; tokens: number }[];
  modelPopularity: { model: string; count: number }[];
}
