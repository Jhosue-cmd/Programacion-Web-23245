function guardarUsuario(){
    var primerNombre_storage = document.getElementById('nombre').value;
    var apellido_storage = document.getElementById('apellido').value;
    var correo_storage = document.getElementById('correo').value;
    var contrasena_storage = document.getElementById('contrasena').value;

  

    // Crear objeto con los datos del usuario actual
   var usuario = {
        nombre: primerNombre_storage,
        apellido: apellido_storage,
        correo: correo_storage,
        contrasena: contrasena_storage,
        fechaRegistro: new Date().toISOString(),
        id: Date.now() // Añadir un ID único basado en timestamp
    };
    
 // Obtener array existente o crear uno nuevo si no existe
    var usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    // Añadir el nuevo usuario al array
    usuarios.push(usuario);
    
    // Guardar el array actualizado
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    console.log("Datos guardados: " + JSON.stringify(usuarios));
    

    
  // Redireccionar al login después de un breve retraso
    setTimeout(function() {
        cargarPaginas('login');
    }, 1000);
}