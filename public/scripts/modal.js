document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle (future use)
  const mobileBtn = document.getElementById('mobileMenuBtn');
  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      // Placeholder for mobile menu toggle
    });
  }

  // Smooth scrolling for anchor links — only valid targets
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.warn('⚠️ Target not found for:', href);
      }
    });
  });

  // Show/Hide password in Signup
  const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
    });
  }

  // Show/Hide password in Signin
  const signinPasswordInput = document.getElementById('signinPassword');
  const toggleSigninPassword = document.getElementById('toggleSigninPassword');
  if (toggleSigninPassword && signinPasswordInput) {
    toggleSigninPassword.addEventListener('click', () => {
      const type = signinPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      signinPasswordInput.setAttribute('type', type);
      toggleSigninPassword.textContent = type === 'password' ? '👁️' : '🙈';
    });
  }
});

// Toggle Signup/Signin modal
function toggleModal() {
  const modal = document.getElementById('signupModal');
  const signupForm = document.getElementById('signupForm');
  const signinForm = document.getElementById('signinForm');

  modal.classList.toggle('hidden');

  if (modal.classList.contains('hidden')) {
    signupForm.reset();
    signinForm.reset();
    signupForm.classList.remove('hidden');
    signinForm.classList.add('hidden');
    document.getElementById('signupMessage').textContent = '';
    document.getElementById('signinMessage').textContent = '';
  } else {
    signupForm.classList.remove('hidden');
    signinForm.classList.add('hidden');
  }
}

// Switch form inside modal
function toggleAuth(view) {
  const signupForm = document.getElementById('signupForm');
  const signinForm = document.getElementById('signinForm');

  if (view === 'signin') {
    signupForm.classList.add('hidden');
    signinForm.classList.remove('hidden');
  } else {
    signinForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
  }

  signupForm.reset();
  signinForm.reset();
  document.getElementById('signupMessage').textContent = '';
  document.getElementById('signinMessage').textContent = '';
}

// OTP modal control
function openOtpModal() {
  document.getElementById('otpModal').classList.remove('hidden');
  startResendOtpTimer();
}

function closeOtpModal() {
  document.getElementById('otpModal').classList.add('hidden');
  document.getElementById('otpForm').reset();
  document.getElementById('otpMessage').textContent = '';

  const resendBtn = document.getElementById('resendOtpBtn');
  if (resendBtn) {
    resendBtn.disabled = false;
    resendBtn.textContent = 'Resend OTP';
  }
}

// Resend OTP cooldown
function startResendOtpTimer() {
  const resendBtn = document.getElementById('resendOtpBtn');
  if (!resendBtn) return;

  let seconds = 30;
  resendBtn.disabled = true;
  resendBtn.textContent = `Resend OTP in ${seconds}s`;

  const timer = setInterval(() => {
    seconds--;
    resendBtn.textContent = `Resend OTP in ${seconds}s`;

    if (seconds <= 0) {
      clearInterval(timer);
      resendBtn.disabled = false;
      resendBtn.textContent = 'Resend OTP';
    }
  }, 1000);
}

// Forgot Password modal control
function openForgotPasswordModal() {
  document.getElementById('forgotPasswordModal').classList.remove('hidden');
  document.getElementById('forgotPasswordForm').reset();
  document.getElementById('forgotMessage').textContent = '';
  document.getElementById('forgotOtpSection').classList.add('hidden');
  document.getElementById('resetPasswordSection').classList.add('hidden');
  document.getElementById('resendForgotOtpBtn').classList.add('hidden');

  // Remove 'required' from OTP boxes to prevent focus error on hidden inputs
  document.querySelectorAll('.otp-box').forEach(box => box.removeAttribute('required'));

  // Reset step
  if (typeof currentStep !== 'undefined') {
    currentStep = 'email';
  }

  const emailInput = document.getElementById('forgotEmail');
  if (emailInput) emailInput.disabled = false;
}

function closeForgotPasswordModal() {
  document.getElementById('forgotPasswordModal').classList.add('hidden');
  document.getElementById('forgotPasswordForm').reset();
  document.getElementById('forgotMessage').textContent = '';
  document.getElementById('forgotOtpSection').classList.add('hidden');
  document.getElementById('resetPasswordSection').classList.add('hidden');
  document.getElementById('resendForgotOtpBtn').classList.add('hidden');

  // Remove 'required' from OTP boxes here as well
  document.querySelectorAll('.otp-box').forEach(box => box.removeAttribute('required'));
}

document.addEventListener('DOMContentLoaded', () => {
    const avatarBtn = document.getElementById('avatarBtn');
    const dropdown = document.getElementById('profileDropdown');

    if (avatarBtn) {
      avatarBtn.addEventListener('click', () => {
        dropdown.classList.toggle('hidden');
      });
    }

    // Optional: Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!document.getElementById('userAvatar').contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });

    // Dummy logout logic (replace with actual logic)
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        alert('Logging out...');
        // Hide avatar and show signup button again
        document.getElementById('userAvatar').classList.add('hidden');
        document.getElementById('signupBtnNav').classList.remove('hidden');
      });
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
  const googleBtn = document.getElementById('googleSignIn');
  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      window.location.href = 'http://localhost:5000/auth/google';
    });
  }
});
