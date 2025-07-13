function validar_Guardar(event) {
    // Validar el formulario completo
    if (validateRegister(event)) {
        console.log("✅ Validación exitosa. Procediendo a guardar...");
        guardarUsuario(); 
        return true; 
    } else {
        console.log("❌ Validación fallida. No se guardarán los datos.");
        // No mostrar alert aquí porque validateRegister ya muestra mensajes específicos
        return false;
    }
}



function validateRegister(event) {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente

 
    const passwordEl = document.getElementById("contrasena");
    const confirmPasswordEl = document.getElementById("inputPasswordConfirm");

    const password = passwordEl.value;
    const confirmPassword = confirmPasswordEl.value;


    const estado = document.getElementById("placeholder-foto");
    const mapa = document.getElementById("map");

    const bol = estado.getAttribute("data-foto-capturada");
    const bolMapa = mapa.getAttribute("data-mapa-capturado");

    
    if (password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        passwordEl.focus();
        return false;
    }

    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        confirmPasswordEl.focus();
        return false;
    }



    if (!estado) {
        alert("Error: No se encontró el elemento de foto.");
        return false;
    }

    if (!mapa) {
        alert("Error: No se encontró el elemento de mapa.");
        return false;
    }
    //validar ubicacion


   
    if (bol !== "true") {
        alert("Debe capturar su foto de perfil antes de continuar.");
        return false;
    }



    // Si llegamos aquí, todas las validaciones pasaron
    alert("¡Formulario válido! Guardando datos...");
    return true;
}

