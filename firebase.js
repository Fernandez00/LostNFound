import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } 
  from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqf6biwARQaJS2D-Wdw5313hITDMKCvjo",
  authDomain: "lostandfound-352d6.firebaseapp.com",
  databaseURL: "https://lostandfound-352d6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lostandfound-352d6",
  storageBucket: "lostandfound-352d6.appspot.com",
  messagingSenderId: "188690377553",
  appId: "1:188690377553:web:b8c81d5625cc974e394170"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// ✅ Function to Sign Up Users and Save Role
window.signUp = function() {
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const role = document.getElementById("userRole").value;  // Get role from dropdown

    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            const userId = userCredential.user.uid;

            // ✅ Save user role in Firebase Database
            set(ref(database, 'users/' + userId), {
                email: email,
                role: role
            });

            alert(`✅ User Registered as ${role}`);
        })
        .catch(error => {
            alert("❌ Error: " + error.message);
        });
};

// ✅ Function to Log In Users and Redirect Based on Role
window.login = function() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            const userId = userCredential.user.uid;

            // ✅ Check User Role from Firebase
            get(child(ref(database), `users/${userId}`)).then(snapshot => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    if (userData.role === "admin") {
                        alert("✅ Welcome Admin!");
                        window.location.href = "admin.html";  // Redirect to admin page
                    } else {
                        alert("✅ Welcome Customer!");
                        window.location.href = "customer.html";  // Redirect to customer page
                    }
                } else {
                    alert("❌ No role found!");
                }
            }).catch(error => {
                console.error("❌ Error fetching role:", error);
            });
        })
        .catch(error => {
            alert("❌ Error: " + error.message);
        });
};

// ✅ Function to Log Out
window.logout = function() {
    signOut(auth)
        .then(() => {
            alert("✅ Logged out successfully!");
            window.location.href = "index.html"; // Redirect to login page
        })
        .catch(error => {
            alert("❌ Error: " + error.message);
        });
};
