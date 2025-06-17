document.addEventListener("DOMContentLoaded", () => {
  checkSession();

  function checkSession() {
    fetch("/api/auth/check-login", {
      method: "GET",
      credentials: "include", // ✅ Required to send cookies
    })
      .then(async (res) => {
        const avatar = document.getElementById("userAvatar");
        const avatarImg = document.getElementById("avatarImg");
        const signupBtn = document.getElementById("signupBtnNav");
        const emailDisplay = document.getElementById("userEmailDisplay");

        if (res.ok) {
          const data = await res.json();
          const email = data.user?.email || "";

          // ✅ Hide signup, show avatar
          if (signupBtn) {
            signupBtn.classList.add("hidden");
            signupBtn.style.display = "none";
          }
          if (avatar) {
            avatar.classList.remove("hidden");
            avatar.style.display = "block";
          }
          if (avatarImg) {
            avatarImg.src = "images/profile.png"; // ✅ Always show this default image
          }
          if (emailDisplay) {
            emailDisplay.textContent = email;
          }

          localStorage.setItem("fixpromUserEmail", email);

          // ✅ Redirect to extension if user had clicked "Download Extension" before login
          if (typeof onUserLoginSuccess === "function") {
            onUserLoginSuccess();
          }

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
