import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCNwdSMgPA4lhUW8Lu6HTzVI58O8nu7yoA",
  authDomain: "hr-lifestyle.firebaseapp.com",
  projectId: "hr-lifestyle",
  storageBucket: "hr-lifestyle.firebasestorage.app",
  messagingSenderId: "720602229340",
  appId: "1:720602229340:web:caac67bfe65351018f9499",
  measurementId: "G-KY188VVTNV",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
