function hamburger() {
  var x = document.getElementById("links");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}
const imageContainer = document.querySelector(".image-container");

const savedImagesContainer = document.querySelector(".saved-images-container");
const savedImagesList = document.querySelector(".saved-images");
const toggleSavedButton = document.querySelector("#toggle-saved");
const imageCountElement = document.querySelector(".image-count");
const bookmarkIcon = document.querySelector(".bookmark-icon");
const savedImages = [];
let isLogged = false;
const queryInput = document.querySelector("#query");
const searchBox = document.querySelector(".search-box");

function displaySavedImages() {
  savedImagesContainer.innerHTML = "";
  savedImages.forEach((url) => {
    const imageElement = document.createElement("img");
    imageElement.src = url;
    imageElement.className = "image";
    savedImagesContainer.appendChild(imageElement);
  });
}

function updateSavedCount() {
  imageCountElement.textContent = `${savedImages.length} images`;
}

function saveImage(url) {
  if (!savedImages.includes(url)) {
    savedImages.push(url);
    console.log("Image saved:", url);
    updateSavedCount();
    displaySavedImages();
  }
}

function addImages(imageUrls) {
  imageContainer.innerHTML = "";
  imageUrls.forEach((url) => {
    const imageElement = document.createElement("img");
    imageElement.src = url;
    imageElement.className = "image";
    imageElement.addEventListener("click", () => {
      if (isLogged) saveImage(url);
    });
    imageContainer.appendChild(imageElement);
  });
}

async function loadImage() {
  const query = queryInput.value;
  try {
    const response = await fetch(
      `http://localhost:5000/query?query=${encodeURIComponent(query)}`,
    );
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    const data = await response.json();
    console.log("API response:", data);
    const imageUrls = data.imageUrls;
    addImages(imageUrls);
  } catch (error) {
    console.log("Error fetching image:", error);
  }
}

async function loadRandomImage() {
  try {
    const response = await fetch(`http://localhost:5000/random`);
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    const data = await response.json();
    console.log("API response:", data);
    const imageUrls = data.imageUrls;
    addImages(imageUrls);
  } catch (error) {
    console.log("Error fetching image:", error);
  }
}

async function authenticate() {
  if (isLogged) {
    await logout();
  } else {
    window.location.href = "http://localhost:5000/auth";
  }
}

async function checkLoginStatus() {
  try {
    const response = await fetch(`http://localhost:5000/auth/confirmation`);
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    const data = await response.json();
    if (data.isLogged) {
      isLogged = true;
      const savedHeader = document.querySelector(".saved-header");
      savedHeader.style.display = "flex";
      updateLoginButton();
    } else {
      isLogged = false;
      const savedHeader = document.querySelector(".saved-header");
      savedHeader.style.display = "none";
      updateLoginButton();
    }
  } catch (error) {
    console.log("Error checking authentification", error);
  }
}

function updateLoginButton() {
  const loginButton = document.querySelector("#Login");
  if (isLogged) {
    loginButton.innerHTML = "Logout";
  } else {
    loginButton.innerHTML = "Login";
  }
}

async function logout() {
  console.log("isLogged:", isLogged);
  try {
    await fetch("http://localhost:5000/logout", { method: "POST" });
    isLogged = false;
    updateLoginButton();
  } catch (error) {
    console.error("Error during logout:", error);
  }
}

queryInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") loadImage();
});
toggleSavedButton.addEventListener("click", () => {
  const isVisible = savedImagesContainer.style.display === "block";
  savedImagesContainer.style.display = isVisible ? "none" : "block";
  imageContainer.style.display = isVisible ? "flex" : "none";
  searchBox.style.display = isVisible ? "block" : "none";
  bookmarkIcon.src = isVisible ? "bookmark-closed.svg" : "bookmark-opened.svg";
});

loadRandomImage();
window.onload = () => {
  checkLoginStatus();
};
