import {
  db,
  doc,
  collection,
  getDocs,
  onAuthStateChanged,
  auth,
  addDoc,
  getDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "../firebaseConfig.js";

// -------------------like /dislike ----user Collection ----------------
document.addEventListener("DOMContentLoaded", async () => {
  // Dynamically created cards require event delegation for the buttons
  const voiceBloggers = document.getElementById("voiceBloggers");

  // Event delegation for like and bookmark functionality
  voiceBloggers?.addEventListener("click", (event) => {
    const target = event.target;

    // Handle "Like" functionality
    if (target.classList.contains("likeEmpty")) {
      target.classList.add("hide");
      target.nextElementSibling.classList.remove("hide");
    } else if (target.classList.contains("likeFull")) {
      target.classList.add("hide");
      target.previousElementSibling.classList.remove("hide");
    }

    // Handle "Bookmark" functionality
    else if (target.classList.contains("bookmark")) {
      target.classList.add("hide");
      target.nextElementSibling.classList.remove("hide");
    } else if (target.classList.contains("bookmarked")) {
      target.classList.add("hide");
      target.previousElementSibling.classList.remove("hide");
    }

    // Handle "save" functionality
    else if (target.classList.contains("save")) {
      target.classList.add("hide");
      target.nextElementSibling.classList.remove("hide");
    } else if (target.classList.contains("unSave")) {
      target.classList.add("hide");
      target.previousElementSibling.classList.remove("hide");
    }
  });
  const myHeadings = document.querySelectorAll(".myHeadings");
  myHeadings.forEach((heading) => {
    heading.style.display = "none";
  });
  try {
    setTimeout(async () => {
      // Fetch data from Firestore
      document.querySelector(".loader").style.display = "none";
      myHeadings.forEach((heading) => {
        heading.style.display = "block";
      });
      const querySnapshot = await getDocs(collection(db, "userColection"));
      voiceBloggers.innerHTML = ""; // Clear container before adding cards
      querySnapshot.forEach(async (doc) => {
        const data = doc.data();
        //   console.log(data);
        const usersSnapshot = await getDocs(collection(db, "users"));
        usersSnapshot.forEach((user) => {
          if (user.id === data.uid) {
            const userData = user.data();
            const userName = userData.name;
            const time = userData.timestamp;
            // formated timeStamp
            const date = new Date(time.seconds * 1000);

            // Format the date to "MMM DD YYYY"
            const formattedDate = date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            });

            voiceBloggers.innerHTML += `
      <div class="d-grid gap-3">
            <div class="card homeCard" style="width: 22rem !important; height: 480px !important; position: relative !important;">
                <div class="rounded-bottom mx-2" style="position: absolute; right: 0%; padding: 5px; background: rgba(255, 255, 255, 0.784) !important;">
                <img class="bookmark" data-bs-toggle="offcanvas" data-bs-target="#FavBlogList" aria-controls="FavBlogList" data-heading='${
                  data.title.slice(0, 25) + "..."
                }' data-image='${data.image}' data-description='${
              data.description.slice(0, 60) + "..."
            }'  src="../assets/bookmark.png" width="25" height="25">
                <img class="bookmarked hide" src="../assets/bookmarked.png" width="25" height="25">
                </div>
                
                <img src="${
                  data.image || "https://via.placeholder.com/150"
                }" class="blogCardImg rounded-top" style="height: 50% !important;">
                    <div class="card-body" style="height: 50% !important;">
                    <div class="fw-bold mb-1">About : <span class="blogCategory">${
                      data.category || "Uncategorized"
                    }</span></div>
                <p class="card-text">${
                  data.description || "No description available."
                }</p>
                <p class="card-text d-flex justify-content-between gap-3 align-items-center">
                  <small class="text-body-secondary" style="cursor: pointer" data-bs-toggle="modal" data-bs-target="#viewDetail" data-bs-whatever="@mdo" data-object='${JSON.stringify(
                    data
                  )}' onclick="viewDetail(this,'${userName}')">View in Detail....</small> 
                  <small class="d-flex justify-content-center gap-3 align-items-center">
                  <img class="likeEmpty" src="../assets/like-empty.png" width="20" height="20">
                  <img class="likeFull hide" src="../assets/like-full.png" width="20" height="20">
                  <img class="share" data-image='${data.image}' data-title='${
              data.title
            }' data-description='${data.description}' data-reference='${
              data.reference
            }' src="../assets/share.png" width="20" height="20">
                  </small>
                  </p>
                  </div>
            </div>
            <div class="fw-bold">Author : ${userName || "Unknown"}
            <p class="fw-light">Time : ${formattedDate || "Unknown"}</p>
            </div>
            </div>
            `;
          }
        });
      });
    }, 1500);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

// -------------------controlling my Collection ----------------

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const myCollection = document.getElementById("myCollection");
    myCollection.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "userColection"));
    const usersSnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((blog) => {
      usersSnapshot.forEach((User) => {
        if (blog.data().uid === user.uid && User.id === user.uid) {
          const userName = User.data().name;
          const data = blog.data();
          const time = data.time;
          // formated timeStamp
          const date = new Date(time.seconds * 1000);

          // Format the date to "MMM DD YYYY"
          const formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          });
          myCollection.innerHTML += `
      <div class="d-grid gap-3">
            <div class="card homeCard" style="width: 22rem !important; height: 480px !important; position: relative !important;">
              
                <div class="rounded-bottom mx-2" style="position: absolute; right: 11%; padding: 5px; background: rgba(255, 255, 255, 0.784) !important;">
                  <img class="save" data-id='${
                    blog.id
                  }' data-bs-toggle="modal" data-bs-target="#addBlog" 
                  data-bs-whatever="@getbootstrap"
                  src="../assets/save.png" width="25" height="25">
                  <img class="unSave hide" src="../assets/saveUn.png" width="25" height="25">
                </div>
              <div class="rounded-bottom mx-2" style="position: absolute; right: 0%; padding: 5px; background: rgba(255, 255, 255, 0.784) !important;">
              <img class="delete" data-id='${
                blog.id
              }' src="../assets/delete.png" width="25" height="25">
              </div>
                <img src="${
                  data.image || "https://via.placeholder.com/150"
                }" class="blogCardImg rounded-top" style="height: 50% !important;">
                    <div class="card-body" style="height: 50% !important;">
                    <div class="fw-bold mb-1">About : <span class="blogCategory">${
                      data.category || "Uncategorized"
                    }</span></div>
                <p class="card-text">${
                  data.description || "No description available."
                }</p>
                <p class="card-text d-flex justify-content-between gap-3 align-items-center">
                  <small class="text-body-secondary" style="cursor: pointer" data-bs-toggle="modal" data-bs-target="#viewDetail" data-bs-whatever="@mdo" data-object='${JSON.stringify(
                    data
                  )}' onclick="viewDetail(this,'${userName}')">View in Detail....</small> 
                  <small class="d-flex justify-content-center gap-3 align-items-center">
                  <img class="likeEmpty" src="../assets/like-empty.png" width="20" height="20">
                  <img class="likeFull hide" src="../assets/like-full.png" width="20" height="20">
                  <img class="share" data-image='${data.image}' data-title='${
            data.title
          }' data-description='${data.description}' data-reference='${
            data.reference
          }' src="../assets/share.png" width="20" height="20">
                  </small>
                  </p>
                  </div>
            </div>
            <div class="fw-bold">Author : ${userName || "Unknown"}
            <p class="fw-light">Time : ${formattedDate || "Unknown"}</p>
            </div>
            </div>
            `;
        }
      });
    });
  }
});

// ------------------- filtration ----------------
// Filter by category
window.filterCategory = async (blogCategory) => {
  document.querySelector(".conatiner2").style.display = "none";
  document.querySelector(".conatiner1 h1").style.display = "none";
  const voiceBloggers = document.getElementById("voiceBloggers");
  voiceBloggers.innerHTML = ``;
  const blogSnapshot = await getDocs(collection(db, "userColection"));
  const userSnapshot = await getDocs(collection(db, "users"));
  blogSnapshot.forEach((blog) => {
    if (blog.data().category === blogCategory) {
      const data = blog.data();
      const time = data.time;
      // formated timeStamp
      const date = new Date(time.seconds * 1000);

      // Format the date to "MMM DD YYYY"
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
      userSnapshot.forEach((user) => {
        if (user.id === blog.data().uid) {
          const userName = user.data().name;
          voiceBloggers.innerHTML += `
    <div class="d-grid gap-3">
          <div class="card homeCard" style="width: 22rem !important; height: 480px !important; position: relative !important;" >
            <div class="rounded-bottom mx-2" style="position: absolute; right: 0%; padding: 5px; background: rgba(255, 255, 255, 0.784) !important;">
                <img class="bookmark" data-bs-toggle="offcanvas" data-bs-target="#FavBlogList" aria-controls="FavBlogList" data-heading='${
                  data.title.slice(0, 25) + "..."
                }' data-image='${data.image}' data-description='${
            data.description.slice(0, 60) + "..."
          }'  src="../assets/bookmark.png" width="25" height="25">
                <img class="bookmarked hide" src="../assets/bookmarked.png" width="25" height="25">
                </div>
              <img src="${
                data.image || "https://via.placeholder.com/150"
              }" class="blogCardImg rounded-top" style="height: 50% !important;">
                  <div class="card-body" style="height: 50% !important;">
                  <div class="fw-bold mb-1">About : <span class="blogCategory">${
                    data.category || "Uncategorized"
                  }</span></div>
              <p class="card-text">${
                data.description || "No description available."
              }</p>
              <p class="card-text d-flex justify-content-between gap-3 align-items-center">
                <small class="text-body-secondary" style="cursor: pointer" data-bs-toggle="modal" data-bs-target="#viewDetail" data-bs-whatever="@mdo" data-object='${JSON.stringify(
                  data
                )}' onclick="viewDetail(this,'${userName}')">View in Detail....</small> 
                <small class="d-flex justify-content-center gap-3 align-items-center">
                <img class="likeEmpty" src="../assets/like-empty.png" width="20" height="20">
                <img class="likeFull hide" src="../assets/like-full.png" width="20" height="20">
                <img class="share" data-image='${data.image}' data-title='${
            data.title
          }' data-description='${data.description}' data-reference='${
            data.reference
          }' src="../assets/share.png" width="20" height="20">
                </small>
                </p>
                </div>
          </div>
          <div class="fw-bold">Author : ${userName || "Unknown"}
          <p class="fw-light">Time : ${formattedDate || "Unknown"}</p>
          </div>
          </div>
          `;
        }
      });
    }
  });
};

// ------------------- viewDetail ----------------
// Blog detail modal

window.viewDetail = (buttonElement, userName) => {
  try {
    const dataString = buttonElement.getAttribute("data-object");

    const dataObject = JSON.parse(dataString);
    console.log(dataObject);

    document.getElementById("blogTopHeading").textContent =
      dataObject.TopHeading;
    document.getElementById("blogPostTime").textContent = dataObject.date;
    document.getElementById("blogAuther").textContent = userName;
    document.getElementById("blogCategory").textContent = dataObject.category;
    document.getElementById("blogMainImage").src = dataObject.image;
    document.getElementById("blogHeading").textContent = dataObject.blogHeading;
    document.getElementById("blogText").textContent = dataObject.description;
    document.getElementById("blogShortText").textContent =
      dataObject.blogShortText;
    // --------------- feaKeyPoints ------------------------
    const feaKeyPoints = dataObject.featuredPoints;
    feaKeyPoints.forEach((point) => {
      const li = document.createElement("li");
      li.textContent = point;
      document.getElementById("feaKeyPoints").appendChild(li);
    });
    // --------------- refLinks ------------------------
    const refLinks = document.getElementById("refLinks");
    const refLink = dataObject.reference;
    refLinks.innerHTML = ``;
    refLinks.innerHTML += `
    <a
        href="${refLink}"
        class="border p-2 rounded"
        target="_blank"
        style="
        color: var(--coral) !important; text-decoration: underline !important;
        "
        ><img src="../assets/ref-icon(1).png" width="20" height="20"/></a>
    <a
        href="${refLink}"
        class="border p-2 rounded"
        target="_blank"
        style="
          color: var(--coral) !important;
          text-decoration: underline !important;
        "
        ><img src="../assets/ref-icon(2).png" width="20" height="20"
    /></a>
    <a
        href="${refLink}"
        class="border p-2 rounded"
        target="_blank"
        style="
          color: var(--coral) !important;
          text-decoration: underline !important;
        "
        ><img src="../assets/ref-icon(3).png" width="20" height="20"
    /></a>
    `;
  } catch (error) {
    console.error("Error parsing data-object:", error);
  }
};

// -------------------  Fav list----------------
// delete blog from favorite functionality

window.deleteBlog = (event) => {
  event.parentNode.remove();
  Toastify({
    text: "Blog has been Deleted ....",
    duration: 2500,
    delay: 500,
    gravity: "top",
    position: "center",
    color: "var(--desertSun)",
    backgroundColor: "#525960",
    className: "toastify-center",
    avatar: "../assets/thumbsup.png",
  }).showToast();
};

// add to fav blog list functionality
document.addEventListener("click", async function (event) {
  if (event.target.classList.contains("bookmark")) {
    // Data attributes ko access karna
    const heading = event.target.dataset.heading;
    const description = event.target.dataset.description;
    const image = event.target.dataset.image;
    console.log(heading, description, image);
    const docRef = await addDoc(collection(db, "userFav"), {
      heading,
      description,
      image,
    });

    // `offcanvasBody` mein nayi entry add karna
    const favList = document.getElementById("offcanvasBody");
    const favItem = document.createElement("a");
    favItem.href = "#";
    favItem.className =
      "d-flex w-100 align-items-center gap-2 justify-content-between py-3";

    // Content generate karna
    favItem.innerHTML = `
          <img src="${image}" class="rounded" width="80" height="80">
          <div class="d-grid w-100 align-items-center justify-content-between">
              <strong class="mb-1">${heading}</strong>
              <small class="col-10 mb-1 small">${description}</small>
          </div>
          <img src="../assets/delete.png" width="30" height="30" onclick="deleteBlog(this)">
      `;

    // List mein add karna
    favList.appendChild(favItem);

    // Bookmark toggle karna
    event.target.classList.add("hide");
    event.target.nextElementSibling.classList.remove("hide");
    Toastify({
      text: "Blog has been Added in Favorites ....",
      duration: 2500,
      delay: 500,
      gravity: "top",
      position: "center",
      color: "var(--desertSun)",
      backgroundColor: "#525960",
      className: "toastify-center",
      avatar: "../assets/thumbsup.png",
    }).showToast();
  }
});

// how to share image on WhatsApp
// document.addEventListener("click", async function (event) {
//   if (event.target.classList.contains("share")) {
//       const imageURL = event.target.dataset.image; // Image URL

//       try {
//           // Fetch image and create a File object
//           const response = await fetch(imageURL);
//           if (!response.ok) throw new Error("Image fetch failed.");

//           const blob = await response.blob();
//           const imageFile = new File([blob], "shared-image.jpg", { type: blob.type });

//           // Check for file-sharing support
//           if (navigator.canShare && navigator.canShare({ files: [imageFile] })) {
//               // Attach the file and include all text details
//               await navigator.share({
//                   files: [imageFile], // Attach image file
//               });
//               console.log("Shared successfully with image and all details!");
//           } else if (navigator.share) {
//               // Fallback: Share without the image file
//               await navigator.share({
//                   url: reference, // Share reference URL
//               });
//               console.log("Shared successfully without image!");
//           } else {
//               alert("Sharing is not supported on this browser.");
//           }
//       } catch (error) {
//           console.error("Error during sharing:", error);
//           alert("An error occurred while sharing. Please try again.");
//       }
//   }
// });

//share blog details
document.addEventListener("click", async function (event) {
  if (event.target.classList.contains("share")) {
    const title = event.target.dataset.title; // Custom Title
    const description = event.target.dataset.description; // Custom Description
    const imageURL = event.target.dataset.image; // Image URL
    const reference = event.target.dataset.reference; // Reference URL

    try {
      // Combine title, description, and reference into text for WhatsApp
      const combinedText = `${title}\n\n${description}\n\nRead more: ${reference}\nImage: ${imageURL}`;

      // Generate WhatsApp share link
      const whatsappURL = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        combinedText
      )}`;

      // Open the WhatsApp share link
      window.open(whatsappURL, "_blank");
      console.log("WhatsApp share link opened successfully!");
    } catch (error) {
      console.error("Error during WhatsApp sharing:", error);
      alert("An error occurred while sharing. Please try again.");
    }
  }
});

// getting image
// -------------------------------- add Blog -----------------------------
document.getElementById("userBlogImage").addEventListener("click", () => {
  document.getElementById("getUserBlogImage").click();
});
// edit blog
document.addEventListener("click", async function (event) {
  if (event.target.classList.contains("save")) {
    const id = event.target.dataset.id;

    const docRef = doc(db, "userColection", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const updateBlogTopHeading =
        document.getElementById("userBlogTopHeading");
      const updateBlogTitle = document.getElementById("userBlogTitle");
      const updateBlogDescription = document.getElementById(
        "userBlogDescription"
      );
      const updateBlogRef = document.getElementById("userBlogRef");
      const userFeauturedPoints = document.getElementById(
        "userFeauturedPoints"
      );
      const userBlogImage = document.getElementById("getUserBlogImage");
      updateBlogTopHeading.value = data.TopHeading;
      updateBlogTitle.value = data.title;
      updateBlogDescription.value = data.description;
      updateBlogRef.value = data.reference;
      userFeauturedPoints.value = data.featuredPoints;
      userBlogImage.src = data.image;

      const updateBlogForm = async (e) => {
        e.preventDefault();
        const updateBlogTopHeading =
          document.getElementById("userBlogTopHeading").value;
        const updateBlogTitle = document.getElementById("userBlogTitle").value;
        const updateBlogDescription = document.getElementById(
          "userBlogDescription"
        ).value;
        const updateBlogRef = document.getElementById("userBlogRef").value;
        const userFeauturedPoints = document.getElementById(
          "userFeauturedPoints"
        ).value;

        const userBlogImage = document.getElementById("getUserBlogImage");
        const selectedImg = userBlogImage.files[0];
        console.log("Selected image file: ", selectedImg);

        let image = await uploadImge(selectedImg);
        if (!image) {
          console.error(
            "Image upload failed, can't proceed with adding recipe."
          );
          return;
        }

        await updateDoc(doc(db, "userColection", id), {
          title: updateBlogTitle,
          TopHeading: updateBlogTopHeading,
          description: updateBlogDescription,
          reference: updateBlogRef,
          image,
          time: serverTimestamp(),
        });
        Toastify({
          text: "Blog has been Updated Successfully ....",
          duration: 2500,
          delay: 500,
          gravity: "top",
          position: "center",
          color: "var(--desertSun)",
          backgroundColor: "#525960",
          className: "toastify-center",
          avatar: "../assets/thumbsup.png",
        }).showToast();
        window.location.reload();
      };
      document
        .getElementById("updateBlogForm")
        ?.addEventListener("submit", updateBlogForm);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }
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

// // delete blog
document.addEventListener("click", async function (event) {
  if (event.target.classList.contains("delete")) {
    const id = event.target.dataset.id;
    console.log(id);

    await deleteDoc(doc(db, "userColection", id));
    setTimeout(() => {
      Toastify({
        text: "Blog has been Deleted Successfully ....",
        duration: 3000,
        delay: 500,
        gravity: "top",
        position: "center",
        color: "var(--desertSun)",
        backgroundColor: "#525960",
        className: "toastify-center",
        avatar: "../assets/thumbsup.png",
      }).showToast();
    }, 1000);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
});

// New's API
const apiKey = "90a5cfdc9bff4dc0a039d3e95980d4ca";
const apiUrl = `https://newsapi.org/v2/everything?q=tesla&apiKey=${apiKey}`;

window.fetchTeslaNews = async () => {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const articles = data.articles;

    console.log(articles);
    const conatiner1 = document.getElementById("voiceBloggers");
    document.querySelector(".conatiner1 h1").style.display = "none";
    document.querySelector(".conatiner2").style.display = "none";
    document.getElementById("voiceBloggers").style.display = "none";

    conatiner1.innerHTML = "";
    articles.forEach((article) => {
      conatiner1.innerHTML += `
      <div class="d-grid gap-3">
          <div class="card homeCard" style="width: 22rem !important; height: 480px !important; position: relative !important;" >
              <img src="${
                article.urlToImage ||
                "https://ichef.bbci.co.uk/images/ic/1200x675/p0gq40gv.jpg"
              }" class="blogCardImg rounded-top" style="height: 50% !important;">
                  <div class="card-body" style="height: 50% !important;">
                  <div class="fw-bold mb-1">About : <span class="blogCategory">${
                    article.source.name || "Today News"
                  }</span></div>
              <p class="card-text">${article.description || article.content}</p>
              
              </div>
          </div>
          <div class="fw-bold">Author : ${article.author || "Mike Jhordan"}
          <p class="fw-light">Time : ${
            article.publishedAt.slice(0, 10) || " 9 min ago"
          }</p>
          </div>
          </div>
      `;
    });
  } catch (error) {
    console.error("Error fetching Tesla news:", error);
  }
};
