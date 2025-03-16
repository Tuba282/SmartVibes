import {
  db,
  getDocs,
  onSnapshot,
  collection,
  query,
  orderBy,
  where,
  doc,
  setDoc,
  addDoc,
  auth,
  onAuthStateChanged,
  serverTimestamp,
} from "./firebaseConfig.js";

const postBtn2 = document.getElementById("post-btn2");
const textarea2 = document.getElementById("exampleFormControlTextarea2");

let currentUser;
// Function to render a single comment on the UI
const renderComment = (docData, docId) => {
  const commentDiv = document.createElement("div");
  commentDiv.classList.add("comment");
  commentDiv.setAttribute("data-id", docId);

  const userImage =
    docData.userImage ||
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png";

  commentDiv.innerHTML = `
    <div class="d-flex">
      <div class="">
        <img src="${userImage}" class="rounded-5" width="40" alt="User">
      </div>
      <div class="ms-3">
        <strong class="text-dark" id="currentUser">${docData.userName}</strong>
        <p class="text-dark mb-2">${docData.timestamp || "No Timestamp"}</p>
      </div>
    </div>
    <p class="text-dark p-1 mb-3 mb-lg-3 commentPara">${docData.userComment}</p>
    
    <div class="d-flex align-items-start justify-content-start gap-2"></br></br>
      <div class="px-2 btn btn-light border reply-btn" style="border-color: var(--desertSun)">
        &nbsp;<span style="color: var(--desertSun) !important; font-size: 13px">Reply</span>
      </div>
    </div>
    
    <div class="pt-3 pb-3 mt-3 mb-3 comment-post" style="display: none">
      <div class="mb-3">
        <textarea class="form-control comment-textarea" rows="3" style="border: none !important; outline: none !important"></textarea>
      </div>
      <div class="text-end">
        <button class="px-3 btn border post-btn" style="background-color: var(--desertSun) !important; color: rgb(255, 255, 255) !important; font-size: 15px; float: right !important;">
          Post
        </button>
      </div>
    </div>
    
    <div class="reply text-dark mt-3">
      <div class="reply-user" style="color: var(--desertSun) !important">
        <p class="text-dark p-1 mb-3 mb-lg-3 user-reply">${docData.reply || ""}</p>
      </div>
    </div>
  `;

  document.getElementById("randomComments").appendChild(commentDiv);

  // Add interactions for like, dislike, reply
  addCommentInteractions(commentDiv, docId);
};

// Real-Time Listener for Comments
onSnapshot(
  query(collection(db, "comments"), orderBy("timestamp", "desc")),
  (snapshot) => {
    // Clear existing comments before rendering
    document.getElementById("randomComments").innerHTML = "";
    snapshot.forEach((doc) => {
      renderComment(doc.data(), doc.id);
    });
  }
);
let smartVibeReply = "";
const addCommentInteractions = (commentDiv, docId) => {
  const replyBtn = commentDiv.querySelector(".reply-btn");
  const commentPost = commentDiv.querySelector(".comment-post");
  const postBtn = commentDiv.querySelector(".post-btn");
  const textarea = commentDiv.querySelector(".comment-textarea");

  replyBtn?.addEventListener("click", () => {
    commentPost.style.display = "block";
    commentPost.style.outline = "none !important";
  });

  postBtn?.addEventListener("click", async () => {
    const reply = textarea.value; // Get the reply from textarea
    if (reply.trim() !== "") {
      await setDoc(
        doc(db, "comments", docId),
        {
          reply: reply,
          replyTimestamp: new Date().toLocaleTimeString([], {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        { merge: true } // Merge reply with the existing comment document
      );

      // Clear the reply input and hide the reply UI
      textarea.value = "";
      commentPost.style.display = "none";
    } else {
      console.log("Please fill the reply first.");
    }
  });
};

// Post a new comment
postBtn2?.addEventListener("click", async () => {
  const comment = textarea2.value;

  // Check if user is authenticated
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userImage = localStorage.getItem("userCurrentImageSrc");
      const userName = localStorage.getItem("userCurrentName");

      if (comment.trim() !== "") {
        // Add a new comment document to Firestore
        await addDoc(collection(db, "comments"), {
          userComment: comment,
          userUid: user.uid,
          userImage: userImage,
          userName: userName,
          reply: "", // Initialize reply as empty
          timestamp: new Date().toLocaleTimeString([], {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        });

        // Clear the comment input
        textarea2.value = "";
      } else {
        console.log("Please fill the comment first.");
      }
    } else {
      console.log("User is not signed in.");
    }
  });
});