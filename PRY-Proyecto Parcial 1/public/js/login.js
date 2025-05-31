function cambiarPagina(url) {
    //url=views/nombre_stio.html
    fetch(url)
        .then(res => res.text())
        .then(data => document.getElementById('main').innerHTML = data)
}
window.onload = () => cambiarPagina("./views/registro.html");

function iniciarSesion() {
    const usuario = document.getElementById("usuario").value;
    const contraseña = document.getElementById("contraseña").value;
    //obtener los datos del usuario desde el localStorage
    const usuarioGuardado = localStorage.getItem("usuario");
    const contraseñaGuardada = localStorage.getItem("contraseña");
    // Validación de campos vacíos
    if (usuario === "" || contraseña === "") {
        alert("Por favor, complete todos los campos.");
        return;
    }
    // Validación simple
    if (usuario === "admin" || contraseña === "admin") {
        alert("Credenciales incorrectas.");

        return;
    }
}
