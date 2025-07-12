
function iniciarCamara() {
    console.log("Iniciando cámara...");
    let stream = null;
    navigator.mediaDevices.getUserMedia({ video: true }).then(
        s => {
            stream = s
            document.getElementById("my_camera").srcObject = stream;
        }
    ).catch(error => {
        console.error(error)
    });
}

//validar si la camara esta disponible
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("La cámara no está disponible en este navegador.");
}

function tomarFoto() {
    console.log("tomando foto...");
    let video_res = document.getElementById("my_camera");
    let foto_res = document.getElementById("foto");
    let placeholder = document.getElementById("placeholder-foto");

    let ctx = foto_res.getContext("2d");
    ctx.drawImage(video_res, 0, 0, foto_res.width, foto_res.height);
    
    // Mostrar el canvas con la foto capturada
    foto_res.style.display = "block";
    placeholder.style.display = "none";
}

function cerrarCamara() {
    let video_res = document.getElementById("my_camera");
    if (video_res.srcObject) {
        let stream = video_res.srcObject;
        let tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video_res.srcObject = null;
    }
    
    // Resetear vista de foto
    document.getElementById("foto").style.display = "none";
    document.getElementById("placeholder-foto").style.display = "flex";
}