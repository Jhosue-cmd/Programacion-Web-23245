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



// Inicializador para el formulario de agregar canción
window.agregarCancionInit = function() {
    const form = document.getElementById('formAgregarCancion');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const titulo = document.getElementById('tituloCancion').value.trim();
        const artista = document.getElementById('artistaCancion').value.trim();
        const genero = document.getElementById('generoCancion').value.trim();

        // Obtener usuario actual (por ejemplo, usando el nombre de usuario guardado)
        const userName = localStorage.getItem('nombre_usuario');
        if (!userName) {
            alert('No hay usuario activo.');
            return;
        }
        let userData = JSON.parse(localStorage.getItem(userName));
        if (!userData) {
            alert('No se encontró el usuario.');
            return;
        }

        // Inicializar el array de canciones si no existe
        if (!userData.canciones) userData.canciones = [];

        // Agregar la nueva canción
        userData.canciones.push({ titulo, artista, genero });

        // Guardar de nuevo en localStorage
        localStorage.setItem(userName, JSON.stringify(userData));

        // Mostrar alerta de éxito
        document.getElementById('alertaCancion').classList.remove('d-none');
        form.reset();
        form.classList.remove('was-validated');
    });
};