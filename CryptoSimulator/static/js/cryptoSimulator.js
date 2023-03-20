const peticion = new XMLHttpRequest();
console.log("Empiezo a ejecutar JS");

function cargarTransacciones() {
    console.log("Has llamado a la función cargarTransacciones()");
    // aquí irá el spinner

    let queryParams = getQueryParams();

    let url = "http://127.0.0.1:5000/api/v1/transacciones";

    if (queryParams) {
        url += "?" + queryParams;
    }

    console.log("URL construida para la API", url);
    peticion.open("GET", url, true);
    peticion.send();

    console.log("FIN de la función cargarTransacciones()");
}

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);

  let queryParams = "";

  if (params.has("p") && params.get("p")) {
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


function mostrarTransacciones() {
    console.log("Has llamado a la función mostrarTransacciones", this);

    if (this.readyState === 4 && this.status === 200) {
        console.log("La petición ha sido correcta");
        const response = JSON.parse(peticion.responseText);
        const transacciones = response.results;

        let html = "";
        for (let i = 0; i < transacciones.length; i++) {
            const trans = transacciones[i];

            const date = new Date(trans.date);
            const FormatDate = date.toLocaleDateString();

            html = html + `
            <tr>
            <td class="fecha">${FormatDate}</td>
            <td>${trans.time}</td>
            <td>${trans.from_currency}</td>
            <td>${trans.from_quantity}</td>
            <td>${trans.to_currency}</td>
            <td>${trans.to_quantity}</td>
            <td>${trans.rate}</td>

            <td>
            `;
        }   

        const tabla = document.querySelector("#tabla-transacciones");
        tabla.innerHTML = html;
    } else {
        console.log("La petición ha fallado");
        alert("error al cargar las transacciones")
    }
    // aquí irá el spinner
}




window.onload = function () {
    console.log("funcion onload");
    // aquí irá el spinner

    cargarTransacciones();
    peticion.onload = mostrarTransacciones;
};