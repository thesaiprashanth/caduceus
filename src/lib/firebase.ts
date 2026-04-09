import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD22mZL_ytxG7odO8Om1aRjzgz0sA1q89Q",
  authDomain: "caduceus-e05b1.firebaseapp.com",
  projectId: "caduceus-e05b1",
  storageBucket: "caduceus-e05b1.firebasestorage.app",
  messagingSenderId: "1064492108431",
  appId: "1:1064492108431:web:3d2ead5d145b08d61d3efa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
