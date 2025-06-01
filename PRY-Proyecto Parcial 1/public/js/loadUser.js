function actualizarPerfil() {
    var res_nombre_usuario = localStorage.getItem("nombre_usuario");
    var res_apellido_usuario = localStorage.getItem("apellido_usuario");
    var res_ciudad_usuario = localStorage.getItem("ciudad_usuario");
    var res_provincia_usuario = localStorage.getItem("provincia_usuario");
    var res_telefono_usuario = localStorage.getItem("telefono_usuario");
    var res_foto_usuario = localStorage.getItem("foto_usuario");
    var res_ubicacion_usuario = localStorage.getItem("ubicacion_usuario");
    var res_email_usuario = localStorage.getItem("email_usuario");
    var res_fecha_nacimiento_usuario = localStorage.getItem("fecha_nacimiento_usuario");
    document.getElementById("userName").innerText = res_nombre_usuario;
    document.getElementById("userLastName").innerText = res_apellido_usuario;
    document.getElementById("userCity").innerText = res_ciudad_usuario;
    document.getElementById("userProvince").innerText = res_provincia_usuario;
    document.getElementById("userPhone").innerText = res_telefono_usuario;
    document.getElementById("userPhoto").src = res_foto_usuario;
    document.getElementById("userLocation").innerText = res_ubicacion_usuario;
    document.getElementById("userEmail").innerText = res_email_usuario;
    document.getElementById("userBirthDate").innerText = res_fecha_nacimiento_usuario;
}
function eliminarUsuario() {
    localStorage.removeItem("nombre_usuario");
    localStorage.removeItem("apellido_usuario");
    localStorage.removeItem("ciudad_usuario");
    localStorage.removeItem("provincia_usuario");
    localStorage.removeItem("telefono_usuario");
    localStorage.removeItem("foto_usuario");
    localStorage.removeItem("ubicacion_usuario");
    localStorage.removeItem("email_usuario");
    localStorage.removeItem("fecha_nacimiento_usuario");

    alert("Usuario eliminado correctamente.");
}
function cargarUsuario() {
    var datos_us = localStorage.getItem("datos_usuario");
    var usuario = JSON.parse(datos_us);
    console.log(usuario);
    document.getElementById("table_nombre").innerText = usuario.nombre;
    document.getElementById("table_apellido").innerText = usuario.apellido;
    document.getElementById("table_email").innerText = usuario.email; 
}
function eliminarUsuario() {
        localStorage.removeItem("datos_usuario");
        alert("Usuario eliminado correctamente.");

    }
