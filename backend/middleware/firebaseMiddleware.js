const User = require("../model/userModel.js");
const admin = require("firebase-admin");
require("dotenv").config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

async function verifyFirebaseToken(req, res, next) {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "No authentication token provided" });
    }
    // Verify Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;

    // Find or create user in MongoDB
    let user = await User.findOne({ userFirebaseUid: firebaseUid });

    if (!user) {
      user = new User({
        userFirebaseUid: firebaseUid,
        userEmail: decodedToken.email,
      });

      await user.save();
    }

    req.user = user; //this is essential for user auth
    next();
  } catch (error) {
    console.error("Firebase Auth Error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = verifyFirebaseToken;
