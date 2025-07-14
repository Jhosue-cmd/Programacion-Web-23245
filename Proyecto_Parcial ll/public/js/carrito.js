

// Función para cargar los platos del carrito
function cargarCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contenedorCarrito = document.getElementById('carrito-lista');
    if (!contenedorCarrito) return;
    // Limpiar el contenedor antes de cargar los platos
    contenedorCarrito.innerHTML = '';
    // Verificar si hay platos en el carrito
    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = '<p>No hay platos en el carrito.</p>';
        return;
    }

    carrito.forEach((plato, index) => {
        // Crear un contenedor row para cada plato
        const row = document.createElement('div');
        row.className = 'row mb-3';

        const col = document.createElement('div');
        col.className = 'col-12';

        const card = document.createElement('div');
        card.className = 'card h-100';
        card.innerHTML = `
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-2">
                                <img src="${plato.foto}" class="img-fluid rounded" alt="${plato.nombre}" style="height: 100px; object-fit: cover;">
                            </div>
                            <div class="col-4">
                                <h5 class="card-title mb-1">${plato.nombre}</h5>
                                <p class="card-text mb-1">${plato.descripcion}</p>
                            </div>
                            <div class="col-3">
                                <p class="card-text mb-1"><strong>Precio:</strong> $${plato.precio.toFixed(2)}</p>
                                <p class="card-text mb-1"><strong>Cantidad:</strong> ${plato.cantidad || 1}</p>
                            </div>
                            <div class="col-3">
                                <button class="btn btn-danger eliminar-carrito" data-index="${index}" onclick="eliminarDelCarrito('${plato.nombre}')">Eliminar del carrito</button>
                            </div>
                        </div>
                    </div>
                `; col.appendChild(card);
        row.appendChild(col);
        contenedorCarrito.appendChild(row);
    });
}

// Función para eliminar un plato del carrito
function eliminarDelCarrito(nombrePlato) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const index = carrito.findIndex(p => p.nombre === nombrePlato);

    if (index !== -1) {
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        // Mostrar un modal en lugar de alert
        mostrarModal(`${nombrePlato} ha sido eliminado del carrito.`);
        cargarCarrito(); // Recargar el carrito para reflejar los cambios
    } else {
        mostrarModal('Plato no encontrado en el carrito.');
    }
}
// Función para mostrar un modal
function mostrarModal(mensaje) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'mensajeModal';
    modal.tabIndex = '-1';
    modal.setAttribute('aria-labelledby', 'mensajeModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="mensajeModalLabel">Información</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>${mensaje}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}
// Función para vaciar el carrito
function vaciarCarrito() {
    localStorage.removeItem('carrito');
    cargarCarrito(); // Recargar el carrito para reflejar los cambios
    mostrarModal('El carrito ha sido vaciado.');
}
// Cargar los platos disponibles al cargar la página
window.onload = () => {
    cargarPaginasLogin('indexPrincipal'); // Cargar la página del carrito
    cargarCarrito(); // Cargar el carrito al inicio
};