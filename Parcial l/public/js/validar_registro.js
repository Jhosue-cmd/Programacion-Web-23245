function  validar_Guardar(event) {

if(validateRegister(event)){
   
    guardarUsuario(); 
   
    return true; 
}
else{
    alert("Los datos no se guardaran")
    return false;

}
}



function validateRegister(event) {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente

    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("contrasena").value;
    const confirmPassword = document.getElementById("inputPasswordConfirm").value;

 

    // Validar solo correos institucionales de la ESPE
    const espeRegex = /^[a-zA-Z0-9._%+-]+@espe\.edu\.ec$/;
    if (!espeRegex.test(correo)) {
        alert("Solo se permiten estudiantes que esten registrados en la ESPE.");
        return false;
    }

    if (password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return false;
    }

    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return false;
    }

    alert("Cuenta creada exitosamente.");
    return true;
}
