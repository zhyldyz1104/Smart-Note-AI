import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAlfhnbLhvKlzrTsijSv01DU0oid8LmUPo",
  authDomain: "smart-note-ai-ec294.firebaseapp.com",
  projectId: "smart-note-ai-ec294",
  storageBucket: "smart-note-ai-ec294.firebasestorage.app",
  messagingSenderId: "478554995274",
  appId: "1:478554995274:web:68ba457d2b3394747844b3",
  measurementId: "G-X8KEB0S5KY"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
