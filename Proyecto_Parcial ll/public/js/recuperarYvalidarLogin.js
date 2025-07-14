function recuperarYvalidar(event) {
    event.preventDefault(); // Primero prevenir el envío del formulario
    
    // Obtener los valores de los campos
    var nombreUsuario_recuperado = document.getElementById('inputnombreUsuario').value;
    var contrasena_recuperada = document.getElementById('inputPassword').value; 
    
    // Verificar credenciales de administrador
    const userData = {
        nombreUsuario: "Grupo2",
        password: "admin123"
    };
    
    // Comprobar si es el administrador
    if (nombreUsuario_recuperado === userData.nombreUsuario && contrasena_recuperada === userData.password) {
        // Mostrar modal de bienvenida administrador
        const modalBienvenidaAdmin = document.getElementById('modalBienvenidaAdmin');
        if (modalBienvenidaAdmin) {
            const modal = new bootstrap.Modal(modalBienvenidaAdmin);
            modal.show();
            
            // Configurar botón de acceso
            const btnAccesoAdmin = document.getElementById('btnAccesoAdmin');
            if (btnAccesoAdmin) {
                btnAccesoAdmin.onclick = function() {
                    modal.hide();
                    setTimeout(() => {
                        window.location.href = 'indexAdmin.html';
                    }, 300);
                };
            }
        } else {
            // Fallback al alert si no hay modal
            mostrarModal("Bienvenido Administrador");
            window.location.href = 'indexAdmin.html';
        }
        return true;
    }
    
    // Si no es admin, verificar en localStorage
    try {
        // Obtener el array de usuarios
        var usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        console.log("Usuarios recuperados:", usuarios);
        
        // Verificar si hay usuarios
        if (usuarios.length === 0) {
            // Mostrar modal de error - no hay usuarios
            const modalErrorLogin = document.getElementById('modalErrorLogin');
            const mensajeErrorLogin = document.getElementById('mensajeErrorLogin');
            
            if (modalErrorLogin && mensajeErrorLogin) {
                mensajeErrorLogin.textContent = 'No hay usuarios registrados. Por favor regístrese primero.';
                const modal = new bootstrap.Modal(modalErrorLogin);
                modal.show();
            } else {
                // Fallback al alert si no hay modal
                mostrarModal("No hay usuarios registrados. Por favor regístrese primero.");
            }
            return false;
        }
        
        // Buscar el usuario en el array
        var usuarioEncontrado = false;
        var usuarioActual = null;
        
        for (var i = 0; i < usuarios.length; i++) {
            if (usuarios[i].nombreUsuario === nombreUsuario_recuperado && usuarios[i].contrasena === contrasena_recuperada) {
                usuarioEncontrado = true;
                usuarioActual = usuarios[i];
                break;
            }
        }
        
        if (usuarioEncontrado) {
            // Mostrar modal de bienvenida cliente
            const modalBienvenidaCliente = document.getElementById('modalBienvenidaCliente');
            const mensajeBienvenidaCliente = document.getElementById('mensajeBienvenidaCliente');
            
            if (modalBienvenidaCliente && mensajeBienvenidaCliente) {
                mensajeBienvenidaCliente.textContent = `¡Bienvenido ${usuarioActual.nombre} ${usuarioActual.apellido}!`;
                const modal = new bootstrap.Modal(modalBienvenidaCliente);
                modal.show();
                
                // Configurar botón de acceso
                const btnAccesoCliente = document.getElementById('btnAccesoCliente');
                if (btnAccesoCliente) {
                    btnAccesoCliente.onclick = function() {
                        modal.hide();
                        setTimeout(() => {
                            // Guardar usuario en sesión
                            sessionStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
                            // Redirigir a la página de cliente
                            window.location.href = 'indexCliente.html';
                        }, 300);
                    };
                }
            } else {
                // Fallback al alert si no hay modal
                alert("Bienvenido " + usuarioActual.nombre + " " + usuarioActual.apellido);
                
                // Guardar usuario en sesión
                sessionStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
                // Redirigir a la página de cliente
                window.location.href = 'indexCliente.html';
            }
            
            return true;
        } else {
            // Mostrar modal de error de credenciales
            const modalErrorLogin = document.getElementById('modalErrorLogin');
            const mensajeErrorLogin = document.getElementById('mensajeErrorLogin');
            
            if (modalErrorLogin && mensajeErrorLogin) {
                mensajeErrorLogin.textContent = 'Nombre de usuario o contraseña incorrectos';
                const modal = new bootstrap.Modal(modalErrorLogin);
                modal.show();
            } else {
                // Fallback al alert si no hay modal
                mostrarModal("Nombre de usuario o contraseña incorrectos");
            }
            return false;
        }
    } catch (error) {
        console.error("Error al recuperar datos:", error);
        
        // Mostrar modal de error general
        const modalErrorLogin = document.getElementById('modalErrorLogin');
        const mensajeErrorLogin = document.getElementById('mensajeErrorLogin');
        
        if (modalErrorLogin && mensajeErrorLogin) {
            mensajeErrorLogin.textContent = 'Ocurrió un error al intentar iniciar sesión';
            const modal = new bootstrap.Modal(modalErrorLogin);
            modal.show();
        } else {
            // Fallback al alert si no hay modal
            mostrarModal("Ocurrió un error al intentar iniciar sesión");
        }
        return false;
    }
}