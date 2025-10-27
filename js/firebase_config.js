// ✅ Firebase initialization for JW Admin Site

// Import the Firebase SDKs (modular style)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🔥 Your Firebase configuration (replace with your real config)
const firebaseConfig = {
  apiKey: "AIzaSyBqwbVJvapXbHfOQCN_RDA60c1LQUZTWq4",
  authDomain: "jw-admin-fieldflow.firebaseapp.com",
  projectId: "jw-admin-fieldflow",
  storageBucket: "jw-admin-fieldflow.firebasestorage.app",
  messagingSenderId: "37186999757",
  appId: "1:37186999757:web:0e90ba1329b4442183e084",
  measurementId: "G-6KVTJL43S8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

// Export for other scripts
export { db, auth, collection, getDocs, addDoc, signInWithEmailAndPassword, signOut };
