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
const savedImages = [];

const queryInput = document.querySelector("#query");

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
      saveImage(url);
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

function authenticate() {
  console.log("HEY");
}

queryInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") loadImage();
});
toggleSavedButton.addEventListener("click", () => {
  const isVisible = savedImagesContainer.style.display === "block";
  savedImagesContainer.style.display = isVisible ? "none" : "block";
});

loadRandomImage();
