import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAqgovZlllCjih37UjvAYk7Vvbyp2Ete8Y",
  authDomain: "flashtest-a4852.firebaseapp.com",
  projectId: "flashtest-a4852",
  storageBucket: "flashtest-a4852.firebasestorage.app",
  messagingSenderId: "224301551066",
  appId: "1:224301551066:web:2ec270b2001e67053404e3",
  measurementId: "G-QY2001K2K7"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };