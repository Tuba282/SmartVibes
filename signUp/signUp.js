import {
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
  //   firestore
  db,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  Timestamp,
  serverTimestamp,
} from "../firebaseConfig.js";

//
//
// -------------------------- sign Up form -----------------------
//
//
const signInForm = async (event) => {
  event.preventDefault();
  const name = document.getElementById("signUp-Name").value;
  const email = document.getElementById("signUp-Email").value;
  const password = document.getElementById("signUp-Password").value;

  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCredentials.user.uid;
    await setDoc(doc(db, "users",auth.currentUser.uid), {
      name:name || '',
      email:email || '',
      image:'',
      password:password || '',
      timestamp: serverTimestamp(),
    });
    Toastify({
      text: "User Successfuly created ...",
      duration: 1500,
      delay: 1000,
      gravity: "top",
      position: "center",
      color: "var(--desertSun)",
      backgroundColor: "#525960",
      className: "toastify-center",
      avatar: "../assets/thumbsup.png",
    }).showToast();
    window.location.replace("/")
  } catch (error) {
    Toastify({
      text: error.message,
      duration: 1500,
      delay: 1000,
      gravity: "top",
      position: "center",
      color: "var(--desertSun)",
      backgroundColor: "#525960",
      className: "toastify-center",
      avatar: "../assets/thumbsup.png",
    }).showToast();
  }
};

document.getElementById("signUpForm")?.addEventListener("submit", signInForm);

//
//
// -------------------------- login form -----------------------
//
//
const loginForm = async (event) => {
  event.preventDefault();
  const email = document.getElementById("logIn-Email").value;
  const password = document.getElementById("logIn-Password").value;

  try {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(userCredentials.user.uid);
    Toastify({
      text: "User Successfuly login ...",
      duration: 1500,
      delay: 1000,
      gravity: "top",
      position: "center",
      color: "var(--desertSun)",
      backgroundColor: "#525960",
      className: "toastify-center",
      avatar: "../assets/user-Authorize.png",
    }).showToast();
    window.location.replace("/")
  } catch (error) {
    Toastify({
      text: error.message,
      duration: 1500,
      delay: 1000,
      gravity: "top",
      position: "center",
      color: "var(--desertSun)",
      backgroundColor: "#525960",
      className: "toastify-center",
      avatar: "../assets/user-Unauthorize.png",
    }).showToast();
  }
};
document.getElementById("loginInForm")?.addEventListener("submit", loginForm);
//
//
// -------------------------- SignUp With Google -----------------------

const SignUpGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    // Sign out if a user is already signed in
    if (auth.currentUser) {
      await signOut(auth);
      console.log("User Signed Out");
    }

    // Google Sign-In
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("Name:", user.displayName);
    console.log("Email:", user.email);
    console.log("Profile Image:", user.photoURL);

    localStorage.setItem("userCurrentImageSrc", user.photoURL);
    localStorage.setItem("userCurrentEmail", user.email);
    localStorage.setItem("userCurrentName", user.displayName);

    console.log(user);
    
    await setDoc(doc(db, "users",auth.currentUser.uid), {
      name:user.displayName || '',
      email:user.email || '',
      image:user.photoURL || '',
      password:user.password || '',
      timestamp: serverTimestamp(),
    });

    // Show success toast
    Toastify({
      text: "User Successfully Signed Up ...",
      duration: 1500,
      delay: 1000,
      gravity: "top",
      position: "center",
      color: "var(--desertSun)",
      backgroundColor: "#525960",
      className: "toastify-center",
      avatar: "../assets/user-Authorize.png",
    }).showToast();
    window.location.replace("/");
  } catch (error) {
    console.error("Error during sign-in:", error.message);

    // Show error toast
    Toastify({
      text: error.message,
      duration: 1500,
      delay: 1000,
      gravity: "top",
      position: "center",
      color: "var(--desertSun)",
      backgroundColor: "#525960",
      className: "toastify-center",
      avatar: "../assets/user-Authorize.png",
    }).showToast();
  }
};

// Add event listener to the Sign-Up button
document
  .getElementById("SignUpGoogle")
  ?.addEventListener("click", SignUpGoogle);

//
// //
// // -------------------------- SignUp With Facebook -----------------------
// //
// //

// const SignUpFacebook = async () => {
//   const provider = new FacebookAuthProvider();
//   provider.setCustomParameters({ prompt: "select_account" });

//   try {
//     // Signing out any existing user
//     await signOut(auth);

//     // Facebook sign-in
//     const result = await signInWithPopup(auth, provider);

//     // Success message
//     console.log("User Successfully Signed Up...");

//     Toastify({
//       text: "User Successfully Signed Up...",
//       duration: 1500,
//       gravity: "top",
//       position: "center",
//       backgroundColor: "#525960",
//     }).showToast();
//   } catch (error) {
//     if (error.code === "auth/account-exists-with-different-credential") {
//       // Fetch the email linked to the account
//       const email = error.customData.email;

//       // Get the provider linked to this email
//       const methods = await fetchSignInMethodsForEmail(auth, email);

//       if (methods.includes("google.com")) {
//         // Handle case for Google
//         const googleProvider = new GoogleAuthProvider();
//         const googleResult = await signInWithPopup(auth, googleProvider);
//         const credential = FacebookAuthProvider.credentialFromResult(result);

//         // Link accounts
//         await linkWithCredential(googleResult.user, credential);
//         Toastify({
//           text: "Accounts Linked Successfully!",
//           duration: 1500,
//           gravity: "top",
//           position: "center",
//           backgroundColor: "#525960",
//         }).showToast();
//       } else {
//         console.log("Account already exists with a different provider!");

//         Toastify({
//           text: "Account already exists with a different provider!",
//           duration: 1500,
//           gravity: "top",
//           position: "center",
//           backgroundColor: "#525960",
//         }).showToast();
//       }
//     } else {
//       // Handle other errors
//       console.log(error.message);

//       Toastify({
//         text: error.message,
//         duration: 1500,
//         gravity: "top",
//         position: "center",
//         backgroundColor: "#525960",
//       }).showToast();
//     }
//   }
// };
// document
//   .getElementById("SignUpFacebook")
//   ?.addEventListener("click", SignUpFacebook);
// //
// //
// // -------------------------- SignUp With GitHub -----------------------
// //
// //

// const SignUpGithub = async () => {
//   const provider = new GithubAuthProvider();
//   provider.setCustomParameters({ prompt: "select_account" });
//   try {
//     await signOut(auth);
//     console.log("User Signed Out");

//     const result = await signInWithPopup(auth, provider);
//     Toastify({
//       text: "User Successfuly Sign Up ...",
//       duration: 1500,
//       delay: 1000,
//       gravity: "top",
//       position: "center",
//       color: "var(--desertSun)",
//       backgroundColor: "#525960",
//       className: "toastify-center",
//       avatar: "../assets/user-Authorize.png",
//     }).showToast();
//   } catch (error) {
//     console.log(error.message);
//     Toastify({
//       text: error.message,
//       duration: 1500,
//       delay: 1000,
//       gravity: "top",
//       position: "center",
//       color: "var(--desertSun)",
//       backgroundColor: "#525960",
//       className: "toastify-center",
//       avatar: "../assets/user-Authorize.png",
//     }).showToast();
//   }
// };
// document
//   .getElementById("SignUpGithub")
//   ?.addEventListener("click", SignUpGithub);

// const linkAccounts = async (providerType) => {
//   let provider;

//   // Select provider dynamically
//   if (providerType === "google") {
//     provider = new GoogleAuthProvider();
//   } else if (providerType === "facebook") {
//     provider = new FacebookAuthProvider();
//   } else if (providerType === "github") {
//     provider = new GithubAuthProvider();
//   }

//   try {
//     console.log(`Attempting sign-in with ${providerType}...`);
//     // Attempt sign-in with the selected provider
//     const result = await signInWithPopup(auth, provider);

//     console.log(`Successfully signed in with ${providerType}:`, result.user);

//     // Show success toast
//     Toastify({
//       text: `Signed in with ${providerType}!`,
//       duration: 1500,
//       gravity: "top",
//       position: "center",
//       backgroundColor: "#4caf50",
//     }).showToast();
//   } catch (error) {
//     console.log("Sign-in error:", error.message);

//     if (error.code === "auth/account-exists-with-different-credential") {
//       const email = error.customData.email;
//       console.log("Account exists with different credential. Email:", email);

//       // Fetch existing providers for the email
//       const methods = await fetchSignInMethodsForEmail(auth, email);
//       console.log("Sign-in methods linked to this email:", methods);

//       if (methods.includes("google.com")) {
//         console.log(
//           "Existing provider is Google. Attempting to link accounts..."
//         );
//         const googleProvider = new GoogleAuthProvider();
//         const googleResult = await signInWithPopup(auth, googleProvider);

//         const newCredential = provider.credentialFromError(error);
//         await linkWithCredential(googleResult.user, newCredential);

//         console.log(`Successfully linked ${providerType} with Google account.`);
//         Toastify({
//           text: `Linked ${providerType} to existing Google account!`,
//           duration: 1500,
//           gravity: "top",
//           position: "center",
//           backgroundColor: "#4caf50",
//         }).showToast();
//       } else if (methods.includes("facebook.com")) {
//         console.log(
//           "Existing provider is Facebook. Attempting to link accounts..."
//         );
//         const facebookProvider = new FacebookAuthProvider();
//         const facebookResult = await signInWithPopup(auth, facebookProvider);

//         const newCredential = provider.credentialFromError(error);
//         await linkWithCredential(facebookResult.user, newCredential);

//         console.log(
//           `Successfully linked ${providerType} with Facebook account.`
//         );
//         Toastify({
//           text: `Linked ${providerType} to existing Facebook account!`,
//           duration: 1500,
//           gravity: "top",
//           position: "center",
//           backgroundColor: "#4caf50",
//         }).showToast();
//       } else if (methods.includes("github.com")) {
//         console.log(
//           "Existing provider is GitHub. Attempting to link accounts..."
//         );
//         const githubProvider = new GithubAuthProvider();
//         const githubResult = await signInWithPopup(auth, githubProvider);

//         const newCredential = provider.credentialFromError(error);
//         await linkWithCredential(githubResult.user, newCredential);

//         console.log(`Successfully linked ${providerType} with GitHub account.`);
//         Toastify({
//           text: `Linked ${providerType} to existing GitHub account!`,
//           duration: 1500,
//           gravity: "top",
//           position: "center",
//           backgroundColor: "#4caf50",
//         }).showToast();
//       } else {
//         console.log("No existing provider found for this email.");
//         Toastify({
//           text: "Error: No existing provider found for this email!",
//           duration: 1500,
//           gravity: "top",
//           position: "center",
//           backgroundColor: "#f44336",
//         }).showToast();
//       }
//     } else {
//       // Log other errors
//       console.error("Unhandled sign-in error:", error.message);
//       Toastify({
//         text: error.message,
//         duration: 1500,
//         gravity: "top",
//         position: "center",
//         backgroundColor: "#f44336",
//       }).showToast();
//     }
//   }
// };

// // Event listeners for buttons
// document
//   .getElementById("SignUpGoogle")
//   ?.addEventListener("click", () => linkAccounts("google"));
// document
//   .getElementById("SignUpFacebook")
//   ?.addEventListener("click", () => linkAccounts("facebook"));
// document
//   .getElementById("SignUpGithub")
//   ?.addEventListener("click", () => linkAccounts("github"));

//
//
// -------------------------- Login With Google -----------------------
//
//
const LoginGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  try {
    await signOut(auth);
    console.log("User Signed Out");

    const result = await signInWithPopup(auth, provider);
    Toastify({
      text: "User Successfuly login ...",
      duration: 1500,
      delay: 1000,
      gravity: "top",
      position: "center",
      color: "var(--desertSun)",
      backgroundColor: "#525960",
      className: "toastify-center",
      avatar: "../assets/user-Authorize.png",
    }).showToast();
    window.location.replace("../index.html");
  } catch (error) {
    Toastify({
      text: error.message,
      duration: 1500,
      delay: 1000,
      gravity: "top",
      position: "center",
      color: "var(--desertSun)",
      backgroundColor: "#525960",
      className: "toastify-center",
      avatar: "../assets/user-Authorize.png",
    }).showToast();
  }
};
document.getElementById("LoginGoogle")?.addEventListener("click", LoginGoogle);
//
//
// -------------------------- SignUp With Facebook -----------------------
//
//

const LoginFacebook = async () => {
  const provider = new FacebookAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  try {
    await signOut(auth);
    console.log("User Signed Out");

    const result = await signInWithPopup(auth, provider);
    Toastify({
      text: "User Successfuly Sign Up ...",
      duration: 1500,
      delay: 1000,
      gravity: "top",
      position: "center",
      color: "var(--desertSun)",
      backgroundColor: "#525960",
      className: "toastify-center",
      avatar: "../assets/user-Authorize.png",
    }).showToast();
  } catch (error) {
    console.log(error.message);
    Toastify({
      text: error.message,
      duration: 1500,
      delay: 1000,
      gravity: "top",
      position: "center",
      color: "var(--desertSun)",
      backgroundColor: "#525960",
      className: "toastify-center",
      avatar: "../assets/user-Authorize.png",
    }).showToast();
  }
};
document
  .getElementById("LoginFacebook")
  ?.addEventListener("click", LoginFacebook);
//
//
// -------------------------- SignUp With GitHub -----------------------
//
//

const LoginGithub = async () => {
  const provider = new GithubAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  try {
    await signOut(auth);
    console.log("User Signed Out");

    const result = await signInWithPopup(auth, provider);
    Toastify({
      text: "User Successfuly Sign Up ...",
      duration: 1500,
      delay: 1000,
      gravity: "top",
      position: "center",
      color: "var(--desertSun)",
      backgroundColor: "#525960",
      className: "toastify-center",
      avatar: "../assets/user-Authorize.png",
    }).showToast();
  } catch (error) {
    console.log(error.message);

    Toastify({
      text: error.message,
      duration: 1500,
      delay: 1000,
      gravity: "top",
      position: "center",
      color: "var(--desertSun)",
      backgroundColor: "#525960",
      className: "toastify-center",
      avatar: "../assets/user-Authorize.png",
    }).showToast();
  }
};
document.getElementById("LoginGithub")?.addEventListener("click", LoginGithub);
//
//
// -------------------------- Forget Password -----------------------
//
//
const forgetPassword = async (event) => {
  event.preventDefault();
  try {
    const recoveryEmail = document.getElementById("forgetPassword-Email").value;
    await sendPasswordResetEmail(auth, recoveryEmail);
    Toastify({
      text: "Reset Message Sent!!",
      duration: 1500,
      delay: 1000,
      gravity: "top",
      position: "center",
      color: "var(--desertSun)",
      backgroundColor: "#525960",
      className: "toastify-center",
      avatar: "../assets/thumbsup.png",
    }).showToast();
  } catch (error) {
    Toastify({
      text: error.message,
      duration: 1500,
      delay: 1000,
      gravity: "top",
      position: "center",
      color: "var(--desertSun)",
      backgroundColor: "#525960",
      className: "toastify-center",
      avatar: "../assets/thumbsdown.png",
    }).showToast();
  }
};
document
  .getElementById("forgetPasswordForm")
  ?.addEventListener("submit", forgetPassword);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// -------------------going to login Form --------------------
const loginBtn = document.getElementById("loginBtn");
const signInBtn = document.getElementById("signInBtn");
const forgetPasswordBtn = document.getElementById("forgetPasswordBtn");
const backtoLogin = document.getElementById("backtoLogin"); //forget password sy wapis login pe jany wala btn hai.
//
// -----------showing login form-------------------
//
loginBtn?.addEventListener("click", () => {
  document.getElementById("loginInForm").style.display = "grid";
  document.getElementById("signUpForm").style.display = "none";
  document.getElementById("forgetPasswordForm").style.display = "none";
});
//
// -------------------showing sign up form-------------------
//
signInBtn?.addEventListener("click", () => {
  document.getElementById("signUpForm").style.display = "grid";
  document.getElementById("loginInForm").style.display = "none";
  document.getElementById("forgetPasswordForm").style.display = "none";
});
//
// -------------------showing forget Password form-------------------
//
forgetPasswordBtn?.addEventListener("click", () => {
  document.getElementById("forgetPasswordForm").style.display = "grid";
  document.getElementById("loginInForm").style.display = "none";
  document.getElementById("signUpForm").style.display = "none";
});
//
// -------------------back to login form-------------------
//
backtoLogin?.addEventListener("click", () => {
  document.getElementById("loginInForm").style.display = "grid";
  document.getElementById("forgetPasswordForm").style.display = "none";
  document.getElementById("signUpForm").style.display = "none";
});
