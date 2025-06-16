document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll for valid anchor links only
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return; // ❌ skip invalid # links

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      } else {
        console.warn("Target not found:", href);
      }
    });
  });

  // Chrome Web Store install buttons
  // document.querySelectorAll(".install-btn, #installBtn, #installMainBtn").forEach((btn) => {
  //   btn.addEventListener("click", () => {
  //     window.open("https://chrome.google.com/webstore/detail/fixprom/YOUR_EXTENSION_ID", "_blank");
  //   });
  // });

  // Scroll to pricing section
  document.querySelectorAll(".upgrade-btn, #upgradeProBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.href = "#pricing";
    });
  });

  // Pricing card hover effects
  document.querySelectorAll(".pricing-card, .bg-white.rounded-2xl.shadow-lg, .bg-white.rounded-2xl.shadow-xl").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-5px)";
      card.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.1)";
      card.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "";
    });
  });

  // Step indicator animations
  document.querySelectorAll(".w-12.h-12.rounded-full, .step-indicator").forEach((indicator) => {
    indicator.addEventListener("mouseenter", () => {
      indicator.style.transform = "scale(1.1)";
      indicator.style.transition = "all 0.3s ease";
    });

    indicator.addEventListener("mouseleave", () => {
      indicator.style.transform = "scale(1)";
    });
  });

  // Scroll animation pause/resume
  const scrollContainer = document.querySelector(".scroll-content");
  if (scrollContainer) {
    scrollContainer.addEventListener("mouseenter", () => {
      scrollContainer.style.animationPlayState = "paused";
    });
    scrollContainer.addEventListener("mouseleave", () => {
      scrollContainer.style.animationPlayState = "running";
    });
  }

  // Button hover elevation
  document.querySelectorAll("button, .btn-modern").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      if (btn.classList.contains("bg-blue-600") || btn.classList.contains("bg-gradient-to-r")) {
        btn.style.transform = "translateY(-2px)";
        btn.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
      }
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translateY(0)";
    });
  });

  // IntersectionObserver fade-in animation
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  document.querySelectorAll(".bg-gradient-to-br, .platform-card, .bg-white.rounded-xl").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  // FixProm button click effect
  document.querySelectorAll(".fixprom-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.style.transform = "scale(0.95)";
      setTimeout(() => {
        btn.style.transform = "scale(1.1)";
        setTimeout(() => {
          btn.style.transform = "scale(1)";
        }, 150);
      }, 100);
    });
  });

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      console.log("Mobile menu clicked");
    });
  }

  // Watch Demo button
  document.querySelectorAll("#watchDemoBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("Demo video would open here");
    });
  });

  // Account page button
  document.querySelectorAll("#accountBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("Account page would open here");
    });
  });

  // Loading state for Add to Chrome / Upgrade buttons
  document.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.textContent.includes("Add to Chrome") || btn.textContent.includes("Upgrade")) {
        const originalText = btn.textContent;
        btn.textContent = "Loading...";
        btn.disabled = true;

        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 2000);
      }
    });
  });
});

