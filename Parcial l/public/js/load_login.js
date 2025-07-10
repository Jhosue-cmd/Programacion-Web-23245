

function cargarPaginas(url_pagina) {
    fetch(`paginasLogin/${url_pagina}.html`)
        .then(res => res.text())
        .then(data => {
            // Reemplazar rutas relativas con rutas absolutas
            const contenidoModificado = data.replace(/src="\.\.\/img\//g, 'src="./img/');
            document.getElementById('contenido').innerHTML = contenidoModificado;

    
        })
        .catch(error => {
            console.error('Error al cargar la página:', error);
        });
}

window.onload = () => cargarPaginas("login");