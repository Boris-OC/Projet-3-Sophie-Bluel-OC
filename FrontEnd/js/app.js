async function getWorks(filter) {
  const url = "http://localhost:5678/api/works";
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
      }
      const works = await response.json();
      
      // Appliquer le filtre si filter est défini
      const filtered = filter !== undefined 
          ? works.filter((data) => data.categoryId === filter) 
          : works;

      // Afficher les résultats filtrés
      document.querySelector(".gallery").innerHTML = ''; // Clear the gallery before appending
      for (let i = 0; i < filtered.length; i++) {
          console.log(filtered[i]);
          setFigure(filtered[i]);
      }
  } catch (error) {
      console.error(error.message);
  }
}

getWorks(); // Appel initial sans filtre

function setFigure(work) {
  const figure = document.createElement("figure");
  figure.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}">
                      <figcaption>${work.title}</figcaption>`;
  document.querySelector(".gallery").append(figure);
}

async function getCategories() {
  const url = "http://localhost:5678/api/categories";
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
      }
      const categories = await response.json();
      console.log(categories);

      // Ajouter un écouteur d'événements pour le filtre "Tous"
      document.querySelector(".tous").addEventListener("click", () => {
          getWorks(); // Appel sans filtre pour afficher tous les travaux
      });

      for (let i = 0; i < categories.length; i++) {
          setFilter(categories[i]);
      }
  } catch (error) {
      console.error(error.message);
  }
}
getCategories();

function setFilter(data) {
  const div = document.createElement("div");
  div.className = `${data.id}`;
  div.innerHTML = `${data.name}`;
  div.addEventListener("click", () => {
      getWorks(data.id); // Appel de getWorks avec l'ID de la catégorie
  });
  document.querySelector(".div-container").append(div);
}