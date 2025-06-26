document.addEventListener('DOMContentLoaded', () => {
  const avatarBtn = document.getElementById('avatarBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  const userAvatar = document.getElementById('userAvatar');

  const logoutBtn = document.getElementById('logoutBtn');
  const logoutModal = document.getElementById('logoutModal');
  const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
  const cancelLogoutBtn = document.getElementById('cancelLogoutBtn');

  // Toggle dropdown
  avatarBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown?.classList.toggle('hidden');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (
      !userAvatar?.contains(target) &&
      !profileDropdown?.contains(target)
    ) {
      profileDropdown?.classList.add('hidden');
    }
  });

  // Show logout confirmation modal
  logoutBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown?.classList.add('hidden');
    logoutModal?.classList.remove('hidden');
  });

  // Confirm logout
  confirmLogoutBtn?.addEventListener('click', () => {
    localStorage.removeItem("fixpromJWT");      // <-- Updated!
    localStorage.removeItem("fixpromUserEmail");
    logoutModal?.classList.add('hidden');
    window.location.href = "/";
  });

  cancelLogoutBtn?.addEventListener('click', () => {
    logoutModal?.classList.add('hidden');
    if (typeof window.updateLoginUIFromSession === 'function') {
      window.updateLoginUIFromSession();
    }
  });
});