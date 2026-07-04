// ===================================================
// Klaso — real jobs data layer (Supabase-powered)
// Requires supabase-client.js to be loaded first
// ===================================================

async function getJobs() {
  const { data, error } = await supabaseClient
    .from('jobs')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
  return data;
}

async function addJob(job) {
  const { data: { session } } = await supabaseClient.auth.getSession();

  if (!session) {
    return { success: false, message: 'You must be logged in to post a job.' };
  }

  const { data, error } = await supabaseClient
    .from('jobs')
    .insert({
      school_id: session.user.id,
      title: job.title,
      school_name: job.school,
      location: job.location,
      type: job.type,
      level: job.level,
      mode: job.mode,
      pay: job.pay,
      description: job.description
    })
    .select();

  if (error) {
    return { success: false, message: error.message };
  }
  return { success: true, job: data[0] };
}