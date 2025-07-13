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

    const estado= document.getElementById("placeholder-foto");
    const mapa= document.getElementById("map");

    const bol=estado.getAttribute("data-foto-capturada");
    const bolMapa=mapa.getAttribute("data-mapa-capturado");

    //validar el ingreso de la foto
    if(bol === "true") {
        alert("Foto de perfil gurdado.");
        return true;
    }
    else if (bol == "false") {
        alert("Debe capturar su foto para capturar.");
        return false;
    }
    else{
       
        return false;
    }
    
//validar el ingreso del mapa
    if(bolMapa === "true") {
        alert("Ubicación guardada.");
        return true;
    }
    else if (bolMapa == "false") {
        alert("Debe capturar su ubicación.");
        return false;
    }
    else{
       
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

