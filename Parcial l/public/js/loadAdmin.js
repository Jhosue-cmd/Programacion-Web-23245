fetch("menu_Admin.html")
  .then(res => res.text())
  .then(data => document.getElementById("header_admin").innerHTML = data);

fetch("footerAdmin.html")
  .then(res => res.text())
  .then(data => document.getElementById("footerAdmin").innerHTML = data);

  function cargarPaginasAdmin(url_pagina) {
    fetch(`paginasAdmin/${url_pagina}.html`)
        .then(res => res.text())
        .then(data => {
            // Reemplazar rutas relativas con rutas absolutas
            const contenidoModificado = data.replace(/src="\.\.\/img\//g, 'src="./img/');
            document.getElementById('principal').innerHTML = contenidoModificado;
            
            // Cargar scripts específicos después de cargar el contenido
       if (url_pagina === "verPerfiles") {
                // Llama directamente a cargarGaleriaPerfiles si existe
                if (typeof window.cargarGaleriaPerfiles === 'function') {
                    window.cargarGaleriaPerfiles();
                } else {
                    // Si el script aún no está cargado, cárgalo y luego llama a la función
                    const script = document.createElement('script');
                    script.src = '../js/recuperarTodo.js';
                    script.onload = () => window.cargarGaleriaPerfiles();
                    document.body.appendChild(script);
                }
            }       
            
        })
        .catch(error => {
            console.error('Error al cargar la página:', error);
        });
}

window.onload = () => cargarPaginasAdmin("inicio");