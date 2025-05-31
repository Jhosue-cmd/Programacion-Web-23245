
function cambiarPagina(url) {
    //url=views/nombre_stio.html
    fetch(url)
        .then(res => res.text())
        .then(data => document.getElementById('main').innerHTML = data)
}


// Validación del formulario
function validarFormulario() {
    const form = document.querySelector('.needs-validation');
    form.addEventListener('submit', (event) => {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
            const firstInvalid = form.querySelector(':invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        }
        form.classList.add('was-validated');
        if (form.checkValidity()) {
            guardarUsuario();
            window.onload = () => cambiarPagina('./views/ver_perfil.html');
        }

    });
}
function guardarUsuario() {
    var nombre_usuario = document.getElementById("validationCustom01").value;
    localStorage.setItem("nombre_usuario", nombre_usuario);
    var apellido_usuario = document.getElementById("validationCustom02").value;
    localStorage.setItem("apellido_usuario", apellido_usuario);
    var ciudad_usuario = document.getElementById("validationCustom03").value;
    localStorage.setItem("ciudad_usuario", ciudad_usuario);
    var provincia_usuario = document.getElementById("validationCustom04").value;
    localStorage.setItem("provincia_usuario", provincia_usuario);
    var telefono_usuario = document.getElementById("validationCustom05").value;
    localStorage.setItem("telefono_usuario", telefono_usuario);
    var foto_usuario = document.getElementById("foto").toDataURL();
    localStorage.setItem("foto_usuario", foto_usuario);
    var ubicacion_usuario = document.getElementById("locationInfo").textContent;
    localStorage.setItem("ubicacion_usuario", ubicacion_usuario);
    var email_usuario = document.getElementById("validationCustom06").value;
    localStorage.setItem("email_usuario", email_usuario);
    var fecha_nacimiento_usuario = document.getElementById("validationCustom07").value;
    localStorage.setItem("fecha_nacimiento_usuario", fecha_nacimiento_usuario);
    alert("Datos del usuario guardados correctamente");
}


