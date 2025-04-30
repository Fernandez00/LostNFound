const express = require("express");
const admin = require("firebase-admin");
const fs = require("fs");

// Load Firebase credentials
const serviceAccount = JSON.parse(fs.readFileSync("firebaseConfig.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-project-id.firebaseio.com" // Replace with your Firebase URL
});

const db = admin.firestore();
const app = express();
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Firebase is connected! 🚀");
});

// Add a lost item
app.post("/add-lost-item", async (req, res) => {
  try {
    const { itemName, description, location } = req.body;
    const newItem = await db.collection("lost_items").add({
      itemName,
      description,
      location,
      status: "lost",
      timestamp: new Date()
    });
    res.send({ success: true, id: newItem.id });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

// Start server
app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));

