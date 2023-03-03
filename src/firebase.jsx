import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyChSEZlBZS6qF8QDDtG1QwywRxGwhUJhkI",
  authDomain: "todo-app-6dbf8.firebaseapp.com",
  projectId: "todo-app-6dbf8",
  storageBucket: "todo-app-6dbf8.appspot.com",
  messagingSenderId: "336711816591",
  appId: "1:336711816591:web:84e7a218aa41ba76f967fa",
  measurementId: "G-5WBMZ6TL3Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth,provider};
export const db = getDatabase(app);
export const storage = getStorage(app)
