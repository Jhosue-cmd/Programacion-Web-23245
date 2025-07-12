// Variable global para el mapa
let mapInstance = null;

// Función para limpiar y recrear el mapa
function limpiarMapa() {
    if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
    }
    document.getElementById('map').innerHTML = '';
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let latitud = position.coords.latitude;
            let longitud = position.coords.longitude;

            document.getElementById("locationInfo").textContent = `Latitud: ${latitud}, Longitud: ${longitud}`;

            limpiarMapa();
            mapInstance = L.map('map').setView([latitud, longitud], 13);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(mapInstance);
            L.marker([latitud, longitud]).addTo(mapInstance)
                .bindPopup('Tu ubicación actual.')
                .openPopup();
        });
    } else {
        alert("No soporta la geolocalización");
    }
}

function verUbicacion() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let latitud = position.coords.latitude;
            let longitud = position.coords.longitude;

            limpiarMapa();
            mapInstance = L.map('map').setView([latitud, longitud], 13);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(mapInstance);
            L.marker([latitud, longitud]).addTo(mapInstance)
                .bindPopup('Ubicación guardada.')
                .openPopup();
        });
    } else {
        alert("No soporta la geolocalización");
    }
}

function abrirModalUbicacion() {
    document.getElementById("loadingLocation").style.display = "block";
    document.getElementById("locationContent").style.display = "none";
    limpiarMapa();
}

function getLocationForModal() {
    if (navigator.geolocation) {
        document.getElementById("loadingLocation").style.display = "block";
        document.getElementById("locationContent").style.display = "none";
        
        limpiarMapa();

        navigator.geolocation.getCurrentPosition(
            function (position) {
                let latitud = position.coords.latitude;
                let longitud = position.coords.longitude;
                let precision = position.coords.accuracy;

                document.getElementById("latitudDisplay").textContent = latitud.toFixed(6);
                document.getElementById("longitudDisplay").textContent = longitud.toFixed(6);
                document.getElementById("precisionDisplay").textContent = Math.round(precision);

                document.getElementById("loadingLocation").style.display = "none";
                document.getElementById("locationContent").style.display = "block";

                setTimeout(() => {
                    mapInstance = L.map('map').setView([latitud, longitud], 15);
                    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 19,
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    }).addTo(mapInstance);
                    L.marker([latitud, longitud]).addTo(mapInstance)
                        .bindPopup('Tu ubicación actual')
                        .openPopup();
                }, 100);
            },
            function (error) {
                document.getElementById("loadingLocation").style.display = "none";
                let errorMessage = "";
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Acceso a la ubicación denegado.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Información de ubicación no disponible.";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Tiempo de espera agotado.";
                        break;
                    default:
                        errorMessage = "Error desconocido.";
                        break;
                }
                alert(errorMessage);
            }
        );
    } else {
        alert("Tu navegador no soporta la geolocalización");
    }
}