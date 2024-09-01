//SDK's installation
import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase's Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdQB6tQrrp7dXD6x70FFOaCZ1xIFGv13U",
  authDomain: "warehouse-47c9c.firebaseapp.com",
  projectId: "warehouse-47c9c",
  storageBucket: "warehouse-47c9c.appspot.com",
  messagingSenderId: "589857382373",
  appId: "1:589857382373:web:5692757010cff126f6d90c"
};

// Firebase's app initialization
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app);
const storage = getStorage(app);

const googleAuthProvider = new GoogleAuthProvider();
const githubAuthProvider = new GithubAuthProvider();

export { app, auth, database, storage, googleAuthProvider, githubAuthProvider };
