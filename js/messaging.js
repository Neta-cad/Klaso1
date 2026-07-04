// ===================================================
// Klaso — messaging helper functions (Supabase-powered)
// Requires supabase-client.js to be loaded first
// ===================================================

// Get or create a conversation between the current user and another user
async function getOrCreateConversation(otherUserId) {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) return { success: false, message: 'Not logged in.' };

  const myId = session.user.id;

  // Always store the pair in a consistent order to match the unique constraint
  const userA = myId < otherUserId ? myId : otherUserId;
  const userB = myId < otherUserId ? otherUserId : myId;

  // Check if conversation already exists
  const { data: existing } = await supabaseClient
    .from('conversations')
    .select('*')
    .eq('user_a', userA)
    .eq('user_b', userB)
    .maybeSingle();

  if (existing) {
    return { success: true, conversation: existing };
  }

  // Create new conversation
  const { data: created, error } = await supabaseClient
    .from('conversations')
    .insert({ user_a: userA, user_b: userB })
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, conversation: created };
}

// Send a message in a conversation
async function sendMessage(conversationId, content) {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) return { success: false, message: 'Not logged in.' };

  const { error: msgError } = await supabaseClient
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: session.user.id,
      content: content
    });

  if (msgError) {
    return { success: false, message: msgError.message };
  }

  // Update conversation preview
  await supabaseClient
    .from('conversations')
    .update({ last_message: content, last_message_at: new Date().toISOString() })
    .eq('id', conversationId);

  return { success: true };
}

// Get all conversations for the current user, with other person's profile info
async function getMyConversations() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) return [];

  const myId = session.user.id;

  const { data, error } = await supabaseClient
    .from('conversations')
    .select('*')
    .or(`user_a.eq.${myId},user_b.eq.${myId}`)
    .order('last_message_at', { ascending: false });

  if (error || !data) return [];

  // For each conversation, fetch the OTHER person's profile
  const enriched = [];
  for (const conv of data) {
    const otherId = conv.user_a === myId ? conv.user_b : conv.user_a;
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('id, name, avatar_url')
      .eq('id', otherId)
      .single();

    enriched.push({ ...conv, otherUser: profile });
  }

  return enriched;
}

// Get all messages in a conversation
async function getMessages(conversationId) {
  const { data, error } = await supabaseClient
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) return [];
  return data;
}