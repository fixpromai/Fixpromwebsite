document.addEventListener("DOMContentLoaded", () => {
  checkSession();

  async function checkSession() {
    const token = localStorage.getItem("fixpromJWT"); // Use new key

    if (!token) {
      resetLoginUI();
      return;
    }

    try {
      const res = await fetch("/auth/verify", { // Use new endpoint
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const avatar = document.getElementById("userAvatar");
      const avatarImg = document.getElementById("avatarImg");
      const signupBtn = document.getElementById("signupBtnNav");
      const emailDisplay = document.getElementById("userEmailDisplay");

      if (res.ok) {
        const data = await res.json();
        if (data.valid) {
          const email = data.user?.email || "";

          if (signupBtn) {
            signupBtn.classList.add("hidden");
            signupBtn.style.display = "none";
          }
          if (avatar) {
            avatar.classList.remove("hidden");
            avatar.style.display = "block";
          }
          if (avatarImg) {
            avatarImg.src = "images/profile.png";
          }
          if (emailDisplay) {
            emailDisplay.textContent = email;
          }

          localStorage.setItem("fixpromUserEmail", email);

          // ✅ Handle extension redirect once
          const wantsExtension = localStorage.getItem("wantsExtension");
          if (wantsExtension === "true") {
            localStorage.removeItem("wantsExtension");
            window.open("https://chromewebstore.google.com/detail/fineaoekjmkdgnmeenfjdlkbnhlidmme", "_blank");
          }
        } else {
          resetLoginUI();
        }
      } else {
        resetLoginUI();
      }
    } catch (err) {
      console.error("⚠️ Token-based session check failed:", err);
      resetLoginUI();
    }
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
    localStorage.removeItem("fixpromJWT"); // Clear JWT on failed check
  }

  window.updateLoginUIFromSession = checkSession;
});