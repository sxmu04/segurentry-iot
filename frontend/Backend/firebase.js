const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBJ7ZEX26qbJZVuzk5IoA1B114i3J0_qhA",
  authDomain: "segurentry-app.firebaseapp.com",
  projectId: "segurentry-app",
  storageBucket: "segurentry-app.firebasestorage.app",
  messagingSenderId: "187206406043",
  appId: "1:187206406043:web:fad7ab7406c5ef008c1b3e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = db;