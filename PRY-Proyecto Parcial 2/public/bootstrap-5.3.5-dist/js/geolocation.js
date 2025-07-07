//geolocation

let geolocation = navigator.geolocation;

if (geolocation) {
    geolocation.getCurrentPosition(
        function (position) {
            let latitud = position.coords.latitude;
            let longitud = position.coords.longitude;

            var map = L.map('map').setView([latitud, longitud], 13);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
        })
} else {
    alert("No soporta la geolocalización");
}