
function cambiarPagina(url) {
    //url=views/nombre_stio.html
    fetch(url)
        .then(res => res.text())
        .then(data => document.getElementById('main').innerHTML = data)
}
window.onload = () => cambiarPagina("./views/crear_perfil.html");

// Validación del formulario
function validarFormulario() {
    const form = document.querySelector('.needs-validation');
    form.addEventListener('submit', (event) => {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        form.classList.add('was-validated');
        if (form.checkValidity()) {
            guardarUsuario();
            window.onload = () => cambiarPagina('./views/ver_perfil.html');
        }

    });
}

