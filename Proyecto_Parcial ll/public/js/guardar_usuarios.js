function guardarUsuario(){
    // Obtener datos personales
    var primerNombre_storage = document.getElementById('nombre').value;
    var apellido_storage = document.getElementById('apellido').value;
    var correo_storage = document.getElementById('inputEmail').value;
    var provincia_storage = document.getElementById('provincia').value;
    var ciudad_storage = document.getElementById('ciudad').value;
    var telefono_storage = document.getElementById('telefono').value;
    var fechaNacimiento_storage = document.getElementById('fechaNacimiento').value;
    
    // Obtener datos de acceso
    var nombreUsuario_storage = document.getElementById('nombreUsuario').value;
    var contrasena_storage = document.getElementById('contrasena').value;
    
    // Obtener foto capturada (si existe)
    var fotoCanvas = document.getElementById('foto');
    var fotoDataURL = null;
    if (fotoCanvas && fotoCanvas.toDataURL) {
        try {
            fotoDataURL = fotoCanvas.toDataURL('image/jpeg', 0.8);
        } catch (e) {
            console.log('No se pudo obtener la foto capturada');
        }
    }
    
    // Obtener ubicación (si existe)
    var latitud = null;
    var longitud = null;
    var precision = null;
    
    // Verificar si hay datos de ubicación en los elementos del DOM
    var latitudElement = document.getElementById('latitudDisplay');
    var longitudElement = document.getElementById('longitudDisplay');
    var precisionElement = document.getElementById('precisionDisplay');
    
    if (latitudElement && latitudElement.textContent !== '-') {
        latitud = latitudElement.textContent;
    }
    if (longitudElement && longitudElement.textContent !== '-') {
        longitud = longitudElement.textContent;
    }
    if (precisionElement && precisionElement.textContent !== '-') {
        precision = precisionElement.textContent;
    }

    // Crear objeto con todos los datos del usuario
    var usuario = {
        // Datos personales
        nombre: primerNombre_storage,
        apellido: apellido_storage,
        correo: correo_storage,
        provincia: provincia_storage,
        ciudad: ciudad_storage,
        telefono: telefono_storage,
        fechaNacimiento: fechaNacimiento_storage,
        
        // Datos de acceso
        nombreUsuario: nombreUsuario_storage,
        contrasena: contrasena_storage,
        
        // Foto de perfil
        foto: fotoDataURL,
        
        // Ubicación
        ubicacion: {
            latitud: latitud,
            longitud: longitud,
            precision: precision
        },
        
        // Metadatos
        fechaRegistro: new Date().toISOString(),
        id: Date.now() // ID único basado en timestamp
    };
    
    // Obtener array existente o crear uno nuevo si no existe
    var usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    // Añadir el nuevo usuario al array
    usuarios.push(usuario);
    
    // Guardar el array actualizado
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    console.log("Usuario registrado exitosamente:");
    console.log("- Nombre completo:", usuario.nombre + " " + usuario.apellido);
    console.log("- Ubicación:", usuario.provincia + ", " + usuario.ciudad);
    console.log("- Fecha de nacimiento:", usuario.fechaNacimiento);
    console.log("- Nombre de usuario:", usuario.nombreUsuario);
    console.log("- Foto capturada:", usuario.foto ? "Sí" : "No");
    console.log("- Ubicación GPS:", usuario.ubicacion.latitud ? "Sí" : "No");
    console.log("Total de usuarios registrados:", usuarios.length);
    
    if (latitud && longitud) {
        console.log('Ubicación GPS capturada:', { latitud, longitud, precision });
    } else {
        console.warn('No se capturó la ubicación GPS.');
    }
    
    // Redireccionar al login después de un breve retraso
    setTimeout(function() {
        cargarPaginas('login');
    }, 1000);
}