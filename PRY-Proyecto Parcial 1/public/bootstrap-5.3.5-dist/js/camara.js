 let stream=null
 
 navigator.mediaDevices.getUserMedia({ video: true }).then(
    
    s=>{
        stream = s;
        document.getElementById("my_camara").srcObject = stream;


    }
    



   
);

function tomarFoto() {
   let video_res=  document.getElementById("my_camara");
   let foto_res = document.getElementById("foto");

    let ctx= foto_res.getContext("2d");

    ctx.drawImage(video_res, 0, 0, foto_res.width, foto_res.height);
}

 


