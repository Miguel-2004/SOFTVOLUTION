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

  function guardarCambios(idPago, idUsuario) {
    // Convertir los valores a los tipos de datos correspondientes
    idPago = parseInt(idPago); // Convertir a número entero
    idUsuario = parseInt(idUsuario); // Convertir a número entero
  
    // Obtener el valor introducido por el usuario en el campo de monto
    const montoInput = document.getElementById(`montoUpdate-${idPago}`);
    const montoValor = parseInt(montoInput.value);
  
    // Obtener el valor introducido por el usuario en el campo de fecha de emisión
    const fechaEmisionInput = document.getElementById(
      `fechaEmisionUpdate-${idPago}`
    );
    const fechaEmisionValor = fechaEmisionInput.value;
  
    // Obtener el valor introducido por el usuario en el campo de fecha límite
    const fechaLimiteInput = document.getElementById(
      `fechaLimiteUpdate-${idPago}`
    );
    const fechaLimiteValor = fechaLimiteInput.value;
  
    // Obtener el valor introducido por el usuario en el campo de fecha de pago
    const fechaPagoInput = document.getElementById(`fechaPagoUpdate-${idPago}`);
    const fechaPagoValor = fechaPagoInput.value;
  
    // Obtener el valor introducido por el usuario en el campo de estado
    const estadoInput = document.getElementById(`estadoUpdate-${idPago}`);
    const estadoValor = estadoInput.value;
  
    // Obtener el valor introducido por el usuario en el campo de modalidad
    const modalidadInput = document.getElementById(`modalidadUpdate-${idPago}`);
    const modalidadValor = modalidadInput.value;
  
    // Obtener el valor introducido por el usuario en el campo de concepto
    const conceptoInput = document.getElementById(`conceptoUpdate-${idPago}`);
    const conceptoValor = conceptoInput.value;
  
    // Construir el objeto de datos con los cambios
    const datosUsuarioa = {
      idPagoValor: idPago,
      idUsuarioValor: idUsuario,
      montoValor: montoValor,
      fechaEmisionValor: fechaEmisionValor,
      fechaLimiteValor: fechaLimiteValor,
      fechaPagoValor: fechaPagoValor,
      estadoValor: estadoValor,
      modalidadValor: modalidadValor,
      conceptoValor: conceptoValor,
    };
  
    console.log(datosUsuarioa);
  
    // Realizar la consulta AJAX
    // Enviar la solicitud al servidor
    // Realizar la consulta AJAX
    fetch("/actualizarPago", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosUsuarioa),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message); // Mensaje de éxito del servidor
        buscarAlumno(); // Recargar la lista de alumnos/pagos
      })
      .catch((error) => {
        console.error("Error al actualizar el pago:", error);
        // Mostrar algún mensaje de error al usuario aquí si es necesario
      })
      .finally(() => {
        // Cerrar el modal y eliminar el fondo opaco
        const modalElement = document.getElementById(`exampleModal-${idPago}`);
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          if (modalInstance) {
            modalInstance.hide();
          }
        }
  
        // Eliminar el fondo opaco (backdrop)
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) {
          backdrop.remove();
        }
  
        // Restablecer la interactividad de la página si es necesario
        document.body.style.overflow = ""; // Restablecer el desplazamiento
        document.body.classList.remove("modal-open");
      });
  }

  
function registros() {
    document.getElementById("tituloNavbar").innerText = "Registros";
  
    contenedor = document.getElementById("contenedor");
    contenedor.innerHTML = "";
  
    contenedor.innerHTML = `
      <div id="buscarAlumnoRegistro" class="col-6" style="padding-top: 2%">
    <div class="input-group mb-3">
      <input id="inputNombreBuscarR" type="text" class="form-control" placeholder="Nombre Paterno Materno" aria-label="Recipient's username" aria-describedby="button-addon2">
      <button class="btn btn-outline-secondary" type="button" id="button-addon2" onclick="buscarAlumnoRegistro()">Buscar</button>
    </div>
  </div>
  
  
  <!-- Tabla de Pagos -->
  <table id="tablaPagos" class="table">
    <thead>
      <tr>
        <th scope="col">ID Pagos</th>
        <th scope="col">Monto</th>
        <th scope="col">Fecha Emisión</th>
        <th scope="col">Fecha Límite</th>
        <th scope="col">Fecha Pago</th>
        <th scope="col">Estado</th>
        <th scope="col">Modalidad</th>
        <th scope="col">Concepto</th>
        <th scope="col">Seleccionar</th>
        <th scope="col">Generar Ficha</th>
      </tr>
    </thead>
    <tbody id="cuerpoTabla">
      <!-- Aquí se cargarán los datos de los pagos -->
    </tbody>
  </table>
  
  
  
  
  <div class="row">
  
  
  
    <div class="col-md-6" id="formularioSolicitarCobro">
      <div class="card">
        <div class="card-body">
  
          <!-- Título -->
          <h5 class="card-title">Solicitud de cobro</h5>
  
          <!-- Formulario -->
          <form id="formulario1">
  
            <!-- Fecha solicitud -->
            <div class="mb-3">
              <label for="fecha_solicitud">Fecha solicitud</label>
              <input type="date" class="form-control" id="fechaEmision" placeholder="Seleccione la fecha">
            </div>
  
            <!-- Fecha límite -->
            <div class="mb-3">
              <label for="fecha_limite">Fecha límite</label>
              <input type="date" class="form-control" id="fechaLimite" placeholder="Seleccione la fecha">
            </div>
  
            <!-- Monto -->
            <div class="mb-3">
              <label for="monto">Monto</label>
              <input type="number" class="form-control" id="monto" placeholder="Ingrese el monto">
            </div>
  
            <!-- Concepto -->
            <div class="mb-3">
              <label for="concepto">Concepto</label>
              <select class="form-control" id="concepto">
                <option value="Colegiatura">Colegiatura</option>
                <option value="Otros pagos">Otros pagos</option>
              </select>
            </div>
  
            <!-- Botón de registro -->
            <button type="submit" class="btn btn-primary" style="background-color: #9E3232;">Solicitar Cobro</button>
                          </form>
                      </div>
                  </div>
              </div>
  
  
    <div class=" col-md-6" id="registrarPagoEfectivoTransferencia">
              <div class="card">
                <div class="card-body">
                  <!-- Título -->
                  <h5 class="card-title" id="cardRegPagoEfTr">Registrar pago Efect./Transf. idPago:</h5>
  
                  <!-- Formulario -->
                  <form id="formulario2">
  
                    <div class="mb-3" style="display: flex;">
  
                      <div class="flex-large" style="flex: 30%;">
                        <label for="modalidad">Modalidad</label>
                        <select class="form-control" id="modalidadEfectTrans">
                          <option value="Efectivo">Efectivo</option>
                          <option value="transferencia">Transferencia</option>
                        </select>
                      </div>
  
                      <div class="flex-small" style="flex: 70%; display: none;" id="uploadField">
                        <label for="transferImage">Subir Archivo</label>
                        <input type="file" class="form-control" id="transferImage" name="transferImage">
                      </div>
  
                    </div>
  
  
                    <!-- Monto -->
                    <div class="mb-3">
                      <label for="monto">Monto</label>
                      <input type="number" class="form-control" id="montoRegistrarPaEfTr" placeholder="Ingrese el monto">
                    </div>
  
                    <!-- Fecha de pago -->
                    <div class="mb-3">
                      <label for="fecha_pago">Fecha pago</label>
                      <input type="date" class="form-control" id="fechaPagoRegistrarPaEfTr" placeholder="Seleccione la fecha">
                    </div>
  
                    <!-- Concepto -->
                    <div class="mb-3">
                      <label for="concepto">Concepto</label>
                      <select class="form-control" id="conceptoRegistrarPaEfTr">
                        <option value="Colegiatura">Colegiatura</option>
                        <option value="Otros pagos">Otros pagos</option>
                      </select>
                    </div>
  
                    <!-- Botón de registro -->
                    <button type="submit" class="btn btn-success" style="background-color: #9E3232;">Registrar pago</button>
                  </form>
                </div>
              </div>
        </div>
  
      </div>
  
    </div>
  
  
  
  
    <div class="row" style="padding-top: 2%">
  
      <div class="col-md-6" id="referenciaPersonalizada">
  
        <div class="card">
          <div class="card-body">
            <!-- Título -->
            <h5 class="card-title" id="titleReferenciaPersonalizada" >Registrar Ref matricula:</h5>
  
            <!-- Formulario -->
            <form id="formulario3">
  
              <!-- Monto -->
              <div class="mb-3">
                <label for="nroReferencia">Numero de referencia</label>
                <input type="number" class="form-control" id="nroReferencia" placeholder="Ingrese el n° referencia">
              </div>
  
  
              <!-- Botón de registro -->
              <button type="submit" class="btn btn-success" style="background-color: #9E3232;" ">Registrar n° referencia</button>
              </form>
          </div>
      </div>
  </div>
  
  
  <div class=" col-md-6" id="registrarCicloEscolar">
                <div class="card">
                  <div class="card-body">
                    <!-- Título -->
                    <h5 class="card-title" id="cardRegPagoEfTr">Registrar Ciclo Escolar</h5>
  
                    <!-- Formulario -->
  
                    <form id="formulario4">
  
                      <div class="mb-3" ">
                        <label for="cicloEscolar">Ciclo actual</label>
                        <select class="form-control" id="seleccionarCicloEscolar">
                        </select>
                        </div>
  
                      <!-- Botón de registro -->
                      <button type="submit" class="btn btn-dark" style="background-color: #9E3232;">Registrar Ciclo</button>
                    </form>
                  </div>
                </div>
          </div>
  
        </div>
  
      </div>
  
  
        `;
  
    document.getElementById("inputNombreBuscarR").value = nombre;
    buscarAlumnoRegistro();
  
    llenarComboBoxCicloEscolar();
  
    const formularioSolicitarCobro = document.getElementById(
      "formularioSolicitarCobro"
    );
  
    formularioSolicitarCobro.addEventListener("submit", function (event) {
      event.preventDefault(); // Esto previene el comportamiento por defecto del formulario
      solicitarCobro(); // Llama a la función solicitarCobro cuando se haga submit al formulario
    });
  
    const registrarPagoEfectivoTransferencia = document.getElementById(
      "registrarPagoEfectivoTransferencia"
    );
  
    registrarPagoEfectivoTransferencia.addEventListener(
      "submit",
      function (event) {
        event.preventDefault(); // Esto previene el comportamiento por defecto del formulario
        registrarPagoEfectivoTransferenciaFunc(); // Llama a la función registrarPagoEfectivoTransferencia cuando se haga submit al formulario
      }
    );
  
    const seleccionarCicloEscolar = document.getElementById(
      "seleccionarCicloEscolar"
    );
  
    registrarCicloEscolar.addEventListener("submit", function (event) {
      event.preventDefault(); // Esto previene el comportamiento por defecto del formulario
      registrarCicloEscolarFunction(); // Llama a la función registrarPagoEfectivoTransferencia cuando se haga submit al formulario
    });
  
    const referenciaPersonalizada = document.getElementById(
      "referenciaPersonalizada"
    );
  
    referenciaPersonalizada.addEventListener("submit", function (event) {
      event.preventDefault(); // Esto previene el comportamiento por defecto del formulario
      RegistrarReferenciaPersonalizada(); // Llama a la función registrarPagoEfectivoTransferencia cuando se haga submit al formulario
    });
    // Añadir el controlador de eventos después de actualizar el DOM
    document
      .getElementById("modalidadEfectTrans")
      .addEventListener("change", function () {
        const uploadField = document.getElementById("uploadField");
        if (this.value === "transferencia") {
          uploadField.style.display = "block"; // Muestra el campo de archivo
        } else {
          uploadField.style.display = "none"; // Oculta el campo de archivo
        }
      });
  }
  function buscarAlumnoRegistro() {
    // Obtener el valor del input de búsqueda
    nombre = document.querySelector("#buscarAlumnoRegistro input").value;
    console.log("es", nombre);
    // Hacer una solicitud AJAX para buscar el alumno por nombre
    // Hacer una solicitud AJAX para obtener los datos de los pagos del usuario
  
    fetch(`/buscarAlumno?nombre=${nombre}`)
      .then((response) => response.json())
      .then((data) => {
        // Obtener el cuerpo de la tabla
        const cuerpoTabla = document.getElementById("cuerpoTabla");
  
        // Limpiar el contenido actual de la tabla
        cuerpoTabla.innerHTML = "";
        console.log("estudiante: ", data.alumno);
  
        usuarioActualId = data.alumno.IdUsuario;
  
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
  
        setearCombobox();
  
        document.getElementById(
          "titleReferenciaPersonalizada"
        ).innerText = `Registrar n° Ref a n° matricula: ${alumno.Matricula}`;
  
        document.getElementById("nroReferencia").value = alumno.Referencia;
  
        // Iterar sobre los datos de los pagos y agregar filas a la tabla
        data.pagos.forEach((pago) => {
          usuarioActualId = pago.idUsuario;
          console.log(
            "buscarAlumnoRegistro -> usuarioActualId:",
            usuarioActualId
          );
          // Solo agregar la fila si el estado es "Pendiente"
          if (pago.estado === "Pendiente") {
            const fila = `
      <tr>
          <td>${pago.idPago}</td>
          <td>${pago.monto}</td>
          <td>${pago.fechaEmision.substring(0, 10)}</td>
          <td>${pago.fechaLimite.substring(0, 10)}</td>
          <td>${
            pago.fechaPago ? pago.fechaPago.substring(0, 10) : "------------"
          }</td>
          <td style="color: red">${pago.estado}</td>
          <td>${
            pago.modalidad ? pago.modalidad.substring(0, 10) : "------------"
          }</td>
          <td>${pago.concepto}</td>
          <td>
          <div class="form-check" id="check">
          <input class="form-check-input checkbox-pago" type="checkbox" value="${
            pago.monto
          }" id="checkbox-${pago.idPago}" onclick="handleCheckboxClick(this, '${
              pago.idPago
            }','${pago.monto}','${pago.concepto}')">
  
          <label class="form-check-label" for="flexCheckDefault">        
          </label>
          </div>
          </td>
          <td>
  
          <button onclick="toggleSVGColor(this, '${pago.idPago}','${
              pago.monto
            }','${pago.concepto}' ,'${pago.fechaLimite.substring(0, 10)}')">
          <div id="ficha" class="pdf">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="20" fill="currentColor" class="bi bi-filetype-pdf" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM1.6 11.85H0v3.999h.791v-1.342h.803q.43 0 .732-.173.305-.175.463-.474a1.4 1.4 0 0 0 .161-.677q0-.375-.158-.677a1.2 1.2 0 0 0-.46-.477q-.3-.18-.732-.179m.545 1.333a.8.8 0 0 1-.085.38.57.57 0 0 1-.238.241.8.8 0 0 1-.375.082H.788V12.48h.66q.327 0 .512.181.185.183.185.522m1.217-1.333v3.999h1.46q.602 0 .998-.237a1.45 1.45 0 0 0 .595-.689q.196-.45.196-1.084 0-.63-.196-1.075a1.43 1.43 0 0 0-.589-.68q-.396-.234-1.005-.234zm.791.645h.563q.371 0 .609.152a.9.9 0 0 1 .354.454q.118.302.118.753a2.3 2.3 0 0 1-.068.592 1.1 1.1 0 0 1-.196.422.8.8 0 0 1-.334.252 1.3 1.3 0 0 1-.483.082h-.563zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638z"/>
              </svg>
          </div>
      </button>
          
          </td>
  
      
      </tr>
  `;
            cuerpoTabla.innerHTML += fila;
          }
        });
      })
      .catch((error) => console.error("Error al buscar alumno:", error));
  }
  
  function getBase64Image(img) {
    // Crea un elemento canvas
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
  
    // Dibuja la imagen en el canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
  
    // Obtiene la imagen en formato base64
    var dataURL = canvas.toDataURL("image/png");
  
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }
  
  function toggleSVGColor(button, idPago, monto, concepto, fechaLimite) {
    var ficha = button.querySelector("#ficha");
    ficha.classList.toggle("active"); // Cambia la clase para cambiar el color
    setTimeout(() => {
      ficha.classList.remove("active"); // Remueve la clase después de un breve tiempo
    }, 400); // 500 ms después de hacer clic
  
    console.log(`Generando PDf ${idPago} ${monto} ${concepto} ${fechaLimite}`);
    // Crear una instancia de jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
  
    // Asegúrate de que las posiciones Y son únicas para cada línea de texto
    let y = 10;
    const lineHeight = 10; // Altura de línea para separar las líneas de texto
  
    doc.text(`ID de Pago: ${idPago}`, 10, y);
    y += lineHeight; // Incrementa la posición y para la próxima línea de texto
  
    doc.text(
      `Alumno: ${alumno.Nombre} ${alumno.Apellido_paterno} ${alumno.Apellido_materno}`,
      10,
      y
    );
    y += lineHeight; // y así sucesivamente...
  
    doc.text(`Monto: ${monto} USD`, 10, y);
    y += lineHeight;
  
    doc.text(`Fecha de pago : ${fechaLimite}`, 10, y);
    y += lineHeight;
  
    doc.text(`N° referencia: ${alumno.Referencia}`, 10, y);
    y += lineHeight;
  
    doc.text(`Concepto: ${concepto}`, 10, y);
    y += lineHeight;
  
    doc.text(`Fecha Límite: ${fechaLimite}`, 10, y);
    y += lineHeight;
  
    doc.text(`Cta. Bancaria: 4135-7867-6589-123`, 10, y);
    y += lineHeight;
  
    doc.text(`Nombre de la cuenta: Instituto Via Diseño`, 10, y);
    // No necesitas incrementar y aquí si no hay más texto después
  
    //Añadir la imagen en otra columna
    // Supongamos que la imagen está codificada en base64
  
    var image = new Image();
    image.onload = function () {
      var base64 = getBase64Image(image);
      console.log(base64); // Imprime la cadena base64 de la imagen en la consola
    };
    image.src = "https://i.ibb.co/YBNPpjF/via-Dise-o-Logo-Grande.png"; // Asegúrate de tener acceso a la imag
    // Posición de la imagen (x, y, ancho, alto)
    doc.addImage(image, "PNG", 130, 10, 70, 70); // Ajusta las coordenadas como sea necesario
  
    // Guardar el documento
    doc.save(`Pago_${idPago}.pdf`);
  }
  
  function handleCheckboxClick(clickedCheckbox, clickedId, monto, concepto) {
    // Obtener todos los checkboxes
    const checkboxes = document.querySelectorAll(".checkbox-pago");
  
    // Iterar sobre todos los checkboxes
    checkboxes.forEach((checkbox) => {
      // Si el ID del checkbox no coincide con el que fue clickeado, deseleccionarlo
      if (checkbox.id !== `checkbox-${clickedId}`) {
        checkbox.checked = false;
      }
    });
    // Asegurar que el checkbox clickeado esté seleccionado
    clickedCheckbox.checked = true;
  
    console.log(clickedId);
    console.log(monto);
    console.log(concepto);
    console.log(fechaHoy);
  
    document.getElementById("montoRegistrarPaEfTr").value = monto;
    var conceptoRegistrarPaEfTr = document.getElementById(
      "conceptoRegistrarPaEfTr"
    );
    conceptoRegistrarPaEfTr.value = concepto;
    document.getElementById("fechaPagoRegistrarPaEfTr").value = fechaHoy;
  
    document.getElementById(
      "cardRegPagoEfTr"
    ).innerText = `Registrar pago Efect./Transf. idPago:${clickedId}`;
  
    checkboxClickedId = clickedId;
    checkboxClickedMonto = monto;
    checkboxClickedConcepto = concepto;
  }
  function solicitarCobro() {
    //   Obtener los valores de los campos del formulario
    const fechaEmision = document.getElementById("fechaEmision").value;
    const fechaLimite = document.getElementById("fechaLimite").value;
    const monto = document.getElementById("monto").value;
    const concepto = document.getElementById("concepto").value;
  
    console.log("registrarCobro -> usuarioActualId:", usuarioActualId);
  
    if (!usuarioActualId) {
      alert("No hay un usuario seleccionado.");
      return;
    }
    const datosSolicitud = {
      idUsuario: usuarioActualId, // Aquí supongo que idUsuario se obtiene de alguna manera externa
      fechaEmision: fechaEmision,
      fechaLimite: fechaLimite,
      fechaPago: null, // o null si tu base de datos lo permite
      monto: monto,
      estado: "Pendiente",
      modalidad: null, // o la modalidad que corresponda
      concepto: concepto,
    };
  
    // Realizar la solicitud AJAX con fetch
    fetch("/solicitarCobro", {
      // Reemplaza con la ruta de tu servidor
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosSolicitud),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor");
        }
        return response.json();
      })
      .then((data) => {
        // Aquí manejas la respuesta del servidor. Por ejemplo, puedes mostrar un mensaje al usuario
        console.log(data.message);
        buscarAlumnoRegistro();
      })
      .catch((error) => {
        // Aquí manejas los errores de la solicitud
        console.error("Error al registrar la solicitud de cobro:", error);
      });

  }  

  function registrarPagoEfectivoTransferenciaFunc() {
    // Obteniendo los valores de los campos del formulario
  
    const fechaPago = document.getElementById("fechaPagoRegistrarPaEfTr").value;
    const modalidad = document.getElementById("modalidadEfectTrans").value;
    const idPago = document
      .getElementById("cardRegPagoEfTr")
      .innerText.split(":")[1]
      .trim();
  
    console.log(
      `verificando regitro datos  ${idPago}, ${fechaPago}, ${modalidad}`
    );
    // Opcional: Handle file upload
  
    datos = {
      idPago: idPago,
      fechaPago: fechaPago,
      modalidad: modalidad,
    };
  
    // Realizar la petición AJAX
    fetch("/ActualizarPagoEfectTrans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message); // Mensaje de éxito del servidor
        buscarAlumnoRegistro();
      })
      .catch((error) => {
        console.error("Error al actualizar el pago:", error);
        // Mostrar algún mensaje de error al usuario aquí si es necesario
      });
  }