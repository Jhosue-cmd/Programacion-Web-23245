// Exponer la función globalmente
window.obtenerUbicacion = function() {
    let geolocation = navigator.geolocation;
    
    if (geolocation) {
        geolocation.getCurrentPosition(
            function(position) {
                // Obtener coordenadas
                let latitud = position.coords.latitude;
                let longitud = position.coords.longitude;
                
                // Actualizar campos de formulario
                document.getElementById("latitud").value = latitud;
                document.getElementById("longitud").value = longitud;
                
                // Crear o actualizar el mapa
                const mapElement = document.getElementById('map');
                if (mapElement) {
                    // Limpiar el mapa anterior si existe
                    mapElement.innerHTML = '';
                    
                    // Crear nuevo mapa
                    var map = L.map('map').setView([latitud, longitud], 13);
                    
                    // Añadir capa de tiles de OpenStreetMap
                    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 19,
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    }).addTo(map);
                    
                    // Añadir marcador en la ubicación actual
                    L.marker([latitud, longitud])
                        .addTo(map)
                        .bindPopup('Tu ubicación actual')
                        .openPopup();
                    
                    // Forzar actualización del mapa
                    setTimeout(function() {
                        map.invalidateSize();
                    }, 100);
                } else {
                    console.error("Elemento del mapa no encontrado. Asegúrate de tener un elemento con id='map'");
                    alert("No se pudo mostrar el mapa. El elemento no existe en la página.");
                }
            },
            function(error) {
                console.error("Error al obtener la ubicación:", error);
                alert("No se pudo acceder a la ubicación. Error: " + error.message);
            }
        );
    } else {
        alert("Tu navegador no soporta geolocalización");
    }
};