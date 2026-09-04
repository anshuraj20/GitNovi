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

  const meta = user.user_metadata || {};
  const metaName =
    meta.full_name ||
    meta.name ||
    meta.display_name ||
    (meta.given_name ? `${meta.given_name} ${meta.family_name || ''}`.trim() : null) ||
    meta.user_name;

  const finalProfile = profileData
    ? {
        ...profileData,
        display_name:
          (!profileData.display_name || profileData.display_name === user.email?.split('@')[0]) && metaName
            ? metaName
            : profileData.display_name,
      }
    : metaName
    ? {
        display_name: metaName,
        email: user.email ?? '',
        current_level: 'pre-git',
        created_at: user.created_at ?? '',
      }
    : null;

  if ((!profileData?.display_name || profileData.display_name === user.email?.split('@')[0]) && metaName) {
    supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          email: user.email,
          display_name: metaName,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .then(() => null);
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#A7B0BC] hover:text-[#22D3EE] transition mb-6 group"
      >
        <svg
          className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#22D3EE]"
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
        <div className="text-xs font-bold uppercase tracking-[0.2em] font-mono text-[#22D3EE]">
          GitNovi / Developer Profile
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#E6EDF3] tracking-tight">
          Developer Profile & Settings
        </h1>
        <p className="mt-1 text-[#A7B0BC] text-sm sm:text-base max-w-2xl">
          Manage your learner identity, mastery progress, and account settings.
        </p>
      </div>

      <ProfileLiveView
        initialProfile={finalProfile}
        initialStreak={streakData}
        userEmail={user.email || ''}
        createdAt={user.created_at || ''}
      />
    </div>
  );
}
