function guardar_Datos() {
    const datos = {
        nombre: document.getElementById("nombre").value.trim(),
        apellido: document.getElementById("apellido").value.trim(),
        cedula: document.getElementById("cedula").value.trim(),
        fecha_nacimiento: document.getElementById("fecha_nacimiento").value,
        email: document.getElementById("email").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        direccion: document.getElementById("direccion").value.trim(),
        nivel: document.getElementById("nivel").value,
        horario: document.getElementById("horario").value,
        comentarios: document.getElementById("comentarios").value.trim(),
        latitud: document.getElementById("latitud").value,
        longitud: document.getElementById("longitud").value,
        foto: obtenerImagenDesdeCanvas("foto"),
        timestamp: new Date().toISOString(),
        id: Date.now() // Agregar un ID único basado en timestamp
    };

    // Validar campos obligatorios
    for (const campo in datos) {
        if (datos[campo] === "" && campo !== "direccion" && campo !== "comentarios" && campo !== "foto") {
            alert(`El campo ${campo} es obligatorio.`);
            return false;
        }
    }

    try {
        // Asegurarse de que datosGuardados sea un array
        let datosGuardados;
        try {
            const datosGuardadosStr = localStorage.getItem("datosFormulario");
            if (datosGuardadosStr) {
                datosGuardados = JSON.parse(datosGuardadosStr);
                if (!Array.isArray(datosGuardados)) {
                    console.warn("Los datos guardados no son un array, creando uno nuevo");
                    datosGuardados = [];
                }
            } else {
                datosGuardados = [];
            }
        } catch (parseError) {
            console.error("Error al parsear datos guardados:", parseError);
            datosGuardados = [];
        }
        
        // Añadir los nuevos datos
        datosGuardados.push(datos);
        
        // Guardar el array actualizado en localStorage
        localStorage.setItem("datosFormulario", JSON.stringify(datosGuardados));
        
        // Guardar el objeto datos en sessionStorage
        sessionStorage.setItem('usuarioActual', JSON.stringify(datos));
        
        console.log("Datos guardados en localStorage y sessionStorage correctamente.");
        
        // Limpiar el formulario después de guardar
        limpiarFormulario();
        
        // Mostrar mensaje de éxito
        alert("Datos registrados correctamente.");
        
        return true;
    } catch (e) {
        console.error("Error al guardar en localStorage:", e);
        alert("Ocurrió un error al guardar los datos: " + e.message);
        return false;
    }
}

/**
 * Obtiene la imagen desde un canvas como URL base64
 * @param {string} idCanvas - ID del elemento canvas
 * @returns {string} - URL base64 de la imagen o string vacío si hay error
 */
function obtenerImagenDesdeCanvas(idCanvas) {
    try {
        const canvas = document.getElementById(idCanvas);
        if (canvas && canvas.tagName === 'CANVAS') {
            return canvas.toDataURL("image/png");
        } else {
            console.warn(`El elemento con ID "${idCanvas}" no existe o no es un canvas`);
            return "";
        }
    } catch (error) {
        console.error("Error al obtener imagen desde canvas:", error);
        return "";
    }
}

/**
 * Limpia todos los campos del formulario
 */
function limpiarFormulario() {
    try {
        // Limpiar campos de texto
        const camposTexto = ["nombre", "apellido", "cedula", "email", "telefono", "direccion", "comentarios"];
        camposTexto.forEach(campo => {
            const elemento = document.getElementById(campo);
            if (elemento) elemento.value = "";
        });
        
        // Restablecer selects
        const selectores = ["nivel", "horario"];
        selectores.forEach(selector => {
            const elemento = document.getElementById(selector);
            if (elemento && elemento.options.length > 0) elemento.selectedIndex = 0;
        });
        
        // Limpiar fecha
        const fechaElement = document.getElementById("fecha_nacimiento");
        if (fechaElement) fechaElement.value = "";
        
        // Restablecer coordenadas
        const latitudElement = document.getElementById("latitud");
        const longitudElement = document.getElementById("longitud");
        if (latitudElement) latitudElement.value = "";
        if (longitudElement) longitudElement.value = "";
        
        // Limpiar canvas si existe
        const canvas = document.getElementById("foto");
        if (canvas && canvas.tagName === 'CANVAS') {
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        console.log("Formulario limpiado correctamente");
    } catch (error) {
        console.error("Error al limpiar formulario:", error);
    }
}

// Exponer funciones globalmente para que puedan ser usadas desde HTML
window.guardar_Datos = guardar_Datos;
window.obtenerImagenDesdeCanvas = obtenerImagenDesdeCanvas;
window.limpiarFormulario = limpiarFormulario;