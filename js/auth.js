// ✅ Import Firebase modules (v11)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// ✅ Firebase config (JW Admin Panel)
const firebaseConfig = {
  apiKey: "AIzaSyBqwbVJvapXbHfOQCN_RDA60c1LQUZTWq4",
  authDomain: "jw-admin-fieldflow.firebaseapp.com",
  projectId: "jw-admin-fieldflow",
  storageBucket: "jw-admin-fieldflow.firebasestorage.app",
  messagingSenderId: "37186999757",
  appId: "1:37186999757:web:0e90ba1329b4442183e084",
};

// ✅ Initialize Firebase
let app, auth;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log("✅ Firebase initialized for JW Admin login page.");
} catch (err) {
  console.error("❌ Firebase initialization error:", err);
  alert("⚠️ Firebase failed to initialize. Check console for details.");
}

// ✅ DOM Elements
const form = document.getElementById("loginForm");
const message = document.getElementById("loginMessage");
const debugBox = document.createElement("div");
debugBox.style.cssText = `
  background: #222; color: #0f0; padding: 8px; font-size: 12px;
  margin-top: 10px; border-radius: 5px; display: none;
`;
document.body.appendChild(debugBox);

function debugLog(msg) {
  console.log(msg);
  debugBox.style.display = "block";
  debugBox.innerHTML += `<div>🪲 ${msg}</div>`;
}

// ✅ Detect existing session
onAuthStateChanged(auth, (user) => {
  const currentPage = window.location.pathname.split("/").pop();

  if (user) {
    debugLog(`🔐 Already logged in as: ${user.email}`);
    localStorage.setItem("jwAdminUser", user.email);

    // 🔁 If user is on login page but already logged in, redirect to index
    if (currentPage === "login.html") {
      window.location.href = "index.html";
    }

  } else {
    debugLog("👋 No user session found.");

    // 🔒 Redirect to login page if user not logged in and not already there
    if (currentPage !== "login.html") {
      debugLog("🚨 Redirecting to login page — user not logged in.");
      window.location.href = "login.html";
    }
  }
});

// ✅ Handle Login Form
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();

    if (!email || !password) {
      message.textContent = "⚠️ Please fill in both email and password.";
      message.style.color = "red";
      return;
    }

    message.textContent = "⏳ Attempting to log in...";
    message.style.color = "#333";
    debugBox.innerHTML = ""; // clear old logs
    debugLog(`📨 Trying login for: ${email}`);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      debugLog(`✅ Firebase login success: ${user.email}`);
      message.style.color = "green";
      message.textContent = "✅ Login successful! Redirecting...";

      // Save session
      localStorage.setItem("jwAdminUser", user.email);

      // Redirect after 1.5s
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);

    } catch (error) {
      console.error("❌ Login error:", error.code, error.message);
      debugLog(`❌ ERROR: ${error.code} — ${error.message}`);
      message.style.color = "red";

      // User-friendly feedback
      switch (error.code) {
        case "auth/invalid-email":
          message.textContent = "❌ Invalid email format.";
          break;
        case "auth/user-not-found":
          message.textContent = "❌ No account found with this email.";
          break;
        case "auth/wrong-password":
          message.textContent = "❌ Incorrect password.";
          break;
        case "auth/network-request-failed":
          message.textContent = "🌐 Network error — please check your internet.";
          break;
        default:
          message.textContent = `❌ ${error.message}`;
      }
    }
  });
} else {
  console.warn("⚠️ Login form not found on this page.");
  debugLog("⚠️ Login form missing in DOM.");
}

// ✅ Logout function (usable globally)
export function logoutUser() {
  signOut(auth)
    .then(() => {
      localStorage.removeItem("jwAdminUser");
      debugLog("🚪 Logged out successfully.");

      // 🔁 Always redirect to login page after logout
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("❌ Logout error:", error.message);
      debugLog(`❌ Logout error: ${error.message}`);
    });
}
