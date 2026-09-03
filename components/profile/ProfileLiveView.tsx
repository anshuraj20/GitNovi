'use client';

import { useState, useEffect, useMemo } from 'react';
import { courseCatalog } from '@/lib/course/courseCatalog';
import { challengesCatalog } from '@/lib/challenges/challengeCatalog';
import { achievementDefinitions } from '@/lib/achievements/definitions';
import { getLocalStreak } from '@/lib/progress/streak';
import Link from 'next/link';

export function ProfileLiveView({
  initialProfile,
  initialStreak,
  userEmail = '',
  createdAt,
}: {
  initialProfile?: { display_name?: string; bio?: string; preferred_editor?: string } | null;
  initialStreak?: { current_streak?: number; longest_streak?: number } | null;
  userEmail?: string;
  createdAt?: string;
}) {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('Learning Git internals and mastering version control on GitNovi.');
  const [editor, setEditor] = useState('VS Code');
  const [avatarSeed, setAvatarSeed] = useState<'cyan' | 'emerald' | 'purple' | 'amber'>('cyan');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Dynamic statistics
  const [completedLessons, setCompletedLessons] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState(0);
  const [streakData, setStreakData] = useState({ current_streak: 1, longest_streak: 1 });

  const allLessons = useMemo(() => Object.values(courseCatalog).flatMap((m) => m.lessons), []);
  const totalLessons = allLessons.length;
  const totalChallenges = challengesCatalog.length;
  const totalBadges = Object.keys(achievementDefinitions).length;

  // Initialize once on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('gitnovi_profile_name');
      const savedBio = localStorage.getItem('gitnovi_profile_bio');
      const savedEditor = localStorage.getItem('gitnovi_profile_editor');
      const savedAvatar = localStorage.getItem('gitnovi_profile_avatar') as any;

      if (savedName) {
        setDisplayName(savedName);
      } else if (initialProfile?.display_name) {
        setDisplayName(initialProfile.display_name);
      } else if (userEmail) {
        setDisplayName(userEmail.split('@')[0]);
      }

      if (savedBio) setBio(savedBio);
      else if (initialProfile?.bio) setBio(initialProfile.bio);

      if (savedEditor) setEditor(savedEditor);
      else if (initialProfile?.preferred_editor) setEditor(initialProfile.preferred_editor);

      if (savedAvatar && ['cyan', 'emerald', 'purple', 'amber'].includes(savedAvatar)) {
        setAvatarSeed(savedAvatar);
      }

      // Count completed lessons
      const doneLessons = allLessons.filter(
        (l) => localStorage.getItem(`gitnovi_lesson_${l.id}`) === 'true',
      ).length;
      setCompletedLessons(doneLessons);

      // Count completed challenges
      const doneChallenges = challengesCatalog.filter(
        (c) => localStorage.getItem(`gitnovi_challenge_${c.id}`) === 'true',
      ).length;
      setCompletedChallenges(doneChallenges);

      // Hydrate streak
      const localStreak = getLocalStreak();
      setStreakData({
        current_streak: Math.max(initialStreak?.current_streak ?? 0, localStreak.current_streak || 1),
        longest_streak: Math.max(initialStreak?.longest_streak ?? 0, localStreak.longest_streak || 1),
      });

      // Calculate earned badges
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

    const nameToSave = displayName.trim() || userEmail.split('@')[0] || 'Learner';

    // 1. Save to localStorage immediately
    if (typeof window !== 'undefined') {
      localStorage.setItem('gitnovi_profile_name', nameToSave);
      localStorage.setItem('gitnovi_profile_bio', bio);
      localStorage.setItem('gitnovi_profile_editor', editor);
      localStorage.setItem('gitnovi_profile_avatar', avatarSeed);
    }

    // 2. Sync to Supabase profile endpoint
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: nameToSave,
          bio,
          preferredEditor: editor,
        }),
      });

      if (res.ok) {
        setSaveStatus({ text: '✓ Profile updated and saved successfully!', type: 'success' });
      } else {
        setSaveStatus({ text: '✓ Profile saved locally on this device.', type: 'success' });
      }
    } catch {
      setSaveStatus({ text: '✓ Profile saved locally.', type: 'success' });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  const handleResetSandbox = async () => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(
        'Are you sure you want to reset your local Terminal Sandbox repository state? Your lessons and completed challenges will NOT be deleted.',
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
          // Local reset preserved
        }
        alert('✓ Sandbox repository state has been completely reset.');
      }
    }
  };

  const handleExportProgress = () => {
    if (typeof window === 'undefined') return;

    const exportData = {
      userEmail: userEmail || 'guest@gitnovi.dev',
      displayName: displayName || 'Learner',
      bio,
      preferredEditor: editor,
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
  };

  const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const currentRank =
    percent >= 80
      ? { title: 'Git Grandmaster', icon: '🏆', color: 'text-purple-400', border: 'border-purple-500/40' }
      : percent >= 50
      ? { title: 'Version Control Architect', icon: '⚡', color: 'text-cyan-400', border: 'border-cyan-500/40' }
      : percent >= 20
      ? { title: 'Branch Practitioner', icon: '🌿', color: 'text-emerald-400', border: 'border-emerald-500/40' }
      : { title: 'Git Cadet', icon: '🌱', color: 'text-amber-400', border: 'border-amber-500/40' };

  const avatarGradients: Record<string, string> = {
    cyan: 'from-cyan-500 to-blue-600 border-cyan-400/40 shadow-cyan-500/20',
    emerald: 'from-emerald-500 to-teal-600 border-emerald-400/40 shadow-emerald-500/20',
    purple: 'from-purple-500 to-indigo-600 border-purple-400/40 shadow-purple-500/20',
    amber: 'from-amber-500 to-orange-600 border-amber-400/40 shadow-amber-500/20',
  };

  const memberDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Active Explorer';

  return (
    <div className="mt-8 space-y-8">
      {/* Developer Identity Card */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-slate-950/90 p-6 sm:p-8 shadow-xl shadow-slate-950/20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            {/* Live Interactive Avatar */}
            <div
              className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${
                avatarGradients[avatarSeed] || avatarGradients.cyan
              } text-3xl font-black text-white shadow-lg border-2 transition-all duration-300`}
            >
              {(displayName || userEmail || 'G').charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-extrabold text-white">
                  {displayName || 'Git Learner'}
                </h2>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${currentRank.border} bg-slate-900/80 ${currentRank.color}`}
                >
                  {currentRank.icon} {currentRank.title}
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                <span>{userEmail || 'developer@gitnovi.dev'}</span>
                <span>•</span>
                <span>Member since {memberDate}</span>
              </div>

              <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                {bio}
              </p>
            </div>
          </div>

          {/* Streak & Milestone Badge */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 border-t border-slate-800/80 pt-4 sm:border-0 sm:pt-0">
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-2 text-xs font-bold text-cyan-300 flex items-center gap-2">
              <span className="text-base">🔥</span>
              <span>{streakData.current_streak} Day Streak</span>
            </div>

            <div className="text-xs text-slate-500 font-mono">
              Best Record: <span className="text-slate-300 font-bold">{streakData.longest_streak} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
          <div className="text-xs text-slate-500 font-medium">Curriculum Progress</div>
          <div className="mt-1 flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-white font-mono">{percent}%</div>
            <div className="text-xs text-cyan-400 font-mono">{completedLessons}/{totalLessons} lessons</div>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-cyan-400 transition-all duration-500" style={{ width: `${percent}%` }} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
          <div className="text-xs text-slate-500 font-medium">Challenges Verified</div>
          <div className="mt-1 flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">{completedChallenges}</div>
            <div className="text-xs text-slate-400 font-mono">/ {totalChallenges} lab tasks</div>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-emerald-400 transition-all duration-500"
              style={{ width: `${Math.round((completedChallenges / totalChallenges) * 100)}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
          <div className="text-xs text-slate-500 font-medium">Milestone Badges</div>
          <div className="mt-1 flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-purple-400 font-mono">{earnedBadges}</div>
            <div className="text-xs text-slate-400 font-mono">/ {totalBadges} badges</div>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-purple-400 transition-all duration-500"
              style={{ width: `${Math.round((earnedBadges / totalBadges) * 100)}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
          <div className="text-xs text-slate-500 font-medium">Preferred Editor</div>
          <div className="mt-1 text-2xl font-extrabold text-amber-400 font-mono truncate">{editor}</div>
          <div className="mt-3 text-[11px] text-slate-500 font-mono">CLI environment</div>
        </div>
      </div>

      {/* Profile Preferences & Settings Form */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 shadow-xl shadow-slate-950/20">
        <div className="border-b border-slate-800/80 pb-4">
          <h3 className="text-lg font-bold text-white">Developer Preferences & Settings</h3>
          <p className="mt-1 text-xs text-slate-400">
            Customize your learner identity, avatar color, and development environment.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="mt-6 space-y-5">
          {/* Avatar Color Theme Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
              Avatar Glow Theme
            </label>
            <div className="flex items-center gap-3">
              {(['cyan', 'emerald', 'purple', 'amber'] as const).map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setAvatarSeed(color)}
                  className={`h-10 w-10 rounded-xl bg-gradient-to-br ${
                    avatarGradients[color]
                  } transition-transform cursor-pointer ${
                    avatarSeed === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110' : 'opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`Select ${color} avatar theme`}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Display Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Linus Torvalds"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 shadow-inner outline-none transition focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40"
              />
            </div>

            {/* Email (Readonly) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1.5">
                Account Email
              </label>
              <input
                type="email"
                readOnly
                value={userEmail || 'guest@gitnovi.dev'}
                className="w-full rounded-xl border border-slate-800/60 bg-slate-950/40 px-4 py-2.5 text-sm text-slate-400 font-mono opacity-80 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Bio / Goal */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1.5">
              Bio & Learning Goal
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="What are you aiming to master on GitNovi?"
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 shadow-inner outline-none transition focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40"
            />
          </div>

          {/* Preferred Editor */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1.5">
              Preferred Git Editor
            </label>
            <div className="flex flex-wrap gap-2">
              {['VS Code', 'Neovim', 'Vim', 'Nano', 'Sublime Text', 'IntelliJ'].map((ed) => (
                <button
                  type="button"
                  key={ed}
                  onClick={() => setEditor(ed)}
                  className={`rounded-xl px-4 py-2 text-xs font-medium transition cursor-pointer ${
                    editor === ed
                      ? 'border border-cyan-500/50 bg-cyan-500/20 text-cyan-300 font-bold'
                      : 'border border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {ed}
                </button>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-cyan-500 px-6 py-2.5 text-xs font-bold text-slate-950 shadow transition hover:bg-cyan-400 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {saving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>

            {saveStatus && (
              <span
                className={`text-xs font-semibold ${
                  saveStatus.type === 'success' ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {saveStatus.text}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Advanced Sandbox & Account Controls */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Sandbox Controls */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Sandbox Terminal Controls</h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Reset your virtual repository filesystem, commit graph, and branch references if you wish to start a clean sandbox session.
            </p>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={handleResetSandbox}
              className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-300 transition hover:bg-amber-500/20 hover:border-amber-400 cursor-pointer"
            >
              Reset Sandbox Repository State
            </button>
          </div>
        </div>

        {/* Data & Security */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Data & Account Security</h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Download your complete progress history or change your account security credentials.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExportProgress}
              className="rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-300 cursor-pointer"
            >
              Export Progress (.json)
            </button>

            <Link
              href="/auth/reset-password"
              className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-500/40 hover:text-cyan-300"
            >
              Change Password →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
