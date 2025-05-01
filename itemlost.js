import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCOZZ44tcqI8TPCXK6SzT7tURKM01j7efo",
  authDomain: "lostnfounditemlostdb.firebaseapp.com",
  databaseURL: "https://lostnfounditemlostdb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lostnfounditemlostdb",
  storageBucket: "lostnfounditemlostdb.appspot.com",
  messagingSenderId: "494153480103",
  appId: "1:494153480103:web:e04aef1eab4e89cdb5a882",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
  // Store the submit handler for use in the main script
  window.lostItemFormSubmit = async (e, customFormData) => {
    e.preventDefault();

    // Get current user data from sessionStorage
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (!userData) {
      alert("You must be logged in to submit a report");
      window.location.href = "index.html";
      return;
    }

    // Use custom form data if provided, otherwise collect from form
    const formData = customFormData || {
      itemName: document.getElementById("itemName").value,
      dateLost: document.getElementById("dateLost").value,
      category: document.getElementById("category").value,
      primaryColor1: document.getElementById("primaryColor1").value,
      location: document.getElementById("location").value,
      additionalLocation: document.getElementById("additionalLocation").value || "none",
      fullName: document.getElementById("fullName").value,
      phoneNumber: document.getElementById("phoneNumber").value,
      email: document.getElementById("email").value,
      imageURL: document.getElementById("imageURL")?.value || null,
      timestamp: new Date().toISOString(),
      userId: userData.idNumber,
      userName: userData.name,
      userEmail: userData.email
    };

    // Validate required fields
    if (!formData.itemName || !formData.dateLost || !formData.category || 
        !formData.primaryColor1 || !formData.location || 
        !formData.fullName || !formData.phoneNumber || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // Push data to Firebase under lostItems
      const newItemRef = push(ref(db, "lostItems"));
      await set(newItemRef, formData);

      // Also save under the user's reports
      const userReportRef = push(ref(db, `users/${userData.idNumber}/reports`));
      await set(userReportRef, {
        reportId: newItemRef.key,
        type: "lost",
        itemName: formData.itemName,
        dateReported: formData.timestamp,
        imageURL: formData.imageURL || null
      });

      console.log("Data saved successfully with ID:", newItemRef.key);

      alert("Report submitted successfully!");
      window.location.href = "student.html"; // Redirect after submission
    } catch (error) {
      console.error("Error submitting report: ", error);
      alert("Failed to submit report. Please try again.");
    }
  };

  // Auto-fill user info if available
  const userData = JSON.parse(sessionStorage.getItem('user'));
  if (userData) {
    const fullNameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    
    if (fullNameInput) fullNameInput.value = userData.name || '';
    if (emailInput) emailInput.value = userData.email || '';
  }
});