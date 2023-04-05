document.addEventListener("DOMContentLoaded", function () {
  obtenerStatus();
});

function obtenerStatus() {
  fetch("http://127.0.0.1:5000/api/v1/status")
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Error en la petición");
      }
    })
    .then((data) => {
      if (data.status === "success") {
        var results = data.results;

        document.getElementById("saldo_euros_invertidos").textContent =
          results.saldo_euros_invertidos;
        document.getElementById("total_euros_invertidos").textContent =
          results.total_euros_invertidos;
        document.getElementById("valor_actual_cartera_euros").textContent =
          results.valor_actual_cartera_euros;
      } else {
        if (data.status === "error") {
          console.log("Error al obtener el status de la cartera", data.message);
        }
      }
    })
    .catch((error) => {
      console.log("Error en la petición", error);
    });
}

