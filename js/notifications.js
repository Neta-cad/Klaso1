// ===================================================
// Klaso — notifications helper functions
// Requires supabase-client.js to be loaded first
// ===================================================

async function createNotification(userId, type, message, link) {
  await supabaseClient
    .from('notifications')
    .insert({
      user_id: userId,
      type: type,
      message: message,
      link: link || null
    });
}

async function getMyNotifications() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) return [];

  const { data, error } = await supabaseClient
    .from('notifications')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(30);

  if (error || !data) return [];
  return data;
}

async function getUnreadCount() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) return 0;

  const { count } = await supabaseClient
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', session.user.id)
    .eq('read', false);

  return count || 0;
}

async function markNotificationRead(notificationId) {
  await supabaseClient
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);
}

async function markAllRead() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) return;

  await supabaseClient
    .from('notifications')
    .update({ read: true })
    .eq('user_id', session.user.id)
    .eq('read', false);
}