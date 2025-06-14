document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ googleLogin.js loaded');

  const logoutBtn = document.getElementById('logoutBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  const avatarBtn = document.getElementById('avatarBtn');
  const userAvatar = document.getElementById('userAvatar');
  const signupBtn = document.getElementById('signupBtnNav');
  const emailDisplay = document.getElementById('userEmailDisplay');
  const avatarImg = document.getElementById('avatarImg');

  // ✅ Set default avatar image
  if (avatarImg) {
    avatarImg.src = "images/profile.png";
  }

  // ✅ Toggle dropdown on avatar click
  if (avatarBtn && profileDropdown) {
    avatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('hidden');

      if (!profileDropdown.classList.contains('hidden')) {
        profileDropdown.classList.remove('opacity-0', 'scale-y-95');
        profileDropdown.classList.add('opacity-100', 'scale-y-100');
      } else {
        profileDropdown.classList.remove('opacity-100', 'scale-y-100');
        profileDropdown.classList.add('opacity-0', 'scale-y-95');
      }
    });
  }

  // ❌ Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!userAvatar.contains(e.target)) {
      profileDropdown?.classList.add('hidden', 'opacity-0', 'scale-y-95');
      profileDropdown?.classList.remove('opacity-100', 'scale-y-100');
    }
  });

  // 🚪 Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      fetch('/api/auth/logout', {
        method: 'GET',
        credentials: 'include',
      }).then(() => {
        localStorage.removeItem('fixpromUserEmail');
        window.location.reload();
      });
    });
  }

  // ✅ Session check and UI update
  fetch('/api/auth/check-login', {
    method: 'GET',
    credentials: 'include',
  })
    .then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        const email = data.user?.email || '';

        // ✅ Logged in - update UI
        if (signupBtn) signupBtn.classList.add('hidden');
        if (userAvatar) userAvatar.classList.remove('hidden');
        if (emailDisplay) emailDisplay.textContent = email;

        localStorage.setItem('fixpromUserEmail', email);
      } else {
        // ❌ Not logged in - reset UI
        if (signupBtn) signupBtn.classList.remove('hidden');
        if (userAvatar) userAvatar.classList.add('hidden');
        if (emailDisplay) emailDisplay.textContent = '';
        localStorage.removeItem('fixpromUserEmail');
      }
    })
    .catch((err) => {
      console.error('❌ Session check failed', err);
    });
});
