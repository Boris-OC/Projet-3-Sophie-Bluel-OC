async function getWorks(idCategory) {
  const url = "http://localhost:5678/api/works";
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
      }
      let works = await response.json();
      
      if (idCategory !== undefined){
        works = works.filter((data) => data.categoryId === idCategory) 
      } 
      
      // Afficher les résultats filtrés
      document.querySelector(".gallery").innerHTML = ''; // Clear the gallery before appending
      for (const work of works) {
          console.log(work);
          displayWork(work);
      }
  } catch (error) {
      console.error(error.message);
  }
}

getWorks(); 

function displayWork(work) {
  const figure = document.createElement("figure");
  
  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;
  
  const figcaption = document.createElement("figcaption");
  figcaption.textContent = work.title;

  figure.appendChild(img);
  figure.appendChild(figcaption);
  
  document.querySelector(".gallery").appendChild(figure);
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
      for (const category of categories) {
        setFilter(category);
      }
  } catch (error) {
      console.error(error.message);
  }
}
getCategories();

function setFilter(data) {
  const div = document.createElement("div");
  div.className = `${data.id}`;

  const textNode = document.createTextNode(data.name);
  div.appendChild(textNode);
  
  div.addEventListener("click", () => {
    getWorks(data.id); // Appel de getWorks avec l'ID de la catégorie
  });
  
  document.querySelector(".div-container").appendChild(div);
}