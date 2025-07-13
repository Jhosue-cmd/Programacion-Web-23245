

// Función para inicializar funcionalidades específicas de cada página
function inicializarFuncionalidades(pagina) {
    const funcionalidades = {
        login: () => {
            // Mostrar contraseña
            if (window.setupMostrarContrasenaParaLogin) window.setupMostrarContrasenaParaLogin();
        },
        register: () => {
            // Aquí puedes agregar funcionalidades para registro si las necesitas
            // Ejemplo: if (window.initValidacionRegistro) window.initValidacionRegistro();
        }
        // Agregar más páginas según necesites
    };
    
    if (funcionalidades[pagina]) {
        funcionalidades[pagina]();
    }
}

function cargarPaginas(url_pagina) {
    fetch(`paginasLogin/${url_pagina}.html`)
        .then(res => res.text())
        .then(data => {
            // Reemplazar rutas relativas con rutas absolutas
            const contenidoModificado = data.replace(/src="\.\.\/img\//g, 'src="./img/');
            document.getElementById('contenido').innerHTML = contenidoModificado;

            // Inicializar funcionalidades específicas
            inicializarFuncionalidades(url_pagina);
        })
        .catch(error => {
            console.error('Error al cargar la página:', error);
        });
}

window.onload = () => cargarPaginas("login");