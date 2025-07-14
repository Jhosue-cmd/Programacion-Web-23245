// Verificar si el navegador soporta la API de Notificaciones
if ('Notification' in window) {
    console.log('Notification API soportada');
} else {
    console.error('Notification API no soportada en este navegador');
}

// Solicitar permiso para mostrar notificaciones
function solicitarPermisoNotificaciones() {
    if (Notification.permission === 'default') {
        Notification.requestPermission().then((permiso) => {
            if (permiso === 'granted') {
                console.log('Permiso para notificaciones concedido');
            } else {
                console.warn('Permiso para notificaciones denegado');
            }
        });
    }
}

// Mostrar una notificación del sistema
function mostrarNotificacionSistema(titulo, mensaje) {
    if (Notification.permission === 'granted') {
        const notificacion = new Notification(titulo, {
            body: mensaje,
            icon: '../assets/img/notification-icon.png', // Cambia el icono según tu diseño
        });

        // Opcional: manejar clics en la notificación
        notificacion.onclick = () => {
            console.log('Notificación clickeada');
            window.focus(); // Llevar al usuario a la ventana principal
        };
    } else {
        console.warn('No se pueden mostrar notificaciones: permiso denegado');
    }
}

// Actualizar la campanita con notificaciones
function actualizarCampanita(usuario, producto) {
    const campanita = document.getElementById('dropdownMenuButton');
    const listaNotificaciones = document.querySelector('.dropdown-menu');

    // Crear una nueva notificación en la campanita
    const nuevaNotificacion = document.createElement('li');
    nuevaNotificacion.className = 'mb-2';
    nuevaNotificacion.innerHTML = `
        <a class="dropdown-item border-radius-md" href="javascript:;">
            <div class="d-flex py-1">
                <div class="my-auto">
                    <img src="../assets/img/team-2.jpg" class="avatar avatar-sm me-3">
                </div>
                <div class="d-flex flex-column justify-content-center">
                    <h6 class="text-sm font-weight-normal mb-1">
                        <span class="font-weight-bold">${usuario}</span> compró <span class="font-weight-bold">${producto}</span>
                    </h6>
                    <p class="text-xs text-secondary mb-0">
                        <i class="fa fa-clock me-1"></i> Hace unos momentos
                    </p>
                </div>
            </div>
        </a>
    `;

    // Agregar la notificación a la lista
    listaNotificaciones.prepend(nuevaNotificacion);

    // Mostrar una notificación del sistema
    mostrarNotificacionSistema('Nueva compra realizada', `${usuario} compró ${producto}`);
}



// Inicializar notificaciones al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Solicitar permiso para notificaciones
    solicitarPermisoNotificaciones();

    // Simular una compra después de 5 segundos (para pruebas)
    setTimeout(simularCompra, 5000);
});