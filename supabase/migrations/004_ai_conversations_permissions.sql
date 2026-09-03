-- ============================================================
-- GitNovi AI Conversation Permissions
-- ============================================================

-- Give authenticated users the table privileges needed for
-- the RLS policies in 003_ai_conversations.sql.

grant select, insert, update, delete
on public.ai_conversations
to authenticated;

grant select, insert, update, delete
on public.ai_messages
to authenticated;


-- Allow authenticated users to use the generated UUID defaults.
grant usage, select
on all sequences
in schema public
to authenticated;


-- Explicitly ensure RLS remains enabled.
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;


-- ============================================================
-- Conversation ownership policies
-- ============================================================

drop policy if exists "ai conversations own select"
on public.ai_conversations;

create policy "ai conversations own select"
on public.ai_conversations
for select
to authenticated
using (
  auth.uid() = user_id
);


drop policy if exists "ai conversations own insert"
on public.ai_conversations;

create policy "ai conversations own insert"
on public.ai_conversations
for insert
to authenticated
with check (
  auth.uid() = user_id
);


drop policy if exists "ai conversations own update"
on public.ai_conversations;

create policy "ai conversations own update"
on public.ai_conversations
for update
to authenticated
using (
  auth.uid() = user_id
)
with check (
  auth.uid() = user_id
);


drop policy if exists "ai conversations own delete"
on public.ai_conversations;

create policy "ai conversations own delete"
on public.ai_conversations
for delete
to authenticated
using (
  auth.uid() = user_id
);


-- ============================================================
-- Message ownership policies
-- ============================================================

drop policy if exists "ai messages own select"
on public.ai_messages;

create policy "ai messages own select"
on public.ai_messages
for select
to authenticated
using (
  exists (
    select 1
    from public.ai_conversations c
    where c.id = ai_messages.conversation_id
      and c.user_id = auth.uid()
  )
);


drop policy if exists "ai messages own insert"
on public.ai_messages;

create policy "ai messages own insert"
on public.ai_messages
for insert
to authenticated
with check (
  exists (
    select 1
    from public.ai_conversations c
    where c.id = ai_messages.conversation_id
      and c.user_id = auth.uid()
  )
);


drop policy if exists "ai messages own update"
on public.ai_messages;

create policy "ai messages own update"
on public.ai_messages
for update
to authenticated
using (
  exists (
    select 1
    from public.ai_conversations c
    where c.id = ai_messages.conversation_id
      and c.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.ai_conversations c
    where c.id = ai_messages.conversation_id
      and c.user_id = auth.uid()
  )
);


drop policy if exists "ai messages own delete"
on public.ai_messages;

create policy "ai messages own delete"
on public.ai_messages
for delete
to authenticated
using (
  exists (
    select 1
    from public.ai_conversations c
    where c.id = ai_messages.conversation_id
      and c.user_id = auth.uid()
  )
);