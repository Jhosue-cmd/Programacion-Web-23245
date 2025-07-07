function iniciarSesion() {
    var userName = document.getElementById("usuario").value.trim();
    var passwordIngresada = document.getElementById("contraseña").value;

    var datosEnStorage = localStorage.getItem(userName);

    if (!datosEnStorage) {
        mostrarModalLoginIncorrecto();
        return;
    }

    try {
        var objetoUsuario = JSON.parse(datosEnStorage);
    } catch (e) {
        console.error("Error al parsear los datos JSON del usuario:", e);
        mostrarModalLoginIncorrecto();
        return;
    }

    if (objetoUsuario.password === passwordIngresada) {
        mostrarModalLoginExitoso();
    } else {
        mostrarModalLoginIncorrecto();
    }
}

function mostrarModalLoginExitoso() {
    const modal = new bootstrap.Modal(document.getElementById('modalLoginExitoso'));
    modal.show();
}
function validarFormularioLogin() {
    const form = document.querySelector('.needs-validation');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        const firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) {
            firstInvalid.focus();
        }
        return;
    }
    form.classList.add('was-validated');
    iniciarSesion();

}
function entrarDashboard() {
    window.location.href = "dashboard.html";
}
function mostrarModalLoginIncorrecto() {
    const modal = new bootstrap.Modal(document.getElementById('modalLoginIncorrecto'));
    modal.show();
}