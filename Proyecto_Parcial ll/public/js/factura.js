// Ajustar el tamaño del modal para que ocupe casi toda la pantalla
const style = document.createElement('style');
style.innerHTML = `
    #modalFactura{
        max-width: 95vw !important;
        width: 95vw !important;
        margin: 2vh auto !important;
    }
    #contenidoFactura {
        min-height: 90vh !important;
    }
    #cuerpoFactura {
        max-height: 70vh;
        overflow-y: auto;
    }
`;
document.head.appendChild(style);

function generarFactura() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios[0];

    if (!usuario) {
        mostrarModal('No hay datos de usuario disponibles.');
        return;
    }

    if (carrito.length === 0) {
        mostrarModal('No hay platos en el carrito para generar una factura.');
        return;
    }

    // Calcular el subtotal
    const subtotal = carrito.reduce((acc, plato) => acc + (plato.precio * (plato.cantidad || 1)), 0);
    const iva = subtotal * 0.15;
    const total = subtotal + iva;

    // Mostrar la factura
    const facturaHTML = `
        <h2>Factura</h2>
        <h4>Datos del Cliente</h4>
        <ul>
            <li><strong>Nombre:</strong> ${usuario.nombre || ''}</li>
            <li><strong>Correo:</strong> ${usuario.correo || ''}</li>
            <li><strong>Dirección:</strong> ${usuario.direccion || ''}</li>
            <li><strong>Teléfono:</strong> ${usuario.telefono || ''}</li>
        </ul>
        <table class="table">
            <thead>
                <tr>
                    <th>Plato</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${carrito.map(plato => `
                    <tr>
                        <td>${plato.nombre}</td>
                        <td>$${plato.precio.toFixed(2)}</td>
                        <td>${plato.cantidad || 1}</td>
                        <td>$${(plato.precio * (plato.cantidad || 1)).toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div style="display: flex; justify-content: flex-end;">
            <div>
                <h4>Subtotal: $${subtotal.toFixed(2)}</h4>
                <h4>IVA (15%): $${iva.toFixed(2)}</h4>
                <h3>Total: $${total.toFixed(2)}</h3>
            </div>
        </div>
    `;

    mostrarModalFactura(facturaHTML);

    // Esperar a que el modal esté en el DOM
    setTimeout(() => {
        const btnPDF = document.getElementById('btnGenerarPDF');
        if (btnPDF) {
            btnPDF.onclick = function () {
                generarPDF(usuario, carrito, subtotal, iva, total);
            };
        }
    }, 100);
}
function generarPDF() {
    window.print();
    // Limpiar el carrito después de generar la factura
    localStorage.removeItem('carrito');
}

function mostrarModalFactura(mensaje) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'mensajeModal';
    modal.tabIndex = '-1';
    modal.setAttribute('aria-labelledby', 'mensajeModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <div class="modal-dialog" id="modalFactura">
            <div class="modal-content" id="contenidoFactura">
                <div class="modal-header">
                    <h5 class="modal-title" id="mensajeModalLabel">Información</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="cuerpoFactura">
                    <p>${mensaje}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button id="btnGenerarPDF" class="btn btn-primary">Generar PDF</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}