controlarEvento();

const comprar = ["EUR"];
const vender = [
  "BTC",
  "ETH",
  "USDT",
  "ADA",
  "SOL",
  "XRP",
  "DOT",
  "DOGE",
  "SHIB",
];

document.addEventListener("DOMContentLoaded", () => {
  const SeleccionOperacion = document.getElementById("operacion");
  const SeleccionOrigen = document.getElementById("from_currency");
  const SeleccionDestino = document.getElementById("to_currency");

  const actualizarOpciones = (seleccion, opciones) => {
    seleccion.innerHTML =
      '<option value="" selected="selected" disabled="disabled">-- Selecciona una moneda --</option>';

    for (const coin of opciones) {
      const opcion = document.createElement("option");
      opcion.value = coin;
      opcion.textContent = coin;
      seleccion.appendChild(opcion);
    }
  };
 // Función para actualizar los menús desplegables de las monedas de origen y destino
  const actualizarMonedas = () => {
    const OperacionSeleccionada = SeleccionOperacion.value;

    if (OperacionSeleccionada === "comprar") {
      actualizarOpciones(SeleccionOrigen, comprar);
      actualizarOpciones(SeleccionDestino, vender);
    } else {
      actualizarOpciones(SeleccionOrigen, vender);
      actualizarOpciones(
        SeleccionDestino,
        OperacionSeleccionada === "vender" ? ["EUR"] : vender
      );
    }
  };

  actualizarMonedas();

  // Actualiza los menús desplegables cada vez que se cambia la operación
  SeleccionOperacion.addEventListener("change", actualizarMonedas);
});



// Función para obtener el precio de la moneda de origen y destino
function PrecioUnitarioDestino() {
  var monedaOrigen = document.getElementById("from_currency").value;
  var monedaDestino = document.getElementById("to_currency").value;

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
  console.log("Formulario enviado", event);
  event.preventDefault(); // Evitar el comportamiento predeterminado del formulario
  const form = event.target;

  // Validar el formulario
    
  if (!validarFormulario(form)) {
    return;
  }

    // Recoger los datos del formulario y convertirlos en un objeto json para enviarlos a la API
    const formData = new FormData(form);

    // convertir los datos del formulario en un objeto json
    const jsonObject = {};
    for (const [key, value] of formData.entries()) {
      jsonObject[key] = value;
    }

    const operacion = jsonObject.operacion;

    if (operacion === "comprar") {
      realizarCompra(jsonObject);


    } else if (operacion === "vender") {

      fetch(`http://127.0.0.1:5000/api/v1/cartera`, {
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
          const from_currency = jsonObject.from_currency;
          const cripto_cartera = data.results[from_currency];

          if (
            !cripto_cartera ||
            cripto_cartera.total < jsonObject.from_quantity
          ) {
            alert(`No tienes suficiente ${from_currency} para vender.`);
            return;
          }

          realizarVenta(jsonObject, data);
        })
        .catch((error) => {
          console.log("Error en la petición", error);
        });
    
    
    } else if (operacion === "intercambiar") {
      realizarIntercambio(jsonObject);
    } else {
      console.log("Tipo de transacción desconocida");
      return;
    }
  }

  function realizarCompra(jsonObject) {
    console.log("Realizando compra", jsonObject);
    fetch("http://127.0.0.1:5000/api/v1/comprar", {
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
          console.log("Compra realizada con éxito");
          alert("Compra realizada con éxito");
          location.reload();
        } else {
          console.log("Error en la compra");
        }
      })
      .catch((error) => {
        console.log("Error en la petición", error);
      });
  }

  function realizarIntercambio(jsonObject) {
    console.log("Realizando intercambio", jsonObject);
    const from_currency = jsonObject.from_currency;
    const from_quantity = jsonObject.from_quantity;
    const to_currency = jsonObject.to_currency;
  
    // comprobar la cartera
    fetch(`http://127.0.0.1:5000/api/v1/cartera`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Error en la petición de cartera");
        }
      })
      .then((data) => {
        const cripto_cartera = data.results[from_currency];

        if (!cripto_cartera || cripto_cartera < from_quantity) {
          alert(`No tienes suficiente ${from_currency} en tu cartera, por favor modifica la cantidad`);
          return;
        }

        // realizar el intercambio

        fetch("http://127.0.0.1:5000/api/v1/intercambiar", {
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
              throw new Error("Error en la petición de intercambio");
            }
          })
          .then((data) => {
            console.log(data);
            const to_quantity = data.to_quantity;
            obtenerCartera();
            alert(`Has intercambiado ${from_quantity} ${from_currency} por ${to_quantity} ${to_currency}`);
          })
          .catch((error) => {
            console.log("Error en la petición", error);
          });
      })
      .catch((error) => {
        console.log("Error en la petición", error);
      });
  }

  function realizarVenta(jsonObject, data) {
    console.log("Realizando venta", jsonObject);
    const from_quantity = jsonObject.from_quantity;
    const to_currency = jsonObject.to_currency;
    const from_currency = jsonObject.from_currency;
    let venta_exitosa = false;
  
    const cripto_cartera = data.results[from_currency];

    // comprobar la cartera
    fetch(`http://127.0.0.1:5000/api/v1/cartera`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Error en la petición de cartera");
        }
      })
      .then((data) => {
        const cripto_cartera = data.results[from_currency];

        if (!cripto_cartera || cripto_cartera < from_quantity) {
          alert(`No tienes suficiente ${from_currency} en tu cartera, por favor modifica la cantidad`);
          return;
        }


        // obtener el precio de la crypto
        const monedaOrigen = from_currency;
        const monedaDestino = "EUR";

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
              const rate = data.rate;

              const cantidad_venta = jsonObject.from_quantity;
              console.log("Cantidad de venta: ", cantidad_venta);
              console.log("Tipo de cambio: ", rate);

              const valor_venta = cantidad_venta * rate;

              console.log("Valor de venta: ", valor_venta);

              jsonObject.valor_venta = valor_venta;

              console.log("Venta realizada con éxito", jsonObject);

              // realizar la venta

              return fetch("http://127.0.0.1:5000/api/v1/vender", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonObject),
              });
            }
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
              console.log("Venta realizada con éxito");
              alert("Venta realizada con éxito");
              obtenerCartera();
              venta_exitosa = true;
       
            } else {
              console.log("Error en la venta");
            }
          })
   
      }
      )
      .catch((error) => {
        console.log("Error en la petición", error);
      });
}
  

  function validarFormulario(form) {
    const from_currency = form.from_currency.value;
    const to_currency = form.to_currency.value;
    const operacion = form.operacion.value;
    const from_quantity = form.from_quantity.value;
  

    let isValid = true;
    let errorMsg = "";

    if (!from_currency) {
      errorMsg = "Por favor, seleccione una moneda de origen.\n";
      isValid = false;
    }

    if (!to_currency) {
      errorMsg += "Por favor, seleccione una moneda de destino.\n";
      isValid = false;
    }

    if (!operacion) {
      errorMsg += "Por favor, seleccione una operación.\n";
      isValid = false;
    }

    if (!from_quantity || from_quantity <= 0) {
      errorMsg += "Por favor, introduzca una cantidad válida.\n";
      isValid = false;
    }

    if (!isValid) {
      alert(errorMsg);
    }

  return isValid;
}

