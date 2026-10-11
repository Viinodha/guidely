/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AssessmentWizard } from './components/AssessmentWizard';
import { RecommendationDashboard } from './components/RecommendationDashboard';
import { AskPathfinderDrawer } from './components/AskPathfinderDrawer';
import { BookmarksCompare } from './components/BookmarksCompare';
import { CloudSyncModal } from './components/CloudSyncModal';
import { useStudentProfile } from './hooks/useStudentProfile';
import { CAREER_DATABASE, CareerPath } from './data/careerDatabase';

export default function App() {
  const {
    profile,
    isHydrated,
    isSyncing,
    syncStatus,
    saveProfile,
    bookmarkCareer,
    toggleMilestone,
    syncToCloud,
    loadFromCloud,
  } = useStudentProfile();

  const [currentTab, setCurrentTab] = useState<'assessment' | 'dashboard' | 'bookmarks'>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [activeAdvisorCareer, setActiveAdvisorCareer] = useState<CareerPath | null>(null);

  // Set initial theme & sync with documentElement (default to warm muted cream light)
  useEffect(() => {
    const savedTheme = localStorage.getItem('sih_theme') as 'dark' | 'light' | null;
    const initialTheme = (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleSetTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('sih_theme', newTheme);
  };

  const handleToggleUserType = () => {
    const nextType = profile.userType === 'school' ? 'college' : 'school';
    saveProfile({
      userType: nextType,
      streamOrMajor: nextType === 'school' ? 'PCM (Physics, Chemistry, Mathematics)' : 'Computer Science & Engineering / IT',
      schoolLevel: nextType === 'school' ? 'Class 11-12 (Entrance & Board Focus)' : undefined,
      collegeYear: nextType === 'college' ? '2nd Year (Core Skills & Internships)' : undefined,
    });
  };

  const handleOpenAdvisorForCareer = (career: CareerPath) => {
    setActiveAdvisorCareer(career);
    setIsChatOpen(true);
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2] text-[#c76f3b]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#c76f3b] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold tracking-wider uppercase text-[var(--text-muted)]">Loading Guidley...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:p-3 focus:bg-[#c76f3b] focus:text-white focus:font-bold focus:rounded-xl shadow-md"
      >
        Skip to main content
      </a>

      {/* Primary Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        profile={profile}
        theme={theme}
        setTheme={handleSetTheme}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenSync={() => setIsSyncModalOpen(true)}
        onToggleUserType={handleToggleUserType}
      />

      {/* Main Interactive Views */}
      <main id="main-content" className="flex-1 pb-16">
        {currentTab === 'assessment' && (
          <AssessmentWizard
            profile={profile}
            saveProfile={saveProfile}
            onComplete={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'dashboard' && (
          <RecommendationDashboard
            profile={profile}
            onBookmark={bookmarkCareer}
            onToggleMilestone={toggleMilestone}
            onOpenAdvisorForCareer={handleOpenAdvisorForCareer}
            onRetakeAssessment={() => setCurrentTab('assessment')}
            onUpdateProfile={saveProfile}
          />
        )}

        {currentTab === 'bookmarks' && (
          <BookmarksCompare
            profile={profile}
            onRemoveBookmark={bookmarkCareer}
            onSelectCareer={handleOpenAdvisorForCareer}
            onGoToDashboard={() => setCurrentTab('dashboard')}
          />
        )}
      </main>

      {/* Screen 3: Contextual Pathfinder Advisor Drawer */}
      <AskPathfinderDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        activeCareer={activeAdvisorCareer}
        profile={profile}
      />

      {/* Multi-Device Cloud Synchronization Modal */}
      <CloudSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        profile={profile}
        syncToCloud={syncToCloud}
        loadFromCloud={loadFromCloud}
        isSyncing={isSyncing}
        syncStatus={syncStatus}
      />

      {/* Minimal Relaxed Footer */}
      <footer className="border-t border-[var(--border-subtle)] py-10 text-center text-xs text-[var(--text-muted)] bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-medium text-[var(--text-secondary)]">
            Guidley · Thoughtful Career & Education Guidance for Indian Students
          </p>
          <div className="flex items-center gap-4 text-[11px] text-[var(--text-muted)]">
            <span>NIRF Aligned</span>
            <span>·</span>
            <span>JoSAA & State Counseling</span>
            <span>·</span>
            <span>High Contrast & Screen Reader Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
