document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signinForm');
  const message = document.getElementById('signinMessage');

  const forgotForm = document.getElementById('forgotPasswordForm');
  const forgotMessage = document.getElementById('forgotMessage');
  const forgotEmailInput = document.getElementById('forgotEmail');
  const otpInputs = document.querySelectorAll('.otp-box');
  const forgotOtpSection = document.getElementById('forgotOtpSection');
  const resetPasswordSection = document.getElementById('resetPasswordSection');
  const resendOtpBtn = document.getElementById('resendForgotOtpBtn');
  const resendBlock = document.getElementById('forgotResendBlock');
  const newPasswordInput = document.getElementById('newPassword');
  const toggleForgotPassword = document.getElementById('toggleForgotPassword');
  const userEmailDisplay = document.getElementById('userEmailDisplay');
  const signupBtnNav = document.getElementById('signupBtnNav');
  const userAvatar = document.getElementById('userAvatar');
  const logoutBtn = document.getElementById('logoutBtn');

  let forgotEmail = '';
  let currentOtp = '';
  let resendInterval = null;

  // ✅ Check session login status on page load (real session check)
  fetch('http://localhost:5000/api/auth/check-login', {
    credentials: 'include'
  })
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        localStorage.setItem('fixpromUserEmail', data.user.email);
        if (userEmailDisplay) userEmailDisplay.textContent = data.user.email;
        if (signupBtnNav) {
          signupBtnNav.classList.add('hidden');
          signupBtnNav.style.display = 'none';
        }
        if (userAvatar) {
          userAvatar.classList.remove('hidden');
          userAvatar.style.display = 'block';
        }
      } else {
        localStorage.removeItem('fixpromUserEmail');
        if (userEmailDisplay) userEmailDisplay.textContent = '';
        if (signupBtnNav) {
          signupBtnNav.classList.remove('hidden');
          signupBtnNav.style.display = 'inline-block';
        }
        if (userAvatar) {
          userAvatar.classList.add('hidden');
          userAvatar.style.display = 'none';
        }
      }
    })
    .catch(() => {
      localStorage.removeItem('fixpromUserEmail');
    });

  // 🔐 Login Handler
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('signinEmail').value.trim();
      const password = document.getElementById('signinPassword').value.trim();

      try {
        const response = await fetch('http://localhost:5000/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
          message.textContent = '✅ Login successful';
          message.style.color = 'green';
          form.reset();

          localStorage.setItem('fixpromUserEmail', email);

          setTimeout(() => {
            toggleModal();
            if (signupBtnNav) {
              signupBtnNav.classList.add('hidden');
              signupBtnNav.style.display = 'none';
            }
            if (userAvatar) {
              userAvatar.classList.remove('hidden');
              userAvatar.style.display = 'block';
            }
            if (userEmailDisplay) userEmailDisplay.textContent = email;
          }, 1000);
        } else {
          message.textContent = data.message || '❌ Login failed';
          message.style.color = 'red';
        }
      } catch (error) {
        message.textContent = '❌ Server error. Please try again.';
        message.style.color = 'red';
        console.error(error);
      }
    });
  }

  // 🔁 Forgot Password Handler
  if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!forgotOtpSection.classList.contains('hidden') && resetPasswordSection.classList.contains('hidden')) {
        currentOtp = Array.from(otpInputs).map(input => input.value.trim()).join('');
        if (currentOtp.length !== 6) {
          forgotMessage.textContent = '❌ Please enter all 6 digits of the OTP.';
          forgotMessage.style.color = 'red';
          return;
        }

        try {
          const res = await fetch('http://localhost:5000/api/auth/verify-forgot-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: forgotEmail, otp: currentOtp }),
          });

          const data = await res.json();
          if (res.ok) {
            forgotMessage.textContent = '✅ OTP Verified! Now set your new password.';
            forgotMessage.style.color = 'green';
            forgotOtpSection.classList.add('hidden');
            resetPasswordSection.classList.remove('hidden');
          } else {
            forgotMessage.textContent = data.message || '❌ Invalid OTP.';
            forgotMessage.style.color = 'red';
          }
        } catch (err) {
          forgotMessage.textContent = '❌ Server error. Please try again.';
          forgotMessage.style.color = 'red';
        }

      } else if (!resetPasswordSection.classList.contains('hidden')) {
        const newPassword = newPasswordInput.value.trim();
        const pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

        if (!pattern.test(newPassword)) {
          forgotMessage.textContent = '❌ Password must have 6+ chars, 1 uppercase, 1 number, 1 special char.';
          forgotMessage.style.color = 'red';
          return;
        }

        try {
          const res = await fetch('http://localhost:5000/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: forgotEmail, otp: currentOtp, newPassword }),
          });

          const data = await res.json();
          if (res.ok) {
            forgotMessage.textContent = '✅ Password successfully reset.';
            forgotMessage.style.color = 'green';
            setTimeout(() => {
              closeForgotPasswordModal();
              resetForgotPasswordFlow();
            }, 1500);
          } else {
            forgotMessage.textContent = data.message || '❌ Reset failed.';
            forgotMessage.style.color = 'red';
          }
        } catch (err) {
          forgotMessage.textContent = '❌ Server error. Please try again.';
          forgotMessage.style.color = 'red';
        }

      } else {
        forgotEmail = forgotEmailInput.value.trim();
        if (!forgotEmail) {
          forgotMessage.textContent = 'Please enter your email.';
          forgotMessage.style.color = 'red';
          return;
        }

        try {
          const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: forgotEmail }),
          });

          const data = await res.json();
          if (res.ok) {
            forgotMessage.textContent = '📩 OTP sent to your email.';
            forgotMessage.style.color = 'green';
            forgotOtpSection.classList.remove('hidden');
            forgotEmailInput.setAttribute('readonly', true);
            forgotEmailInput.classList.add('opacity-60', 'cursor-not-allowed');
            resendOtpBtn.classList.remove('hidden');
            resendBlock.classList.remove('hidden');
            otpInputs.forEach(input => input.value = '');
            otpInputs[0].focus();
            startResendForgotOtpTimer();
          } else {
            forgotMessage.textContent = data.message || '❌ OTP send failed.';
            forgotMessage.style.color = 'red';
          }
        } catch (err) {
          forgotMessage.textContent = '❌ Server error. Please try again.';
          forgotMessage.style.color = 'red';
        }
      }
    });

    resendOtpBtn.addEventListener('click', async () => {
      if (!forgotEmail) return;
      try {
        const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: forgotEmail }),
        });

        const data = await res.json();
        if (res.ok) {
          forgotMessage.textContent = '📩 OTP resent.';
          forgotMessage.style.color = 'green';
          otpInputs.forEach(input => input.value = '');
          otpInputs[0].focus();
          startResendForgotOtpTimer();
        } else {
          forgotMessage.textContent = data.message || '❌ OTP resend failed.';
          forgotMessage.style.color = 'red';
        }
      } catch (err) {
        forgotMessage.textContent = '❌ Server error. Try again later.';
        forgotMessage.style.color = 'red';
      }
    });
  }

  otpInputs.forEach((box, idx) => {
    box.addEventListener('input', () => {
      if (box.value.length === 1 && idx < otpInputs.length - 1) {
        otpInputs[idx + 1].focus();
      }
    });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !box.value && idx > 0) {
        otpInputs[idx - 1].focus();
      }
    });
  });

  function startResendForgotOtpTimer() {
    let seconds = 30;
    resendOtpBtn.disabled = true;
    resendOtpBtn.textContent = `Resend OTP in ${seconds}s`;
    clearInterval(resendInterval);
    resendInterval = setInterval(() => {
      seconds--;
      resendOtpBtn.textContent = `Resend OTP in ${seconds}s`;
      if (seconds <= 0) {
        clearInterval(resendInterval);
        resendOtpBtn.disabled = false;
        resendOtpBtn.textContent = 'Resend OTP';
      }
    }, 1000);
  }

  if (toggleForgotPassword && newPasswordInput) {
    toggleForgotPassword.addEventListener('click', () => {
      const isPassword = newPasswordInput.type === 'password';
      newPasswordInput.type = isPassword ? 'text' : 'password';
      toggleForgotPassword.textContent = isPassword ? '🙈' : '👁️';
    });
  }

  function resetForgotPasswordFlow() {
    forgotForm.reset();
    forgotOtpSection.classList.add('hidden');
    resetPasswordSection.classList.add('hidden');
    resendOtpBtn.classList.add('hidden');
    resendBlock.classList.add('hidden');
    forgotEmail = '';
    currentOtp = '';
    forgotEmailInput.removeAttribute('readonly');
    forgotEmailInput.classList.remove('opacity-60', 'cursor-not-allowed');
    forgotMessage.textContent = '';
    otpInputs.forEach(input => input.value = '');
    resendOtpBtn.disabled = false;
    resendOtpBtn.textContent = 'Resend OTP';
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('fixpromUserEmail');
      if (userEmailDisplay) userEmailDisplay.textContent = '';
      if (signupBtnNav) {
        signupBtnNav.classList.remove('hidden');
        signupBtnNav.style.display = 'inline-block';
      }
      if (userAvatar) {
        userAvatar.classList.add('hidden');
        userAvatar.style.display = 'none';
      }
    });
  }
});
