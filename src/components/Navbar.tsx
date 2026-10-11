/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Compass, 
  Sparkles, 
  Bookmark, 
  Cloud, 
  Sun, 
  Moon, 
  Eye, 
  GraduationCap, 
  Briefcase, 
  MessageSquareText
} from 'lucide-react';
import { StudentProfile } from '../types/student';

interface NavbarProps {
  currentTab: 'assessment' | 'dashboard' | 'bookmarks';
  setCurrentTab: (tab: 'assessment' | 'dashboard' | 'bookmarks') => void;
  profile: StudentProfile;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  onOpenChat: () => void;
  onOpenSync: () => void;
  onToggleUserType: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  profile,
  theme,
  setTheme,
  onOpenChat,
  onOpenSync,
  onToggleUserType,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-3.5 text-left group focus:outline-none"
            aria-label="Guidely Home"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#f2e9dc] dark:bg-[#2b2622] text-[#c76f3b] border border-[#e2d5c3] dark:border-[#3e3731] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-xl tracking-tight text-[var(--text-primary)]">
                  Guidely
                </span>
                <span className="text-[11px] font-medium tracking-wide px-2 py-0.5 rounded-full bg-[#f4ebe1] dark:bg-[#2c2621] text-[#b3602d] dark:text-[#e08953] border border-[#ebdccf] dark:border-[#3d342d]">
                  Advisor
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] hidden sm:block tracking-normal">
                Thoughtful Career & Education Guidance for Indian Students
              </p>
            </div>
          </button>
        </div>

        {/* Primary Navigation Tabs - Roomy and calm */}
        <nav className="hidden md:flex items-center gap-1.5 p-1.5 bg-[#f0e8dc]/70 dark:bg-[#1d1a18] rounded-2xl border border-[var(--border-subtle)]" aria-label="Main Navigation">
          <button
            onClick={() => setCurrentTab('assessment')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl transition-all ${
              currentTab === 'assessment'
                ? 'bg-white dark:bg-[#2c2825] text-[#c76f3b] dark:text-[#e68d57] font-semibold shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Intake Wizard</span>
          </button>

          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl transition-all ${
              currentTab === 'dashboard'
                ? 'bg-white dark:bg-[#2c2825] text-[#c76f3b] dark:text-[#e68d57] font-semibold shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Recommendations</span>
          </button>

          <button
            onClick={() => setCurrentTab('bookmarks')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl transition-all relative ${
              currentTab === 'bookmarks'
                ? 'bg-white dark:bg-[#2c2825] text-[#c76f3b] dark:text-[#e68d57] font-semibold shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved & Compare</span>
            {profile.bookmarks?.length > 0 && (
              <span className="w-4 h-4 text-[10px] bg-[#c76f3b] text-white rounded-full flex items-center justify-center font-bold">
                {profile.bookmarks.length}
              </span>
            )}
          </button>
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          
          {/* Mode Switcher (School vs College) - Soft Warm Cream Styling */}
          <button
            onClick={onToggleUserType}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] bg-[#f7f1e7] dark:bg-[#221e1b] hover:bg-[#ede5d8] dark:hover:bg-[#2a2522] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium transition-colors"
            title={`Currently in ${profile.userType === 'school' ? 'School Mode (Class 9-12)' : 'College Mode (Undergrad/Grad)'}. Click to switch.`}
            aria-label="Switch between School and College student mode"
          >
            {profile.userType === 'school' ? (
              <>
                <GraduationCap className="w-4 h-4 text-[#c76f3b]" />
                <span className="hidden sm:inline">School Mode</span>
                <span className="text-[11px] text-[var(--text-muted)]">(9–12)</span>
              </>
            ) : (
              <>
                <Briefcase className="w-4 h-4 text-[#c76f3b]" />
                <span className="hidden sm:inline">College Mode</span>
                <span className="text-[11px] text-[var(--text-muted)]">(UG/Grad)</span>
              </>
            )}
          </button>

          {/* Cloud Sync Button */}
          <button
            onClick={onOpenSync}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] bg-[#f7f1e7] dark:bg-[#221e1b] hover:bg-[#ede5d8] dark:hover:bg-[#2a2522] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium transition-colors"
            title="Multi-device Cloud Sync"
            aria-label="Open Cloud Synchronization dialog"
          >
            <Cloud className="w-4 h-4 text-[#9c6a46]" />
            <span className="hidden lg:inline">{profile.syncCode || 'Sync'}</span>
          </button>

          {/* Theme Selector (Light Cream vs Dark Espresso) */}
          <div className="flex items-center bg-[#f0e8dc] dark:bg-[#1f1c19] rounded-xl p-1 border border-[var(--border-subtle)]" role="group" aria-label="Theme selection">
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-lg transition-colors ${
                theme === 'light' ? 'bg-white text-[#b85d24] shadow-xs font-semibold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
              title="Light Cream Theme"
              aria-label="Set light theme"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-lg transition-colors ${
                theme === 'dark' ? 'bg-[#2b2724] text-[#d9824c] shadow-xs font-semibold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
              title="Dark Espresso Theme"
              aria-label="Set dark theme"
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>

          {/* Ask Guidely AI Trigger - Muted Terracotta Button */}
          <button
            onClick={onOpenChat}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c76f3b] hover:bg-[#b56130] text-white font-medium text-xs shadow-sm transition-transform active:scale-95"
            aria-label="Ask Guidely AI Advisor"
          >
            <MessageSquareText className="w-4 h-4" />
            <span className="hidden sm:inline">Ask Guidely</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Navigation Bar */}
      <div className="md:hidden flex items-center justify-around py-2.5 border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]">
        <button
          onClick={() => setCurrentTab('assessment')}
          className={`flex items-center gap-1.5 text-xs font-medium py-1 px-2.5 rounded-lg ${
            currentTab === 'assessment' ? 'text-[#c76f3b] font-bold bg-[#f3eae0] dark:bg-[#2a2420]' : 'text-[var(--text-muted)]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Intake</span>
        </button>
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex items-center gap-1.5 text-xs font-medium py-1 px-2.5 rounded-lg ${
            currentTab === 'dashboard' ? 'text-[#c76f3b] font-bold bg-[#f3eae0] dark:bg-[#2a2420]' : 'text-[var(--text-muted)]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Matches</span>
        </button>
        <button
          onClick={() => setCurrentTab('bookmarks')}
          className={`flex items-center gap-1.5 text-xs font-medium py-1 px-2.5 rounded-lg ${
            currentTab === 'bookmarks' ? 'text-[#c76f3b] font-bold bg-[#f3eae0] dark:bg-[#2a2420]' : 'text-[var(--text-muted)]'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved ({profile.bookmarks?.length || 0})</span>
        </button>
      </div>
    </header>
  );
};
