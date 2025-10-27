// main.js
import { signOut, auth } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", () => {
  console.clear();
  console.log("🚀 JW Admin Dashboard Loaded ✅");

  // 🛡️ Check login session
  const loggedInUser = localStorage.getItem("jwAdminUser");

  if (!loggedInUser) {
    console.warn("⚠️ No active session found. Redirecting to login page...");
    window.location.href = "login.html";
    return;
  }

  // 👋 Personalized welcome message
  const username = loggedInUser.split("@")[0]; // Extract name from email
  console.log(`👋 Welcome back, ${username}!`);
  showWelcomePopup(username);

  // 🧹 Logout functionality
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      console.log("🔒 Logging out...");
      try {
        await signOut(auth);
        localStorage.removeItem("jwAdminUser");
        alert("✅ You have been logged out successfully.");
        window.location.href = "login.html";
      } catch (error) {
        console.error("❌ Logout failed:", error);
        alert("Logout failed. Check console for details.");
      }
    });
  } else {
    console.log("ℹ️ No logout button found on this page.");
  }
});

// 💬 Small popup animation (optional)
function showWelcomePopup(username) {
  const popup = document.createElement("div");
  popup.textContent = `Welcome back, ${username}!`;
  popup.style.position = "fixed";
  popup.style.bottom = "20px";
  popup.style.right = "20px";
  popup.style.background = "#007BFF";
  popup.style.color = "white";
  popup.style.padding = "10px 18px";
  popup.style.borderRadius = "8px";
  popup.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
  popup.style.fontFamily = "Poppins, sans-serif";
  popup.style.transition = "opacity 0.5s ease-in-out";
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.style.opacity = "0";
    setTimeout(() => popup.remove(), 600);
  }, 3000);
}
