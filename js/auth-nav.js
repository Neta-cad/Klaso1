// ===================================================
// Klaso — updates the navbar based on login state
// Include this AFTER supabase-client.js on every page
// ===================================================

async function updateNav() {
  const navActions = document.getElementById('navActions');
  if (!navActions) return;

  const { data: { session } } = await supabaseClient.auth.getSession();

  if (session) {
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('name, role, is_admin')
      .eq('id', session.user.id)
      .single();

    const firstName = profile ? profile.name.split(' ')[0] : 'Account';

    const prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
    const unreadCount = typeof getUnreadCount === 'function' ? await getUnreadCount() : 0;

    const navLinksEl = document.getElementById('navLinks');
    if (navLinksEl && profile) {
      if (profile.role === 'school') {
        navLinksEl.innerHTML = `
          <a href="${prefix}school-dashboard.html">Dashboard</a>
          <a href="${prefix}my-jobs.html">My Jobs</a>
          <a href="${prefix}post-job.html">Post a Job</a>
          <a href="${prefix}resources.html">Resources</a>
        `;
      } else if (profile.role === 'teacher') {
        navLinksEl.innerHTML = `
          <a href="${prefix}teacher-dashboard.html">Dashboard</a>
          <a href="${prefix}jobs.html">Browse Jobs</a>
          <a href="${prefix}my-applications.html">My Applications</a>
          <a href="${prefix}resources.html">Resources</a>
        `;
      } else if (profile.role === 'tutor') {
        navLinksEl.innerHTML = `
          <a href="${prefix}tutor-dashboard.html">Dashboard</a>
          <a href="${prefix}my-bookings.html">My Bookings</a>
          <a href="${prefix}become-tutor.html">Edit Listing</a>
          <a href="${prefix}resources.html">Resources</a>
        `;
      } else if (profile.role === 'student') {
        navLinksEl.innerHTML = `
          <a href="${prefix}student-dashboard.html">Dashboard</a>
          <a href="${prefix}tutors.html">Find Tutors</a>
          <a href="${prefix}my-learning.html">My Learning</a>
          <a href="${prefix}resources.html">Resources</a>
        `;
      }
    }

    let dashboardLink = '';
    if (profile && profile.role === 'school') {
      dashboardLink = `<a href="${prefix}school-dashboard.html" class="btn btn-ghost btn-sm">Dashboard</a>`;
    } else if (profile && profile.role === 'tutor') {
      dashboardLink = `<a href="${prefix}tutor-dashboard.html" class="btn btn-ghost btn-sm">Dashboard</a>`;
    } else if (profile && profile.role === 'teacher') {
      dashboardLink = `<a href="${prefix}teacher-dashboard.html" class="btn btn-ghost btn-sm">Dashboard</a>`;
    } else if (profile && profile.role === 'student') {
      dashboardLink = `<a href="${prefix}student-dashboard.html" class="btn btn-ghost btn-sm">Dashboard</a>`;
    }

    let adminLink = '';
    if (profile && profile.is_admin) {
      adminLink = `<a href="${prefix}admin.html" class="btn btn-ghost btn-sm" title="Admin dashboard">👑</a>`;
    }

    navActions.innerHTML = `
     ${adminLink}
      ${dashboardLink}
      <a href="${prefix}notifications.html" class="btn btn-ghost btn-sm" style="position:relative;">
        🔔${unreadCount > 0 ? `<span style="position:absolute; top:-4px; right:-4px; background:var(--coral); color:white; font-size:0.62rem; font-weight:700; border-radius:999px; width:16px; height:16px; display:flex; align-items:center; justify-content:center;">${unreadCount > 9 ? '9+' : unreadCount}</span>` : ''}
      </a>
      <a href="${prefix}messages.html" class="btn btn-ghost btn-sm">💬</a>
      <a href="${prefix}referrals.html" class="btn btn-ghost btn-sm">🎁</a>
      <a href="${prefix}profile.html" style="font-size:0.88rem; color:var(--slate); margin-right:4px; text-decoration:underline;">Hi, ${firstName}</a>
      <button id="logoutBtn" class="btn btn-ghost btn-sm">Log out</button>
    `;

    document.getElementById('logoutBtn').addEventListener('click', async () => {
      await supabaseClient.auth.signOut();
      window.location.reload();
    });
  }
  // If no session, leave the default "Log in / Get started" buttons as-is
}

updateNav();