modalidadPago = "------------";

let fechaHoy = new Date().toISOString().substring(0, 10);
let usuarioActualId = null; //
let checkboxClickedId = null;
let checkboxClickedMonto = null;
let checkboxClickedConcepto = null;
let alumno = null;
let nombre = null;

let historialPagoList = [];

let pagoX = null;

function historialPago() {
  document.getElementById("tituloNavbar").innerText = "Historial de Pago";

  let contenedor = document.getElementById("contenedor");
  contenedor.innerHTML = "";

  contenedor.innerHTML = `
  <div class="container">
  <div class="row" style="padding-top: 2%">
      <div id="buscarAlumno" class="col-md-6">
          <div class="input-group mb-3">
              <input id="inputNombreBuscar" type="text" class="form-control" placeholder="Nombre Paterno Materno" aria-label="Recipient's username" aria-describedby="button-addon2">
              <button class="btn btn-outline-secondary" type="button" id="button-addon2" onclick="buscarAlumno()">Buscar</button>
          </div>
      </div>
  
      <div class="col-md-1">
      <button onclick="actionHistoiralPDF(this)" id="download-pdf">
          <div id="descargarHistorial" class="pdf">
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-filetype-pdf" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM1.6 11.85H0v3.999h.791v-1.342h.803q.43 0 .732-.173.305-.175.463-.474a1.4 1.4 0 0 0 .161-.677q0-.375-.158-.677a1.2 1.2 0 0 0-.46-.477q-.3-.18-.732-.179m.545 1.333a.8.8 0 0 1-.085.38.57.57 0 0 1-.238.241.8.8 0 0 1-.375.082H.788V12.48h.66q.327 0 .512.181.185.183.185.522m1.217-1.333v3.999h1.46q.602 0 .998-.237a1.45 1.45 0 0 0 .595-.689q.196-.45.196-1.084 0-.63-.196-1.075a1.43 1.43 0 0 0-.589-.68q-.396-.234-1.005-.234zm.791.645h.563q.371 0 .609.152a.9.9 0 0 1 .354.454q.118.302.118.753a2.3 2.3 0 0 1-.068.592 1.1 1.1 0 0 1-.196.422.8.8 0 0 1-.334.252 1.3 1.3 0 0 1-.483.082h-.563zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638z"/>
              </svg>
          </div>
          </button>

      </div>
      
  </div>
</div>
    <table id="tablaPagos" class="table">
            <thead>
                <tr>
                    <th scope="col">ID Pago</th>
                    <th scope="col">Monto</th>
                    <th scope="col">Fecha Emisión</th>
                    <th scope="col">Fecha Límite</th>
                    <th scope="col">Fecha Pago</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Modalidad</th>
                    <th scope="col">Concepto</th>
                    <th scope="col">Modificar</th>
                </tr>
            </thead>
            <tbody id="cuerpoTabla">
                <!-- Aquí se cargarán los datos de los pagos -->
            </tbody>`;

  document.getElementById("inputNombreBuscar").value = nombre;
  buscarAlumno();
}

function actionHistoiralPDF(button) {
  var ficha = button.querySelector("#descargarHistorial");
  ficha.classList.toggle("active"); // Cambia la clase para cambiar el color
  setTimeout(() => {
    ficha.classList.remove("active"); // Remueve la clase después de un breve tiempo
  }, 400); // 500 ms después de hacer clic

  console.log(`Generando PDf `);
  // Crear una instancia de jsPDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();


  var image = new Image();
  image.onload = function () {
    var base64 = getBase64Image(image);
    console.log(base64); // Imprime la cadena base64 de la imagen en la consola
  };
  image.src = "https://i.ibb.co/YBNPpjF/via-Dise-o-Logo-Grande.png"; // Asegúrate de tener acceso a la imag
  // Posición de la imagen (x, y, ancho, alto)
  doc.addImage(image, "PNG", 150, 5, 30, 30); // Ajusta las coordenadas como sea necesario

  doc.setFontSize(10); // Establece el tamaño de fuente a 8 puntos
  doc.setFont("helvetica", "bold");
  
  doc.text(`Nombre Alumno: ${alumno.Nombre} ${alumno.Apellido_paterno} ${alumno.Apellido_materno}`, 10, 10);
  doc.text(` N° Matricula: ${alumno.Matricula}`, 10, 20);

  

  doc.text("ID Pago", 10, 50);
  doc.text("Monto", 30, 50);
  doc.text("Fecha Emisión", 50, 50);
  doc.text("Fecha Límite", 80, 50);
  doc.text("Fecha Pago", 110, 50);
  doc.text("Estado", 140, 50);
  doc.text("Modalidad", 160, 50);
  doc.text("Concepto", 180, 50);

  //Dibuja una línea horizontal debajo de los títulos de las columnas
  doc.line(10, 55, 200, 55); // Ajusta los valores de `x2` según el ancho de tu página

  doc.setFont("helvetica", "normal"); 
  let y = 60; // Posición inicial de los datos en Y

  historialPagoList.forEach(function (pago, index) {
    doc.text(`${pago.idPago}`, 10, y);
    doc.text(`${pago.monto}`, 30, y);
    doc.text(`${pago.fechaEmision}`, 50, y);
    doc.text(`${pago.fechaLimite}`, 80, y);
    doc.text(`${pago.fechaPago}`, 110, y);
    doc.text(`${pago.estado}`, 140, y);
    doc.text(`${pago.modalidad}`, 160, y);
    doc.text(`${pago.concepto}`, 180, y);

    // Dibuja una línea horizontal debajo de cada fila de datos
    doc.line(10, y + 3, 200, y + 3); // Ajusta los valores de `x2` según el ancho de tu página

    y += 10; // Incrementa la posición Y para la próxima línea de datos
  });

  // Guardar el documento
  doc.save("historial-pagos.pdf");
}

function buscarAlumno() {
  historialPagoList = [];

  nombre = document.querySelector("#buscarAlumno input").value;
  console.log(nombre);
  // Hacer una solicitud AJAX para buscar el alumno por nombre
  // Hacer una solicitud AJAX para obtener los datos de los pagos del usuario
  fetch(`/buscarAlumno?nombre=${nombre}`)
    .then((response) => response.json())
    .then((data) => {
      // Obtener el cuerpo de la tabla
      const cuerpoTabla = document.getElementById("cuerpoTabla");

      // Limpiar el contenido actual de la tabla
      cuerpoTabla.innerHTML = "";

      alumno = {
        IdUsuario: data.alumno.IdUsuario,
        Nombre: data.alumno.Nombre,
        Apellido_paterno: data.alumno.Apellido_paterno,
        Apellido_materno: data.alumno.Apellido_materno,
        Correo: data.alumno.Correo,
        Matricula: data.alumno.Matricula,
        Telefono: data.alumno.Telefono,
        Referencia: data.alumno.Referencia,
      };

   

   

      // Iterar sobre los datos de los pagos y agregar filas a la tabla
      data.pagos.forEach((pago) => {
        pagoX = {
          idPago: pago.idPago,
          monto: pago.monto,
          fechaEmision: pago.fechaEmision.substring(0, 10),
          fechaLimite: pago.fechaLimite.substring(0, 10),
          fechaPago: pago.fechaPago
            ? pago.fechaPago.substring(0, 10)
            : "------------",
          estado: pago.estado,
          modalidad: pago.modalidad
            ? pago.modalidad.substring(0, 10)
            : "------------",
          concepto: pago.concepto,
          estado: pago.estado,
        };

        historialPagoList.push(pagoX);
        usuarioActualId = pago.idUsuario;

        const fila = `
<tr>
    <td>${pago.idPago}</td>
    <td>${pago.monto}</td>
    <td>${pago.fechaEmision.substring(0, 10)}</td>
    <td>${pago.fechaLimite.substring(0, 10)}</td>
    <td>${
      pago.fechaPago ? pago.fechaPago.substring(0, 10) : "------------"
    }</td>
    <td style="color: ${pago.estado === "Aprobado" ? "green" : "red"}">${
          pago.estado
        }</td>
    <td>${
      pago.modalidad ? pago.modalidad.substring(0, 10) : "------------"
    }</td>
    <td>${pago.concepto}</td>
    <td>
        ${
          pago.estado !== "Aprobado"
            ? `
            <!-- Botón para abrir el modal -->
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal-${
              pago.idPago
            }">
                Modificar
            </button>

            <!-- Modal -->
            <div class="modal fade" id="exampleModal-${
              pago.idPago
            }" tabindex="-1" aria-labelledby="exampleModalLabel-${
                pago.idPago
              }" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Editar Pago</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form>
                <div class="mb-3">
                <label for="monto" class="form-label">Monto</label>
                <input type="text" class="form-control" id="montoUpdate-${
                  pago.idPago
                }" value="${pago.monto}">
                </div>
                <div class="mb-3">
                <label for="fechaEmision" class="form-label">Fecha Emisión</label>
                <input type="date" class="form-control" id="fechaEmisionUpdate-${
                  pago.idPago
                }" value="${
                pago.fechaEmision
                  ? pago.fechaEmision.substring(0, 10)
                  : "------------"
              }">
                </div>
                <div class="mb-3">
                <label for="fechaLimite" class="form-label">Fecha Límite</label>
                <input type="date" class="form-control" id="fechaLimiteUpdate-${
                  pago.idPago
                }" value="${
                pago.fechaLimite ? pago.fechaLimite.substring(0, 10) : ""
              }">
                </div>
                <div class="mb-3">
                <label for="fechaPago" class="form-label">Fecha Pago</label>
                <input type="date" class="form-control" id="fechaPagoUpdate-${
                  pago.idPago
                }" value="${
                pago.fechaPago ? pago.fechaPago.substring(0, 10) : ""
              }">
                </div>
                <div class="mb-3">
                <label for="estado" class="form-label">Estado</label>
                <input type="text" class="form-control" id="estadoUpdate-${
                  pago.idPago
                }" value="${pago.estado}">
                </div>
                <div class="mb-3">
                <label for="modalidad" class="form-label">Modalidad</label>
                <input type="text" class="form-control" id="modalidadUpdate-${
                  pago.idPago
                }" value="${pago.modalidad}">
                </div>
                <div class="mb-3">
                <label for="concepto" class="form-label">Concepto</label>
                <input type="text" class="form-control" id="conceptoUpdate-${
                  pago.idPago
                }" value="${pago.concepto}">
                </div>
            </form>

                        </div>
                        <div class="modal-footer" id='footer-${pago.idPago}'>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-primary" onclick="guardarCambios('${
                              pago.idPago
                            }','${pago.idUsuario}')">Guardar cambios</button>
                        </div>
                    </div>
                </div>
            </div>`
            : ""
        }
    </td>
</tr>
`;
        cuerpoTabla.innerHTML += fila;
      });
    })
    .catch((error) => console.error("Error al buscar alumno:", error));
}