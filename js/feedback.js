// ✅ Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


// ✅ Redirect to login if user not logged in
const jwAdminUser = localStorage.getItem("jwAdminUser");
if (!jwAdminUser) {
  console.warn("🚫 User not logged in — redirecting to login page.");
  window.location.href = "login.html";
}

// ✅ Firebase Config (same as users.js)
const firebaseConfig = {
  apiKey: "AIzaSyBqwbVJvapXbHfOQCN_RDA60c1LQUZTWq4",
  authDomain: "jw-admin-fieldflow.firebaseapp.com",
  projectId: "jw-admin-fieldflow",
  storageBucket: "jw-admin-fieldflow.firebasestorage.app",
  messagingSenderId: "37186999757",
  appId: "1:37186999757:web:0e90ba1329b4442183e084",
};

// ✅ Initialize Firebase
console.log("💧 Initializing Firebase for Feedback Page...");
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("✅ Firebase initialized for Feedback Page.");

// ✅ DOM Elements
const feedbackList = document.getElementById("feedbackList");
const searchInput = document.getElementById("searchFeedback");

// ✅ Fetch All Feedback
async function loadFeedback() {
  console.log("📦 Fetching feedback from Firestore...");
  feedbackList.innerHTML = "<p>Loading feedback...</p>";

  try {
    // 👇 Corrected collection name: 'feedbacks'
    const querySnapshot = await getDocs(collection(db, "feedbacks"));

    if (querySnapshot.empty) {
      console.warn("⚠️ No feedback found in Firestore.");
      feedbackList.innerHTML = "<p>No feedback found.</p>";
      return;
    }

    feedbackList.innerHTML = ""; // Clear loading text

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log("💬 Feedback found:", data);

      const div = document.createElement("div");
      div.className = "feedback-card";

      div.innerHTML = `
        <h3>${data.title || "No Title"}</h3>
        <p><strong>From:</strong> ${data.username || "Unknown"} (${data.email || "No Email"})</p>
        <p><strong>Role:</strong> ${data.role || "Unknown"}</p>
        <p><strong>Type:</strong> ${data.type || "General"}</p>
        <p><strong>Description:</strong> ${data.description || "No message provided."}</p>
        <p><strong>Status:</strong> <span class="status">${data.status || "Pending"}</span></p>
        <small>🕒 ${data.timestamp || "Unknown"}</small>
         <p><strong>Created:</strong> ${data.createdAt}</p>
      `;

      feedbackList.appendChild(div);
    });

    console.log("✅ Feedbacks loaded successfully.");

  } catch (error) {
    console.error("❌ Error fetching feedback:", error);
    feedbackList.innerHTML = `<p style="color:red;">❌ Error loading feedback: ${error.message}</p>`;
  }
}

// 🔍 Search Filter
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const cards = document.querySelectorAll(".feedback-card");

  cards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(searchTerm) ? "block" : "none";
  });
});

// 🚀 Load on Page Ready
document.addEventListener("DOMContentLoaded", loadFeedback);
