async function getWorks() {
    const url = "http://localhost:5678/api/works";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const works = await response.json();
      for (const work of works){
        setFigure(work)
      }
    } catch (error) {
      console.error(error.message);
    }
  }
getWorks();

function setFigure(work) {
    const figure = document.createElement("figure");
    figure.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}">
                        <figcaption>${work.title}</figcaption>`

    document.querySelector(".gallery").append(figure);
}

async function getCategories() {
  const url = "http://localhost:5678/api/categories";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    for (let i = 0; i < json.length; i++) {
      setFilter(json[i]);
    }
  } catch (error) {
    console.error(error.message);
  }
}
getCategories();


function setFilter (data) {
  const div = document.createElement("div");
    div.innerHTML = `${data.name}`;

    document.querySelector(".div-container").append(div);
}
