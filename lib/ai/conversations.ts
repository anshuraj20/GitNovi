import { createClient } from '@/lib/supabase/server';

export type Conversation = {
  id: string;
  user_id: string;
  title: string;
  model: string | null;
  created_at: string;
  updated_at: string;
};

export type AIMessage = {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model: string | null;
  created_at: string;
};

export async function listConversations(
  userId: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ai_conversations')
    .select(
      'id,user_id,title,model,created_at,updated_at',
    )
    .eq('user_id', userId)
    .order('updated_at', {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `Failed to load conversations: ${error.message}`,
    );
  }

  return (data ?? []) as Conversation[];
}

export async function createConversation(
  userId: string,
  title = 'New Git chat',
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ai_conversations')
    .insert({
      user_id: userId,
      title,
    })
    .select(
      'id,user_id,title,model,created_at,updated_at',
    )
    .single();

  if (error) {
    throw new Error(
      `Failed to create conversation: ${error.message}`,
    );
  }

  return data as Conversation;
}

export async function getConversation(
  userId: string,
  conversationId: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ai_conversations')
    .select(
      'id,user_id,title,model,created_at,updated_at',
    )
    .eq('id', conversationId)
    .eq('user_id', userId)
    .single();

  if (error) {
    throw new Error(
      `Conversation not found: ${error.message}`,
    );
  }

  return data as Conversation;
}

export async function getMessages(
  userId: string,
  conversationId: string,
) {
  const supabase = await createClient();

  /*
   * The conversation ownership check is performed
   * before loading messages.
   */
  await getConversation(
    userId,
    conversationId,
  );

  const { data, error } = await supabase
    .from('ai_messages')
    .select(
      'id,conversation_id,role,content,model,created_at',
    )
    .eq(
      'conversation_id',
      conversationId,
    )
    .order('created_at', {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `Failed to load messages: ${error.message}`,
    );
  }

  return (data ?? []) as AIMessage[];
}

export async function addMessage(
  userId: string,
  conversationId: string,
  message: {
    role: AIMessage['role'];
    content: string;
    model?: string | null;
  },
) {
  const supabase = await createClient();

  /*
   * This also guarantees that the authenticated
   * user owns the conversation.
   */
  await getConversation(
    userId,
    conversationId,
  );

  const { data, error } = await supabase
    .from('ai_messages')
    .insert({
      conversation_id: conversationId,
      role: message.role,
      content: message.content,
      model: message.model ?? null,
    })
    .select(
      'id,conversation_id,role,content,model,created_at',
    )
    .single();

  if (error) {
    throw new Error(
      `Failed to save message: ${error.message}`,
    );
  }

  return data as AIMessage;
}

export async function updateConversation(
  userId: string,
  conversationId: string,
  updates: {
    title?: string;
    model?: string | null;
  },
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ai_conversations')
    .update(updates)
    .eq('id', conversationId)
    .eq('user_id', userId)
    .select(
      'id,user_id,title,model,created_at,updated_at',
    )
    .single();

  if (error) {
    throw new Error(
      `Failed to update conversation: ${error.message}`,
    );
  }

  return data as Conversation;
}

export async function deleteConversation(
  userId: string,
  conversationId: string,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('ai_conversations')
    .delete()
    .eq('id', conversationId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(
      `Failed to delete conversation: ${error.message}`,
    );
  }
}