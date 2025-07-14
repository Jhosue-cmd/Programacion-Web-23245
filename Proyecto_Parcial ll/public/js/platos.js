// obtener platos disponibles del localStorage
const array = JSON.parse(localStorage.getItem('productos')) || [];

// Función para cargar los platos en la página
function cargarPlatosDisponibles() {
    const contenedorPlatos = document.getElementById('platos-lista');
    if (!contenedorPlatos) return;

    // Limpiar el contenedor antes de cargar los platos
    contenedorPlatos.innerHTML = '';

    // Verificar si hay platos disponibles
    if (array.length === 0) {
        contenedorPlatos.innerHTML = '<p>No hay platos disponibles.</p>';
        return;
    }

    // Crear un contenedor row para las tarjetas
    const row = document.createElement('div');
    row.className = 'row';

    array.forEach((plato, index) => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-4 mb-3';

        const card = document.createElement('div');
        card.className = 'card h-100';
        card.innerHTML = `
            <img src="${plato.foto}" class="card-img-top" alt="${plato.nombre}" style="height: 200px; object-fit: cover;">
            <div class="card-body">
            <h5 class="card-title">${plato.nombre}</h5>
            <p class="card-text">${plato.descripcion || ''}</p>
            <p class="card-text"><strong>Precio:</strong> $${plato.precio.toFixed(2)}</p>
            <button class="btn btn-primary agregar-carrito" data-index="${index}" onclick="agregarAlCarrito('${plato.nombre}')">Agregar al carrito</button>
            </div>
        `;
        col.appendChild(card);
        row.appendChild(col);
    });

    contenedorPlatos.appendChild(row);
}

function agregarAlCarrito(nombrePlato) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const plato = array.find(p => p.nombre === nombrePlato);

    if (plato) {
        // Buscar si el plato ya está en el carrito
        const platoEnCarrito = carrito.find(p => p.nombre === nombrePlato);
        if (platoEnCarrito) {
            // Si existe, aumentar la cantidad
            platoEnCarrito.cantidad = (platoEnCarrito.cantidad || 1) + 1;
        } else {
            // Si no existe, agregarlo con cantidad 1
            const platoConCantidad = { ...plato, cantidad: 1 };
            carrito.push(platoConCantidad);
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarModalPlato(`${plato.nombre} ha sido agregado al carrito.`);
        console.log(carrito);
    } else {
        mostrarModalPlato('Plato no encontrado.');
    }
}

function mostrarModalPlato(mensaje) {
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
                    <p><strong>Cantidad en carrito:</strong> ${
                        (() => {
                            const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
                            const plato = carrito.find(p => mensaje.includes(p.nombre));
                            return plato ? plato.cantidad : 0;
                        })()
                    }</p>
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
// Cargar los platos disponibles al cargar la página
window.onload = () => {
    cargarPaginasLogin('platosDisponibles'); // Cargar la página de platos disponibles
    cargarPlatosDisponibles();
};