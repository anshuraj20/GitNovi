-- ============================================================
-- GitNovi AI Conversations
-- ============================================================
-- Stores ChatGPT-style conversations and messages.
--
-- A user can only access their own conversations.
-- Messages belong to conversations and inherit ownership
-- through the conversation.
-- ============================================================


-- ============================================================
-- Conversations
-- ============================================================

create table if not exists ai_conversations (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  title text not null default 'New Git chat',

  model text,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


-- ============================================================
-- Messages
-- ============================================================

create table if not exists ai_messages (
  id uuid primary key default gen_random_uuid(),

  conversation_id uuid not null
    references ai_conversations(id)
    on delete cascade,

  role text not null
    check (role in ('user', 'assistant', 'system')),

  content text not null,

  model text,

  created_at timestamptz not null default now()
);


-- ============================================================
-- Indexes
-- ============================================================

create index if not exists ai_conversations_user_id_idx
  on ai_conversations(user_id);

create index if not exists ai_conversations_updated_at_idx
  on ai_conversations(updated_at desc);

create index if not exists ai_messages_conversation_id_idx
  on ai_messages(conversation_id);

create index if not exists ai_messages_created_at_idx
  on ai_messages(created_at);


-- ============================================================
-- Row Level Security
-- ============================================================

alter table ai_conversations enable row level security;

alter table ai_messages enable row level security;


-- ============================================================
-- Conversation policies
-- ============================================================

drop policy if exists "ai conversations own select"
  on ai_conversations;

create policy "ai conversations own select"
  on ai_conversations
  for select
  using (
    auth.uid() = user_id
  );


drop policy if exists "ai conversations own insert"
  on ai_conversations;

create policy "ai conversations own insert"
  on ai_conversations
  for insert
  with check (
    auth.uid() = user_id
  );


drop policy if exists "ai conversations own update"
  on ai_conversations;

create policy "ai conversations own update"
  on ai_conversations
  for update
  using (
    auth.uid() = user_id
  )
  with check (
    auth.uid() = user_id
  );


drop policy if exists "ai conversations own delete"
  on ai_conversations;

create policy "ai conversations own delete"
  on ai_conversations
  for delete
  using (
    auth.uid() = user_id
  );


-- ============================================================
-- Message policies
-- ============================================================

drop policy if exists "ai messages own select"
  on ai_messages;

create policy "ai messages own select"
  on ai_messages
  for select
  using (
    exists (
      select 1
      from ai_conversations
      where ai_conversations.id =
            ai_messages.conversation_id
        and ai_conversations.user_id =
            auth.uid()
    )
  );


drop policy if exists "ai messages own insert"
  on ai_messages;

create policy "ai messages own insert"
  on ai_messages
  for insert
  with check (
    exists (
      select 1
      from ai_conversations
      where ai_conversations.id =
            ai_messages.conversation_id
        and ai_conversations.user_id =
            auth.uid()
    )
  );


drop policy if exists "ai messages own update"
  on ai_messages;

create policy "ai messages own update"
  on ai_messages
  for update
  using (
    exists (
      select 1
      from ai_conversations
      where ai_conversations.id =
            ai_messages.conversation_id
        and ai_conversations.user_id =
            auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from ai_conversations
      where ai_conversations.id =
            ai_messages.conversation_id
        and ai_conversations.user_id =
            auth.uid()
    )
  );


drop policy if exists "ai messages own delete"
  on ai_messages;

create policy "ai messages own delete"
  on ai_messages
  for delete
  using (
    exists (
      select 1
      from ai_conversations
      where ai_conversations.id =
            ai_messages.conversation_id
        and ai_conversations.user_id =
            auth.uid()
    )
  );


-- ============================================================
-- Automatically keep conversation.updated_at fresh
-- ============================================================

create or replace function public.update_ai_conversation_timestamp()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.ai_conversations
  set updated_at = now()
  where id = new.conversation_id;

  return new;
end;
$$;


drop trigger if exists ai_messages_update_conversation_timestamp
  on ai_messages;


create trigger ai_messages_update_conversation_timestamp
after insert or update
on ai_messages
for each row
execute procedure public.update_ai_conversation_timestamp();