// ===================================================
// Klaso — shared site behavior (mobile menu + scroll reveal)
// ===================================================

document.addEventListener('DOMContentLoaded', () => {

  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navActions = document.querySelector('.nav-actions');
  const navBar = document.querySelector('.nav');
  let mobileMenu = null;

  if (toggle && navLinks && navActions && navBar) {
    toggle.addEventListener('click', () => {
      if (mobileMenu) {
        mobileMenu.remove();
        mobileMenu = null;
        return;
      }

      mobileMenu = document.createElement('div');
      mobileMenu.style.cssText = 'position:absolute; top:64px; left:0; right:0; background:var(--paper); border-bottom:1px solid var(--line); padding:18px 20px; display:flex; flex-direction:column; gap:12px; z-index:200; box-shadow:0 8px 20px rgba(0,0,0,0.08);';
      mobileMenu.innerHTML =
        navLinks.innerHTML +
        '<div style="height:1px; background:var(--line); margin:6px 0;"></div>' +
        navActions.innerHTML;

      navBar.appendChild(mobileMenu);

      // Re-attach logout behavior for the cloned button inside the mobile menu
      const buttons = mobileMenu.querySelectorAll('button');
      buttons.forEach(btn => {
        if (btn.textContent.trim() === 'Log out') {
          btn.addEventListener('click', async () => {
            if (typeof supabaseClient !== 'undefined') {
              await supabaseClient.auth.signOut();
            }
            const prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
            window.location.href = prefix + 'login.html';
          });
        }
      });

      // Close the menu if a link inside it is tapped
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.remove();
          mobileMenu = null;
        });
      });
    });
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }
});