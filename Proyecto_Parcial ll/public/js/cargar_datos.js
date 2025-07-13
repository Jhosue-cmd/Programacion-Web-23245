function cargarDatosPerfil() {
    // Obtener datos SOLO de sessionStorage
    const datos = JSON.parse(sessionStorage.getItem("usuarioActual"));

    if (!datos) {
        console.warn("No se encontraron datos del usuario actual en sessionStorage.");
        return false;
    }

    // Verificar que los elementos existen antes de intentar acceder a ellos
    const elementos = {
        nombre: document.getElementById("profileNombre"),
        apellido: document.getElementById("profileApellido"),
        cedula: document.getElementById("profileCedula"),
        fecha_nacimiento: document.getElementById("profileFechaNacimiento"),
        email: document.getElementById("profileEmail"),
        telefono: document.getElementById("profileTelefono"),
        direccion: document.getElementById("profileDireccion"),
        nivel: document.getElementById("profileNivel"),
        horario: document.getElementById("profileHorario"),
        comentarios: document.getElementById("profileComentarios"),
        latitud: document.getElementById("profileLatitud"),
        longitud: document.getElementById("profileLongitud"),
        foto: document.getElementById("profilePhoto"),
        mapa: document.getElementById("profileMap")
    };

    // Verificar si los elementos existen (para evitar errores en carga dinámica)
    if (!elementos.nombre) {
        console.warn("Los elementos del perfil no están presentes en el DOM actual");
        return false;
    }

    // Asignar valores a los elementos existentes
    for (const key in elementos) {
        if (elementos[key] && datos[key]) {
            if (key === 'foto') {
                elementos[key].src = datos[key];
            } else if (key === 'email') {
                elementos[key].innerHTML = `<i class="fas fa-envelope me-2 text-primary"></i><span id="emailValue">${datos[key]}</span>`;
            } else if (key === 'telefono') {
                elementos[key].innerHTML = `<i class="fas fa-phone me-2 text-primary"></i><span id="telefonoValue">${datos[key]}</span>`;
            } else if (key === 'direccion') {
                elementos[key].innerHTML = `<i class="fas fa-map-marker-alt me-2 text-primary"></i><span id="direccionValue">${datos[key]}</span>`;
            } else if (key === 'nivel') {
                elementos[key].innerHTML = `<i class="fas fa-language me-2 text-primary"></i><span id="nivelValue">${datos[key]}</span>`;
            } else if (key === 'horario') {
                elementos[key].innerHTML = `<i class="fas fa-clock me-2 text-primary"></i><span id="horarioValue">${datos[key]}</span>`;
            } else if (key === 'comentarios') {
                elementos[key].innerHTML = `<i class="fas fa-comment me-2 text-primary"></i><span id="comentariosValue">${datos[key]}</span>`;
            } else {
                elementos[key].textContent = datos[key];
            }
        }
    }

    // Mostrar mapa con Leaflet si las coordenadas son válidas
    const lat = parseFloat(datos.latitud);
    const lng = parseFloat(datos.longitud);

    if (!isNaN(lat) && !isNaN(lng) && elementos.mapa) {
        // Esperar a que Leaflet esté cargado
        if (typeof L !== 'undefined') {
            // Comprobar si el mapa ya está inicializado
            if (elementos.mapa._leaflet_id) {
                elementos.mapa._leaflet = null;
                elementos.mapa.innerHTML = '';
            }
            
            const map = L.map("profileMap").setView([lat, lng], 13);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "© OpenStreetMap contributors"
            }).addTo(map);

            L.marker([lat, lng]).addTo(map)
                .bindPopup("Ubicación del alumno")
                .openPopup();
                
            return true;
        } else {
            console.error("Leaflet no está cargado");
            return false;
        }
    } else if (elementos.mapa) {
        elementos.mapa.textContent = "Coordenadas inválidas o no proporcionadas.";
        return true;
    }
    
    return true;
}

// Función para mostrar la tarjeta de perfil en la galería
function crearCardPerfil(perfil) {
    return `
        <div class="col-md-6 mx-auto mb-4">
            <div class="resumen-card perfil-actual" onclick="mostrarInfoCompleta()" style="cursor:pointer; border: 3px solid #007bff; box-shadow: 0 0 15px rgba(0,123,255,0.5);">
                <div class="badge bg-primary position-absolute" style="top: 10px; right: 10px;">Perfil Actual</div>
                <img src="${perfil.foto || ''}" alt="Foto" class="resumen-photo mb-3">
                <div class="resumen-name">${perfil.nombre || ''} ${perfil.apellido || ''}</div>
                <div class="badge-level">${perfil.nivel || ''}</div>
            </div>
        </div>
    `;
}

// Función para cargar la galería de perfiles
function cargarGaleriaPerfiles() {
    const container = document.getElementById("galeriaPerfilesContainer");
    if (!container) return;
    
    // Obtener SOLO el perfil de sessionStorage
    let perfilActual = null;
    try {
        perfilActual = JSON.parse(sessionStorage.getItem('usuarioActual'));
    } catch (error) {
        console.error("Error al cargar el perfil actual:", error);
    }
    
    // Verificar si hay un perfil actual para mostrar
    if (!perfilActual) {
        container.innerHTML = `
            <div class="alert alert-info text-center">
                <i class="fas fa-info-circle me-2"></i>
                No hay perfil actual para mostrar.
                <br>
                <a href="formulario.html" class="btn btn-primary mt-3">
                    <i class="fas fa-plus-circle me-2"></i>Registrar Nuevo Perfil
                </a>
            </div>`;
        return;
    }
    
    // Mostrar solo el perfil actual
    let html = '<div class="row">';
    html += crearCardPerfil(perfilActual);
    html += '</div>';
    container.innerHTML = html;
}

// Función para mostrar información completa del perfil
function mostrarInfoCompleta() {
    // Obtener solo el perfil de sessionStorage
    const perfil = JSON.parse(sessionStorage.getItem('usuarioActual'));
    if (!perfil) {
        alert("No se encontró el perfil actual");
        return;
    }

    document.getElementById("galeriaPerfilesContainer").style.display = "none";
    document.getElementById("infoCompletaContainer").style.display = "block";

    // Cargar los datos del perfil
    cargarDatosPerfil();
}

// Función para volver a la galería
function volverAGaleria() {
    document.getElementById("infoCompletaContainer").style.display = "none";
    document.getElementById("galeriaPerfilesContainer").style.display = "block";
}

// Verificar si estamos en la página del perfil
function verificarYCargarPerfil() {
    // Solo intentar cargar si estamos en la página del perfil
    if (document.getElementById("profileNombre")) {
        cargarDatosPerfil();
    }
    
    // Si estamos en la página de galería
    if (document.getElementById("galeriaPerfilesContainer")) {
        cargarGaleriaPerfiles();
    }
}

// Función para ser llamada después de cargar contenido dinámico
function cargarPerfilDinamico() {
    // Usar un pequeño retraso para asegurar que el DOM esté actualizado
    setTimeout(verificarYCargarPerfil, 100);
}

// Listener para cuando la página se carga inicialmente
document.addEventListener("DOMContentLoaded", function() {
    agregarEstilosPerfilActual();
    verificarYCargarPerfil();
});

// Para contenido dinámico - llamar esta función cuando se cargue verPerfil.html
if (document.readyState === "complete" || document.readyState === "interactive") {
    verificarYCargarPerfil();
}

// Agregar estilos CSS para el perfil actual
function agregarEstilosPerfilActual() {
    if (!document.getElementById('estilosPerfilActual')) {
        const estilos = document.createElement('style');
        estilos.id = 'estilosPerfilActual';
        estilos.textContent = `
            .perfil-actual {
                position: relative;
                border: 3px solid #007bff !important;
                box-shadow: 0 0 15px rgba(0,123,255,0.5) !important;
                transform: scale(1.05);
                transition: all 0.3s ease;
            }
            .perfil-actual:hover {
                transform: scale(1.08);
            }
            .resumen-card {
                background-color: white;
                border-radius: 10px;
                padding: 20px;
                text-align: center;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                transition: transform 0.3s ease;
            }
            .resumen-photo {
                width: 120px;
                height: 120px;
                border-radius: 60px;
                object-fit: cover;
                margin: 0 auto;
                border: 2px solid #007bff;
            }
            .resumen-name {
                font-size: 18px;
                font-weight: bold;
                margin: 10px 0;
            }
            .badge-level {
                display: inline-block;
                background-color: #007bff;
                color: white;
                padding: 5px 10px;
                border-radius: 20px;
                font-size: 14px;
            }
        `;
        document.head.appendChild(estilos);
    }
}

// Exponer funciones para uso global
window.mostrarInfoCompleta = mostrarInfoCompleta;
window.volverAGaleria = volverAGaleria;
window.cargarPerfilDinamico = cargarPerfilDinamico;
window.verificarYCargarPerfil = verificarYCargarPerfil;

// Escuchar evento personalizado
window.addEventListener("cargarPerfilEvent", verificarYCargarPerfil);