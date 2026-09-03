-- Authenticated learning access and atomic activity tracking.
create or replace function public.record_learning_activity(p_user_id uuid, p_kind text, p_minutes int default 0, p_achievement_id text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  today_date date := current_date;
  new_streak int := 0;
  previous_date date;
  previous_streak int := 0;
begin
  if auth.uid() is null or auth.uid() <> p_user_id then
    raise exception 'not authorized';
  end if;

  insert into daily_activity(user_id, activity_date, lessons, commands, challenges, minutes)
  values(p_user_id, today_date, 0, 0, 0, greatest(p_minutes,0))
  on conflict(user_id, activity_date) do update set minutes = daily_activity.minutes + greatest(excluded.minutes,0);

  if p_kind = 'lesson' then
    update daily_activity set lessons = lessons + 1 where user_id = p_user_id and activity_date = today_date;
  elsif p_kind = 'command' then
    update daily_activity set commands = commands + 1 where user_id = p_user_id and activity_date = today_date;
  elsif p_kind = 'challenge' then
    update daily_activity set challenges = challenges + 1 where user_id = p_user_id and activity_date = today_date;
  else
    raise exception 'unknown activity kind';
  end if;

  select last_activity_date, current_streak into previous_date, previous_streak from user_streaks where user_id = p_user_id;
  if previous_date = today_date then
    new_streak := greatest(previous_streak, 1);
  elsif previous_date = today_date - 1 then
    new_streak := previous_streak + 1;
  else
    new_streak := 1;
  end if;

  insert into user_streaks(user_id,current_streak,longest_streak,last_activity_date)
  values(p_user_id,new_streak,new_streak,today_date)
  on conflict(user_id) do update set current_streak = excluded.current_streak, longest_streak = greatest(user_streaks.longest_streak, excluded.longest_streak), last_activity_date = excluded.last_activity_date;

  update profiles set last_active_at = now() where id = p_user_id;

  if p_kind = 'lesson' then
    insert into user_achievements(user_id,achievement_id) values(p_user_id,'first-lesson') on conflict do nothing;
    if (select count(*) from lesson_progress where user_id=p_user_id and completed=true) >= (select count(*) from lessons) and (select count(*) from lessons) > 0 then
      insert into user_achievements(user_id,achievement_id) values(p_user_id,'course-complete') on conflict do nothing;
    end if;
  elsif p_kind = 'challenge' then
    if (select count(*) from challenge_progress where user_id=p_user_id and completed=true) >= 5 then
      insert into user_achievements(user_id,achievement_id) values(p_user_id,'terminal-warrior') on conflict do nothing;
    end if;
  elsif p_kind = 'command' then
    null;
  end if;
  if p_achievement_id is not null and p_achievement_id in ('first-commit','branch-explorer','internals-explorer','recovery-expert') then
    insert into user_achievements(user_id,achievement_id) values(p_user_id,p_achievement_id) on conflict do nothing;
  end if;

  if new_streak >= 7 then insert into user_achievements(user_id,achievement_id) values(p_user_id,'streak-7') on conflict do nothing; end if;
  if new_streak >= 30 then insert into user_achievements(user_id,achievement_id) values(p_user_id,'streak-30') on conflict do nothing; end if;

  return jsonb_build_object('current_streak',new_streak);
end;
$$;

alter table course_modules enable row level security;
alter table lessons enable row level security;
alter table commands enable row level security;
alter table quizzes enable row level security;
alter table quiz_questions enable row level security;
alter table terminal_challenges enable row level security;
alter table achievements enable row level security;

create policy "authenticated course modules" on course_modules for select using (auth.uid() is not null);
create policy "authenticated lessons" on lessons for select using (auth.uid() is not null);
create policy "authenticated commands" on commands for select using (auth.uid() is not null);
create policy "authenticated quizzes" on quizzes for select using (auth.uid() is not null);
create policy "authenticated quiz questions" on quiz_questions for select using (auth.uid() is not null);
create policy "authenticated challenges" on terminal_challenges for select using (auth.uid() is not null);
create policy "authenticated achievements" on achievements for select using (auth.uid() is not null);
