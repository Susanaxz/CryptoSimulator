console.log("----iniciamos el formulario----");

const form = document.getElementById("mov-form"); // recogemos el formulario
form.addEventListener("submit", sendForm); // añadimos el evento submit al formulario

// TODO: Crear la funcion sendForm que se ejecutará cuando se envíe el formulario
function sendForm(event) {
  event.preventDefault(); // Evitar el comportamiento predeterminado del formulario

  // TODO: recoger los datos del formulario

  // TODO: enviar la petición con los datos a la API
}

//  TODO: validar que las monedas seleccionadas en origen y destino sean diferentes

