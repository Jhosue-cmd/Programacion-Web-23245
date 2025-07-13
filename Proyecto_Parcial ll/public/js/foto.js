let strem = null;
let camaraInicializada = false;

// Función para inicializar la cámara solo cuando sea necesario
function inicializarCamara() {
    if (camaraInicializada) return; // Evitar inicializar múltiples veces
    
    const videoElement = document.getElementById("my_camara");
    if (!videoElement) return; // No hacer nada si el elemento no existe
    
    camaraInicializada = true;
    
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(s => {
            strem = s;
            videoElement.srcObject = strem;
        })
        .catch(error => {
            console.log("Error accediendo a la cámara:", error);
        });
}
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar cámara si el elemento existe
    if (document.getElementById("my_camara")) {
        inicializarCamara();
    }
    
    // Configurar el botón de tomar foto
    const btnCapturar = document.getElementById("btn_capturar");
    if (btnCapturar) {
        btnCapturar.addEventListener('click', tomarFoto);
    }
});

function tomarFoto() {
    let video_res = document.getElementById("my_camara");
    let foto_res = document.getElementById("foto");
    
    if (!video_res || !foto_res) {
        console.error("Elementos de cámara no encontrados");
        return;
    }
    
    let ctx = foto_res.getContext("2d");
    ctx.drawImage(video_res, 0, 0, foto_res.width, foto_res.height);
}

// Exponer una función para activar la cámara desde fuera
window.activarCamara = function() {
    inicializarCamara();
};