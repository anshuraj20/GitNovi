'use client';

import { useState, useEffect, useMemo } from 'react';
import { courseCatalog } from '@/lib/course/courseCatalog';
import { challengesCatalog } from '@/lib/challenges/challengeCatalog';
import { achievementDefinitions } from '@/lib/achievements/definitions';
import { getLocalStreak } from '@/lib/progress/streak';

export function ProfileLiveView({
  initialProfile,
  initialStreak,
  userEmail = '',
  createdAt,
}: {
  initialProfile?: { display_name?: string; bio?: string } | null;
  initialStreak?: { current_streak?: number; longest_streak?: number } | null;
  userEmail?: string;
  createdAt?: string;
}) {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('Learning Git fundamentals and internal plumbing mechanics on GitNovi.');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [completedLessons, setCompletedLessons] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState(0);
  const [streakData, setStreakData] = useState({ current_streak: 1, longest_streak: 1 });

  const allLessons = useMemo(() => Object.values(courseCatalog).flatMap((m) => m.lessons), []);
  const totalLessons = allLessons.length;
  const totalChallenges = challengesCatalog.length;
  const totalBadges = Object.keys(achievementDefinitions).length;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('gitnovi_profile_name');
      const savedBio = localStorage.getItem('gitnovi_profile_bio');

      if (savedName && savedName !== userEmail.split('@')[0]) {
        setDisplayName(savedName);
      } else if (initialProfile?.display_name) {
        setDisplayName(initialProfile.display_name);
      } else if (savedName) {
        setDisplayName(savedName);
      } else if (userEmail) {
        setDisplayName(userEmail.split('@')[0]);
      }

      if (savedBio) setBio(savedBio);
      else if (initialProfile?.bio) setBio(initialProfile.bio);

      const doneLessons = allLessons.filter(
        (l) => localStorage.getItem(`gitnovi_lesson_${l.id}`) === 'true',
      ).length;
      setCompletedLessons(doneLessons);

      const doneChallenges = challengesCatalog.filter(
        (c) => localStorage.getItem(`gitnovi_challenge_${c.id}`) === 'true',
      ).length;
      setCompletedChallenges(doneChallenges);

      const localStreak = getLocalStreak();
      setStreakData({
        current_streak: Math.max(initialStreak?.current_streak ?? 0, localStreak.current_streak || 1),
        longest_streak: Math.max(initialStreak?.longest_streak ?? 0, localStreak.longest_streak || 1),
      });

      let badges = 0;
      if (doneLessons >= 1) badges++;
      if (doneLessons >= allLessons.length) badges++;
      if (doneChallenges >= 1) badges++;
      if (doneChallenges >= 5) badges++;
      if (localStreak.longest_streak >= 7) badges++;
      if (localStreak.longest_streak >= 30) badges++;
      setEarnedBadges(badges);
    }
  }, [allLessons, initialProfile, initialStreak, userEmail]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveStatus(null);

    const nameToSave = displayName.trim() || userEmail.split('@')[0] || 'Developer';

    if (typeof window !== 'undefined') {
      localStorage.setItem('gitnovi_profile_name', nameToSave);
      localStorage.setItem('gitnovi_profile_bio', bio);
      window.dispatchEvent(new Event('gitnovi_profile_updated'));
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: nameToSave,
          bio,
        }),
      });

      if (res.ok) {
        setSaveStatus({ text: '✓ Profile updated successfully.', type: 'success' });
      } else {
        setSaveStatus({ text: '✓ Profile saved locally.', type: 'success' });
      }
    } catch {
      setSaveStatus({ text: '✓ Profile saved locally.', type: 'success' });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(null), 3500);
    }
  };

  const handleResetSandbox = async () => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(
        'Reset local Terminal Sandbox repository state? Your lesson and challenge progress will NOT be lost.',
      );
      if (confirmed) {
        localStorage.removeItem('gitnovi_terminal_state');
        localStorage.removeItem('gitnovi_terminal_history');
        try {
          await fetch('/api/terminal/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reset: true }),
          });
        } catch {
          // Local reset
        }
        alert('Sandbox state reset.');
      }
    }
  };

  const handleExportProgress = () => {
    if (typeof window !== 'undefined') {
      const exportData = {
        userEmail: userEmail || 'user@gitnovi.dev',
        displayName: displayName || 'Developer',
        bio,
        stats: {
          completedLessons,
          totalLessons,
          completedChallenges,
          totalChallenges,
          earnedBadges,
          totalBadges,
          currentStreak: streakData.current_streak,
          longestStreak: streakData.longest_streak,
        },
        exportedAt: new Date().toISOString(),
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `gitnovi-progress-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };

  const memberDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Active';

  return (
    <div className="space-y-6">
      {/* Account Info Card */}
      <div className="rounded-lg border border-[#293542] bg-[#11161D] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-[#E6EDF3]">
              {displayName || 'Developer'}
            </h2>
            <span className="text-xs font-mono text-[#737F8C]">
              ({userEmail || 'user@gitnovi.dev'})
            </span>
          </div>
          <div className="text-xs text-[#737F8C] mt-0.5">
            Member since {memberDate} · {streakData.current_streak} day streak
          </div>
        </div>

        <div className="text-xs font-mono text-[#737F8C]">
          {completedLessons}/{totalLessons} lessons ({Math.round((completedLessons / totalLessons) * 100)}%)
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border border-[#293542] bg-[#11161D] p-3.5">
          <div className="text-xs text-[#737F8C]">Lessons Completed</div>
          <div className="font-mono text-base font-bold text-[#E6EDF3] mt-1">{completedLessons} / {totalLessons}</div>
        </div>
        <div className="rounded-lg border border-[#293542] bg-[#11161D] p-3.5">
          <div className="text-xs text-[#737F8C]">Challenges Passed</div>
          <div className="font-mono text-base font-bold text-[#E6EDF3] mt-1">{completedChallenges} / {totalChallenges}</div>
        </div>
        <div className="rounded-lg border border-[#293542] bg-[#11161D] p-3.5">
          <div className="text-xs text-[#737F8C]">Milestones Unlocked</div>
          <div className="font-mono text-base font-bold text-[#E6EDF3] mt-1">{earnedBadges} / {totalBadges}</div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="rounded-lg border border-[#293542] bg-[#11161D] p-4 sm:p-5 space-y-4">
        <div className="border-b border-[#202934] pb-2">
          <h3 className="text-xs font-semibold text-[#737F8C] uppercase tracking-wider font-mono">
            Profile Settings
          </h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-3.5 max-w-lg">
          {saveStatus && (
            <div className="rounded-md border border-[#34D399]/40 bg-[#34D399]/10 p-2.5 text-xs text-[#34D399] font-mono">
              {saveStatus.text}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#E6EDF3] mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-md border border-[#293542] bg-[#090D12] px-3 py-1.5 text-xs text-[#E6EDF3] outline-none focus:border-[#22D3EE]/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#E6EDF3] mb-1">
              Bio
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-md border border-[#293542] bg-[#090D12] px-3 py-1.5 text-xs text-[#E6EDF3] outline-none focus:border-[#22D3EE]/50"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-[#22D3EE] px-4 py-1.5 text-xs font-semibold text-[#0B0F14] hover:bg-[#67E8F9] disabled:opacity-50 transition cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>

      {/* Actions */}
      <div className="rounded-lg border border-[#293542] bg-[#11161D] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
        <div>
          <div className="font-semibold text-[#E6EDF3]">Data Management</div>
          <div className="text-[#A7B0BC]">Export your progress record or reset sandbox state.</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportProgress}
            className="rounded-md border border-[#293542] bg-[#090D12] px-3 py-1.5 text-[#E6EDF3] hover:border-[#22D3EE]/40 transition cursor-pointer"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={handleResetSandbox}
            className="rounded-md border border-[#293542] bg-[#090D12] px-3 py-1.5 text-[#F87171] hover:border-[#F87171]/50 transition cursor-pointer"
          >
            Reset Sandbox
          </button>
        </div>
      </div>
    </div>
  );
}
