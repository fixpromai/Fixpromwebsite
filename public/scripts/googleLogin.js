document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ googleLogin.js loaded');

  const signupBtnNav = document.getElementById('signupBtnNav');
  const userAvatar = document.getElementById('userAvatar');
  const userEmailDisplay = document.getElementById('userEmailDisplay');
  const logoutBtn = document.getElementById('logoutBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  const avatarBtn = document.getElementById('avatarBtn');

  // ✅ Check session on load
  fetch('https://fixpromwebsite.onrender.com/api/auth/check-login', {
    method: 'GET',
    credentials: 'include',
  })
    .then(async (res) => {
      if (!res.ok) throw new Error('Not logged in');
      const data = await res.json();
      const user = data.user;

      // ✅ Update UI
      if (userEmailDisplay) userEmailDisplay.textContent = user.email || '';
      if (signupBtnNav) {
        signupBtnNav.classList.add('hidden');
        signupBtnNav.style.display = 'none';
      }
      if (userAvatar) {
        userAvatar.classList.remove('hidden');
        userAvatar.style.display = 'block';
      }
      localStorage.setItem('fixpromUserEmail', user.email || '');
    })
    .catch(() => {
      console.log('⚠️ No active session (Google login not found)');
      if (signupBtnNav) {
        signupBtnNav.classList.remove('hidden');
        signupBtnNav.style.display = 'inline-flex';
      }
      if (userAvatar) {
        userAvatar.classList.add('hidden');
        userAvatar.style.display = 'none';
      }
      if (userEmailDisplay) {
        userEmailDisplay.textContent = '';
      }
      localStorage.removeItem('fixpromUserEmail');
    });

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

  // ❌ Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!userAvatar.contains(e.target)) {
      profileDropdown?.classList.add('hidden', 'opacity-0', 'scale-y-95');
      profileDropdown?.classList.remove('opacity-100', 'scale-y-100');
    }
  });

  // 🚪 Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      fetch('https://fixpromwebsite.onrender.com/api/auth/logout', {
        method: 'GET',
        credentials: 'include',
      }).then(() => {
        // Clear UI
        if (userEmailDisplay) userEmailDisplay.textContent = '';
        if (signupBtnNav) {
          signupBtnNav.classList.remove('hidden');
          signupBtnNav.style.display = 'inline-flex';
        }
        if (userAvatar) {
          userAvatar.classList.add('hidden');
          userAvatar.style.display = 'none';
        }
        if (profileDropdown) {
          profileDropdown.classList.add('hidden', 'opacity-0', 'scale-y-95');
          profileDropdown.classList.remove('opacity-100', 'scale-y-100');
        }
        localStorage.removeItem('fixpromUserEmail');
        window.location.reload(); // Optional: reload after logout
      });
    });
  }
});
