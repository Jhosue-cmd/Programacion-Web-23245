function recuperarYvalidar(event) {
    event.preventDefault(); // Primero prevenir el envío del formulario
    
    // Obtener los valores de los campos
    var correo_recuperado = document.getElementById('inputEmail').value;
    var contrasena_recuperada = document.getElementById('inputPassword').value; // Corregido "vale" a "value"
    
    // Verificar credenciales de administrador
    const userData = {
        email: "mateolisintuna@gmail.com",
        password: "admin123"
    };
    
    // Comprobar si es el administrador
    if (correo_recuperado === userData.email && contrasena_recuperada === userData.password) {
        alert("Bienvenido Administrador");
               window.location.href = 'indexAdmin.html';

        return true;
    }
    
    // Si no es admin, verificar en localStorage
    try {
        // Obtener el array de usuarios
        var usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        console.log("Usuarios recuperados:", usuarios);
        
        // Verificar si hay usuarios
        if (usuarios.length === 0) {
            alert("No hay usuarios registrados. Por favor regístrese primero.");
            return false;
        }
        
        // Buscar el usuario en el array
        var usuarioEncontrado = false;
        var usuarioActual = null;
        
        for (var i = 0; i < usuarios.length; i++) {
            if (usuarios[i].correo === correo_recuperado && usuarios[i].contrasena === contrasena_recuperada) {
                usuarioEncontrado = true;
                usuarioActual = usuarios[i];
                break;
            }
        }
        
        if (usuarioEncontrado) {
            alert("Bienvenido " + usuarioActual.nombre + " " + usuarioActual.apellido);
            
            // Guardar usuario en sesión (opcional)
            sessionStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
            
            // Redirigir a la página de bienvenida
            window.location.href = 'bienvenida.html';
            return true;
        } else {
            alert("Correo o contraseña incorrectos");
            return false;
        }
    } catch (error) {
        console.error("Error al recuperar datos:", error);
        alert("Ocurrió un error al intentar iniciar sesión");
        return false;
    }
}


// Constante con credenciales de administrador
const userData = {
    email: "mateolisintuna@gmail.com",
    password: "admin123"
};