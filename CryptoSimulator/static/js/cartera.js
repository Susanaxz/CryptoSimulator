document.addEventListener("DOMContentLoaded", function () {
  obtenerCartera();
});

window.obtenerCartera = function() {
  fetch("http://127.0.0.1:5000/api/v1/cartera", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Error en la petición");
      }
    })
    .then((data) => {
      if (data.status === "success") {
        console.log("datos recibidos", data);
        renderizarCartera(data.results);
      } else {
        console.log("Error al obtener la cartera");
      }
    })
    .catch((error) => {
      console.log("Error en la petición", error);
    });
}

function renderizarCartera(data) {
  console.log("data recibida en renderCartera", data);
  const listadoCartera = document.getElementById("listado-cartera");
  listadoCartera.innerHTML = ""; 

  Object.entries(data).forEach(([moneda, total]) => { 
    console.log("Moneda individual:", moneda, total);
    

    const listItem = document.createElement("li");
    
    listItem.innerHTML = `<strong>${moneda}</strong>: ${total.toFixed(6)}`;
   

    listItem.setAttribute("data-moneda", moneda.to_currency);
    listItem.classList.add("moneda-item");
    listadoCartera.appendChild(listItem);
  });
}

