import {
  collection,
  getDocs,
  db,
  query,
  orderBy,
  limit,
} from "../firebaseConfig.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Dynamically created cards require event delegation for the buttons
  const Blogs = document.getElementById("Blogs");

  // Event delegation for like and bookmark functionality
  Blogs?.addEventListener("click", (event) => {
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
  
  setTimeout(async () => {
    const querySnapshot = await getDocs(collection(db, "blogs"));
    Blogs.innerHTML = ``
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      Blogs.innerHTML += `
              <div class="d-grid gap-3">
              <div class="card homeCard" style="width: 22rem !important; height: 480px !important; position: relative !important;" >
                <div class="rounded-bottom mx-2" style="position: absolute; right: 0%; padding: 5px; background: rgba(255, 255, 255, 0.784) !important;">
                <img class="bookmark" data-bs-toggle="offcanvas" data-bs-target="#FavBlogList" aria-controls="FavBlogList" data-heading='${
                  data.blogHeading.slice(0, 25) + "..."
                }' data-image='${data.image}' data-description='${
                  data.blogText.slice(0, 60) + "..."
                }'  src="../assets/bookmark.png" width="25" height="25">
                <img class="bookmarked hide" src="../assets/bookmarked.png" width="25" height="25">
                </div>
                <img src="${
                  data.image
                }" class="blogCardImg rounded-top" style="height: 50% !important;">
                    <div class="card-body" style="height: 50% !important;">
                    <div class="fw-bold mb-1">About : <span class="blogCategory">${
                      data.category || "Uncategorized"
                    }</span></div>
                <p class="card-text">${
                  data.blogShortText.slice(0, 240) + "..." ||
                  data.blogText.slice(0, 240) + "..."
                }</p>
                <p class="card-text d-flex justify-content-between gap-3 align-items-center">
                  <small class="text-body-secondary" style="cursor: pointer" data-bs-toggle="modal" data-bs-target="#viewDetail" data-bs-whatever="@mdo" data-object='${JSON.stringify(
                    data
                  )}' onclick="viewDetail(this)">View in Detail....</small> 
                  <small class="d-flex justify-content-center gap-3 align-items-center">
                  <img class="likeEmpty" src="../assets/like-empty.png" width="20" height="20">
                  <img class="likeFull hide" src="../assets/like-full.png" width="20" height="20">
                  <img class="share" data-image='${data.image}' data-title='${
                    data.blogHeading
                  }' data-description='${data.blogText}' data-reference='${
                    data.relatedBlogs
                  }' src="../assets/share.png" width="20" height="20">
                  </small>
                  </p>
                  </div>
            </div>
            <div class="fw-bold">Author : ${data.blogAuthor || "Mike Jhordan"}
            <p class="fw-light">Time : ${data.date || "Unknown"}</p>
            </div>
            </div>
        `;
    });
  }, 1500);

  // get all blogs
  let filteredBlogs = [];
  let slicedBLogs = [];
  window.moveTo = async (para) => {
    const querySnapshot = await getDocs(collection(db, "blogs"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      filteredBlogs.push(data);
    });
    if (para == 1) {
      slicedBLogs = filteredBlogs.slice(0, 12);
    } else if (para == 2) {
      slicedBLogs = filteredBlogs.slice(12, 24);
    } else if (para == 3) {
      slicedBLogs = filteredBlogs.slice(24, 36);
    } else {
      slicedBLogs = filteredBlogs.slice(36, 48);
    }
    const Blogs = document.getElementById("Blogs");
    Blogs.innerHTML = "";
    slicedBLogs.forEach((blog) => {
      Blogs.innerHTML += `
              <div class="d-grid gap-3">
              <div class="card homeCard" style="width: 22rem !important; height: 480px !important; position: relative !important;" >
                <div class="rounded-bottom mx-2" style="position: absolute; right: 0%; padding: 5px; background: rgba(255, 255, 255, 0.784) !important;">
                <img class="bookmark" data-bs-toggle="offcanvas" data-bs-target="#FavBlogList" aria-controls="FavBlogList" data-heading='${
                  blog.blogHeading.slice(0, 25) + "..."
                }' data-image='${blog.image}' data-description='${
        blog.blogText.slice(0, 60) + "..."
      }'  src="../assets/bookmark.png" width="25" height="25">
                <img class="bookmarked hide" src="../assets/bookmarked.png" width="25" height="25">
                </div>
                <img src="${
                  blog.image
                }" class="blogCardImg rounded-top" style="height: 50% !important;">
                    <div class="card-body" style="height: 50% !important;">
                    <div class="fw-bold mb-1">About : <span class="blogCategory">${
                      blog.category || "Uncategorized"
                    }</span></div>
                <p class="card-text">${
                  blog.blogShortText.slice(0, 240) + "..." ||
                  blog.blogText.slice(0, 240) + "..."
                }</p>
                <p class="card-text d-flex justify-content-between gap-3 align-items-center">
                  <small class="text-body-secondary" style="cursor: pointer" data-bs-toggle="modal" data-bs-target="#viewDetail" data-bs-whatever="@mdo" data-object='${JSON.stringify(
                    blog
                  )}' onclick="viewDetail(this)">View in Detail....</small> 
                  <small class="d-flex justify-content-center gap-3 align-items-center">
                  <img class="likeEmpty" src="../assets/like-empty.png" width="20" height="20">
                  <img class="likeFull hide" src="../assets/like-full.png" width="20" height="20">
                  <img class="share" data-image='${blog.image}' data-title='${
        blog.blogHeading
      }' data-description='${blog.blogText}' data-reference='${
        blog.relatedBlogs
      }' src="../assets/share.png" width="20" height="20">
                  </small>
                  </p>
                  </div>
            </div>
            <div class="fw-bold">Author : ${blog.blogAuthor || "Mike Jhordan"}
            <p class="fw-light">Time : ${blog.date || "Unknown"}</p>
            </div>
            </div>
        `;
    });
  };
  // get filtered blogs
  window.getBlog = async (category) => {
    const querySnapshot = await getDocs(collection(db, "blogs"));
    const Blogs = document.getElementById("Blogs");
    Blogs.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.category === category) {
        // console.log(data);
        Blogs.innerHTML += `
              <div class="d-grid gap-3">
              <div class="card homeCard" style="width: 22rem !important; height: 480px !important; position: relative !important;" >
                <div class="rounded-bottom mx-2" style="position: absolute; right: 0%; padding: 5px; background: rgba(255, 255, 255, 0.784) !important;">
                <img class="bookmark" data-bs-toggle="offcanvas" data-bs-target="#FavBlogList" aria-controls="FavBlogList" data-heading='${
                  data.blogHeading.slice(0, 25) + "..."
                }' data-image='${data.image}' data-description='${
          data.blogText.slice(0, 60) + "..."
        }'  src="../assets/bookmark.png" width="25" height="25">
                <img class="bookmarked hide" src="../assets/bookmarked.png" width="25" height="25">
                </div>
                <img src="${
                  data.image
                }" class="blogCardImg rounded-top" style="height: 50% !important;">
                    <div class="card-body" style="height: 50% !important;">
                    <div class="fw-bold mb-1">About : <span class="blogCategory">${
                      data.category || "Uncategorized"
                    }</span></div>
                <p class="card-text">${
                  data.blogShortText.slice(0, 240) + "..." ||
                  data.blogText.slice(0, 240) + "..."
                }</p>
                <p class="card-text d-flex justify-content-between gap-3 align-items-center">
                  <small class="text-body-secondary" style="cursor: pointer" data-bs-toggle="modal" data-bs-target="#viewDetail" data-bs-whatever="@mdo" data-object='${JSON.stringify(
                    data
                  )}' onclick="viewDetail(this)">View in Detail....</small> 
                  <small class="d-flex justify-content-center gap-3 align-items-center">
                  <img class="likeEmpty" src="../assets/like-empty.png" width="20" height="20">
                  <img class="likeFull hide" src="../assets/like-full.png" width="20" height="20">
                  <img class="share" data-image='${data.image}' data-title='${
          data.blogHeading
        }' data-description='${data.blogText}' data-reference='${
          data.relatedBlogs
        }' src="../assets/share.png" width="20" height="20">
                  </small>
                  </p>
                  </div>
            </div>
            <div class="fw-bold">Author : ${data.blogAuthor || "Mike Jhordan"}
            <p class="fw-light">Time : ${data.date || "Unknown"}</p>
            </div>
            </div>
        `;
      }
    });
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
        text: "Blog has been Added to Favorites ....",
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

  // ------------------- viewDetail ----------------
  // Blog detail modal

  window.viewDetail = (buttonElement) => {
    try {
      const dataString = buttonElement.getAttribute("data-object");

      const dataObject = JSON.parse(dataString);
      console.log(dataObject);

      document.getElementById("blogTopHeading").textContent =
        dataObject.blogTopHeading;
      document.getElementById("blogPostTime").textContent = dataObject.date;
      //   document.getElementById("blogAuther").textContent = userName;
      document.getElementById("blogCategory").textContent = dataObject.category;
      document.getElementById("blogMainImage").src = dataObject.image;
      document.getElementById("blogHeading").textContent =
        dataObject.blogHeading;
      document.getElementById("blogText").textContent = dataObject.description;
      document.getElementById("blogShortText").textContent =
        dataObject.blogShortText;
      // --------------- feaKeyPoints ------------------------
      //   const feaKeyPoints = dataObject.featuredPoints;
      //   feaKeyPoints.forEach((point) => {
      //     const li = document.createElement("li");
      //     li.textContent = point;
      //     document.getElementById("feaKeyPoints").appendChild(li);
      //   });
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

  //share blog details
  document.addEventListener("click", async function (event) {
    if (event.target.classList.contains("share")) {
      const title = event.target.dataset.title; // Custom Title
      const description = event.target.dataset.description; // Custom Description
      const imageURL = event.target.dataset.image; // Image URL
      const reference = event.target.dataset.reference; // Reference URL

      try {
        const combinedText = `${title}\n\n${description}\n\nRead more: ${reference}\nImage: ${imageURL}`;

        const whatsappURL = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          combinedText
        )}`;
        Toastify({
          text: "Thanks for sharing this blog .",
          duration: 2500,
          delay: 500,
          gravity: "top",
          position: "center",
          color: "var(--desertSun)",
          backgroundColor: "#525960",
          className: "toastify-center",
          avatar: "../assets/thumbsup.png",
        }).showToast();
        window.open(whatsappURL, "_blank");
      } catch (error) {
        console.error("Error during WhatsApp sharing:", error);
        alert("An error occurred while sharing. Please try again.");
      }
    }
  });
});
