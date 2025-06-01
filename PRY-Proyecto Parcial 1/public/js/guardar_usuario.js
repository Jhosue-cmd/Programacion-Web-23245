function guardarUsuario() {
    var userName = document.getElementById("USERNAME").value;
    localStorage.setItem("nombre_usuario", userName);
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
    guardarUsuario();
    
}
function mostrarModalRegistroExitoso() {
    const modal = new bootstrap.Modal(document.getElementById('modalRegistroExitoso'));
    modal.show();
}



function agregarCancionInit() {
    var form = document.getElementById('formAgregarCancion');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Submit detectado');
        console.log(localStorage.getItem('nombre_usuario'));
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        var titulo = document.getElementById('tituloCancion').value.trim();
        var artista = document.getElementById('artistaCancion').value.trim();
        var genero = document.getElementById('generoCancion').value.trim();

        // Obtener usuario actual (por ejemplo, usando el nombre de usuario guardado)
        var userName = localStorage.getItem('nombre_usuario');
        if (!userName) {
            alert('No hay usuario activo.');
            return;
        }

        // Recuperar el objeto de usuario completo
        var objUser = {};
        var userData = JSON.parse(localStorage.getItem(userName));
        if (!userData) {
            alert('No se encontró el usuario.');
            return;
        }
        objUser[userName] = userData;

        // Inicializar el array de canciones si no existe
        if (!objUser[userName].canciones) objUser[userName].canciones = [];

        // Agregar la nueva canción
        objUser[userName].canciones.push({ titulo: titulo, artista: artista, genero: genero });

        // Guardar de nuevo en localStorage
        localStorage.setItem(userName, JSON.stringify(objUser[userName]));

        // Mostrar alerta de éxito
        document.getElementById('alertaCancion').classList.remove('d-none');
        form.reset();
        form.classList.remove('was-validated');
    });
}

// ...existing code...

