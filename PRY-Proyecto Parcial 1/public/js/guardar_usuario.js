function guardarUsuario() {
    var nombre_usuario = document.getElementById("validationCustom01").value;
    localStorage.setItem("nombre_usuario", nombre_usuario);
}

function registrarUsuario() {
    var nombre = document.getElementById("validationCustom01").value;
    var apellido = document.getElementById("validationCustom02").value;
    var email = document.getElementById("EMAIL").value;
    var foto = document.getElementById("foto").toDataURL();
    var ubicacion = document.getElementById("locationInfo").textContent;
    var fecha_nacimiento = document.getElementById("validationCustom07").value;
    var ciudad = document.getElementById("validationCustom03").value;
    var provincia = document.getElementById("validationCustom04").value;
    var telefono = document.getElementById("validationCustom05").value;
    var userName = document.getElementById("USERNAME").value;
    var password = document.getElementById("PASSWORD").value;

    var objUser = {};
    objUser[userName] = {
        nombre: nombre,
        apellido: apellido,
        email: email,
        foto: foto,
        ubicacion: ubicacion,
        fecha_nacimiento: fecha_nacimiento,
        ciudad: ciudad,
        provincia: provincia,
        telefono: telefono,
        password: password
    };
    localStorage.setItem(userName, JSON.stringify(objUser[userName]));
}
// Validación del formulario
function validarFormularioRegistro() {
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
    registrarUsuario();
    mostrarModalRegistroExitoso();
}
function mostrarModalRegistroExitoso() {
    const modal = new bootstrap.Modal(document.getElementById('modalRegistroExitoso'));
    modal.show();
}