MontoTotalaPagar = 0
idsCheckboxSelectedList = []
modalidadPago = '------------'





function historialPago() {

    document.getElementById('tituloNavbar').innerText = 'Historial de Pago';

    const tablaPagos = document.getElementById("tablaPagos");
    const totalPagos = document.getElementById("totalPagos");

    totalPagos.innerHTML = "";

    tablaPagos.innerHTML = `
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
                </tr>
            </thead>
            <tbody id="cuerpoTabla">
                <!-- Aquí se cargarán los datos de los pagos -->
            </tbody>`



    // Hacer una solicitud AJAX para obtener los datos de los pagos del usuario
    fetch(`/pagos/${idUsuario}`)
        .then(response => response.json())
        .then(data => {
            // Obtener el cuerpo de la tabla
            const cuerpoTabla = document.getElementById("cuerpoTabla");

            // Limpiar el contenido actual de la tabla
            cuerpoTabla.innerHTML = "";
            const tdElement = document.createElement('td');

            // Iterar sobre los datos de los pagos y agregar filas a la tabla
            data.forEach(pago => {
                //para mintar verde y rojo el estado de pago
                tdElement.textContent = pago.estado;
                if (pago.estado === 'Aprobado') {
                    tdElement.classList.add('estado-aprobado');
                    const fila = `
                    <tr>
                      <td>${pago.idPago}</td>
                      <td>${pago.monto}</td>
                      <td>${pago.fechaEmision.substring(0, 10)}</td>
                      <td>${pago.fechaLimite.substring(0, 10)}</td>
                      <td>${pago.fechaPago ? pago.fechaPago.substring(0, 10) : '------------'}</td>
                      <td style="color: ${pago.estado === 'Aprobado' ? 'green' : 'red'}">${pago.estado}</td>
              
                      <td>${pago.modalidad ? pago.modalidad.substring(0, 10) : '------------'}</td>
                      <td>${pago.concepto}</td>
                    </tr>
                  `;
                  cuerpoTabla.innerHTML += fila;
                } else {
                    tdElement.classList.add('estado-pendiente');
                }
       
                
            });
        })
        .catch(error => console.error("Error al obtener los datos de los pagos:", error));

}

function estadoCuenta() {
    document.getElementById('tituloNavbar').innerText = 'Estado de Cuenta';
    MontoTotalaPagar = 0
    const tablaPagos = document.getElementById("tablaPagos");
    const totalPagos = document.getElementById("totalPagos");
    tablaPagos.innerHTML = `
        <thead>
                <tr>
                    <th scope="col">ID Pago</th>
                    <th scope="col">Monto</th>
                    <th scope="col">Fecha Emisión</th>
                    <th scope="col">Fecha Límite</th>
                    <th scope="col">Concepto</th>
                    <th scope="col">Seleccionar</th>
                </tr>
            </thead>
            <tbody id="cuerpoTabla">
                <!-- Aquí se cargarán los datos de los pagos -->
            </tbody>
          `;
    totalPagos.innerHTML = `            
          <!-- Total -->
          <div class="d-flex justify-content-center mt-10 flex-column align-items-center">
            <!-- Centrado horizontalmente y verticalmente -->
            <h1>Total: $${MontoTotalaPagar}</h1>
            <div class="modoPagoCheck">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="WebPay" onclick="handleCheckboxClickOne(this, 'Transferencia')">
                <label class="form-check-label" for="WebPay"> WebPay </label>
            </div>
                                        
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="Transferencia" onclick="handleCheckboxClickOne(this, 'WebPay')">
                <label class="form-check-label" for="Transferencia"> Transferencia </label>
            </div>
        </div>

            <button type="button" class="btn btn-success mt-3">Realizar Pago</button>
        </div>
       
`
        ;

    // Hacer una solicitud AJAX para obtener los datos de los pagos del usuario
    fetch(`/pagos/${idUsuario}`)
        .then(response => response.json())
        .then(data => {
            // Obtener el cuerpo de la tabla
            const cuerpoTabla = document.getElementById("cuerpoTabla");

            // Limpiar el contenido actual de la tabla
            cuerpoTabla.innerHTML = "";

            // Iterar sobre los datos de los pagos y agregar filas a la tabla
            data.forEach(pago => {
                // Solo agregar filas para los pagos con estado "Pendiente"
                if (pago.estado === "Pendiente") {
                    const fila = `
                        <tr>
                            <td>${pago.idPago}</td>
                            <td>${pago.monto}</td>
                            <td>${pago.fechaEmision.substring(0, 10)}</td>
                            <td>${pago.fechaLimite.substring(0, 10)}</td>
                            <td>${pago.concepto}</td>
                            <td> <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="${pago.monto}" id="${pago.idPago}" onclick="handleCheckboxClick(this)">
                                <label class="form-check-label" for="flexCheckDefault">        
                                </label>
                                </div>
                            </td>
                                
                        </tr>
                      
    

                    `;
                    cuerpoTabla.innerHTML += fila;
                }
            });
        })
        .catch(error => console.error("Error al obtener los datos de los pagos:", error));
}
// Se realizan distintas acciones cuando el checkbox esta marcado
function handleCheckboxClick(checkbox) {

    if (checkbox.checked) {
        // El checkbox está marcado
        idsCheckboxSelectedList.push(parseInt(checkbox.id))
        console.log("El checkbox está marcado", checkbox.id);
        console.log("Lista ids selecter", idsCheckboxSelectedList);
        // Realiza las acciones que desees cuando el checkbox está marcado
        MontoTotalaPagar += parseFloat(checkbox.value)
        totalPagos.innerHTML = `            
          <!-- Total -->
          <div class="d-flex justify-content-center mt-10 flex-column align-items-center">
            <!-- Centrado horizontalmente y verticalmente -->
            <h1>Total: $${MontoTotalaPagar}</h1>
            <div class="modoPagoCheck">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="WebPay" onclick="handleCheckboxClickOne(this, 'Transferencia')">
                <label class="form-check-label" for="WebPay"> WebPay </label>
            </div>
                                        
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="Transferencia" onclick="handleCheckboxClickOne(this, 'WebPay')">
                <label class="form-check-label" for="Transferencia"> Transferencia </label>
            </div>
        </div>

        <button type="button" class="btn btn-success mt-3" onclick="pagar()">Realizar Pago</button>
        </div>  
       
`;

    } else {
        // El checkbox está desmarcado
        let indiceIdAEliminar = idsCheckboxSelectedList.indexOf(checkbox.id);
        idsCheckboxSelectedList.splice(indiceIdAEliminar, 1);

        console.log("El checkbox está desmarcado", checkbox.id);
        console.log("Lista ids selecter", idsCheckboxSelectedList);

        // Realiza las acciones que desees cuando el checkbox está desmarcado
        MontoTotalaPagar -= parseFloat(checkbox.value)
        totalPagos.innerHTML = `            
          <!-- Total -->
          <div class="d-flex justify-content-center mt-10 flex-column align-items-center">
            <!-- Centrado horizontalmente y verticalmente -->
            <h1>Total: $${MontoTotalaPagar}</h1>
            <div class="modoPagoCheck">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="WebPay" onclick="handleCheckboxClickOne(this, 'Transferencia')">
                <label class="form-check-label" for="WebPay" => WebPay </label>
            </div>
                                        
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="Transferencia" onclick="handleCheckboxClickOne(this, 'WebPay')">
                <label class="form-check-label" for="Transferencia" > Transferencia </label>
            </div>
        </div>

          
            <button type="button" class="btn btn-success mt-3" onclick="pagar()">Realizar Pago</button>
        </div>
        
`;
    }
}

function handleCheckboxClickOne(checkbox, idOtroCheckbox) {
    // Desmarca el otro checkbox si está marcado
    if (checkbox.checked) {
        document.getElementById(idOtroCheckbox).checked = false;
        modalidadPago = checkbox.id

    }

}

function pagar() {
    console.log('muestra: ', idsCheckboxSelectedList);

    // Crear un objeto con las dos variables
    const data = {
        idsCheckboxSelectedList: idsCheckboxSelectedList,
        modalidadPago: modalidadPago
    };


    fetch('/pagar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {


            // Verificar la respuesta del servidor
            if (response.ok & data.idsCheckboxSelectedList != []) {
                console.log('Pago realizado exitosamente');
                alert('¡Pago realizado exitosamente!');
                estadoCuenta()
                idsCheckboxSelectedList = [] // vaciamos la lista
                // Aquí puedes hacer algo después de que se haya realizado el pago correctamente
            } else {
                console.error('Error al realizar el pago');
                alert('¡Seleccione cuentas a pagar!');
                // Aquí puedes manejar el error en caso de que la solicitud falle
            }
        })
        .catch(error => {
            console.error('Error de red:', error);
            // Aquí puedes manejar errores de red u otros errores de JavaScript
        });
}


historialPago()