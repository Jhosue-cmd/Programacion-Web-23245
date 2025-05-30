fetch('./views/inicio.html')
    .then(res => res.text())
    .then(data => document.getElementById('main').innerHTML = data)

fetch('./views/crear_perfil.html')
    .then(res => res.text())
    .then(data => document.getElementById('main').innerHTML = data)

fetch('./views/ver_perfil.html')
    .then(res => res.text())
    .then(data => document.getElementById('main').innerHTML = data)

function cambiarPagina(url) {
    //url=views/nombre_stio.html
    fetch(url)
        .then(res => res.text())
        .then(data => document.getElementById('main').innerHTML = data)
}
window.onload = () => cambiarPagina('./views/crear_perfil.html')
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
            enviarDatos();
        }
    });
}

//enviar datos del formulario
function enviarDatos() {
    document.getElementById('profileForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const profileData = {
            nombre: document.getElementById('validationCustom01').value,
            apellido: document.getElementById('validationCustom02').value,
            ciudad: document.getElementById('validationCustom03').value,
            provincia: document.getElementById('validationCustom04').value,
            telefono: document.getElementById('validationCustom05').value,
            foto: photo.src,
            ubicacion: document.getElementById('locationInfo').textContent
        };
        localStorage.setItem('userProfile', JSON.stringify(profileData));
        alert('Perfil guardado exitosamente');
    });
}
