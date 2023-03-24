document.getElementById("mov-form").addEventListener("submit", sendForm);



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
  fetch("http://127.0.0.1:5000/api/v1/transacciones",{
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
