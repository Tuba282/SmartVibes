// // --------------------getting importing from firebase ---------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
  // auth
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signOut,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged,
  // firestore
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
  Timestamp,
  updateDoc,
  deleteDoc,
  limit,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyCp6RV-Yai1wMrYlCQ4xCZOoxySlgT5Ysk",
  authDomain: "smartvibes-ab417.firebaseapp.com",
  projectId: "smartvibes-ab417",
  storageBucket: "smartvibes-ab417.firebasestorage.app",
  messagingSenderId: "876525746574",
  appId: "1:876525746574:web:3a70238800bdfe6b1eccdf",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export {
  // auth
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signOut,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged,
  // firestore
  db,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  collection,
  Timestamp,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  query,
  where,
  limit,
  deleteDoc,
};
// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
//   sendPasswordResetEmail,
//   updatePassword,
//   GoogleAuthProvider,
//   signInWithPopup,
//   signOut,
//   deleteUser,
//   updateProfile,
//   FacebookAuthProvider,
//   GithubAuthProvider,
//   fetchSignInMethodsForEmail,
// } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
// //
// //
// import {
//   getFirestore,
//   doc,
//   setDoc,
//   getDoc,
//   addDoc,
//   collection,
//   getDocs,
//   onSnapshot,
//   query,
//   orderBy,
//   where,
//   serverTimestamp,
//   Timestamp,
//   updateDoc,
//   deleteDoc,
// } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firebase.js";

// //
// const firebaseConfig = {
//   apiKey: "AIzaSyCp6RV-Yai1wMrYlCQ4xCZOoxySlgT5Ysk",
//   authDomain: "smartvibes-ab417.firebaseapp.com",
//   projectId: "smartvibes-ab417",
//   storageBucket: "smartvibes-ab417.firebasestorage.app",
//   messagingSenderId: "876525746574",
//   appId: "1:876525746574:web:3a70238800bdfe6b1eccdf"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);
// //
// // ------------------------ Exporting ----------------------------
// //
// export {
//   // auth
//   auth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
//   updateProfile,
//   deleteUser,
//   signInWithPopup,
//   GoogleAuthProvider,
//   signOut,
//   sendPasswordResetEmail,
//   FacebookAuthProvider,
//   GithubAuthProvider,
//   fetchSignInMethodsForEmail,
//   //firebase firestore
//   db,
//   doc,
//   setDoc,
//   getDoc,
//   addDoc,
//   collection,
//   getDocs,
//   onSnapshot,
//   query,
//   orderBy,
//   where,
//   serverTimestamp,
//   Timestamp,
//   updateDoc,
//   deleteDoc,
// };
