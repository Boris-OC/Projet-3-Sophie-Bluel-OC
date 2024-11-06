const apiUrl = "http://localhost:5678/api";

initializeApp();

function initializeApp() {
  fetchWorks();
  fetchCategories();
  checkAdminMode();
  setupPictureSubmission();
}

// Toggle entre les deux modales
const addPhotoBtn = document.querySelector(".add-photo-button");
const closeModalBtn = document.querySelector(".js-modal-back");
addPhotoBtn.addEventListener("click", toggleModal);
closeModalBtn.addEventListener("click", toggleModal);

// Récupération des travaux avec options de filtrage
async function fetchWorks(filter) {
  document.querySelector(".gallery").innerHTML = "";
  document.querySelector(".modal-gallery").innerHTML = "";

  try {
    const response = await fetch(`${apiUrl}/works`);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const works = await response.json();
    const filteredWorks = filter ? works.filter(work => work.categoryId === filter) : works;

    filteredWorks.forEach(work => {
      createGalleryFigure(work);
      createModalFigure(work);
    });

    const trashIcons = document.querySelectorAll(".fa-trash-can");
    trashIcons.forEach(icon => icon.addEventListener("click", deleteWork));
  } catch (error) {
    console.error(error.message);
  }
}

// Intégration à la galerie des figures (image + titre)
function createGalleryFigure(work) {
  const figure = document.createElement("figure");
  figure.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}">
                      <figcaption>${work.title}</figcaption>`;
  document.querySelector(".gallery").append(figure);
}

// Intégration à la modale des figures (image + titre)
function createModalFigure(work) {
  const figure = document.createElement("figure");
  figure.innerHTML = `<div class="image-container">
        <img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>${work.title}</figcaption>
        <i id="${work.id}" class="fa-solid fa-trash-can overlay-icon"></i>
    </div>`;
  document.querySelector(".modal-gallery").append(figure);
}

// Récupération des catégories depuis l'API
async function fetchCategories() {
  try {
    const response = await fetch(`${apiUrl}/categories`);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const categories = await response.json();
    categories.forEach(category => createFilter(category));
  } catch (error) {
    console.error(error.message);
  }
}

// Ajout des eventListeners aux filtres
function createFilter(category) {
  const filterDiv = document.createElement("div");
  filterDiv.className = category.id;
  filterDiv.addEventListener("click", () => fetchWorks(category.id));
  filterDiv.addEventListener("click", toggleFilter);
  document.querySelector(".tous").addEventListener("click", toggleFilter);
  filterDiv.innerHTML = `${category.name}`;
  document.querySelector(".div-container").append(filterDiv);
}

// Affichage du filtre actif et des figures associées
function toggleFilter(event) {
  const container = document.querySelector(".div-container");
  Array.from(container.children).forEach(child => child.classList.remove("active-filter"));
  event.target.classList.add("active-filter");
}

document.querySelector(".tous").addEventListener("click", () => fetchWorks());

// Utilisateur authentifié
function checkAdminMode() {
  if (sessionStorage.authToken) {
    document.querySelector(".div-container").style.display = "none";
    document.querySelector(".js-modal-2").style.display = "block";
    document.querySelector(".gallery").style.margin = "30px 0 0 0";
    const editBanner = document.createElement("div");
    editBanner.className = "edit";
    editBanner.innerHTML = '<p><a href="#modal1" class="js-modal"><i class="fa-regular fa-pen-to-square"></i>Mode édition</a></p>';
    document.body.prepend(editBanner);
    document.querySelector(".log-button").textContent = "logout";
    document.querySelector(".log-button").addEventListener("click", () => {
      sessionStorage.removeItem("authToken");
    });
  }
}

// MODALE
let activeModal = null;
const focusableElements = "button, a, input, textarea";
let focusableItems = [];

const openModal = function (event) {
  event.preventDefault();
  activeModal = document.querySelector(event.target.getAttribute("href"));
  focusableItems = Array.from(activeModal.querySelectorAll(focusableElements));
  focusableItems[0].focus();
  activeModal.style.display = null;
  activeModal.removeAttribute("aria-hidden");
  activeModal.setAttribute("aria-modal", "true");
  activeModal.addEventListener("click", closeModal);
  activeModal.querySelectorAll(".js-modal-close").forEach(btn => btn.addEventListener("click", closeModal));
  activeModal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
};

const closeModal = function (event) {
  if (activeModal === null) return;
  event.preventDefault();
  activeModal.style.display = "none";
  activeModal.setAttribute("aria-hidden", "true");
  activeModal.removeAttribute("aria-modal");
  activeModal.removeEventListener("click", closeModal);
  activeModal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
  activeModal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
  activeModal = null;
};

const stopPropagation = function (event) {
  event.stopPropagation();
};

const focusInModal = function (event) {
  event.preventDefault();
  let index = focusableItems.findIndex(item => item === activeModal.querySelector(":focus"));
  index += event.shiftKey ? -1 : 1;

  if (index >= focusableItems.length) {
    index = 0;
  } else if (index < 0) {
    index = focusableItems.length - 1;
  }

  focusableItems[index].focus();
};

window.addEventListener("keydown", function (event) {
  if (event.key === "Escape" || event.key === "Esc") {
    closeModal(event);
  }
  if (event.key === "Tab" && activeModal !== null) {
    focusInModal(event);
  }
});

document.querySelectorAll(".js-modal").forEach(link => {
  link.addEventListener("click", openModal);
});

// Fonction de suppression des travaux
async function deleteWork(event) {
  event.stopPropagation();
  const workId = event.srcElement.id;
  const token = sessionStorage.authToken;

  try {
    const response = await fetch(`${apiUrl}/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (response.status === 401 || response.status === 500) {
      const errorBox = document.createElement("div");
      errorBox.className = "error-login";
      errorBox.innerHTML = "Il y a eu une erreur";
      document.querySelector(".modal-button-container").prepend(errorBox);
    }
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
  }
}

// Toggle entre les deux modales
function toggleModal() {
  const galleryModal = document.querySelector(".gallery-modal");
  const addModal = document.querySelector(".add-modal");

  if (galleryModal.style.display === "block" || galleryModal.style.display === "") {
    galleryModal.style.display = "none";
    addModal.style.display = "block";
  } else {
    galleryModal.style.display = "block";
    addModal.style.display = "none";
  }
}

// Gestion de l'ajout d'une nouvelle photo
function setupPictureSubmission() {
  const imgPreview = document.createElement("img");
  const fileInput = document.getElementById("file");
  let file;
  fileInput.style.display = "none";
  fileInput.addEventListener("change", function (event) {
    file = event.target.files[0];
    const maxFileSize = 4 * 1024 * 1024;

    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      if (file.size > maxFileSize) {
        alert("La taille de l'image ne doit pas dépasser 4 Mo.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        imgPreview.src = e.target.result;
        imgPreview.alt = "Uploaded Photo";
        document.getElementById("photo-container").appendChild(imgPreview);
      };
      reader.readAsDataURL(file);
      document.querySelectorAll(".picture-loaded").forEach(e => (e.style.display = "none"));
    } else {
      alert("Veuillez sélectionner une image au format JPG ou PNG.");
    }
  });

  const titleInput = document.getElementById("title");
  let titleInputValue = "";
  let selectedCategoryId = "1";

  document.getElementById("category").addEventListener("change", function () {
    selectedCategoryId = this.value;
  });

  titleInput.addEventListener("input", function () {
    titleInputValue = titleInput.value;
  });

  const addPictureForm = document.getElementById("picture-form");

  addPictureForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const hasImage = document.querySelector("#photo-container").firstChild;
    if (hasImage && titleInputValue) {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", titleInputValue);
      formData.append("category", selectedCategoryId);

      const token = sessionStorage.authToken;

      if (!token) {
        console.error("Token d'authentification manquant.");
        return;
      }

      let response = await fetch(`${apiUrl}/works`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });

      if (response.status === 201) {
        // Si la photo a été ajoutée avec succès
        const newWork = await response.json();
        // Ajout immédiat de la photo à la galerie
        createGalleryFigure(newWork);
        createModalFigure(newWork);

        // Fermer la modal et réinitialiser les champs
        toggleModal();
        document.getElementById("file").value = "";  // Réinitialiser le champ du fichier
        document.getElementById("title").value = "";  // Réinitialiser le titre
        document.getElementById("photo-container").innerHTML = "";  // Réinitialiser la prévisualisation de l'image
      } else {
        const errorText = await response.text();
        console.error("Erreur : ", errorText);
        const errorBox = document.createElement("div");
        errorBox.className = "error-login";
        errorBox.innerHTML = `Il y a eu une erreur : ${errorText}`;
        document.querySelector("form").prepend(errorBox);
      }
    } else {
      alert("Veuillez remplir tous les champs");
    }
  });
}
