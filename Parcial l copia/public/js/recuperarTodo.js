function crearCardPerfil(perfil, index) {
    return `
        <div class="col-md-4 mb-4">
            <div class="resumen-card" onclick="mostrarInfoCompleta(${index})" style="cursor:pointer;">
                <img src="${perfil.foto || ''}" alt="Foto" class="resumen-photo mb-3" id="resumenFoto${index}">
                <div class="resumen-name" id="resumenNombre${index}">${perfil.nombre || ''} ${perfil.apellido || ''}</div>
                <div class="badge-level">${perfil.nivel || ''}</div>
            </div>
        </div>
    `;
}

function cargarGaleriaPerfiles() {
    const container = document.getElementById("galeriaPerfilesContainer");
    const datos = JSON.parse(localStorage.getItem("datosFormulario")) || [];
    if (!container) return;

    if (!Array.isArray(datos) || datos.length === 0) {
        container.innerHTML = `<div class="alert alert-info text-center">No hay perfiles registrados.</div>`;
        return;
    }

    let html = '<div class="row">';
    datos.forEach((perfil, idx) => {
        html += crearCardPerfil(perfil, idx);
    });
    html += '</div>';
    container.innerHTML = html;
}

function mostrarInfoCompleta(index) {
    const datos = JSON.parse(localStorage.getItem("datosFormulario")) || [];
    const perfil = datos[index];
    if (!perfil) return;

    document.getElementById("galeriaPerfilesContainer").style.display = "none";
    document.getElementById("infoCompletaContainer").style.display = "block";

    document.getElementById("profilePhoto").src = perfil.foto || '';
    document.getElementById("profileNombre").textContent = perfil.nombre || '';
    document.getElementById("profileApellido").textContent = perfil.apellido || '';
    document.getElementById("profileCedula").textContent = perfil.cedula || '';
    document.getElementById("profileFechaNacimiento").textContent = perfil.fecha_nacimiento || '';

    document.getElementById("profileEmail").innerHTML = `<i class="fas fa-envelope me-2 text-primary"></i><span id="emailValue">${perfil.email || ''}</span>`;
    document.getElementById("profileTelefono").innerHTML = `<i class="fas fa-phone me-2 text-primary"></i><span id="telefonoValue">${perfil.telefono || ''}</span>`;
    document.getElementById("profileDireccion").innerHTML = `<i class="fas fa-map-marker-alt me-2 text-primary"></i><span id="direccionValue">${perfil.direccion || ''}</span>`;

    document.getElementById("profileNivel").innerHTML = `<i class="fas fa-language me-2 text-primary"></i><span id="nivelValue">${perfil.nivel || ''}</span>`;
    document.getElementById("profileHorario").innerHTML = `<i class="fas fa-clock me-2 text-primary"></i><span id="horarioValue">${perfil.horario || ''}</span>`;
    document.getElementById("profileComentarios").innerHTML = `<i class="fas fa-comment me-2 text-primary"></i><span id="comentariosValue">${perfil.comentarios || ''}</span>`;

    document.getElementById("profileLatitud").textContent = perfil.latitud || '';
    document.getElementById("profileLongitud").textContent = perfil.longitud || '';

    // Leaflet map
    const lat = parseFloat(perfil.latitud);
    const lng = parseFloat(perfil.longitud);
    const mapaDiv = document.getElementById("profileMap");
    if (!isNaN(lat) && !isNaN(lng) && mapaDiv && typeof L !== 'undefined') {
        // Limpieza del mapa si ya existe uno
        if (mapaDiv._leaflet_map) {
            mapaDiv._leaflet_map.remove();
            mapaDiv._leaflet_map = null;
        }
        mapaDiv.innerHTML = ""; // Limpia el contenido del div

        const map = L.map("profileMap").setView([lat, lng], 13);
        mapaDiv._leaflet_map = map; // Guarda la instancia para futuras limpiezas

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors"
        }).addTo(map);
        L.marker([lat, lng]).addTo(map)
            .bindPopup("Ubicación del alumno")
            .openPopup();
    } else if (mapaDiv) {
        mapaDiv.textContent = "Coordenadas inválidas o no proporcionadas.";
    }
}

function volverAGaleria() {
    document.getElementById("infoCompletaContainer").style.display = "none";
    document.getElementById("galeriaPerfilesContainer").style.display = "block";
}

document.addEventListener("DOMContentLoaded", cargarGaleriaPerfiles);

