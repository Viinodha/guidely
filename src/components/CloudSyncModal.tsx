/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Cloud, 
  UploadCloud, 
  DownloadCloud, 
  Copy, 
  Check, 
  Smartphone, 
  Laptop, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { StudentProfile } from '../types/student';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  syncToCloud: () => Promise<{ success: boolean; syncCode: string; message: string }>;
  loadFromCloud: (code: string) => Promise<{ success: boolean; message: string }>;
  isSyncing: boolean;
  syncStatus: string | null;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  profile,
  syncToCloud,
  loadFromCloud,
  isSyncing,
  syncStatus,
}) => {
  const [codeToRestore, setCodeToRestore] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isOpen) return null;

  const currentCode = profile.syncCode || 'IND-9428';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBackup = async () => {
    setFeedbackMsg(null);
    const result = await syncToCloud();
    setFeedbackMsg({ text: result.message, error: !result.success });
  };

  const handleRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeToRestore.trim()) return;
    setFeedbackMsg(null);
    const result = await loadFromCloud(codeToRestore.trim().toUpperCase());
    setFeedbackMsg({ text: result.message, error: !result.success });
    if (result.success) {
      setTimeout(() => onClose(), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" role="dialog" aria-modal="true" aria-label="Cloud Synchronization">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-[var(--bg-card)] rounded-3xl p-8 sm:p-9 border border-[var(--border-subtle)] shadow-2xl z-10 space-y-7"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f5ede2] dark:bg-[#2c2621] text-[#c76f3b] flex items-center justify-center">
              <Cloud className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">
                Multi-Device Cloud Sync
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Access your choices and saved roadmaps seamlessly across any phone or laptop
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[#f3ede3] dark:hover:bg-[#28231f] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sync Code Box */}
        <div className="p-6 rounded-2xl bg-[#f8f3eb] dark:bg-[#1a1715] border border-[var(--border-subtle)] space-y-3">
          <span className="text-xs text-[var(--text-muted)] block font-medium">
            Your Unique Guidely Sync Code
          </span>
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-2xl tracking-wider text-[#c76f3b]">
              {currentCode}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-card)] hover:bg-[#eee2d4] text-xs text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors shadow-xs"
              title="Copy code to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#c76f3b]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Store this 6-character code to restore your profile and bookmarks on any device.
          </p>
        </div>

        {/* Backup Action */}
        <div className="space-y-2">
          <button
            onClick={handleBackup}
            disabled={isSyncing}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#c76f3b] hover:bg-[#b56130] disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition-all active:scale-95"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isSyncing ? 'Backing up to cloud...' : 'Backup Current Choices to Cloud'}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border-subtle)]" />
          </div>
          <span className="relative bg-[var(--bg-card)] px-4 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            Restore On Another Device
          </span>
        </div>

        {/* Restore from Code Form */}
        <form onSubmit={handleRestore} className="space-y-3.5">
          <label htmlFor="restoreCodeInput" className="block text-xs font-semibold text-[var(--text-primary)]">
            Enter Sync Code from your other device
          </label>
          <div className="flex items-center gap-3">
            <input
              id="restoreCodeInput"
              type="text"
              value={codeToRestore}
              onChange={(e) => setCodeToRestore(e.target.value.toUpperCase())}
              placeholder="e.g. IND-9428"
              maxLength={10}
              className="flex-1 px-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[#f9f5ee] dark:bg-[#1c1917] text-xs text-[var(--text-primary)] focus:border-[#c76f3b] outline-none uppercase font-mono tracking-wider shadow-xs"
            />
            <button
              type="submit"
              disabled={!codeToRestore.trim() || isSyncing}
              className="py-3 px-5 rounded-xl bg-[#f5ede3] dark:bg-[#25201d] hover:bg-[#ede1d2] disabled:opacity-50 text-[var(--text-primary)] font-semibold text-xs border border-[var(--border-subtle)] transition-colors shadow-xs"
            >
              <DownloadCloud className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Status / Feedback message */}
        {(feedbackMsg || syncStatus) && (
          <div className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
            feedbackMsg?.error
              ? 'bg-[#fbedeb] text-[#c93b2b] border border-[#f5c7c2]'
              : 'bg-[#f8f2eb] text-[#8c5936] border border-[#ead6c3]'
          }`}>
            {feedbackMsg?.error ? <AlertCircle className="w-4 h-4 shrink-0" /> : <ShieldCheck className="w-4 h-4 shrink-0" />}
            <span>{feedbackMsg?.text || syncStatus}</span>
          </div>
        )}

        {/* Footer info icons */}
        <div className="flex items-center justify-around pt-3 text-xs text-[var(--text-muted)] border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-4 h-4" />
            <span>Mobile Ready</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Laptop className="w-4 h-4" />
            <span>Laptop Sync</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#c76f3b]" />
            <span>Private & Encrypted</span>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
