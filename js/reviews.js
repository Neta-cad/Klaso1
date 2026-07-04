// ===================================================
// Klaso — reviews & ratings helper functions
// Requires supabase-client.js to be loaded first
// ===================================================

async function submitReview(revieweeId, rating, comment, context) {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) return { success: false, message: 'Not logged in.' };

  const { error } = await supabaseClient
    .from('reviews')
    .upsert({
      reviewer_id: session.user.id,
      reviewee_id: revieweeId,
      rating: rating,
      comment: comment || null,
      context: context
    }, { onConflict: 'reviewer_id,reviewee_id,context' });

  if (error) {
    return { success: false, message: error.message };
  }
  return { success: true };
}

async function getReviewsFor(revieweeId) {
  const { data, error } = await supabaseClient
    .from('reviews')
    .select('*, profiles!reviews_reviewer_id_fkey(name, avatar_url)')
    .eq('reviewee_id', revieweeId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data;
}

async function getAverageRating(revieweeId) {
  const { data, error } = await supabaseClient
    .from('reviews')
    .select('rating')
    .eq('reviewee_id', revieweeId);

  if (error || !data || data.length === 0) {
    return { average: 0, count: 0 };
  }

  const sum = data.reduce((acc, r) => acc + r.rating, 0);
  return { average: (sum / data.length).toFixed(1), count: data.length };
}

function renderStars(rating) {
  const fullStars = Math.round(rating);
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += i <= fullStars ? '★' : '☆';
  }
  return stars;
}