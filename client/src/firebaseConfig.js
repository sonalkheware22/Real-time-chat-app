import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDOkKUtD8plrCY7AWyu0eaZZpwGgKfmbMs",
  authDomain: "realtime-chat-7aedb.firebaseapp.com",
  databaseURL: "https://realtime-chat-7aedb-default-rtdb.firebaseio.com",
  projectId: "realtime-chat-7aedb",
  storageBucket: "realtime-chat-7aedb.firebasestorage.app",
  messagingSenderId: "928297898468",
  appId: "1:928297898468:web:bad26017e2d8e2ab6437f1",
  measurementId: "G-4VZRSPHL5P",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
