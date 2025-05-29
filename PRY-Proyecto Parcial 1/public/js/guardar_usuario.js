

function guardarUsuario() {
    var nombre_usuario = document.getElementById("txt_nombre_usuario").value;
    localStorage.setItem("nombre_usuario", nombre_usuario);
    alert("Usuario guardado: " + nombre_usuario);

}
