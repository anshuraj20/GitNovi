import { requireUser } from '@/lib/supabase/server';
import { ProfileLiveView } from '@/components/profile/ProfileLiveView';
import Link from 'next/link';

export default async function ProfilePage() {
  const { user, supabase } = await requireUser();

  const [{ data: profileData }, { data: streakData }] = await Promise.all([
    supabase
      .from('profiles')
      .select('display_name,email,current_level,created_at')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('user_streaks')
      .select('current_streak,longest_streak')
      .eq('user_id', user.id)
      .maybeSingle(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition mb-6 group"
      >
        <svg
          className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-cyan-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span>Back to Dashboard</span>
      </Link>

      <div className="flex flex-col gap-2">
        <div className="text-xs font-bold uppercase tracking-[0.2em] font-mono text-cyan-400">
          GitNovi / Developer Profile
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Developer Profile & Settings
        </h1>
        <p className="mt-1 text-slate-400 text-sm sm:text-base max-w-2xl">
          Manage your learner identity, CLI editor preferences, mastery ranks, and account settings.
        </p>
      </div>

      <ProfileLiveView
        initialProfile={profileData}
        initialStreak={streakData}
        userEmail={user.email || ''}
        createdAt={user.created_at || ''}
      />
    </div>
  );
}
