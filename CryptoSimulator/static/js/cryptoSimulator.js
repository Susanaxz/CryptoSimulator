const peticion = new XMLHttpRequest();
console.log("Empiezo a ejecutar JS");

function cargarTransacciones(page) {
  console.log("Has llamado a la función cargarTransacciones()");
  // aquí irá el spinner

  let queryParams = getQueryParams(page);

  let url = "http://127.0.0.1:5000/api/v1/transacciones";

  if (queryParams) {
    url += "?" + queryParams;
  }

  console.log("URL construida para la API", url);

  peticion.open("GET", url);
  peticion.send();



  console.log("FIN de la función cargarTransacciones()");
}

function getQueryParams(page) {
  const params = new URLSearchParams(window.location.search);

  let queryParams = "";

  if (page) {
    queryParams = `p=${page}`;
  } else if (params.has("p") && params.get("p")) {
    queryParams = `p=${params.get("p")}`;
  }

  if (params.has("r") && params.get("r")) {
    if (queryParams) {
      queryParams += "&";
    }
    queryParams += `r=${params.get("r")}`;
  }

  console.log("queryParams", queryParams);
  return queryParams;
}

function actualizarPaginacion(page, num_pages) {
  const pagination = document.querySelector(".pagination");

  let html = "";
  const maxVisiblePages = 3;
  let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(num_pages, startPage + maxVisiblePages - 1);

  if (page > 1) {
    html += `<a class="pagination-link" data-page="${
      page - 1
    }" href="#">&lt;</a>`;
  } else {
    html += `<span class="pagination-link disabled">&lt;</span>`;
  }

  for (let p = startPage; p <= endPage; p++) {
    if (p === page) {
      html += `<span class="pagination-link current">${p}</span>`;
    } else {
      html += `<a class="pagination-link" data-page="${p}" href="#">${p}</a>`;
    }
  }

  if (page < num_pages) {
    html += `<a class="pagination-link" data-page="${
      page + 1
    }" href="#">&gt;</a>`;
  } else {
    html += `<span class="pagination-link disabled">&gt;</span>`;
  }

  pagination.innerHTML = html;

  // Agrega event listeners a los nuevos enlaces de paginación
  const links = pagination.querySelectorAll(".pagination-link");
  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const page = parseInt(this.dataset.page);
      cargarTransacciones(page);
    });
  });
}

function mostrarTransacciones() {
  console.log("Has llamado a la función mostrarTransacciones", this);

  if (this.readyState === 4 && this.status === 200) {
    console.log("La petición ha sido correcta");
    const response = JSON.parse(peticion.responseText);
    const transacciones = response.results;
    console.log(response);
    const page = response.page;
    const num_pages = response.num_pages;
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";

    let html = "";
    for (let i = 0; i < transacciones.length; i++) {
      const trans = transacciones[i];

      const date = new Date(trans.date);
      const FormatDate = date.toLocaleDateString();

      // Ajustar los decimales
      const opciones = {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      };
      const formateador = new Intl.NumberFormat("es-ES", opciones);
      const criptoQuantity = formateador.format(trans.to_quantity);
      const precioUd = formateador.format(trans.rate)

      html =
        html +
        `
            <tr>
            <td class="fecha">${FormatDate}</td>
            <td>${trans.time}</td>
            <td>${trans.from_currency}</td>
            <td>${trans.from_quantity}</td>
            <td>${trans.to_currency}</td>
            <td>${criptoQuantity + " " + trans.to_currency}</td>
            <td>${precioUd + " " + trans.from_currency}</td>
            </tr>
            `;
    }

    const tabla = document.querySelector("#tabla-transacciones");
    tabla.innerHTML = html;

    actualizarPaginacion(page, num_pages);
  } else if (this.status === 404) {
    console.log("No hay registros");
    // mensaje html
    const html = `
        <tr>
        <td colspan="7">No hay ninguna transacción</td>
        </tr>
        `;
    const txt = document.querySelector("#tabla-transacciones");
    txt.innerHTML = html;
  } else {
    console.log("La petición ha fallado");
    alert("Error al cargar las transacciones");
  }
}

window.onload = function () {
  console.log("funcion onload");
  // aquí irá el spinner

  cargarTransacciones();
  peticion.onload = mostrarTransacciones;
};
