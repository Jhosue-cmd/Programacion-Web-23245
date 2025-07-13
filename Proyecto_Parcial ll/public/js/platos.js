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
            <p class="card-text">${plato.descripcion}</p>
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
        carrito.push(plato);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        alert(`${plato.nombre} ha sido agregado al carrito.`);
        console.log(carrito);
    } else {
        alert('Plato no encontrado.');
    }
}