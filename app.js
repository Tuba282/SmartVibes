import { onAuthStateChanged ,auth } from "./firebaseConfig.js";
import { formatDistanceToNow } from "./node_modules/date-fns/index.js";

import {
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
  query,
  orderBy,
  where,
  onSnapshot,
  limit,
} from "./firebaseConfig.js";
// import { DataConnect } from "firebase/data-connect";

const now = new Date();
//
//
//
// -------------------------------- recentPost -----------------------------
//
//
const recentPost = async () => {
  try {
    // Query: Order by "id" in descending order and limit to 3
    const ref = query(
      collection(db, "userColection"),
      orderBy("time", "desc"),
      limit(4)
    );

    // Fetch the documents
    const querySnapshot = await getDocs(ref);
    const recentPosts = document.getElementById("recentPosts");
    recentPosts.innerHTML = "";

    // Check if we have results
    if (querySnapshot.empty) {
      console.log("No recent posts found");
      recentPosts.innerHTML = "<div>No recent posts available</div>";
      return;
    }

    // Loop through fetched data
    querySnapshot.forEach((doc) => {
      const blog = doc.data();
      const time = blog.time;
      // formated timeStamp
      const date = new Date(time.seconds * 1000);

      // Format the date to "MMM DD YYYY"
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
      // Append blog to the DOM
      recentPosts.innerHTML += `
                <li>
                  <a
                    class="d-flex flex-column flex-lg-row gap-3 align-items-start align-items-lg-center py-3 link-body-emphasis text-decoration-none border-top"
                    href="#"
                  >
                    <div style="width: 100% !important;min-height: 96px !important;background: url(${blog.image}),no-repeat!important;background-position: center center!important;background-size: cover!important;"></div>
                    <div class="col-lg-8">
                      <h6 class="mb-0">${blog.title}</h6>
                      <div class="blogCategory">${blog.category}</div>
                      <small class="text-body-secondary"
                        >${formattedDate}</small
                      >
                    </div>
                  </a>
                </li>
        `;
    });
    
    Toastify({
      text: "Recent Post Updated ...",
      duration: 2500,
      delay: 500,
      gravity: "top",
      position: "center",
      color: "var(--desertSun)",
      backgroundColor: "#525960",
      className: "toastify-center",
      avatar: "./assets/thumbsup.png",
    }).showToast();

    console.log(`Fetched ${querySnapshot.size} recent posts`);
  } catch (error) {
    console.error("Error fetching recent posts:", error.message);
  }
};

recentPost();
//
//
//

//
//
// -------------------------------- Profile functionality -----------------------------
//
//
// Load data from localStorage
let savedImageSrc =
  localStorage.getItem("userCurrentImageSrc") ||
  "https://archive.org/download/whatsapp-smiling-guy-i-accidentally-made/whatsapp%20generic%20person%20light.jpg";
let userCurrentEmail =
  localStorage.getItem("userCurrentEmail") || "guest@example.com";
let userCurrentName = localStorage.getItem("userCurrentName") || "Guest User";

// DOM Elements
const userImage = document.getElementById("userImage");
const profileImage = document.getElementById("profileImage");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");

// Set initial data
if (savedImageSrc && userImage) {
  profileImage.src = savedImageSrc;
  userImage.src = savedImageSrc;
  profileName.textContent = userCurrentName;
  profileEmail.textContent = userCurrentEmail;
} else {
  console.log("No image source found in localStorage.");
}

// Button to trigger image input
document.getElementById("changeProfileImage")?.addEventListener("click", () => {
  document.getElementById("takeProfileImage")?.click();
});

// Update profile details
const changeProfile = (event) => {
  event.preventDefault();

  // Updated fields
  const changeProfileImage = document.getElementById("takeProfileImage"); // File input
  const changeProfileName = document.getElementById("changeProfileName");
  const changeProfileEmail = document.getElementById("changeProfileEmail");

  // Process image file
  if (changeProfileImage.files && changeProfileImage.files[0]) {
    const file = changeProfileImage.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      savedImageSrc = reader.result; // Base64 URL
      localStorage.setItem("userCurrentImageSrc", savedImageSrc);
      userImage.src = savedImageSrc;
      profileImage.src = savedImageSrc;
      document.getElementById("changeProfileImage").src = savedImageSrc;
    };

    reader.readAsDataURL(file);
  } else {
    console.error("No image selected.");
  }

  // Update name
  if (changeProfileName.value) {
    userCurrentName = changeProfileName.value;
    localStorage.setItem("userCurrentName", userCurrentName);
    profileName.textContent = userCurrentName;
  }

  // Update email
  if (changeProfileEmail.value) {
    userCurrentEmail = changeProfileEmail.value;
    localStorage.setItem("userCurrentEmail", userCurrentEmail);
    profileEmail.textContent = userCurrentEmail;
  }

};

// Form submit listener
document
  .getElementById("changeProfile")
  ?.addEventListener("submit", changeProfile);

// -------------------------------- filtered Quotes -----------------------------

const filteredQuotes = [];
const filteredBlogs = [];

window.getBlog = async (para) => {
  const blogSnapshot = await getDocs(collection(db, "blogs"));
  const quoteSnapshot = await getDocs(collection(db, "quotes"));
  blogSnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.category === para) {
      // console.log(data);

      document.getElementById("blogTopHeading").textContent =
        data.blogTopHeading;
      document.getElementById("blogPostTime").textContent = data.date;
      document.getElementById("blogAuther").textContent = data.blogAuthor;
      document.getElementById("blogCategory").textContent = data.category;
      document.getElementById("blogMainImage").src = data.image;
      document.getElementById("blogHeading").textContent = data.blogHeading;
      document.getElementById("blogText").textContent = data.blogText;
      document.getElementById("blogShortText").textContent = data.blogShortText;
      // --------------- feaKeyPoints ------------------------
      const feaKeyPoints = data.featuredKeyPoints;
      feaKeyPoints.forEach((point) => {
        const li = document.createElement("li");
        li.textContent = point;
        document.getElementById("feaKeyPoints").appendChild(li);
      });
      // --------------- refLinks ------------------------
      // const refLinks = data.relatedBlogs;
      // refLinks.forEach((link, ind) => {
      //   const a = document.createElement("a");
      //   a.setAttribute("href", `${link}`);
      //   a.setAttribute("class", "border p-2 rounded");
      //   a.setAttribute("target", "_blank");
      //   a.setAttribute(
      //     "style",
      //     "color: var(--coral) !important; text-decoration: underline !important;"
      //   );
      //   a.innerHTML = `
      //   <img src="./assets/ref-icon(${ind}).png" width="20" height="20"/>
      //   `;
      //   document.getElementById("refLinks")?.appendChild(a); //array
      // });
      
    }
  });
  quoteSnapshot.forEach((quote) => {
    const data = quote.data();
    if (data.Category === para) {
      console.log(data);

      const div = document.createElement("div");
      div.setAttribute("class", "my-3 p-3 rounded cateQuote");
      div.innerHTML = `
        <p class="mb-0 text-light text-center p-3" >
          " <span class="text-light fw-light">${data.Quote}</span> "<br><br>
          <small class="text-light"><span class="fst-italic text-center text-light">${data.Author}</span></small>
        </p> 
      `;

      const cateQuote = document.querySelector(".cateQuote");
      cateQuote.innerHTML = "";
      if (!cateQuote) {
        console.error("cateQuote element nahi mila!");
        return;
      }
      cateQuote.appendChild(div);
    }
  });
};

window.getBlogCards = async (para) => {
  const blogSnapshot = await getDocs(collection(db, "blogs"));
  const homefiltration = document.getElementById("homefiltration");
  homefiltration.innerHTML = "";
  blogSnapshot.forEach((blog) => {
    const data = blog.data();
    if (data.category === para) {
      const updatedAt = new Date(data.date); 
      const lastUpdated = formatDistanceToNow(updatedAt, { addSuffix: true });

      homefiltration.innerHTML += `
      <div  class="card homeCard" style="width: 22rem !important;height: 480px !important;" onclick="detailBlog(${data.id})" data-bs-toggle="modal" data-bs-target="#detailBlogModal">
        <img src="${data.image}" class="blogCardImg rounded-top" style="height: 50% !important;">
        <div class="card-body" style="height: 50% !important;">
          <div class="fw-bold mb-1">Blog About : <span class="blogCategory">${data.category}</span></div>
          <p class="card-text">${data.blogShortText}</p>
          <p class="card-text"><small class="text-body-secondary">Last updated ${lastUpdated}</small></p>
        </div>
      </div>
      `;
    }
  });
};

window.detailBlog = async (getId) => {
  console.log(getId);
  const docSnap = await getDoc(doc(db, "blogs", `${getId}`));

  if (docSnap.exists()) {
    const data = docSnap.data();
    document.getElementById("detalBlogCategory").textContent = data.category;
    document.getElementById("detalBlogImage").src = data.image;
    document.getElementById("detalBlogHeading").textContent = data.blogHeading;
    document.getElementById("detalBlogTopHEading").textContent =
      data.blogTopHeading;
    document.getElementById("detalBlogTime").textContent = data.blogAuthor;
    document.getElementById("detalBlogText").textContent =
      data.blogText + " " + data.blogShortText;
    document.getElementById("detalBlogAuthor").textContent = data.blogAuthor;
    // document.getElementById("detalBlogrefLinks").textContent=data.blogAuthor
    data.relatedBlogs.forEach((link, ind) => {
      const a = document.createElement("a");
      a.setAttribute("href", `${link}`);
      a.setAttribute("class", "border p-2 rounded");
      a.setAttribute("target", "_blank");
      a.setAttribute(
        "style",
        "color: var(--coral) !important; text-decoration: underline !important;"
      );
      a.innerHTML = `
        <img src="./assets/ref-icon(${ind}).png" width="20" height="20"/>
        `;
      document.getElementById("refLinks")?.appendChild(a); //array
    });
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
};
//
//
// -------------------------------- add Blog -----------------------------
document.getElementById("userBlogImage")?.addEventListener("click", () => {
  document.getElementById("getUserBlogImage").click();
});
const userFeaturedBtn = document
  .querySelector(".addFeature")?.addEventListener("click", (event) => {
    event.preventDefault();
    const feaDiv = document.createElement("div");
    feaDiv.setAttribute("class", "mb-1 d-flex justify-content-end gap-2");
    feaDiv.innerHTML = `
    <input type="text" class="form-control w-50">
    `;
    document.getElementById("addFeatures").appendChild(feaDiv);
  });
// Get the form element
const userBlogForm = document.getElementById("userBlogForm");

// Add submit event listener
userBlogForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent page reload 

  // Retrieve data from the form
  const blogTitle = document.getElementById("userBlogTitle").value;
  const blogTopHeading = document.getElementById("userBlogTopHeading").value;
  const blogDescription = document.getElementById("message-text").value;
  const blogCategory = document
    .querySelector(".dropdown-item")
    .textContent.trim();
  const blogReference = document.getElementById("userBlogRef").value;

  // Retrieve featured points
  const featuredPoints = [];
  document.querySelectorAll("#addFeatures input").forEach((input) => {
    featuredPoints.push(input.value);
  });

  // Retrieve the image (if any file is selected)
  const blogImageInput = document.getElementById("getUserBlogImage");
  const selectedImg = blogImageInput.files[0];
  console.log("Selected image file: ", selectedImg);

  let image = await uploadImge(selectedImg);
  if (!image) {
    console.error("Image upload failed, can't proceed with adding recipe.");
    return;
  }
  onAuthStateChanged(auth,async (user)=>{
    
    if (user) {
      localStorage.setItem("userUid", user.uid)
      const docRef = await addDoc(collection(db, "userColection"), {
        title: blogTitle,
        TopHeading:blogTopHeading,
        description: blogDescription,
        category: blogCategory,
        reference: blogReference,
        featuredPoints,
        image,
        uid:user.uid,
        time:serverTimestamp(),
      });
      Toastify({
        text: "Blog has been Added Successfully ....",
        duration: 500,
        delay: 1000,
        gravity: "top",
        position: "center",
        color: "var(--desertSun)",
        backgroundColor: "#525960",
        className: "toastify-center",
        avatar: "./assets/thumbsup.png",
      }).showToast();
      window.location.replace("./userCollection/userBlog.html")
    }else{
      Toastify({
        text: "User Not Found...!",
        duration: 500,
        delay: 1000,
        gravity: "top",
        position: "center",
        color: "var(--desertSun)",
        backgroundColor: "#525960",
        className: "toastify-center",
        avatar: "./assets/thumbsup.png",
      }).showToast();
    }
  })
  
});

// ------------------ upload image in cloudinary helping function ------------------
const uploadImge = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "uploadPreset");
  formData.append("cloud_name", "dzq61zzxb");

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dzq61zzxb/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    console.log("Image upload response: ", data); // Add this line to check the response
    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error("Image URL not found");
    }
  } catch (error) {
    console.log("Image upload error:", error);
    return null;
  }
};

/*
<div class="mb-1 d-flex justify-content-end gap-2">
  <input type="text" class="form-control w-50" id="userFeauturedPoints">
  <button class="btn btn-outline-secondary addFeature">+</button>
</div>
*/
/*
.blogTopHEading,
.blogCategory,
.blogHeading,
.refLink,
.feaKeyPoints {
  color: #333333c2 !important;
  font-family: title !important;
}
body,
html {
  background: #a45c4041;
  color: #33333396 !important;
  border-color: #333 !important;
}
*/
