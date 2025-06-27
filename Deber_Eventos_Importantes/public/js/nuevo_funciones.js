// =============================================================================
// SISTEMA DE EVENTOS PARA FORMULARIO - USANDO SOLO IF E IF-ELSE
// =============================================================================

// Variables globales
var contadorEventos = 0;
var datosFormulario = {};
var estadoValidacion = {};

// =============================================================================
// EVENTOS PARA INPUT TYPE="TEXT"
// Eventos obligatorios: oninput, onchange, onblur, onfocus, onkeydown, onkeyup, onkeypress
// =============================================================================

function manejarEventoTexto(idCampo, tipoEvento) {
    contadorEventos++;
    console.log("Evento #" + contadorEventos + " - Campo: " + idCampo + " - Evento: " + tipoEvento);
    
    var campo = document.getElementById(idCampo);
    var feedback = document.getElementById(idCampo + "Feedback");
    var esValido = true;
    var mensaje = "";
    
    if (tipoEvento === "oninput") {
        // Validación en tiempo real mientras escribe
        if (campo.value.length > 50) {
            esValido = false;
            mensaje = "Máximo 50 caracteres permitidos";
        } else if (campo.value.length > 0 && campo.value.length < 2) {
            esValido = false;
            mensaje = "Mínimo 2 caracteres requeridos";
        }
        
        actualizarProgreso();
        
    } else if (tipoEvento === "onchange") {
        // Validación cuando cambia el valor
        if (campo.value === "") {
            esValido = false;
            mensaje = "Este campo es requerido";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(campo.value)) {
            esValido = false;
            mensaje = "Solo se permiten letras y espacios";
        }
        
        mostrarNotificacion("Campo " + idCampo + " modificado", "info");
        
    } else if (tipoEvento === "onblur") {
        // Validación cuando pierde el foco
        if (campo.value !== "" && campo.value.trim() === "") {
            esValido = false;
            mensaje = "No puede contener solo espacios";
        }
        
        console.log("Campo " + idCampo + " perdió el foco con valor: " + campo.value);
        
    } else if (tipoEvento === "onfocus") {
        // Acciones cuando recibe el foco
        campo.style.backgroundColor = "#f0f8ff";
        console.log("Campo " + idCampo + " recibió el foco");
        
    } else if (tipoEvento === "onkeydown") {
        // Evento cuando presiona una tecla
        console.log("Tecla presionada en campo " + idCampo);
        
    } else if (tipoEvento === "onkeyup") {
        // Evento cuando suelta una tecla
        if (campo.value.length > 0) {
            campo.style.borderColor = "#28a745";
        } else {
            campo.style.borderColor = "#dc3545";
        }
        
    } else if (tipoEvento === "onkeypress") {
        // Evento mientras mantiene presionada una tecla
        console.log("Tecla mantenida presionada en campo " + idCampo);
    }
    
    aplicarEstilosValidacion(campo, feedback, esValido, mensaje);
}

// =============================================================================
// EVENTOS PARA INPUT TYPE="EMAIL"
// Eventos obligatorios: oninput, onchange, onblur
// =============================================================================

function manejarEventoEmail(idCampo, tipoEvento) {
    contadorEventos++;
    console.log("Evento #" + contadorEventos + " - Email: " + idCampo + " - Evento: " + tipoEvento);
    
    var campo = document.getElementById(idCampo);
    var feedback = document.getElementById(idCampo + "Feedback");
    var esValido = true;
    var mensaje = "";
    var patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (tipoEvento === "oninput") {
        // Validación mientras escribe
        if (campo.value.length > 0 && !patronEmail.test(campo.value)) {
            esValido = false;
            mensaje = "Formato de email incorrecto";
        }
        
        actualizarProgreso();
        
    } else if (tipoEvento === "onchange") {
        // Validación cuando cambia
        if (campo.value === "") {
            esValido = false;
            mensaje = "El email es requerido";
        } else if (!patronEmail.test(campo.value)) {
            esValido = false;
            mensaje = "Ingrese un email válido (ejemplo@correo.com)";
        }
        
        if (esValido) {
            mostrarNotificacion("Email válido registrado", "success");
        }
        
    } else if (tipoEvento === "onblur") {
        // Validación final cuando pierde foco
        if (campo.value !== "" && !patronEmail.test(campo.value)) {
            esValido = false;
            mensaje = "El email no tiene un formato válido";
        }
        
        console.log("Validación final de email: " + (esValido ? "VÁLIDO" : "INVÁLIDO"));
    }
    
    aplicarEstilosValidacion(campo, feedback, esValido, mensaje);
}

// =============================================================================
// EVENTOS PARA INPUT TYPE="NUMBER"
// Eventos obligatorios: oninput, onchange, onkeyup
// =============================================================================

function manejarEventoNumero(idCampo, tipoEvento) {
    contadorEventos++;
    console.log("Evento #" + contadorEventos + " - Número: " + idCampo + " - Evento: " + tipoEvento);
    
    var campo = document.getElementById(idCampo);
    var feedback = document.getElementById(idCampo + "Feedback");
    var esValido = true;
    var mensaje = "";
    var valor = parseInt(campo.value);
    
    if (tipoEvento === "oninput") {
        // Validación mientras escribe
        if (isNaN(valor)) {
            if (campo.value !== "") {
                esValido = false;
                mensaje = "Debe ingresar un número válido";
            }
        } else if (valor < 1 || valor > 100) {
            esValido = false;
            mensaje = "La edad debe estar entre 1 y 100 años";
        }
        
        actualizarProgreso();
        
    } else if (tipoEvento === "onchange") {
        // Validación cuando cambia
        if (campo.value === "") {
            esValido = false;
            mensaje = "La edad es requerida";
        } else if (isNaN(valor)) {
            esValido = false;
            mensaje = "Ingrese solo números";
        } else if (valor < 13) {
            esValido = false;
            mensaje = "Debe ser mayor de 13 años";
        } else if (valor > 100) {
            esValido = false;
            mensaje = "Edad máxima permitida: 100 años";
        }
        
        if (esValido) {
            if (valor >= 13 && valor < 18) {
                mostrarNotificacion("Usuario menor de edad registrado", "warning");
            } else if (valor >= 18 && valor < 65) {
                mostrarNotificacion("Usuario adulto registrado", "info");
            } else if (valor >= 65) {
                mostrarNotificacion("Usuario adulto mayor registrado", "info");
            }
        }
        
    } else if (tipoEvento === "onkeyup") {
        // Validación después de cada tecla
        if (campo.value !== "" && !isNaN(valor)) {
            if (valor >= 1 && valor <= 100) {
                campo.style.backgroundColor = "#d4edda";
            } else {
                campo.style.backgroundColor = "#f8d7da";
            }
        } else {
            campo.style.backgroundColor = "";
        }
    }
    
    aplicarEstilosValidacion(campo, feedback, esValido, mensaje);
}

// =============================================================================
// EVENTOS PARA INPUT TYPE="PASSWORD"
// Eventos obligatorios: onkeypress, onkeyup, onblur
// =============================================================================

function manejarEventoPassword(idCampo, tipoEvento) {
    contadorEventos++;
    console.log("Evento #" + contadorEventos + " - Password: " + idCampo + " - Evento: " + tipoEvento);
    
    var campo = document.getElementById(idCampo);
    var feedback = document.getElementById(idCampo + "Feedback");
    var esValido = true;
    var mensaje = "";
    var password = campo.value;
    
    if (tipoEvento === "onkeypress") {
        // Evento mientras presiona teclas
        console.log("Escribiendo contraseña en " + idCampo);
        
    } else if (tipoEvento === "onkeyup") {
        // Validación después de cada tecla
        if (password.length > 0) {
            var fortaleza = calcularFortalezaPassword(password);
            actualizarIndicadorFortaleza(fortaleza);
            
            if (password.length < 8) {
                esValido = false;
                mensaje = "Mínimo 8 caracteres requeridos";
            } else if (fortaleza < 3) {
                esValido = false;
                mensaje = "Contraseña muy débil. Use mayúsculas, minúsculas, números y símbolos";
            }
        }
        
        // Validar confirmación si existe
        if (idCampo === "contraseña") {
            var confirmar = document.getElementById("confirmarContraseña");
            if (confirmar && confirmar.value !== "") {
                validarConfirmacionPassword();
            }
        } else if (idCampo === "confirmarContraseña") {
            validarConfirmacionPassword();
        }
        
        actualizarProgreso();
        
    } else if (tipoEvento === "onblur") {
        // Validación final cuando pierde foco
        if (password === "") {
            esValido = false;
            mensaje = "La contraseña es requerida";
        } else if (password.length < 8) {
            esValido = false;
            mensaje = "La contraseña debe tener al menos 8 caracteres";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            esValido = false;
            mensaje = "Debe contener al menos una mayúscula, una minúscula y un número";
        }
        
        console.log("Validación final de contraseña: " + (esValido ? "VÁLIDA" : "INVÁLIDA"));
    }
    
    aplicarEstilosValidacion(campo, feedback, esValido, mensaje);
}

// =============================================================================
// EVENTOS PARA INPUT TYPE="DATE"
// Eventos obligatorios: onchange, onblur, onfocus
// =============================================================================

function manejarEventoFecha(idCampo, tipoEvento) {
    contadorEventos++;
    console.log("Evento #" + contadorEventos + " - Fecha: " + idCampo + " - Evento: " + tipoEvento);
    
    var campo = document.getElementById(idCampo);
    var feedback = document.getElementById(idCampo + "Feedback");
    var esValido = true;
    var mensaje = "";
    
    if (tipoEvento === "onchange") {
        // Validación cuando cambia la fecha
        if (campo.value === "") {
            esValido = false;
            mensaje = "La fecha de nacimiento es requerida";
        } else {
            var fechaNacimiento = new Date(campo.value);
            var hoy = new Date();
            
            if (fechaNacimiento > hoy) {
                esValido = false;
                mensaje = "La fecha de nacimiento no puede ser futura";
            } else {
                var edad = calcularEdad(fechaNacimiento);
                if (edad < 13) {
                    esValido = false;
                    mensaje = "Debe ser mayor de 13 años";
                } else if (edad > 100) {
                    esValido = false;
                    mensaje = "Fecha de nacimiento inválida";
                }
                
                if (esValido) {
                    // Actualizar campo de edad automáticamente si existe
                    var campoEdad = document.getElementById("edad");
                    if (campoEdad) {
                        campoEdad.value = edad;
                    }
                    mostrarNotificacion("Edad calculada: " + edad + " años", "info");
                }
            }
        }
        
        actualizarProgreso();
        
    } else if (tipoEvento === "onblur") {
        // Validación cuando pierde foco
        if (campo.value !== "") {
            var fecha = new Date(campo.value);
            if (isNaN(fecha.getTime())) {
                esValido = false;
                mensaje = "Formato de fecha inválido";
            }
        }
        
    } else if (tipoEvento === "onfocus") {
        // Acciones cuando recibe foco
        console.log("Selector de fecha activado");
        mostrarNotificacion("Seleccione su fecha de nacimiento", "info");
    }
    
    aplicarEstilosValidacion(campo, feedback, esValido, mensaje);
}

// =============================================================================
// EVENTOS PARA INPUT TYPE="TIME"
// Eventos obligatorios: onchange, onblur
// =============================================================================

function manejarEventoHora(idCampo, tipoEvento) {
    contadorEventos++;
    console.log("Evento #" + contadorEventos + " - Hora: " + idCampo + " - Evento: " + tipoEvento);
    
    var campo = document.getElementById(idCampo);
    
    if (tipoEvento === "onchange") {
        if (campo.value !== "") {
            mostrarNotificacion("Hora preferida seleccionada: " + campo.value, "success");
        }
        
    } else if (tipoEvento === "onblur") {
        console.log("Hora seleccionada: " + campo.value);
    }
}

// =============================================================================
// EVENTOS PARA INPUT TYPE="FILE"
// Eventos obligatorios: onchange, onclick, onblur
// =============================================================================

function manejarEventoArchivo(idCampo, tipoEvento) {
    contadorEventos++;
    console.log("Evento #" + contadorEventos + " - Archivo: " + idCampo + " - Evento: " + tipoEvento);
    
    var campo = document.getElementById(idCampo);
    
    if (tipoEvento === "onchange") {
        if (campo.files.length > 0) {
            var archivo = campo.files[0];
            
            // Validar tipo de archivo
            if (!archivo.type.startsWith('image/')) {
                mostrarNotificacion("Solo se permiten archivos de imagen", "error");
                campo.value = "";
                return;
            }
            
            // Validar tamaño (5MB máximo)
            if (archivo.size > 5 * 1024 * 1024) {
                mostrarNotificacion("El archivo es demasiado grande. Máximo 5MB", "error");
                campo.value = "";
                return;
            }
            
            // Mostrar preview
            mostrarPreviewImagen(archivo);
            mostrarNotificacion("Imagen cargada: " + archivo.name, "success");
        }
        
        actualizarProgreso();
        
    } else if (tipoEvento === "onclick") {
        console.log("Selector de archivos abierto");
        
    } else if (tipoEvento === "onblur") {
        console.log("Selector de archivos cerrado");
    }
}

// =============================================================================
// EVENTOS PARA INPUT TYPE="RANGE"
// Eventos obligatorios: oninput, onchange
// =============================================================================

function manejarEventoRango(idCampo, tipoEvento) {
    contadorEventos++;
    console.log("Evento #" + contadorEventos + " - Rango: " + idCampo + " - Evento: " + tipoEvento);
    
    var campo = document.getElementById(idCampo);
    var valor = parseInt(campo.value);
    
    if (tipoEvento === "oninput") {
        // Actualizar valor en tiempo real
        var spanValor = document.getElementById(idCampo + "Value");
        if (spanValor) {
            spanValor.textContent = valor;
        }
        
        // Cambiar color según valor
        if (valor <= 3) {
            campo.style.background = "linear-gradient(90deg, #dc3545, #ffc107)";
        } else if (valor <= 7) {
            campo.style.background = "linear-gradient(90deg, #ffc107, #28a745)";
        } else {
            campo.style.background = "linear-gradient(90deg, #28a745, #007bff)";
        }
        
    } else if (tipoEvento === "onchange") {
        var mensaje = "";
        if (valor <= 3) {
            mensaje = "Prioridad baja seleccionada";
        } else if (valor <= 7) {
            mensaje = "Prioridad media seleccionada";
        } else {
            mensaje = "Prioridad alta seleccionada";
        }
        
        mostrarNotificacion(mensaje, "info");
    }
}

// =============================================================================
// EVENTOS PARA INPUT TYPE="COLOR"
// Eventos obligatorios: oninput, onchange
// =============================================================================

function manejarEventoColor(idCampo, tipoEvento) {
    contadorEventos++;
    console.log("Evento #" + contadorEventos + " - Color: " + idCampo + " - Evento: " + tipoEvento);
    
    var campo = document.getElementById(idCampo);
    var color = campo.value;
    
    if (tipoEvento === "oninput") {
        // Cambiar color de fondo del campo en tiempo real
        campo.style.transform = "scale(1.1)";
        
    } else if (tipoEvento === "onchange") {
        // Aplicar color seleccionado a elementos del formulario
        document.documentElement.style.setProperty('--primary-color', color);
        mostrarNotificacion("Color favorito actualizado: " + color, "success");
        campo.style.transform = "scale(1)";
    }
}

// =============================================================================
// EVENTOS PARA INPUT TYPE="TEL"
// Eventos obligatorios: oninput, onkeyup
// =============================================================================

function manejarEventoTelefono(idCampo, tipoEvento) {
    contadorEventos++;
    console.log("Evento #" + contadorEventos + " - Teléfono: " + idCampo + " - Evento: " + tipoEvento);
    
    var campo = document.getElementById(idCampo);
    var feedback = document.getElementById(idCampo + "Feedback");
    var esValido = true;
    var mensaje = "";
    var telefono = campo.value;
    
    if (tipoEvento === "oninput") {
        // Formatear número mientras escribe
        var numeroLimpio = telefono.replace(/\D/g, '');
        
        if (numeroLimpio.length < 10) {
            if (telefono !== "") {
                esValido = false;
                mensaje = "Número de teléfono demasiado corto";
            }
        } else if (numeroLimpio.length > 15) {
            esValido = false;
            mensaje = "Número de teléfono demasiado largo";
        }
        
        actualizarProgreso();
        
    } else if (tipoEvento === "onkeyup") {
        // Validar formato después de cada tecla
        var patron = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
        
        if (telefono !== "" && !patron.test(telefono)) {
            esValido = false;
            mensaje = "Formato de teléfono inválido";
        }
        
        if (esValido && telefono.length >= 10) {
            mostrarNotificacion("Teléfono válido", "success");
        }
    }
    
    aplicarEstilosValidacion(campo, feedback, esValido, mensaje);
}

// =============================================================================
// EVENTOS PARA INPUT TYPE="URL"
// Eventos obligatorios: oninput, onblur
// =============================================================================

function manejarEventoUrl(idCampo, tipoEvento) {
    contadorEventos++;
    console.log("Evento #" + contadorEventos + " - URL: " + idCampo + " - Evento: " + tipoEvento);
    
    var campo = document.getElementById(idCampo);
    var feedback = document.getElementById(idCampo + "Feedback");
    var esValido = true;
    var mensaje = "";
    var url = campo.value;
    
    if (tipoEvento === "oninput") {
        // Validación mientras escribe
        if (url.length > 0 && !url.startsWith('http://') && !url.startsWith('https://')) {
            esValido = false;
            mensaje = "La URL debe comenzar con http:// o https://";
        }
        
    } else if (tipoEvento === "onblur") {
        // Validación final
        if (url !== "") {
            var patron = /^https?:\/\/.+\..+/;
            if (!patron.test(url)) {
                esValido = false;
                mensaje = "Ingrese una URL válida (ej: https://ejemplo.com)";
            } else {
                mostrarNotificacion("URL válida registrada", "success");
            }
        }
    }
    
    aplicarEstilosValidacion(campo, feedback, esValido, mensaje);
}

// =============================================================================
// EVENTOS PARA INPUT TYPE="CHECKBOX"
// Eventos obligatorios: onclick, onchange
// =============================================================================

function manejarEventoCheckbox(idCampo, tipoEvento) {
    contadorEventos++;
    console.log("Evento #" + contadorEventos + " - Checkbox: " + idCampo + " - Evento: " + tipoEvento);
    
    var campo = document.getElementById(idCampo);
    var feedback = document.getElementById(idCampo + "Feedback");
    
    if (tipoEvento === "onclick") {
        console.log("Checkbox " + idCampo + " clickeado");
        
    } else if (tipoEvento === "onchange") {
        if (campo.checked) {
            mostrarNotificacion("¡Gracias por suscribirte a las notificaciones!", "success");
            if (feedback) {
                feedback.style.display = "block";
                feedback.classList.add("d-block");
            }
        } else {
            mostrarNotificacion("Suscripción cancelada", "info");
            if (feedback) {
                feedback.style.display = "none";
                feedback.classList.remove("d-block");
            }
        }
        
        actualizarProgreso();
    }
}

// =============================================================================
// EVENTOS PARA INPUT TYPE="RADIO"
// Eventos obligatorios: onclick, onchange
// =============================================================================

function manejarEventoRadio(idCampo, tipoEvento) {
    contadorEventos++;
    console.log("Evento #" + contadorEventos + " - Radio: " + idCampo + " - Evento: " + tipoEvento);
    
    var campo = document.getElementById(idCampo);
    var feedback = document.getElementById("terminosFeedback");
    
    if (tipoEvento === "onclick") {
        console.log("Radio button " + idCampo + " clickeado");
        
    } else if (tipoEvento === "onchange") {
        if (idCampo === "aceptarSi" && campo.checked) {
            mostrarNotificacion("Términos y condiciones aceptados", "success");
            if (feedback) {
                feedback.style.display = "none";
            }
        } else if (idCampo === "aceptarNo" && campo.checked) {
            mostrarNotificacion("Debe aceptar los términos para continuar", "warning");
            if (feedback) {
                feedback.style.display = "block";
                feedback.textContent = "Debe aceptar los términos y condiciones";
            }
        }
        
        actualizarProgreso();
    }
}

// =============================================================================
// EVENTOS PARA SELECT
// Eventos obligatorios: onchange, onclick, onfocus, onblur
// =============================================================================

function manejarEventoSelect(idCampo, tipoEvento) {
    contadorEventos++;
    console.log("Evento #" + contadorEventos + " - Select: " + idCampo + " - Evento: " + tipoEvento);
    
    var campo = document.getElementById(idCampo);
    var feedback = document.getElementById(idCampo + "Feedback");
    var esValido = true;
    var mensaje = "";
    
    if (tipoEvento === "onchange") {
        if (campo.value === "") {
            esValido = false;
            mensaje = "Debe seleccionar un país";
        } else {
            mostrarNotificacion("País seleccionado: " + campo.value, "success");
        }
        
        actualizarProgreso();
        
    } else if (tipoEvento === "onclick") {
        console.log("Lista desplegable abierta");
        
    } else if (tipoEvento === "onfocus") {
        mostrarNotificacion("Seleccione su país de residencia", "info");
        
    } else if (tipoEvento === "onblur") {
        if (campo.value === "") {
            esValido = false;
            mensaje = "El país es requerido";
        }
    }
    
    aplicarEstilosValidacion(campo, feedback, esValido, mensaje);
}

// =============================================================================
// EVENTOS PARA TEXTAREA
// Eventos obligatorios: oninput, onkeyup, onfocus, onblur
// =============================================================================

function manejarEventoTextarea(idCampo, tipoEvento) {
    contadorEventos++;
    console.log("Evento #" + contadorEventos + " - Textarea: " + idCampo + " - Evento: " + tipoEvento);
    
    var campo = document.getElementById(idCampo);
    var contador = document.getElementById(idCampo + "Count");
    var longitudActual = campo.value.length;
    var longitudMaxima = 500;
    
    if (tipoEvento === "oninput") {
        // Actualizar contador de caracteres
        if (contador) {
            contador.textContent = longitudActual;
            
            if (longitudActual > longitudMaxima * 0.9) {
                contador.style.color = "#dc3545";
            } else if (longitudActual > longitudMaxima * 0.7) {
                contador.style.color = "#ffc107";
            } else {
                contador.style.color = "#007bff";
            }
        }
        
        if (longitudActual > longitudMaxima) {
            campo.value = campo.value.substring(0, longitudMaxima);
            mostrarNotificacion("Límite de caracteres alcanzado", "warning");
        }
        
    } else if (tipoEvento === "onkeyup") {
        // Validación después de cada tecla
        if (longitudActual > 0) {
            campo.style.borderColor = "#28a745";
        } else {
            campo.style.borderColor = "#dee2e6";
        }
        
    } else if (tipoEvento === "onfocus") {
        mostrarNotificacion("Cuéntanos algo sobre ti (opcional)", "info");
        
    } else if (tipoEvento === "onblur") {
        if (longitudActual > 0) {
            mostrarNotificacion("Comentario guardado (" + longitudActual + " caracteres)", "success");
        }
    }
}

// =============================================================================
// EVENTOS PARA BUTTON
// Eventos obligatorios: onclick, onmouseover, onmousedown, onmouseup, onfocus
// =============================================================================

function manejarEventoBoton(idBoton, tipoEvento) {
    contadorEventos++;
    console.log("Evento #" + contadorEventos + " - Botón: " + idBoton + " - Evento: " + tipoEvento);
    
    var boton = document.getElementById(idBoton);
    
    if (tipoEvento === "onclick") {
        console.log("Botón " + idBoton + " clickeado - Enviando formulario...");
        
    } else if (tipoEvento === "onmouseover") {
        boton.style.transform = "translateY(-2px) scale(1.02)";
        boton.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
        
    } else if (tipoEvento === "onmousedown") {
        boton.style.transform = "translateY(0) scale(0.98)";
        
    } else if (tipoEvento === "onmouseup") {
        boton.style.transform = "translateY(-2px) scale(1.02)";
        
    } else if (tipoEvento === "onfocus") {
        boton.style.outline = "3px solid rgba(0, 123, 255, 0.5)";
    }
}

// =============================================================================
// EVENTOS PARA FORM
// Eventos obligatorios: onsubmit, onreset, oninput, onchange
// =============================================================================

function manejarEventoForm(idForm, tipoEvento) {
    contadorEventos++;
    console.log("Evento #" + contadorEventos + " - Formulario: " + idForm + " - Evento: " + tipoEvento);
    
    if (tipoEvento === "onsubmit") {
        // Prevenir envío y validar
        event.preventDefault();
        
        if (validarFormularioCompleto()) {
            mostrarModalExito();
            console.log("Formulario válido - Enviando datos...");
        } else {
            mostrarNotificacion("Complete todos los campos requeridos correctamente", "error");
        }
        
    } else if (tipoEvento === "onreset") {
        if (confirm("¿Está seguro de que desea limpiar todo el formulario?")) {
            limpiarTodosLosCampos();
            mostrarNotificacion("Formulario reiniciado", "info");
        } else {
            event.preventDefault();
        }
        
    } else if (tipoEvento === "oninput") {
        // Se ejecuta cada vez que cambia cualquier input
        actualizarProgreso();
        
    } else if (tipoEvento === "onchange") {
        // Se ejecuta cuando cualquier campo cambia su valor
        console.log("Cambio detectado en el formulario");
        actualizarProgreso();
    }
}

// =============================================================================
// FUNCIONES AUXILIARES
// =============================================================================

function aplicarEstilosValidacion(campo, feedback, esValido, mensaje) {
    if (!campo) return;
    
    campo.classList.remove("is-valid", "is-invalid");
    
    if (campo.value.trim() !== "") {
        if (esValido) {
            campo.classList.add("is-valid");
        } else {
            campo.classList.add("is-invalid");
            if (feedback) {
                feedback.textContent = mensaje;
                feedback.style.display = "block";
            }
        }
    }
    
    estadoValidacion[campo.id] = esValido;
}

function calcularFortalezaPassword(password) {
    var fortaleza = 0;
    
    if (password.length >= 8) fortaleza++;
    if (/[a-z]/.test(password)) fortaleza++;
    if (/[A-Z]/.test(password)) fortaleza++;
    if (/\d/.test(password)) fortaleza++;
    if (/[@$!%*?&]/.test(password)) fortaleza++;
    
    return fortaleza;
}

function actualizarIndicadorFortaleza(fortaleza) {
    var barraFortaleza = document.getElementById("passwordStrength");
    var textoFortaleza = document.getElementById("passwordStrengthText");
    
    if (!barraFortaleza || !textoFortaleza) return;
    
    var porcentaje = (fortaleza / 5) * 100;
    var texto = "";
    var color = "";
    
    if (fortaleza <= 1) {
        texto = "Muy débil";
        color = "bg-danger";
    } else if (fortaleza === 2) {
        texto = "Débil";
        color = "bg-warning";
    } else if (fortaleza === 3) {
        texto = "Regular";
        color = "bg-info";
    } else if (fortaleza === 4) {
        texto = "Fuerte";
        color = "bg-success";
    } else {
        texto = "Muy fuerte";
        color = "bg-success";
    }
    
    barraFortaleza.style.width = porcentaje + "%";
    barraFortaleza.className = "progress-bar " + color;
    textoFortaleza.textContent = "Fortaleza: " + texto;
}

function validarConfirmacionPassword() {
    var password = document.getElementById("contraseña");
    var confirmar = document.getElementById("confirmarContraseña");
    var feedback = document.getElementById("confirmarContraseñaFeedback");
    
    if (!password || !confirmar) return;
    
    if (confirmar.value !== "" && password.value !== confirmar.value) {
        confirmar.classList.add("is-invalid");
        confirmar.classList.remove("is-valid");
        if (feedback) {
            feedback.textContent = "Las contraseñas no coinciden";
            feedback.style.display = "block";
        }
    } else if (confirmar.value !== "") {
        confirmar.classList.add("is-valid");
        confirmar.classList.remove("is-invalid");
        if (feedback) {
            feedback.style.display = "none";
        }
    }
}

function calcularEdad(fechaNacimiento) {
    var hoy = new Date();
    var edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    var mes = hoy.getMonth() - fechaNacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
    }
    
    return edad;
}

function mostrarPreviewImagen(archivo) {
    var preview = document.getElementById("archivoPreview");
    if (!preview) return;
    
    var reader = new FileReader();
    reader.onload = function(e) {
        preview.innerHTML = '<img src="' + e.target.result + '" alt="Preview" class="img-thumbnail" style="max-width: 200px; max-height: 200px;">';
    };
    reader.readAsDataURL(archivo);
}

function actualizarProgreso() {
    var camposRequeridos = document.querySelectorAll('[required]');
    var camposCompletos = 0;
    var totalCampos = 0;
    
    for (var i = 0; i < camposRequeridos.length; i++) {
        var campo = camposRequeridos[i];
        totalCampos++;
        
        if (campo.type === 'radio') {
            var nombre = campo.name;
            var radioSeleccionado = document.querySelector('input[name="' + nombre + '"]:checked');
            if (radioSeleccionado) {
                camposCompletos++;
            }
        } else if (campo.value.trim() !== "") {
            camposCompletos++;
        }
    }
    
    var porcentaje = totalCampos > 0 ? (camposCompletos / totalCampos) * 100 : 0;
    var barraProgreso = document.getElementById("progress-bar");
    
    if (barraProgreso) {
        barraProgreso.style.width = porcentaje + "%";
        
        if (porcentaje < 33) {
            barraProgreso.className = "progress-bar progress-bar-striped progress-bar-animated bg-danger";
        } else if (porcentaje < 66) {
            barraProgreso.className = "progress-bar progress-bar-striped progress-bar-animated bg-warning";
        } else if (porcentaje < 100) {
            barraProgreso.className = "progress-bar progress-bar-striped progress-bar-animated bg-info";
        } else {
            barraProgreso.className = "progress-bar progress-bar-striped progress-bar-animated bg-success";
        }
    }
}

function validarFormularioCompleto() {
    var camposRequeridos = document.querySelectorAll('[required]');
    var formularioValido = true;
    
    for (var i = 0; i < camposRequeridos.length; i++) {
        var campo = camposRequeridos[i];
        
        if (campo.type === 'radio') {
            var nombre = campo.name;
            var radioSeleccionado = document.querySelector('input[name="' + nombre + '"]:checked');
            
            if (!radioSeleccionado) {
                formularioValido = false;
                mostrarNotificacion("Debe seleccionar una opción en: " + nombre, "error");
            } else if (nombre === 'terminos' && radioSeleccionado.value !== 'si') {
                formularioValido = false;
                mostrarNotificacion("Debe aceptar los términos y condiciones", "error");
            }
        } else if (campo.value.trim() === "") {
            formularioValido = false;
            campo.classList.add("is-invalid");
            mostrarNotificacion("Complete el campo: " + (campo.placeholder || campo.name), "error");
        }
    }
    
    return formularioValido;
}

function mostrarModalExito() {
    // Recopilar datos del formulario
    var form = document.getElementById("formularioRegistro");
    var formData = new FormData(form);
    var datos = {};
    
    for (var pair of formData.entries()) {
        datos[pair[0]] = pair[1];
    }
    
    // Mostrar datos en el modal
    var userData = document.getElementById("userData");
    if (userData) {
        userData.innerHTML = 
            '<div class="row text-start">' +
            '<div class="col-6"><strong>Nombre:</strong></div>' +
            '<div class="col-6">' + (datos.nombre || '') + '</div>' +
            '<div class="col-6"><strong>Email:</strong></div>' +
            '<div class="col-6">' + (datos.correo || '') + '</div>' +
            '<div class="col-6"><strong>País:</strong></div>' +
            '<div class="col-6">' + (datos.pais || '') + '</div>' +
            '<div class="col-6"><strong>Edad:</strong></div>' +
            '<div class="col-6">' + (datos.edad || '') + ' años</div>' +
            '</div>';
    }
    
    // Mostrar modal usando Bootstrap
    var modal = document.getElementById("successModal");
    if (modal && typeof bootstrap !== 'undefined') {
        var bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }
}

function mostrarNotificacion(mensaje, tipo) {
    var toast = document.getElementById("liveToast");
    var toastMessage = document.getElementById("toastMessage");
    var toastHeader = toast ? toast.querySelector(".toast-header") : null;
    
    if (!toast || !toastMessage || !toastHeader) {
        console.log("Notificación [" + tipo + "]: " + mensaje);
        return;
    }
    
    // Configurar colores según tipo
    if (tipo === "error") {
        toastHeader.className = "toast-header bg-danger text-white";
    } else if (tipo === "success") {
        toastHeader.className = "toast-header bg-success text-white";
    } else if (tipo === "warning") {
        toastHeader.className = "toast-header bg-warning text-dark";
    } else {
        toastHeader.className = "toast-header bg-primary text-white";
    }
    
    toastMessage.textContent = mensaje;
    
    if (typeof bootstrap !== 'undefined') {
        var bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }
}

function limpiarTodosLosCampos() {
    var campos = document.querySelectorAll('input, select, textarea');
    
    for (var i = 0; i < campos.length; i++) {
        var campo = campos[i];
        
        if (campo.type === 'checkbox' || campo.type === 'radio') {
            campo.checked = false;
        } else {
            campo.value = '';
        }
        
        campo.classList.remove('is-valid', 'is-invalid');
    }
    
    // Limpiar preview de imagen
    var preview = document.getElementById("archivoPreview");
    if (preview) {
        preview.innerHTML = '';
    }
    
    // Resetear contador de caracteres
    var contador = document.getElementById("comentariosCount");
    if (contador) {
        contador.textContent = '0';
    }
    
    // Resetear barra de progreso
    actualizarProgreso();
}

// =============================================================================
// FUNCIONES GLOBALES ADICIONALES
// =============================================================================

function limpiarFormulario() {
    if (confirm("¿Está seguro de que desea limpiar todo el formulario?")) {
        limpiarTodosLosCampos();
        mostrarNotificacion("Formulario limpiado completamente", "info");
    }
}

function guardarBorrador() {
    var form = document.getElementById("formularioRegistro");
    var formData = new FormData(form);
    var borrador = {};
    
    for (var pair of formData.entries()) {
        borrador[pair[0]] = pair[1];
    }
    
    localStorage.setItem('formBorrador', JSON.stringify(borrador));
    mostrarNotificacion("Borrador guardado correctamente", "success");
}

function togglePassword(fieldId) {
    var field = document.getElementById(fieldId);
    var icon = document.getElementById('toggleIcon');
    
    if (field && icon) {
        if (field.type === 'password') {
            field.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            field.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }
}

function toggleDarkMode() {
    var body = document.body;
    var icon = document.getElementById('theme-icon');
    
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        if (icon) icon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        if (icon) icon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    }
}

// =============================================================================
// INICIALIZACIÓN CUANDO EL DOM ESTÁ LISTO
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("Sistema de eventos iniciado - Total de eventos registrados: " + contadorEventos);
    
    // Aplicar tema guardado
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        var icon = document.getElementById('theme-icon');
        if (icon) icon.className = 'fas fa-sun';
    }
    
    // Actualizar progreso inicial
    actualizarProgreso();
    
    // Mensaje de bienvenida
    setTimeout(function() {
        mostrarNotificacion("¡Bienvenido! Complete el formulario paso a paso usando todos los eventos.", "info");
    }, 1000);
    
    // Cargar borrador si existe
    var borrador = localStorage.getItem('formBorrador');
    if (borrador) {
        try {
            var datos = JSON.parse(borrador);
            Object.keys(datos).forEach(function(key) {
                var campo = document.getElementById(key) || document.querySelector('[name="' + key + '"]');
                if (campo) {
                    if (campo.type === 'checkbox') {
                        campo.checked = datos[key] === 'on';
                    } else if (campo.type === 'radio') {
                        var radioElement = document.querySelector('[name="' + key + '"][value="' + datos[key] + '"]');
                        if (radioElement) radioElement.checked = true;
                    } else {
                        campo.value = datos[key];
                    }
                }
            });
            mostrarNotificacion("Borrador cargado automáticamente", "info");
        } catch (e) {
            console.log("Error cargando borrador:", e);
        }
    }
});

// Manejar errores globales
window.addEventListener('error', function(e) {
    console.error('Error en el sistema:', e.error);
    mostrarNotificacion("Ha ocurrido un error. Verifique la consola.", "error");
});

console.log("Sistema de eventos cargado completamente");
