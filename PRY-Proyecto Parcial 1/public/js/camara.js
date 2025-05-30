let stream = null;
let camaraActiva = false;

// Función para inicializar la cámara
function inicializarCamara() {
    if (camaraActiva) return;
    
    // Validar si la cámara está disponible
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("La cámara no está disponible en este navegador.");
        return;
    }

    const videoElement = document.getElementById("my_camera");
    if (!videoElement) {
        console.error("Elemento de video no encontrado");
        return;
    }

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(s => {
            stream = s;
            videoElement.srcObject = stream;
            videoElement.style.display = 'block';
            camaraActiva = true;
            
            // Habilitar botón de tomar foto
            const btnFoto = document.getElementById("btn_foto");
            if (btnFoto) {
                btnFoto.disabled = false;
            }
            
            // Cambiar texto del botón
            const btnActivar = document.getElementById("btn_activar_camara");
            if (btnActivar) {
                btnActivar.textContent = "Cámara Activa";
                btnActivar.disabled = true;
            }
            
            console.log("Cámara activada correctamente");
        })
        .catch(error => {
            console.error("Error accediendo a la cámara:", error);
            alert("Error al acceder a la cámara: " + error.message);
        });
}

function tomarFoto() {
    if (!camaraActiva) {
        alert("Primero debes activar la cámara");
        return;
    }
    
    let video_res = document.getElementById("my_camera");
    let foto_res = document.getElementById("foto");

    if (!video_res || !foto_res) {
        console.error("Elementos de cámara no encontrados");
        return;
    }

    let ctx = foto_res.getContext("2d");
    ctx.drawImage(video_res, 0, 0, foto_res.width, foto_res.height);
    
    // Mostrar preview
    const preview = document.getElementById("photo");
    if (preview) {
        preview.src = foto_res.toDataURL('image/png');
        preview.classList.remove('d-none');
        foto_res.style.display = 'block';
        console.log("Foto tomada correctamente");
    }
}

function setupCamaraListeners() {
    // Activar cámara
    const btnActivar = document.getElementById("btn_activar_camara");
    if (btnActivar) {
        const btnActivarClone = btnActivar.cloneNode(true);
        btnActivar.parentNode.replaceChild(btnActivarClone, btnActivarClone.previousSibling || btnActivar);
        btnActivarClone.addEventListener('click', inicializarCamara);
    }

    // Tomar foto
    const btnFoto = document.getElementById("btn_foto");
    if (btnFoto) {
        btnFoto.removeEventListener('click', tomarFoto);
        btnFoto.addEventListener('click', tomarFoto);
    }
}
window.setupCamaraListeners = setupCamaraListeners;


// Exponer funciones globalmente
window.inicializarCamara = inicializarCamara;
window.tomarFoto = tomarFoto;