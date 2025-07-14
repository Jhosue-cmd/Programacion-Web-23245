fetch("menu_cliente.html")
  .then(res => res.text())
  .then(data => document.getElementById("header_cliente").innerHTML = data);

fetch("footer.html")
  .then(res => res.text())
  .then(data => document.getElementById("footer").innerHTML = data);

function cargarPaginasLogin(url_pagina) {
    fetch(`paginasCliente/${url_pagina}.html`)
        .then(res => res.text())
        .then(data => {
            // Reemplazar rutas relativas con rutas absolutas
            const contenidoModificado = data.replace(/src="\.\.\/img\//g, 'src="./img/');
            document.getElementById('principal').innerHTML = contenidoModificado;
            

        })
        .catch(error => {
            console.error('Error al cargar la página:', error);
        });
}

// Función para cerrar sesión
window.logout = function() {
    // Mostrar modal de confirmación
    const modalLogout = new bootstrap.Modal(document.getElementById('modalLogout'));
    modalLogout.show();
    
    // Configurar evento del botón confirmar
    const btnConfirmar = document.getElementById('confirmarLogout');
    btnConfirmar.onclick = function() {
        // Cerrar modal
        modalLogout.hide();
        
        // Pequeño delay para que se cierre el modal antes de redirigir
        setTimeout(() => {
            // Redirigir al index.html principal
            window.location.href = './index.html';
        }, 300);
    };
};

window.onload = () => cargarPaginasLogin("IndexPrincipal");