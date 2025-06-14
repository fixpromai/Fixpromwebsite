document.addEventListener("DOMContentLoaded", () => {
  checkSession();

  function checkSession() {
    fetch("https://fixpromwebsite.onrender.com/api/auth/check-login", {
      method: "GET",
      credentials: "include", // ✅ Required to send cookies
    })
      .then(async (res) => {
        const avatar = document.getElementById("userAvatar");
        const avatarImg = document.getElementById("avatarImg"); // 🆕 added
        const signupBtn = document.getElementById("signupBtnNav");
        const emailDisplay = document.getElementById("userEmailDisplay");

        if (res.ok) {
          const data = await res.json();
          const email = data.user?.email || "";
          const photo = data.user?.photo || ""; // 🆕 from Google

          // ✅ Hide signup, show avatar
          if (signupBtn) {
            signupBtn.classList.add("hidden");
            signupBtn.style.display = "none";
          }
          if (avatar) {
            avatar.classList.remove("hidden");
            avatar.style.display = "block";
          }
          if (avatarImg && photo) {
            avatarImg.src = photo; // 🆕 set Google profile photo
          }
          if (emailDisplay) {
            emailDisplay.textContent = email;
          }

          localStorage.setItem("fixpromUserEmail", email);
        } else {
          resetLoginUI();
        }
      })
      .catch((err) => {
        console.error("⚠️ Session check failed:", err);
        resetLoginUI();
      });
  }

  function resetLoginUI() {
    const avatar = document.getElementById("userAvatar");
    const signupBtn = document.getElementById("signupBtnNav");
    const emailDisplay = document.getElementById("userEmailDisplay");

    if (avatar) {
      avatar.classList.add("hidden");
      avatar.style.display = "none";
    }
    if (signupBtn) {
      signupBtn.classList.remove("hidden");
      signupBtn.style.display = "inline-flex";
    }
    if (emailDisplay) {
      emailDisplay.textContent = "";
    }

    localStorage.removeItem("fixpromUserEmail");
  }

  // ✅ Allow re-checking from other scripts
  window.updateLoginUIFromSession = checkSession;
});
