document.addEventListener('DOMContentLoaded', () => {
  const profileDropdown = document.getElementById('profileDropdown');
  const avatarBtn = document.getElementById('avatarBtn');
  const userAvatar = document.getElementById('userAvatar');
  const signupBtn = document.getElementById('signupBtnNav');
  const emailDisplay = document.getElementById('userEmailDisplay');
  const avatarImg = document.getElementById('avatarImg');

  if (avatarImg) {
    avatarImg.src = "images/profile.png";
  }

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

  document.addEventListener('click', (e) => {
    if (!userAvatar.contains(e.target)) {
      profileDropdown?.classList.add('hidden', 'opacity-0', 'scale-y-95');
      profileDropdown?.classList.remove('opacity-100', 'scale-y-100');
    }
  });

  fetch('/api/auth/check-login', {
    method: 'GET',
    credentials: 'include',
  })
    .then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        const email = data.user?.email || '';

        if (signupBtn) signupBtn.classList.add('hidden');
        if (userAvatar) userAvatar.classList.remove('hidden');
        if (emailDisplay) emailDisplay.textContent = email;

        localStorage.setItem('fixpromUserEmail', email);

        // ✅ Redirect to Chrome Extension if flag is set
        const shouldRedirect = localStorage.getItem('redirectToExtension');
        if (shouldRedirect === 'true') {
          localStorage.removeItem('redirectToExtension');
          setTimeout(() => {
            window.open("https://chromewebstore.google.com/detail/fineaoekjmkdgnmeenfjdlkbnhlidmme", "_blank");
          }, 1000); // Optional delay
        }

      } else {
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
