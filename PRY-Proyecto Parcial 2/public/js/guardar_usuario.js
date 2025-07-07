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

    
    var selectUsuario = document.getElementById('selectUsuario');
    if (selectUsuario) {
        selectUsuario.innerHTML = '<option value="">Seleccione un usuario</option>';
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                const userObj = JSON.parse(localStorage.getItem(key));
                if (userObj && typeof userObj === "object" && userObj.nombre && userObj.apellido) {
                    selectUsuario.innerHTML += `<option value="${key}">${userObj.nombre} ${userObj.apellido} (${key})</option>`;
                }
            } catch (e) {}
        }
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        var titulo = document.getElementById('tituloCancion').value.trim();
        var artista = document.getElementById('artistaCancion').value.trim();
        var genero = document.getElementById('generoCancion').value.trim();
        var userName = selectUsuario.value;

        if (!userName) {
            alert('Seleccione un usuario.');
            return;
        }

        var objUser = {};
        var userData = JSON.parse(localStorage.getItem(userName));
        if (!userData) {
            alert('No se encontró el usuario.');
            return;
        }

        objUser[userName] = userData;
        if (!objUser[userName].canciones) objUser[userName].canciones = [];
        objUser[userName].canciones.push({ titulo: titulo, artista: artista, genero: genero });
        localStorage.setItem(userName, JSON.stringify(objUser[userName]));

        document.getElementById('alertaCancion').classList.remove('d-none');
        form.reset();
        form.classList.remove('was-validated');
    });
}



function verCancionesInit() {
    var selectUsuario = document.getElementById('selectUsuarioVer');
    var cancionesDiv = document.getElementById('cancionesUsuario');
    if (!selectUsuario || !cancionesDiv) return;

    selectUsuario.innerHTML = '<option value="">Seleccione un usuario</option>';
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        try {
            var userObj = JSON.parse(localStorage.getItem(key));
            if (userObj && typeof userObj === "object" && userObj.nombre && userObj.apellido) {
                selectUsuario.innerHTML += `<option value="${key}">${userObj.nombre} ${userObj.apellido} (${key})</option>`;
            }
        } catch (e) {}
    }

    selectUsuario.addEventListener('change', function() {
        cancionesDiv.innerHTML = "";
        var userKey = selectUsuario.value;
        if (!userKey) return;
        var userObj = JSON.parse(localStorage.getItem(userKey));
        if (userObj && userObj.canciones && userObj.canciones.length > 0) {
            var html = `<h4 class="text-white">Canciones de ${userObj.nombre} ${userObj.apellido}</h4>`;
            html += `<ul class="list-group">`;
            userObj.canciones.forEach(function(cancion) {
                html += `<li class="list-group-item">
                    <strong>${cancion.titulo}</strong> - ${cancion.artista} <span class="badge bg-secondary">${cancion.genero}</span>
                </li>`;
            });
            html += `</ul>`;
            cancionesDiv.innerHTML = html;
        } else {
            cancionesDiv.innerHTML = `<div class="alert alert-info">Este usuario no tiene canciones registradas.</div>`;
        }
    });
}

function editarCancionInit() {
    var selectUsuario = document.getElementById('selectUsuarioEditar');
    var selectCancion = document.getElementById('selectCancionEditar');
    var form = document.getElementById('formEditarCancion');
    var titulo = document.getElementById('tituloEditar');
    var artista = document.getElementById('artistaEditar');
    var genero = document.getElementById('generoEditar');

    if (!selectUsuario || !selectCancion || !form) return;

    // Llenar usuarios
    selectUsuario.innerHTML = '<option value="">Seleccione un usuario</option>';
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        try {
            var userObj = JSON.parse(localStorage.getItem(key));
            if (userObj && typeof userObj === "object" && userObj.nombre && userObj.apellido) {
                selectUsuario.innerHTML += `<option value="${key}">${userObj.nombre} ${userObj.apellido} (${key})</option>`;
            }
        } catch (e) {}
    }

    // Al cambiar usuario, llenar canciones
    selectUsuario.addEventListener('change', function() {
        selectCancion.innerHTML = '<option value="">Seleccione una canción</option>';
        titulo.value = '';
        artista.value = '';
        genero.value = '';
        var userKey = selectUsuario.value;
        if (!userKey) return;
        var userObj = JSON.parse(localStorage.getItem(userKey));
        if (userObj && userObj.canciones && userObj.canciones.length > 0) {
            userObj.canciones.forEach(function(cancion, idx) {
                selectCancion.innerHTML += `<option value="${idx}">${cancion.titulo} - ${cancion.artista}</option>`;
            });
        }
    });

    
    selectCancion.addEventListener('change', function() {
        var userKey = selectUsuario.value;
        var idx = selectCancion.value;
        if (!userKey || idx === "") {
            titulo.value = '';
            artista.value = '';
            genero.value = '';
            return;
        }
        var userObj = JSON.parse(localStorage.getItem(userKey));
        var cancion = userObj.canciones[idx];
        titulo.value = cancion.titulo;
        artista.value = cancion.artista;
        genero.value = cancion.genero;
    });

   
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        var userKey = selectUsuario.value;
        var idx = selectCancion.value;
        if (!userKey || idx === "") return;
        var userObj = JSON.parse(localStorage.getItem(userKey));
        userObj.canciones[idx] = {
            titulo: titulo.value.trim(),
            artista: artista.value.trim(),
            genero: genero.value.trim()
        };
        localStorage.setItem(userKey, JSON.stringify(userObj));
        
        var modal = new bootstrap.Modal(document.getElementById('modalCancionEditada'));
        modal.show();
        form.classList.remove('was-validated');
    });
}

function eliminarCancionInit() {
    var selectUsuario = document.getElementById('selectUsuarioEliminar');
    var selectCancion = document.getElementById('selectCancionEliminar');
    var form = document.getElementById('formEliminarCancion');

    if (!selectUsuario || !selectCancion || !form) return;

    // Llenar usuarios
    selectUsuario.innerHTML = '<option value="">Seleccione un usuario</option>';
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        try {
            var userObj = JSON.parse(localStorage.getItem(key));
            if (userObj && typeof userObj === "object" && userObj.nombre && userObj.apellido) {
                selectUsuario.innerHTML += `<option value="${key}">${userObj.nombre} ${userObj.apellido} (${key})</option>`;
            }
        } catch (e) {}
    }

    // Al cambiar usuario, llenar canciones
    selectUsuario.addEventListener('change', function() {
        selectCancion.innerHTML = '<option value="">Seleccione una canción</option>';
        var userKey = selectUsuario.value;
        if (!userKey) return;
        var userObj = JSON.parse(localStorage.getItem(userKey));
        if (userObj && userObj.canciones && userObj.canciones.length > 0) {
            userObj.canciones.forEach(function(cancion, idx) {
                selectCancion.innerHTML += `<option value="${idx}">${cancion.titulo} - ${cancion.artista}</option>`;
            });
        }
    });

    // Eliminar canción
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        var userKey = selectUsuario.value;
        var idx = selectCancion.value;
        if (!userKey || idx === "") return;
        var userObj = JSON.parse(localStorage.getItem(userKey));
        userObj.canciones.splice(idx, 1);
        localStorage.setItem(userKey, JSON.stringify(userObj));
        // Actualizar el select de canciones
        selectCancion.innerHTML = '<option value="">Seleccione una canción</option>';
        if (userObj.canciones && userObj.canciones.length > 0) {
            userObj.canciones.forEach(function(cancion, idx) {
                selectCancion.innerHTML += `<option value="${idx}">${cancion.titulo} - ${cancion.artista}</option>`;
            });
        }
        // Mostrar modal de éxito
        var modal = new bootstrap.Modal(document.getElementById('modalCancionEliminada'));
        modal.show();
        form.classList.remove('was-validated');
    });
}