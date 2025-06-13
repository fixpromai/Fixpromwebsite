
  document.addEventListener('DOMContentLoaded', () => {
    const avatarBtn = document.getElementById('avatarBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const userAvatar = document.getElementById('userAvatar');

    // Toggle dropdown
    avatarBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown?.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!userAvatar?.contains(e.target)) {
        profileDropdown?.classList.add('hidden');
      }
    });
  });
