let geolocation = navigator.geolocation;

if (geolocation) {
    geolocation.getCurrentPosition(
        function (position) {
            let latitud = position.coords.latitude;
            let longitud = position.coords.longitude;

            const locationInfo = document.getElementById("locationInfo");
            if (locationInfo) {
                locationInfo.textContent = `Latitud: ${latitud}, Longitud: ${longitud}`;
            } else {
                console.error("Elemento 'locationInfo' no encontrado");
            }

            const mapElement = document.getElementById('map');
            if (mapElement) {
                var map = L.map('map').setView([latitud, longitud], 13);

                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(map);

                L.marker([latitud, longitud]).addTo(map)
                    .bindPopup('Tu ubicación actual.')
                    .openPopup();
            } else {
                console.error("Elemento 'map' no encontrado");
            }
        },
        function (error) {
            console.error("Error al obtener la ubicación:", error);
            alert("No se pudo acceder a la ubicación. Error: " + error.message);
        }
    );
} else {
    alert("Tu navegador no soporta geolocalización");
}