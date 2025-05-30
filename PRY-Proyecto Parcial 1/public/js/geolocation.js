function getLocation() {
    let geolocation = navigator.geolocation;

    if (geolocation) {
        geolocation.getCurrentPosition(
            function (position) {
                let latitud = position.coords.latitude;
                let longitud = position.coords.longitude;

                document.getElementById("locationInfo").textContent = `Latitud: ${latitud}, Longitud: ${longitud}`;

                var map = L.map('map').setView([latitud, longitud], 13);

                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(map);
                L.marker([latitud, longitud]).addTo(map)
                    .bindPopup('Tu ubicación actual.')
                    .openPopup();
            })
    } else {
        alert("No soporta la geolocalización");
    }
}
