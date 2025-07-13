// Función para recuperar usuarios del localStorage y cargar en la tabla
window.cargarUsuariosEnTabla = function cargarUsuariosEnTabla() {
    console.log("Cargando usuarios desde localStorage...");
    // Obtener usuarios del localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    // Obtener el tbody de la tabla
    const tbody = document.querySelector('table tbody');
    
    // Actualizar contador
    const totalUsuarios = document.getElementById('totalUsuarios');
    if (totalUsuarios) {
        totalUsuarios.textContent = usuarios.length;
    }
    
    if (!tbody) {
        console.error('No se encontró el tbody de la tabla');
        return;
    }
    
    // Limpiar contenido actual
    tbody.innerHTML = '';
    
    // Si no hay usuarios, mostrar mensaje
    if (usuarios.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center py-4">
                    <div class="text-center">
                        <i class="fas fa-users fa-3x text-muted mb-3"></i>
                        <p class="text-secondary">No hay usuarios registrados</p>
                        <small class="text-muted">Los usuarios registrados aparecerán aquí automáticamente</small>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // Generar filas para cada usuario
    usuarios.forEach((usuario, index) => {
        const fila = crearFilaUsuario(usuario, index);
        tbody.appendChild(fila);
    });
}

// Función para crear una fila de usuario
function crearFilaUsuario(usuario, index) {
    const tr = document.createElement('tr');
    
    // Calcular edad desde la fecha de nacimiento
    const edad = calcularEdad(usuario.fechaNacimiento || '2000-01-01');
    
    // Obtener foto (usar foto capturada o imagen por defecto)
    const fotoSrc = usuario.foto || '../assets/img/team-2.jpg';
    
    tr.innerHTML = `
        <td>
            <div class="d-flex px-2 py-1">
                <div>
                    <img src="${fotoSrc}" class="avatar avatar-sm me-3" alt="user${index + 1}" 
                         onerror="this.src='../assets/img/team-2.jpg'">
                </div>
            </div>
        </td>
        <td>
            <h6 class="mb-0 text-sm">${usuario.nombres || 'No especificado'} ${usuario.apellidos || ''}</h6>
        </td>
        <td class="align-middle text-sm">
            <span class="text-secondary text-xs font-weight-bold">${usuario.email || 'No especificado'}</span>
        </td>
        <td class="align-middle text-center">
            <span class="text-secondary text-xs font-weight-bold">${edad} años</span>
        </td>
        <td class="align-middle">
            <span class="text-secondary text-xs font-weight-bold">${usuario.telefono || 'No especificado'}</span>
        </td>
        <td class="align-middle text-center">
            <span class="text-secondary text-xs font-weight-bold">${usuario.provincia || 'No especificado'}</span>
        </td>
        <td class="align-middle text-center">
            <span class="text-secondary text-xs font-weight-bold">${usuario.ciudad || 'No especificado'}</span>
        </td>
        <td class="align-middle text-center">
            <a href="javascript:;" class="text-primary font-weight-bold text-xs" 
               onclick="verUbicacion('${usuario.latitud}', '${usuario.longitud}', '${usuario.nombres}')">
                <i class="fas fa-map-marker-alt"></i> Ver
            </a>
        </td>
        <td class="align-middle">
            <a href="javascript:;" class="text-danger font-weight-bold text-xs me-2" 
               onclick="eliminarUsuario(${index})">
                <i class="fas fa-trash"></i> Eliminar
            </a>
        </td>
    `;
    
    return tr;
}

// Función para calcular la edad
function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return 'N/A';
    
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    
    return edad;
}

// Función para ver ubicación en el mapa
window.verUbicacion = function verUbicacion(latitud, longitud, nombre) {
    if (!latitud || !longitud || latitud === 'undefined' || longitud === 'undefined') {
        alert('No hay coordenadas disponibles para este usuario');
        return;
    }
    
    // Crear un modal o ventana para mostrar el mapa
    const mapModal = document.createElement('div');
    mapModal.className = 'modal fade';
    mapModal.id = 'mapModal';
    mapModal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Ubicación de ${nombre}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div id="userMap" style="height: 400px; width: 100%;"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    `;
    
    // Agregar modal al DOM
    document.body.appendChild(mapModal);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(mapModal);
    modal.show();
    
    // Inicializar mapa cuando se muestre el modal
    mapModal.addEventListener('shown.bs.modal', function() {
        if (typeof L !== 'undefined') {
            const map = L.map('userMap').setView([latitud, longitud], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            L.marker([latitud, longitud]).addTo(map)
                .bindPopup(`Ubicación de ${nombre}`)
                .openPopup();
        } else {
            document.getElementById('userMap').innerHTML = `
                <div class="text-center py-5">
                    <p>Coordenadas: ${latitud}, ${longitud}</p>
                    <a href="https://www.google.com/maps?q=${latitud},${longitud}" target="_blank" class="btn btn-primary">
                        Ver en Google Maps
                    </a>
                </div>
            `;
        }
    });
    
    // Limpiar modal cuando se cierre
    mapModal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(mapModal);
    });
}

// Función para eliminar usuario
window.eliminarUsuario = function eliminarUsuario(index) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        // Obtener usuarios actuales
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        
        // Eliminar usuario por índice
        usuarios.splice(index, 1);
        
        // Guardar usuarios actualizados
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        
        // Recargar tabla
        window.cargarUsuariosEnTabla();
        
        // Mostrar mensaje de éxito
        mostrarMensaje('Usuario eliminado correctamente', 'success');
    }
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.zIndex = '9999';
    alert.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto eliminar después de 3 segundos
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 3000);
}

// Función para buscar usuarios
function buscarUsuarios(termino) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const tbody = document.querySelector('table tbody');
    
    if (!termino.trim()) {
        window.cargarUsuariosEnTabla();
        return;
    }
    
    const usuariosFiltrados = usuarios.filter(usuario => {
        const nombre = `${usuario.nombres || ''} ${usuario.apellidos || ''}`.toLowerCase();
        const email = (usuario.email || '').toLowerCase();
        const telefono = (usuario.telefono || '').toLowerCase();
        const provincia = (usuario.provincia || '').toLowerCase();
        const ciudad = (usuario.ciudad || '').toLowerCase();
        
        return nombre.includes(termino.toLowerCase()) ||
               email.includes(termino.toLowerCase()) ||
               telefono.includes(termino.toLowerCase()) ||
               provincia.includes(termino.toLowerCase()) ||
               ciudad.includes(termino.toLowerCase());
    });
    
    // Actualizar contador con resultados filtrados
    const totalUsuarios = document.getElementById('totalUsuarios');
    if (totalUsuarios) {
        totalUsuarios.textContent = `${usuariosFiltrados.length} de ${usuarios.length}`;
    }
    
    // Limpiar tabla
    tbody.innerHTML = '';
    
    if (usuariosFiltrados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center py-4">
                    <div class="text-center">
                        <i class="fas fa-search fa-3x text-muted mb-3"></i>
                        <p class="text-secondary">No se encontraron usuarios que coincidan con "${termino}"</p>
                        <small class="text-muted">Intenta con otros términos de búsqueda</small>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // Mostrar usuarios filtrados
    usuariosFiltrados.forEach((usuario, index) => {
        const fila = crearFilaUsuario(usuario, usuarios.indexOf(usuario));
        tbody.appendChild(fila);
    });
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    inicializarTablaUsuarios();
});

// Función para inicializar la tabla (para uso con navegación dinámica)
window.inicializarTablaUsuarios = function inicializarTablaUsuarios() {
    console.log('🔄 Inicializando tabla de usuarios...');
    
    // Cargar usuarios en la tabla
    window.cargarUsuariosEnTabla();
    
    // Configurar búsqueda si existe el campo
    const searchInput = document.querySelector('input[placeholder*="Buscar usuarios"]');
    if (searchInput) {
        console.log('🔍 Configurando búsqueda de usuarios...');
        
        // Remover listeners anteriores
        searchInput.removeEventListener('input', buscarUsuarios);
        
        // Agregar nuevo listener
        searchInput.addEventListener('input', function() {
            buscarUsuarios(this.value);
        });
    }
}

// Función que se ejecuta cuando se navega a verPerfiles
function inicializarVerPerfiles() {
    // Esperar un poco para que el DOM se actualice
    setTimeout(() => {
        inicializarTablaUsuarios();
    }, 100);
}

// Función para exportar datos (opcional)
window.exportarUsuarios = function exportarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    if (usuarios.length === 0) {
        alert('No hay usuarios para exportar');
        return;
    }
    
    const dataStr = JSON.stringify(usuarios, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `usuarios_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}
cargarUsuariosEnTabla() 