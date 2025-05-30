
function cambiarPagina(url) {
    fetch(url)
        .then(res => res.text())
        .then(data => {
            document.getElementById('main').innerHTML = data;
            // Si la página cargada es crear_perfil.html, inicializa los listeners de cámara
            if (url.includes('./views/crear_perfil.html') && window.setupCamaraListeners) {
                window.setupCamaraListeners();
            }
            // Si la página cargada es ver_perfil.html, inicializa el llamado de carga datos
            if (url.includes('./views/ver_perfil.html') && window.verificarYCargarPerfil) {
                window.verificarYCargarPerfil();
            }
        });
}

window.onload = () => cambiarPagina("./views/inicio.html");



