// ✅ Import Firebase SDK v11
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { logoutUser } from "./auth.js"; // Reuse your logout function

// ✅ Redirect to login if user not logged in
const jwAdminUser = localStorage.getItem("jwAdminUser");
if (!jwAdminUser) {
  window.location.href = "login.html";
}

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBqwbVJvapXbHfOQCN_RDA60c1LQUZTWq4",
  authDomain: "jw-admin-fieldflow.firebaseapp.com",
  projectId: "jw-admin-fieldflow",
  storageBucket: "jw-admin-fieldflow.firebasestorage.app",
  messagingSenderId: "37186999757",
  appId: "1:37186999757:web:0e90ba1329b4442183e084",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ DOM Elements
const statsBox = document.getElementById("stats");
const logoutBtn = document.getElementById("logoutBtn");

// ✅ Logout button
logoutBtn.addEventListener("click", () => {
  logoutUser();
});

// ✅ Fetch Users & Feedback Counts
async function loadAnalytics() {
  statsBox.innerHTML = "<p>Loading analytics...</p>";

  try {
     console.log("📦 Fetching users...");
    const usersSnap = await getDocs(collection(db, "users"));
        console.log("👤 Users snapshot:", usersSnap);
         console.log("📦 Fetching feedbacks...");
    const feedbackSnap = await getDocs(collection(db, "feedbacks"));
        console.log("✉️ Feedback snapshot:", feedbackSnap);

    const totalUsers = usersSnap.size;
    const totalFeedbacks = feedbackSnap.size;
    const pendingFeedbacks = feedbackSnap.docs.filter(f => f.data().status === "pending").length;

        console.log("📊 Analytics:", { totalUsers, totalFeedbacks, pendingFeedbacks });

    statsBox.innerHTML = `
      <p>👤 Total Users: ${totalUsers}</p>
      <p>✉️ Total Feedbacks: ${totalFeedbacks}</p>
      <p>⏳ Pending Feedbacks: ${pendingFeedbacks}</p>
    `;

    // Prepare chart for feedback types
    const feedbackTypes = {};
    feedbackSnap.docs.forEach(doc => {
      const type = doc.data().type || "General";
      feedbackTypes[type] = (feedbackTypes[type] || 0) + 1;
    });

    const ctx = document.getElementById("feedbackChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(feedbackTypes),
        datasets: [{
          label: "Feedback Count by Type",
          data: Object.values(feedbackTypes),
          backgroundColor: "#007BFF",
        }]
      },
      options: { responsive: true }
    });

  } catch (error) {
    console.error("❌ Analytics load error:", error);
    statsBox.innerHTML = `<p style="color:red;">Error loading analytics: ${error.message}</p>`;
  }
}

// ✅ Run on page load
document.addEventListener("DOMContentLoaded", loadAnalytics);
