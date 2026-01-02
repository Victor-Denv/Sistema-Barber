import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBJhurnqxJuTpqBdMMGiirnWkh3QA2OK7A",
  authDomain: "sistemabarber-292cc.firebaseapp.com",
  projectId: "sistemabarber-292cc",
  storageBucket: "sistemabarber-292cc.firebasestorage.app",
  messagingSenderId: "800662508876",
  appId: "1:800662508876:web:e3b9da78ce7aac691cebe9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);