function cambiarPagina(url) {
    fetch(url)
        .then(res => res.text())
        .then(data => {
            document.getElementById('main').innerHTML = data;
            if (typeof agregarCancionInit === 'function') agregarCancionInit();
            if (typeof verCancionesInit === 'function') verCancionesInit(); // <-- Llama aquí
            if (typeof editarCancionInit === 'function') editarCancionInit();
            if (typeof eliminarCancionInit === 'function') eliminarCancionInit();
            // Si es la vista de perfil, carga la tabla de usuarios
            if (url.includes("verPerfil.html") && typeof window.cargarUsuariosEnTabla === "function") {
                window.cargarUsuariosEnTabla();
            }
        });
}