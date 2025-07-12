window.validar = function() {
    // 1. Obtener todos los campos requeridos (ya existentes)
    const camposRequeridos = document.querySelectorAll('[required]');
    let formularioValido = true;

    // 2. Validación genérica de “required” + pattern
    camposRequeridos.forEach(campo => {
        campo.classList.remove('is-invalid');

        // Si está vacío o no cumple patrón:
        if (campo.value.trim() === '' || 
            (campo.hasAttribute('pattern') && !new RegExp(campo.getAttribute('pattern')).test(campo.value))) {
            
            campo.classList.add('is-invalid');
            formularioValido = false;

            // Mostrar su invalid-feedback (ya presente en HTML)
            const feedbackElement = campo.nextElementSibling;
            if (feedbackElement && feedbackElement.classList.contains('invalid-feedback')) {
                feedbackElement.style.display = 'block';
            }
        }
    });

    // 3. Validación adicional de email (ya existente)
    const emailField = document.getElementById('email');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            emailField.classList.add('is-invalid');
            formularioValido = false;
        } else {
            emailField.classList.remove('is-invalid');
            emailField.classList.add('is-valid');
        }
    }

    // 4. Validación de fecha de nacimiento (ya existente)
    const fechaNacimiento = document.getElementById('fecha_nacimiento');
    if (fechaNacimiento && fechaNacimiento.value) {
        const fechaSeleccionada = new Date(fechaNacimiento.value);
        const fechaMinima = new Date(fechaNacimiento.getAttribute('min'));
        const fechaMaxima = new Date(fechaNacimiento.getAttribute('max'));

        if (fechaSeleccionada < fechaMinima || fechaSeleccionada > fechaMaxima) {
            fechaNacimiento.classList.add('is-invalid');
            formularioValido = false;
        } else {
            fechaNacimiento.classList.remove('is-invalid');
            fechaNacimiento.classList.add('is-valid');
        }
    }

    // 5. Validación de foto en canvas (ya existente)
    const canvas = document.getElementById('foto');
    const contexto = canvas.getContext('2d');
    const imageData = contexto.getImageData(0, 0, canvas.width, canvas.height);
    const pixelArray = imageData.data;
    let canvasVacio = true;
    for (let i = 0; i < pixelArray.length; i += 4) {
        if (pixelArray[i + 3] !== 0 && !(pixelArray[i] === 255 && pixelArray[i+1] === 255 && pixelArray[i+2] === 255)) {
            canvasVacio = false;
            break;
        }
    }
    if (canvasVacio) {
        const camaraContainer = document.getElementById('my_camara').parentElement;
        // Eliminar mensajes anteriores
        const mensajeAnterior = camaraContainer.querySelector('.alert');
        if (mensajeAnterior) camaraContainer.removeChild(mensajeAnterior);

        // Crear y añadir alerta
        const mensajeError = document.createElement('div');
        mensajeError.className = 'alert alert-danger mt-2';
        mensajeError.textContent = 'Por favor, tome una foto';
        camaraContainer.appendChild(mensajeError);

        formularioValido = false;
    }

    // ──────────────────────────────────────────────────────────
    // 6. NUEVA VALIDACIÓN: Ubicación (latitud y longitud)
    // ──────────────────────────────────────────────────────────

    const latitudInput  = document.getElementById('latitud');
    const longitudInput = document.getElementById('longitud');

    // Si siguen en "0.0" o están vacíos, se considera que aún no obtuvieron ubicación
    if (
        !latitudInput.value ||
        !longitudInput.value ||
        latitudInput.value.trim() === '' ||
        longitudInput.value.trim() === '' ||
        latitudInput.value === '0.0' ||
        longitudInput.value === '0.0'
    ) {
        // Marcar ambos campos como inválidos
        latitudInput.classList.add('is-invalid');
        longitudInput.classList.add('is-invalid');
        formularioValido = false;
    } else {
        // Si tienen algún otro valor distinto de "0.0", borrar error previo
        latitudInput.classList.remove('is-invalid');
        longitudInput.classList.remove('is-invalid');
        latitudInput.classList.add('is-valid');
        longitudInput.classList.add('is-valid');
    }

    // ──────────────────────────────────────────────────────────

    // 7. Si todo es válido, se llama a guardar_Datos(); de lo contrario, mostramos alerta general.
    if (formularioValido) {
        // Llamamos a la función original que guarda/enviar datos
        guardar_Datos();
    } else {
        // Mostrar mensaje general de error (si no existe ya)
        window.scrollTo(0, 0);
        const contenedorFormulario = document.querySelector('.form-section');

        let mensajeGeneral = contenedorFormulario.querySelector('.alert-danger');
        if (!mensajeGeneral) {
            mensajeGeneral = document.createElement('div');
            mensajeGeneral.className = 'alert alert-danger';
            mensajeGeneral.innerHTML = '<strong>Error:</strong> Por favor, corrija los campos marcados en rojo.';
            contenedorFormulario.insertBefore(mensajeGeneral, contenedorFormulario.firstChild);
        }
    }
};
