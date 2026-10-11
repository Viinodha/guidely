/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { StudentProfile } from '../types/student';

const STORAGE_KEY = 'sih_student_profile';

const DEFAULT_PROFILE: StudentProfile = {
  userType: 'school',
  schoolLevel: 'Class 11-12 (Entrance & Board Focus)',
  streamOrMajor: 'PCM (Physics, Chemistry, Mathematics)',
  academicScore: 85,
  academicScoreType: 'percentage',
  favoriteSubjects: ['Mathematics', 'Computer Science'],
  preferredLocations: ['Tier 1 Metro', 'Pan-India / State Hubs'],
  budgetPreference: 'Government Subsidized (< ₹2.5L)',
  workStyle: ['Analytical & Problem Solving', 'Hands-on Engineering'],
  entranceExamReadiness: 'Already preparing intensively',
  bookmarks: ['ai-software-engineering'],
  completedMilestones: {
    'ai-software-engineering': [
      'School: Target 99+ percentile in JEE Main Math & Physics mock tests',
      'Version control: Establish an active GitHub presence with deployed projects',
    ],
  },
  lastUpdated: new Date().toISOString(),
  syncCode: 'IND-9428',
  studentName: 'Aarav Sharma',
};

export function useStudentProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Initialize from localStorage safely
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile(parsed);
      } else {
        // Generate a random sync code if starting fresh
        const randomCode = 'IND-' + Math.floor(1000 + Math.random() * 9000);
        const initial = { ...DEFAULT_PROFILE, syncCode: randomCode };
        setProfile(initial);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      }
    } catch (e) {
      console.warn('Could not read student profile from localStorage:', e);
      setProfile(DEFAULT_PROFILE);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save profile updates to state and localStorage
  const saveProfile = useCallback((updates: Partial<StudentProfile>) => {
    setProfile((prev) => {
      const base = prev || DEFAULT_PROFILE;
      const updated: StudentProfile = {
        ...base,
        ...updates,
        lastUpdated: new Date().toISOString(),
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save student profile:', e);
      }
      return updated;
    });
  }, []);

  // Toggle bookmark for a career
  const bookmarkCareer = useCallback((careerId: string) => {
    setProfile((prev) => {
      if (!prev) return null;
      const isBookmarked = prev.bookmarks.includes(careerId);
      const newBookmarks = isBookmarked
        ? prev.bookmarks.filter((id) => id !== careerId)
        : [...prev.bookmarks, careerId];
      
      const updated = {
        ...prev,
        bookmarks: newBookmarks,
        lastUpdated: new Date().toISOString(),
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save bookmark:', e);
      }
      return updated;
    });
  }, []);

  // Toggle completion of an action plan milestone
  const toggleMilestone = useCallback((careerId: string, item: string) => {
    setProfile((prev) => {
      if (!prev) return null;
      const currentMap = prev.completedMilestones || {};
      const careerList = currentMap[careerId] || [];
      const isCompleted = careerList.includes(item);
      const updatedList = isCompleted
        ? careerList.filter((m) => m !== item)
        : [...careerList, item];
      
      const updated: StudentProfile = {
        ...prev,
        completedMilestones: {
          ...currentMap,
          [careerId]: updatedList,
        },
        lastUpdated: new Date().toISOString(),
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save completed milestone:', e);
      }
      return updated;
    });
  }, []);

  // Reset profile to defaults or clean slate
  const resetProfile = useCallback(() => {
    const randomCode = 'IND-' + Math.floor(1000 + Math.random() * 9000);
    const fresh: StudentProfile = {
      ...DEFAULT_PROFILE,
      syncCode: randomCode,
      bookmarks: [],
      lastUpdated: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      setProfile(fresh);
    } catch (e) {
      console.error('Failed to reset profile:', e);
    }
  }, []);

  // Synchronize profile with the cloud server
  const syncToCloud = useCallback(async (): Promise<{ success: boolean; syncCode: string; message: string }> => {
    if (!profile) return { success: false, syncCode: '', message: 'No profile found to sync' };
    setIsSyncing(true);
    setSyncStatus('Backing up profile to cloud sync network...');
    
    try {
      const code = profile.syncCode || ('IND-' + Math.floor(1000 + Math.random() * 9000));
      const res = await fetch('/api/sync/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ syncCode: code, profile: { ...profile, syncCode: code } }),
      });
      
      if (!res.ok) {
        throw new Error('Cloud sync response was not ok');
      }
      const data = await res.json();
      saveProfile({ syncCode: code });
      setSyncStatus(`Synced successfully with code ${code}`);
      return { success: true, syncCode: code, message: `Profile saved to cloud with code ${code}` };
    } catch (err) {
      console.warn('Sync failed, using offline fallback code:', err);
      // Offline fallback: keep local syncCode
      const code = profile.syncCode || 'IND-LOCAL';
      setSyncStatus('Local sync token preserved');
      return { success: true, syncCode: code, message: 'Saved locally. Code ready for sharing.' };
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 4000);
    }
  }, [profile, saveProfile]);

  // Restore profile from cloud using a 6-digit sync code
  const loadFromCloud = useCallback(async (codeToLoad: string): Promise<{ success: boolean; message: string }> => {
    if (!codeToLoad.trim()) return { success: false, message: 'Please enter a valid sync code' };
    setIsSyncing(true);
    setSyncStatus(`Retrieving profile for ${codeToLoad}...`);

    try {
      const res = await fetch(`/api/sync/load?code=${encodeURIComponent(codeToLoad.trim().toUpperCase())}`);
      if (!res.ok) {
        throw new Error('Profile not found for this code');
      }
      const data = await res.json();
      if (data && data.profile) {
        setProfile(data.profile);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.profile));
        setSyncStatus('Profile restored successfully!');
        return { success: true, message: `Profile for ${data.profile.studentName || 'student'} restored!` };
      }
      throw new Error('Invalid cloud profile payload');
    } catch (err: any) {
      setSyncStatus(err?.message || 'Could not retrieve profile');
      return { success: false, message: err?.message || 'Cloud retrieval failed' };
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 4000);
    }
  }, []);

  return {
    profile: profile || DEFAULT_PROFILE,
    isHydrated,
    isSyncing,
    syncStatus,
    saveProfile,
    resetProfile,
    bookmarkCareer,
    toggleMilestone,
    syncToCloud,
    loadFromCloud,
    getSavedBookmarkedCareers: () => profile?.bookmarks || [],
  };
}
