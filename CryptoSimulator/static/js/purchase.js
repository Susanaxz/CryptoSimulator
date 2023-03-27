controlarEvento();


// Función para obtener el precio de la moneda de origen y destino
function PrecioUnitarioDestino() {
  var monedaOrigen = document.getElementById("from_currency").value;
  var monedaDestino = document.getElementById("to_currency").value;

// TO FIX: arreglar el error TyperError. No dar el valor hasta tener las dos seleccionadas. 
  if (monedaOrigen && monedaDestino) {
    fetch(
      `http://127.0.0.1:5000/api/v1/precios?from_currency=${monedaOrigen}&to_currency=${monedaDestino}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Error en la petición");
        }
      })
      .then((data) => {
        if (data.status === "success") {
          var rate = data.rate;
          document.getElementById("precioBase").value = rate;
        } else {
          if (data.status === "error") {
            console.log("Error al obtener el precio de la moneda");
          }
        }
      })
      .catch((error) => {
        console.log("Error en la petición", error);
      });
  }
}

// funcion para controlar el evento cada vez que se cambia el valor de la moneda de origen y destino

function controlarEvento() {
  const monedaOrigen = document.getElementById("from_currency");
  const monedaDestino = document.getElementById("to_currency");
  const formulario = document.getElementById("mov-form");

  monedaOrigen.addEventListener("change", PrecioUnitarioDestino);
  monedaDestino.addEventListener("change", PrecioUnitarioDestino);
  formulario.addEventListener("submit", sendForm);
}

function sendForm(event) {
  const form = event.target;
  console.log("Formulario enviado", event);
  event.preventDefault(); // Evitar el comportamiento predeterminado del formulario

  // Recoger los datos del formulario y convertirlos en un objeto json para enviarlos a la API
  const formData = new FormData(form);

  // convertir los datos del formulario en un objeto json
  const jsonObject = {};
  for (const [key, value] of formData.entries()) {
    jsonObject[key] = value;
  }

  //   // Enviar la petición con los datos a la API
  fetch("http://127.0.0.1:5000/api/v1/transacciones", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonObject),
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
        console.log("Transacción realizada con éxito");
      } else {
        console.log("Error en la transacción");
      }
    })
    .catch((error) => {
      console.log("Error en la petición", error);
    });
}
