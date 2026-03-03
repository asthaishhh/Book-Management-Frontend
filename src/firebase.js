// import { initializeApp } from "firebase/app";
// import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "YOUR_KEY",
//   authDomain: "YOUR_DOMAIN",
//   projectId: "YOUR_ID",
//   storageBucket: "YOUR_BUCKET",
//   messagingSenderId: "XXXX",
//   appId: "XXXX",
// };

// const app = initializeApp(firebaseConfig);

// export const storage = getStorage(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPWstHDr07fmoSN0r0u41K_kHPbZ4t3rw",
  authDomain: "booktimeline-f8a92.firebaseapp.com",
  projectId: "booktimeline-f8a92",
  storageBucket: "booktimeline-f8a92.firebasestorage.app",
  messagingSenderId: "240795068901",
  appId: "1:240795068901:web:b70659396de26c9263270c",
  measurementId: "G-95CWBW1RQG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);