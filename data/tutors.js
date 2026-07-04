// ===================================================
// Klaso — real tutor listings data layer (Supabase-powered)
// Requires supabase-client.js to be loaded first
// ===================================================

async function getTutors() {
  const { data, error } = await supabaseClient
    .from('tutor_listings')
    .select('*, profiles(name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tutors:', error);
    return [];
  }

  // Flatten the joined profile name onto each tutor object
  return data.map(t => ({
    ...t,
    name: t.profiles ? t.profiles.name : 'Tutor'
  }));
}

async function addTutorListing(listing) {
  const { data: { session } } = await supabaseClient.auth.getSession();

  if (!session) {
    return { success: false, message: 'You must be logged in to create a tutor listing.' };
  }

  const { data, error } = await supabaseClient
    .from('tutor_listings')
    .insert({
      tutor_id: session.user.id,
      subjects: listing.subjects,
      location: listing.location,
      mode: listing.mode,
      rate: listing.rate,
      bio: listing.bio,
      availability: listing.availability
    })
    .select();

  if (error) {
    return { success: false, message: error.message };
  }
  return { success: true, listing: data[0] };
}