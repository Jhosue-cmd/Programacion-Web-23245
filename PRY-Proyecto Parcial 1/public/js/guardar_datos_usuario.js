
function guardarDatosUsuario() {
    // 1 Obtener los valores de los campos de entrada
 var usario_n= document.getElementById("txt_nombre").value;
 console.log("Nombre de usuario: " + usario_n);

 var usuario_a = document.getElementById("txt_apellido").value;
 console.log("Apellido de usuario: " + usuario_a);
 var usuario_e = document.getElementById("txt_email").value;
console.log("Email de usuario: " + usuario_e);

 // 2 Convertir esos variables a un objeto 

 // sintaxis 
 // (let, var), nombre_objeto = { varibale: valor };{}

 var datos_usuario = {
        nombre: usario_n,
        apellido: usuario_a,
        email: usuario_e
    };
 localStorage.setItem(
    'datos_usuario', JSON.stringify(datos_usuario)
);
alert("Datos del usuario guardados correctamente");
location.reload(); // Recargar la página para reflejar los cambios
}
