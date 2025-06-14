document.addEventListener("DOMContentLoaded", () => {
  checkSession();

  function checkSession() {
    fetch("/api/auth/check-login", {
      method: "GET",
      credentials: "include", 
    })
      .then(async (res) => {
        const avatar = document.getElementById("userAvatar");
        const signupBtn = document.getElementById("signupBtnNav");
        const emailDisplay = document.getElementById("userEmailDisplay");

        if (res.ok) {
          const data = await res.json();
          const email = data.user?.email || "";

          if (signupBtn) {
            signupBtn.classList.add("hidden");
            signupBtn.style.display = "none";
          }
          if (avatar) {
            avatar.classList.remove("hidden");
            avatar.style.display = "block";
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
        console.error("⚠️ Error checking login status:", err);
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

  // 🟡 Optional: Make it reactive (e.g., after login/signup)
  window.updateLoginUIFromSession = checkSession;
});
