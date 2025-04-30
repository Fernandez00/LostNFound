import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js"

const firebaseConfig = {
  apiKey: "AIzaSyCOZZ44tcqI8TPCXK6SzT7tURKM01j7efo",
  authDomain: "lostnfounditemlostdb.firebaseapp.com",
  databaseURL: "https://lostnfounditemlostdb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lostnfounditemlostdb",
  storageBucket: "lostnfounditemlostdb.appspot.com",
  messagingSenderId: "494153480103",
  appId: "1:494153480103:web:e04aef1eab4e89cdb5a882",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

document.addEventListener("DOMContentLoaded", () => {
  // Store the submit handler for use in the main script
  window.foundItemFormSubmit = async (e, customFormData) => {
    e.preventDefault()

    // Use custom form data if provided, otherwise collect from form
    const formData = customFormData || {
      itemName: document.getElementById("itemName").value,
      dateFound: document.getElementById("dateFound").value,
      category: document.getElementById("category").value,
      primaryColor1: document.getElementById("primaryColor1").value,
      location: document.getElementById("location").value,
      additionalLocation: document.getElementById("additionalLocation").value,
      fullName: document.getElementById("fullName").value,
      phoneNumber: document.getElementById("phoneNumber").value,
      email: document.getElementById("email").value,
      imageURL: document.getElementById("imageURL").value || null,
      status: "unclaimed" // Add status field for found items
    }

    try {
      const newItemRef = push(ref(db, "foundItems")) // Push new item to foundItems
      await set(newItemRef, formData) // Save form data

      console.log("Data saved successfully:", newItemRef.key)

      alert("Report submitted successfully!")
      window.location.href = "student.html" // Redirect after submission
    } catch (error) {
      console.error("Error submitting report: ", error)
      alert("Failed to submit report. Please try again.")
    }
  }
})