document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const signupMessage = document.getElementById('signupMessage');
  const otpModal = document.getElementById('otpModal');
  const otpInput = document.getElementById('otpInput');
  const resendBtn = document.getElementById('resendSignupOtpBtn');
  const otpTimerDisplay = document.getElementById('signupOtpTimer');
  const otpMessage = document.getElementById('otpMessage');
  const verifyOtpBtn = document.getElementById('verifyOtpBtn');

  let signupRequestInProgress = false;
  let resendCountdown = 30;
  let resendInterval;

  // ✅ Update UI after login/signup
  function updateLoginUI(email) {
    console.log("🧩 updateLoginUI called with:", email);
    localStorage.setItem('fixpromUserEmail', email);

    const signupBtnNav = document.getElementById('signupBtnNav');
    const userAvatar = document.getElementById('userAvatar');
    const userEmailDisplay = document.getElementById('userEmailDisplay');

    if (signupBtnNav) {
      signupBtnNav.classList.add('hidden');
      signupBtnNav.style.display = 'none';
      console.log("👋 Hiding signup button");
    } else {
      console.warn("❌ signupBtnNav not found");
    }

    if (userAvatar) {
      userAvatar.classList.remove('hidden');
      userAvatar.style.display = 'block';
      console.log("👤 Showing user avatar");
    } else {
      console.warn("❌ userAvatar not found");
    }

    if (userEmailDisplay) {
      userEmailDisplay.textContent = email;
      console.log("📧 Displaying user email:", email);
    }
  }

  // 🟢 Signup Form Submit
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (signupRequestInProgress) return;
      signupRequestInProgress = true;

      const email = document.getElementById('email')?.value.trim();
      const password = document.getElementById('password')?.value.trim();
      const marketingConsent = document.getElementById('marketingConsent')?.checked;

      if (!email || !password) {
        signupMessage.textContent = 'Please fill all fields.';
        signupMessage.style.color = 'red';
        signupRequestInProgress = false;
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/auth/request-signup-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password, subscribed: marketingConsent })
        });

        const data = await res.json();
        if (res.ok) {
          signupMessage.textContent = '📩 OTP sent to your email.';
          signupMessage.style.color = 'green';
          localStorage.setItem('signupEmail', email);
          signupForm.reset();

          setTimeout(() => {
            otpModal?.classList.remove('hidden');
            otpInput?.focus();
            startResendTimer();
          }, 100);
        } else {
          signupMessage.textContent = data.message || 'Signup failed.';
          signupMessage.style.color = 'red';
        }
      } catch (err) {
        console.error('Signup OTP Error:', err);
        signupMessage.textContent = 'Server error. Try again.';
        signupMessage.style.color = 'red';
      } finally {
        signupRequestInProgress = false;
      }
    });
  }

  // 🔁 Resend OTP
  if (resendBtn) {
    resendBtn.addEventListener('click', async () => {
      const email = localStorage.getItem('signupEmail');
      if (!email || resendBtn.disabled) return;
      resendBtn.disabled = true;

      try {
        const res = await fetch('http://localhost:5000/api/auth/request-signup-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (res.ok) {
          otpMessage.textContent = '📩 OTP resent.';
          otpMessage.style.color = 'green';
          startResendTimer();
        } else {
          otpMessage.textContent = data.message || 'Failed to resend OTP.';
          otpMessage.style.color = 'red';
          resendBtn.disabled = false;
        }
      } catch (err) {
        otpMessage.textContent = 'Server error. Try again.';
        otpMessage.style.color = 'red';
        resendBtn.disabled = false;
      }
    });
  }

  function startResendTimer() {
    resendBtn.disabled = true;
    resendCountdown = 30;
    otpTimerDisplay.textContent = resendCountdown;
    resendInterval = setInterval(() => {
      resendCountdown--;
      otpTimerDisplay.textContent = resendCountdown;
      if (resendCountdown <= 0) {
        clearInterval(resendInterval);
        resendBtn.disabled = false;
        otpTimerDisplay.textContent = '0';
      }
    }, 1000);
  }

  // ✅ Verify OTP and update UI directly
  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', async () => {
      const otp = otpInput?.value.trim();
      const email = localStorage.getItem('signupEmail');

      if (!otp || otp.length !== 6) {
        otpMessage.textContent = 'Enter the 6-digit OTP.';
        otpMessage.style.color = 'red';
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/auth/verify-signup-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, otp }),
        });

        const data = await res.json();

        if (res.ok) {
          otpMessage.textContent = '✅ Signup complete. You are logged in.';
          otpMessage.style.color = 'green';
          localStorage.removeItem('signupEmail');

          // 🔄 Confirm session and update UI
          fetch('http://localhost:5000/api/auth/check', {
            method: 'GET',
            credentials: 'include'
          })
            .then(async (res) => {
              if (res.ok) {
                const sessionData = await res.json();
                updateLoginUI(sessionData.user?.email);
              } else {
                updateLoginUI(email); // fallback if check-login fails
              }
            })
            .catch(() => updateLoginUI(email));

          // ✅ Close OTP modal and reload as a safety net
          setTimeout(() => {
            otpModal?.classList.add('hidden');
            location.reload();
          }, 1000);

        } else {
          otpMessage.textContent = data.message || 'Invalid OTP';
          otpMessage.style.color = 'red';
        }
      } catch (err) {
        otpMessage.textContent = 'Server error during verification.';
        otpMessage.style.color = 'red';
        console.error('OTP Verify Error:', err);
      }
    });
  }
});
