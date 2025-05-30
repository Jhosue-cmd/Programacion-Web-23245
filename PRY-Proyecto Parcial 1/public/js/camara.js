let stream = null;
navigator.mediaDevices.getUserMedia({ video: true }).then(
    s => {
        stream = s
        document.getElementById("my_camera").srcObject = stream;

    }
    ).catch(error => {
        console.error(error)
    });
//validar si la camara esta disponible
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("La cámara no está disponible en este navegador.");
}

function tomarFoto() {
    let video_res = document.getElementById("my_camera");
    let foto_res = document.getElementById("foto");

    let ctx = foto_res.getContext("2d");
    ctx.drawImage(video_res, 0, 0, foto_res.width, foto_res.height);
    
}