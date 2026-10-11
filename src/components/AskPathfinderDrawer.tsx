/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Copy,
  Check,
  Download,
  RotateCcw,
  Square,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Briefcase,
  HelpCircle,
  Zap,
  Target,
  Volume2,
  VolumeX
} from 'lucide-react';
import { CareerPath } from '../data/careerDatabase';
import { StudentProfile } from '../types/student';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  followUps?: string[];
  isStreaming?: boolean;
}

interface AskPathfinderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeCareer: CareerPath | null;
  profile: StudentProfile;
}

function parseSuggestions(rawText: string): { cleanText: string; suggestions: string[] } {
  const lines = rawText.split('\n');
  const suggestions: string[] = [];
  const cleanLines: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('SUGGESTION:')) {
      const q = trimmed.replace(/^SUGGESTION:\s*/, '').trim();
      if (q && !suggestions.includes(q)) suggestions.push(q);
    } else {
      cleanLines.push(line);
    }
  }
  
  return { 
    cleanText: cleanLines.join('\n').replace(/\n{3,}/g, '\n\n').trim(), 
    suggestions 
  };
}

/**
 * Formatted message renderer ensuring bold text and bullets
 * have crisp contrast in both light mode and dark mode.
 */
function FormattedMessage({ text, isStreaming }: { text: string; isStreaming?: boolean }) {
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed text-xs">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        const isBullet = trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ');
        const cleanLine = isBullet ? trimmed.replace(/^[•\-*]\s*/, '') : trimmed;

        // Split by **bold**
        const parts = cleanLine.split(/(\*\*[^*]+\*\*)/g);
        const renderedParts = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-bold text-[var(--text-primary)] dark:text-white">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-0.5">
              <span className="text-[#b85d24] font-bold select-none shrink-0 leading-tight">•</span>
              <span className="text-[var(--text-primary)] dark:text-neutral-100 flex-1">{renderedParts}</span>
            </div>
          );
        }

        return (
          <p key={idx} className="text-[var(--text-primary)] dark:text-neutral-100">
            {renderedParts}
            {isStreaming && idx === lines.length - 1 && (
              <span className="inline-block w-1.5 h-3.5 bg-[#b85d24] ml-1 animate-pulse align-middle" />
            )}
          </p>
        );
      })}
    </div>
  );
}

export const AskPathfinderDrawer: React.FC<AskPathfinderDrawerProps> = ({
  isOpen,
  onClose,
  activeCareer,
  profile,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [selectedContext, setSelectedContext] = useState<CareerPath | null>(activeCareer);
  const [activeCategory, setActiveCategory] = useState<'all' | 'exams' | 'strategy' | 'scholarships' | 'career'>('all');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync selectedContext with activeCareer prop changes
  useEffect(() => {
    setSelectedContext(activeCareer);
  }, [activeCareer]);

  const storageKey = `guidley_counseling_chat_${selectedContext ? selectedContext.id : 'general'}`;

  // Initialize or restore chat when selectedContext changes
  useEffect(() => {
    // Check if we have a saved conversation in sessionStorage
    try {
      const cached = sessionStorage.getItem(storageKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch {
      // Fallback to default initial message
    }

    if (selectedContext) {
      setMessages([
        {
          id: 'welcome-msg',
          role: 'assistant',
          content: `Hello ${profile.studentName || 'Student'}! I am Guidley, your educational advisor.\n\nWe are actively analyzing **${selectedContext.title}**. With your background in **${profile.streamOrMajor}** and academic score of **${profile.academicScore}${profile.academicScoreType === 'cgpa' ? ' CGPA' : '%'}**, ask me anything about:\n• Official national entrance exams (${selectedContext.keyExams.map((e) => e.name).join(', ')})\n• Real category cutoffs & NIRF Tier-1 colleges\n• 6-month revision strategy & syllabus priorities`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          followUps: [
            `What is a realistic cutoff rank in ${selectedContext.keyExams[0]?.name || 'the entrance exam'}?`,
            `How should I structure my daily study routine for this?`,
            `What are the top NIRF institutes for this career?`
          ],
        },
      ]);
    } else {
      setMessages([
        {
          id: 'welcome-msg-gen',
          role: 'assistant',
          content: `Hello ${profile.studentName || 'Student'}! I am Guidley, your advisor.\n\nI can help you navigate Indian stream selection, board exam vs entrance balancing, admission counseling procedures (JoSAA/MCC), state quotas, and national scholarships. What would you like to explore?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          followUps: [
            profile.userType === 'school'
              ? 'How do I balance Class 12 Boards with entrance mocks?'
              : 'What are the highest ROI placement skills in India right now?',
            'What national scholarships (NSP, PMSSS) are open?',
            'How do category reservations and state quotas work?'
          ],
        },
      ]);
    }
  }, [storageKey, selectedContext, profile.streamOrMajor, profile.academicScore, profile.studentName, profile.userType]);

  // Persist conversation to sessionStorage when completed
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(messages));
      } catch {
        // Ignore quota exceptions
      }
    }
  }, [messages, isLoading, storageKey]);

  // Scroll to bottom when messages change or streaming updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Close on Escape key & cancel speech
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Cleanup abort controller and speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setMessages((prev) => 
      prev.map((msg) => msg.isStreaming ? { ...msg, isStreaming: false } : msg)
    );
  };

  const handleSpeak = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanForSpeech = text.replace(/\*\*/g, '').replace(/SUGGESTION:.*$/gm, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanForSpeech);
    utterance.rate = 1.05;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);
    window.speechSynthesis.speak(utterance);
    setSpeakingMessageId(msgId);
  };

  const handleResetChat = () => {
    handleStopGeneration();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    if (selectedContext) {
      setMessages([
        {
          id: 'welcome-reset',
          role: 'assistant',
          content: `Conversation refreshed. What specific detail about **${selectedContext.title}** would you like to explore next?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          followUps: [
            `What is a realistic cutoff rank in ${selectedContext.keyExams[0]?.name || 'the entrance exam'}?`,
            `What is a solid Plan B backup if I miss top cutoffs?`
          ],
        },
      ]);
    } else {
      setMessages([
        {
          id: 'welcome-reset-gen',
          role: 'assistant',
          content: `Conversation refreshed. Ask me any question regarding streams, exams, or career guidance.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          followUps: [
            'Which entrance exams conduct admissions twice a year?',
            'What scholarships cover full college tuition in India?'
          ],
        },
      ]);
    }
  };

  const handleExportTranscript = () => {
    if (messages.length === 0) return;
    const formattedTranscript = messages.map((m) => {
      const speaker = m.role === 'user' ? 'Student' : 'Guidley Advisor';
      return `### ${speaker} (${m.timestamp})\n\n${m.content}\n`;
    }).join('\n---\n\n');

    const header = `# Guidley Advisor — Counseling Transcript\n` +
      `**Student Stream**: ${profile.streamOrMajor}\n` +
      `**Active Career**: ${selectedContext?.title || 'General Advising'}\n` +
      `**Exported At**: ${new Date().toLocaleString()}\n\n---\n\n`;

    const blob = new Blob([header + formattedTranscript], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Guidley_Counseling_Notes_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyMessage = async (msgId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(msgId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt || isLoading) return;

    // Abort any ongoing stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const userMessage: Message = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const assistantMsgId = 'ast-' + Date.now();
    const initialAssistantMessage: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, initialAssistantMessage]);
    setInputPrompt('');
    setIsLoading(true);

    let accumulatedRawText = '';

    try {
      // 1. Try Fast Streaming Endpoint first
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortController.signal,
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
          activeCareer: selectedContext,
          profile,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Streaming connection failed, falling back to standard endpoint');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('data:')) {
            const dataStr = trimmedLine.replace(/^data:\s*/, '').trim();
            if (dataStr === '[DONE]') {
              continue;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                accumulatedRawText += parsed.text;
                const { cleanText } = parseSuggestions(accumulatedRawText);

                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, content: cleanText || accumulatedRawText }
                      : m
                  )
                );
              }
            } catch {
              // Ignore non-json pulse
            }
          }
        }
      }

      // Finalize suggestions extraction
      const { cleanText, suggestions } = parseSuggestions(accumulatedRawText);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                content: cleanText || accumulatedRawText || 'Ready to assist you with further questions.',
                followUps: suggestions.length > 0 ? suggestions : undefined,
                isStreaming: false,
              }
            : m
        )
      );
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User aborted intentionally
        return;
      }
      console.warn('Streaming error, trying standard fallback:', err);

      // Fallback to standard /api/chat
      try {
        const fallbackRes = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
            activeCareer: selectedContext,
            profile,
          }),
        });

        if (!fallbackRes.ok) throw new Error('Fallback failed');
        const data = await fallbackRes.json();
        const { cleanText, suggestions } = parseSuggestions(data.reply || '');

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content: cleanText || 'I am ready to help you navigate your educational roadmap.',
                  followUps: suggestions,
                  isStreaming: false,
                }
              : m
          )
        );
      } catch (fallbackErr) {
        console.error('All chat attempts failed:', fallbackErr);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content: `Regarding **${selectedContext?.title || 'your chosen pathway'}**:\n\n• **Strategic Priority**: Master foundational syllabus chapters and solve at least 5 years of Previous Year Questions (PYQs).\n• **Mock Test Routine**: Dedicate weekend mornings to full-length timed tests.\n• **Admissions Safety**: Track official notification schedules on state counseling and national test agency portals.`,
                  followUps: [
                    'What are the official registration dates?',
                    'What are the safe cutoffs for premier Tier 1 colleges?'
                  ],
                  isStreaming: false,
                }
              : m
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Structured starter suggestions categorized by topic
  const categorizedPrompts = {
    exams: [
      selectedContext
        ? `What is a realistic cutoff rank in ${selectedContext.keyExams[0]?.name || 'the primary entrance exam'}?`
        : 'Which entrance exams should I prioritize for my stream?',
      'How many previous year question papers (PYQs) should I solve?',
      'What are the marking schemes, negative marking, and time per question?',
    ],
    strategy: [
      profile.userType === 'school'
        ? 'How do I balance 12th Board exam prep with competitive mock tests?'
        : 'How do I manage semester university coursework alongside entrance prep?',
      'How should I structure a 6-month revision sprint with weekly mocks?',
      'What is a solid Plan B backup if I miss premier Tier 1 cutoffs?',
    ],
    scholarships: [
      'What national scholarships (NSP, PMSSS, state fee waivers) are available?',
      'How do institutional tuition waivers and merit fellowships work?',
      'What documents are mandatory for scholarship income certification?',
    ],
    career: [
      profile.userType === 'college'
        ? 'How do I prepare for off-campus tech and corporate hiring drives?'
        : 'What are the expected entry-level and senior salaries in this field?',
      'What portfolio projects or certifications impress Indian recruiters?',
      'What are the top NIRF-ranked institutions with best placement records?',
    ],
  };

  const currentPrompts = activeCategory === 'all'
    ? [
        categorizedPrompts.exams[0],
        categorizedPrompts.strategy[0],
        categorizedPrompts.scholarships[0],
        categorizedPrompts.career[0],
      ]
    : categorizedPrompts[activeCategory];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Guidley Advisor">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Slide-in Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="relative w-full max-w-xl h-full bg-[var(--bg-card)] border-l border-[var(--border-subtle)] flex flex-col z-10 shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="p-5 sm:p-6 border-b border-[var(--border-subtle)] bg-[#fdfbf8] dark:bg-[#1a1715] flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#f5ede2] dark:bg-[#2c2621] text-[#b85d24] border border-[#e6d8c8] dark:border-[#3e342c] flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">
                      Guidley Advisor
                    </h3>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#faefe4] dark:bg-[#34271e] text-[#b85d24] border border-[#ebd6c3]">
                      <Zap className="w-2.5 h-2.5 stroke-[2.5]" /> Fast AI
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Calm, grounded Indian education and career intelligence
                  </p>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleExportTranscript}
                  title="Export notes as Markdown"
                  className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[#f4ebe0] dark:hover:bg-[#28231f] transition-colors cursor-pointer"
                  aria-label="Export notes"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetChat}
                  title="Reset conversation"
                  className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[#f4ebe0] dark:hover:bg-[#28231f] transition-colors cursor-pointer"
                  aria-label="Reset conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[#f4ebe0] dark:hover:bg-[#28231f] transition-colors cursor-pointer"
                  aria-label="Close Guidley Advisor"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Context Indicator Strip */}
            <div className="px-5 py-2.5 bg-[#f7f2ea] dark:bg-[#211b17] border-b border-[var(--border-subtle)] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 overflow-hidden">
                <Target className="w-3.5 h-3.5 text-[#b85d24] shrink-0" />
                <span className="text-[var(--text-muted)] shrink-0 font-medium">Context:</span>
                <span className="font-semibold text-[var(--text-primary)] truncate">
                  {selectedContext ? selectedContext.title : 'General Counseling'}
                </span>
              </div>

              {selectedContext ? (
                <button
                  type="button"
                  onClick={() => setSelectedContext(null)}
                  className="text-[11px] font-semibold text-[#b85d24] hover:underline shrink-0 ml-3 cursor-pointer"
                >
                  Switch to General
                </button>
              ) : activeCareer ? (
                <button
                  type="button"
                  onClick={() => setSelectedContext(activeCareer)}
                  className="text-[11px] font-semibold text-[#b85d24] hover:underline shrink-0 ml-3 cursor-pointer"
                >
                  Focus on {activeCareer.title.slice(0, 15)}...
                </button>
              ) : null}
            </div>

            {/* Messages Thread Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-xl bg-[#f5ede2] dark:bg-[#2c2621] border border-[#e6d8c8] dark:border-[#3e342c] text-[#b85d24] flex items-center justify-center shrink-0 text-xs mt-1">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] rounded-3xl p-5 text-xs leading-relaxed transition-all shadow-xs ${
                      msg.role === 'user'
                        ? 'bg-[#b85d24] text-white rounded-tr-none'
                        : 'bg-[#faf6f0] dark:bg-[#231f1c] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-tl-none'
                    }`}
                  >
                    {/* Message Content with Markdown & Crisp Formatting */}
                    <div className="font-medium space-y-1">
                      {msg.role === 'user' ? (
                        <div className="whitespace-pre-line text-white font-medium">{msg.content}</div>
                      ) : (
                        <FormattedMessage text={msg.content} isStreaming={msg.isStreaming} />
                      )}
                    </div>

                    {/* Footer Row: Timestamp + Listen Audio + Copy Button */}
                    <div className="flex items-center justify-between gap-3 mt-3 pt-2 border-t border-black/5 dark:border-white/5 text-[10px]">
                      <span className={msg.role === 'user' ? 'text-white/70' : 'text-[var(--text-muted)]'}>
                        {msg.timestamp}
                      </span>

                      {msg.role === 'assistant' && !msg.isStreaming && msg.content && (
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleSpeak(msg.id, msg.content)}
                            className="flex items-center gap-1 text-[var(--text-muted)] hover:text-[#b85d24] transition-colors cursor-pointer"
                            title={speakingMessageId === msg.id ? 'Stop reading' : 'Listen / Read aloud'}
                          >
                            {speakingMessageId === msg.id ? (
                              <>
                                <VolumeX className="w-3 h-3 text-[#b85d24]" />
                                <span className="text-[#b85d24] font-semibold">Stop</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3" />
                                <span>Listen</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
                            className="flex items-center gap-1 text-[var(--text-muted)] hover:text-[#b85d24] transition-colors cursor-pointer"
                            title="Copy response"
                          >
                            {copiedMessageId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-600 font-semibold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Suggested Interactive Follow-up Questions */}
                    {msg.role === 'assistant' && msg.followUps && msg.followUps.length > 0 && !msg.isStreaming && (
                      <div className="mt-3.5 pt-3 border-t border-[var(--border-subtle)] space-y-2">
                        <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider flex items-center gap-1">
                          <HelpCircle className="w-3 h-3 text-[#b85d24]" /> Suggested Next Questions:
                        </span>
                        <div className="flex flex-col gap-1.5">
                          {msg.followUps.map((question, qIdx) => (
                            <button
                              key={qIdx}
                              type="button"
                              onClick={() => handleSendMessage(question)}
                              className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-[#2b2520] hover:bg-[#faefe4] dark:hover:bg-[#34271e] text-[11px] font-semibold text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[#b85d24] transition-all flex items-center justify-between gap-2 cursor-pointer group"
                            >
                              <span>{question}</span>
                              <ArrowRight className="w-3 h-3 text-[var(--text-muted)] group-hover:text-[#b85d24] shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-xl bg-[#ede4d6] dark:bg-[#2a2522] text-[var(--text-secondary)] flex items-center justify-center shrink-0 text-xs mt-1">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {/* Streaming Indicator */}
              {isLoading && (
                <div className="flex items-center justify-between pl-2">
                  <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs">
                    <span className="w-2 h-2 rounded-full bg-[#b85d24] animate-ping" />
                    <span className="font-medium">Streaming answer from advisor...</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleStopGeneration}
                    className="flex items-center gap-1 px-3 py-1 rounded-xl bg-[#faefe4] dark:bg-[#2d241e] text-[#b85d24] text-[11px] font-semibold border border-[#ecd5c3] hover:bg-[#f5e2d0] transition-colors cursor-pointer"
                  >
                    <Square className="w-3 h-3 fill-current" />
                    <span>Stop</span>
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Categorized Starter Prompt Tray */}
            <div className="p-4 border-t border-[var(--border-subtle)] bg-[#fbf7f2] dark:bg-[#1a1715] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                  Quick Counseling Prompts:
                </span>

                {/* Category Pills */}
                <div className="flex items-center gap-1 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setActiveCategory('all')}
                    className={`px-2 py-0.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                      activeCategory === 'all'
                        ? 'bg-[#b85d24] text-white'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('exams')}
                    className={`px-2 py-0.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                      activeCategory === 'exams'
                        ? 'bg-[#b85d24] text-white'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    Exams
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('strategy')}
                    className={`px-2 py-0.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                      activeCategory === 'strategy'
                        ? 'bg-[#b85d24] text-white'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    Strategy
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('scholarships')}
                    className={`px-2 py-0.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                      activeCategory === 'scholarships'
                        ? 'bg-[#b85d24] text-white'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    Aid
                  </button>
                </div>
              </div>

              {/* Horizontal Scroll Prompts */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {currentPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    className="px-3.5 py-1.5 rounded-xl bg-[var(--bg-card)] hover:bg-[#ede3d5] dark:hover:bg-[#2d2621] text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] whitespace-nowrap border border-[var(--border-subtle)] transition-colors shadow-xs cursor-pointer font-medium"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-4 sm:p-5 border-t border-[var(--border-subtle)] flex items-center gap-3 bg-[var(--bg-card)]"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask about cutoffs, syllabus, quotas, or prep routines..."
                className="flex-1 px-4 py-3 rounded-2xl border border-[var(--border-subtle)] bg-[#f9f5ee] dark:bg-[#1c1917] text-xs text-[var(--text-primary)] focus:border-[#b85d24] outline-none font-medium"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isLoading}
                className="p-3 rounded-2xl bg-[#b85d24] hover:bg-[#9c4c19] disabled:opacity-50 text-white font-semibold transition-transform active:scale-95 shadow-xs cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
