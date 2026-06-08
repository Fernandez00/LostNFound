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
window.login = async function() {
    let input = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!input || !password) {
        return alert("❌ Please enter your ID Number or Email and Password");
    }

    // Convert ID Number to email format if user entered only ID
    let email = input;
    if (!input.includes('@')) {
        email = `${input}@lostnfound.example.com`;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get user data
        const snapshot = await get(child(ref(database), `users/${user.uid}`));
        
        if (snapshot.exists()) {
            const userData = snapshot.val();
            
            if (userData.role === "admin" || email === "admin@lostnfound.com") {
                alert("✅ Welcome Admin!");
                window.location.href = "admin.html";
            } else {
                alert("✅ Welcome Student!");
                window.location.href = "student.html";
            }
        } else {
            alert("❌ User data not found. Please contact admin.");
        }
    } catch (error) {
        console.error(error);
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
            alert("❌ Incorrect password.");
        } else if (error.code === 'auth/user-not-found') {
            alert("❌ No account found with this ID Number or Email.");
        } else if (error.code === 'auth/invalid-email') {
            alert("❌ Invalid email format. Try using your ID Number only.");
        } else {
            alert("❌ Login failed: " + error.message);
        }
    }
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
