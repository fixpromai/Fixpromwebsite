document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ googleLogin.js loaded');

  // ✅ Reuse session update logic from sessionCheck.js
  if (typeof window.updateLoginUIFromSession === 'function') {
    window.updateLoginUIFromSession();
  }

  const logoutBtn = document.getElementById('logoutBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  const avatarBtn = document.getElementById('avatarBtn');
  const userAvatar = document.getElementById('userAvatar');

  // 👆 Toggle dropdown on avatar click
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

      console.log('👆 Avatar clicked, dropdown toggled');
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
        window.location.reload(); // ✅ Re-run session check
      });
    });
  }
});
