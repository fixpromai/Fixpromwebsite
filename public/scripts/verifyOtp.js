document.addEventListener('DOMContentLoaded', () => {
  const otpForm = document.getElementById('otpForm');
  const otpMessage = document.getElementById('otpMessage');
  const signupBtnNav = document.getElementById('signupBtnNav');
  const userAvatar = document.getElementById('userAvatar');
  const resendOtpBtn = document.getElementById('resendOtpBtn');

  const boxes = Array.from(document.querySelectorAll('.otp-box'));
  boxes.forEach((box, idx) => {
    box.addEventListener('input', (e) => {
      const value = e.target.value;
      if (value.length === 1 && idx < boxes.length - 1) {
        boxes[idx + 1].focus();
      }
    });

    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !box.value && idx > 0) {
        boxes[idx - 1].focus();
      }
    });
  });

  // 🔐 Verify Signup OTP
  if (otpForm) {
    otpForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = localStorage.getItem('signupEmail');
      const otp = boxes.map(box => box.value.trim()).join('');

      if (!email || otp.length < 6) {
        otpMessage.textContent = 'Enter all 6 digits of the OTP';
        otpMessage.classList.remove('text-green-600');
        otpMessage.classList.add('text-red-500');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/verify-signup-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp }),
        });

        const data = await response.json();

        if (response.ok) {
          otpMessage.textContent = '✅ Email verified successfully!';
          otpMessage.classList.remove('text-red-500');
          otpMessage.classList.add('text-green-600');

          boxes.forEach(box => box.disabled = true);

          setTimeout(() => {
            closeOtpModal();
            document.getElementById('signupModal')?.classList.add('hidden');
            signupBtnNav?.classList.add('hidden');
            userAvatar?.classList.remove('hidden');
            localStorage.removeItem('signupEmail');
          }, 1500);
        } else {
          otpMessage.textContent = data.message || 'Invalid or expired OTP';
          otpMessage.classList.remove('text-green-600');
          otpMessage.classList.add('text-red-500');
        }
      } catch (err) {
        otpMessage.textContent = 'Server error. Try again later.';
        otpMessage.classList.remove('text-green-600');
        otpMessage.classList.add('text-red-500');
        console.error(err);
      }
    });
  }

  // 🔁 Resend Signup OTP
  if (resendOtpBtn) {
    resendOtpBtn.addEventListener('click', async () => {
      const email = localStorage.getItem('signupEmail');

      if (!email) {
        otpMessage.textContent = 'Missing email. Please start signup again.';
        otpMessage.classList.remove('text-green-600');
        otpMessage.classList.add('text-red-500');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/resend-signup-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          otpMessage.textContent = '📩 New OTP sent to your email.';
          otpMessage.classList.remove('text-red-500');
          otpMessage.classList.add('text-green-600');

          boxes.forEach(box => {
            box.disabled = false;
            box.value = '';
          });
          boxes[0].focus();
        } else {
          otpMessage.textContent = data.message || 'Resend failed.';
          otpMessage.classList.remove('text-green-600');
          otpMessage.classList.add('text-red-500');
        }
      } catch (err) {
        otpMessage.textContent = 'Server error. Please try again.';
        otpMessage.classList.remove('text-green-600');
        otpMessage.classList.add('text-red-500');
        console.error(err);
      }
    });
  }
});
