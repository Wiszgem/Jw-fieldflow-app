// ✅ Import Firebase SDK (v11)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


// ✅ Redirect to login if user not logged in
const jwAdminUser = localStorage.getItem("jwAdminUser");
if (!jwAdminUser) {
  console.warn("🚫 User not logged in — redirecting to login page.");
  window.location.href = "login.html";
}

// ✅ Firebase Config (same as your project)
const firebaseConfig = {
  apiKey: "AIzaSyBqwbVJvapXbHfOQCN_RDA60c1LQUZTWq4",
  authDomain: "jw-admin-fieldflow.firebaseapp.com",
  projectId: "jw-admin-fieldflow",
  storageBucket: "jw-admin-fieldflow.firebasestorage.app",
  messagingSenderId: "37186999757",
  appId: "1:37186999757:web:0e90ba1329b4442183e084",
};

// ✅ Initialize Firebase + Firestore
console.log("💧 Initializing Firebase for Users Page...");
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("✅ Firebase initialized for Users Page.");

// ✅ DOM Elements
const userList = document.getElementById("userList");
const searchInput = document.getElementById("searchUsers");

// ✅ Fetch All Users
async function loadUsers() {
  console.log("📦 Fetching users from Firestore...");
  userList.innerHTML = "<p>Loading users...</p>";

  try {
    const querySnapshot = await getDocs(collection(db, "users"));

    if (querySnapshot.empty) {
      console.warn("⚠️ No users found in Firestore.");
      userList.innerHTML = "<p>No users found.</p>";
      return;
    }

    userList.innerHTML = ""; // Clear loading message

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log("👤 User found:", data);

      const card = document.createElement("div");
      card.className = "user-card";
      card.innerHTML = `
        <h3>${data.username || "Unknown"}</h3>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Role:</strong> ${data.role}</p>
        <p><strong>User ID:</strong> ${data.userId}</p>
        <p><strong>Created:</strong> ${data.createdAt}</p>
            <p><strong>Country:</strong> ${data.country || "Unknown"}</p>  <!-- ✅ Added country -->
      `;
      userList.appendChild(card);
    });

    console.log("✅ All users loaded successfully.");

  } catch (error) {
    console.error("❌ Error fetching users:", error);
    userList.innerHTML = `<p style="color:red;">❌ Error loading users: ${error.message}</p>`;
  }
}

// ✅ Search filter
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const cards = document.querySelectorAll(".user-card");

  cards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(searchTerm) ? "block" : "none";
  });
});

// ✅ Run when page loads
document.addEventListener("DOMContentLoaded", loadUsers);
