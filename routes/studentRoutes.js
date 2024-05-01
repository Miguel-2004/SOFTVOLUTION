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