// fotoProductos.js - Integración del sistema de fotos con gestión de productos

class FotoProductos {
    constructor() {
        this.fotoActual = null;
        this.tipoFoto = null; // 'camara' o 'archivo'
        this.streamActual = null;
        this.inicializar();
    }

    inicializar() {
        // Esperar un poco para que el DOM esté listo
        setTimeout(() => {
            this.configurarEventos();
        }, 100);
    }

    configurarEventos() {
        // Botón para activar cámara
        const btnActivarCamara = document.getElementById('btnActivarCamara');
        if (btnActivarCamara) {
            btnActivarCamara.addEventListener('click', () => {
                console.log('Botón activar cámara clickeado');
                this.activarCamara();
            });
        } else {
            console.log('Botón activar cámara no encontrado');
        }

        // Botón para capturar foto
        const btnCapturar = document.getElementById('btn_capturar');
        if (btnCapturar) {
            btnCapturar.addEventListener('click', () => {
                console.log('Botón capturar clickeado');
                this.capturarFoto();
            });
        }

        // Botón para subir archivo
        const btnSubirArchivo = document.getElementById('btnSubirArchivo');
        if (btnSubirArchivo) {
            btnSubirArchivo.addEventListener('click', () => {
                console.log('Botón subir archivo clickeado');
                this.abrirSelectorArchivo();
            });
        } else {
            console.log('Botón subir archivo no encontrado');
        }

        // Input de archivo
        const inputArchivo = document.getElementById('inputArchivoFoto');
        if (inputArchivo) {
            inputArchivo.addEventListener('change', (e) => {
                console.log('Archivo seleccionado');
                this.manejarArchivoSubido(e);
            });
        }

        // Botón para eliminar foto
        const btnEliminarFoto = document.getElementById('btnEliminarFoto');
        if (btnEliminarFoto) {
            btnEliminarFoto.addEventListener('click', () => this.eliminarFoto());
        }

        // Botón para nueva foto
        const btnNuevaFoto = document.getElementById('btnNuevaFoto');
        if (btnNuevaFoto) {
            btnNuevaFoto.addEventListener('click', () => this.nuevaFoto());
        }
    }

    async activarCamara() {
        try {
            console.log('Intentando activar cámara...');
            const video = document.getElementById('my_camara');
            const btnCapturar = document.getElementById('btn_capturar');
            
            if (!video) {
                console.error('Elemento de video no encontrado');
                alert('Error: No se encontró el elemento de video');
                return;
            }

            // Solicitar permisos de cámara
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 300 },
                    height: { ideal: 200 }
                } 
            });
            
            console.log('Stream obtenido:', stream);
            this.streamActual = stream;
            
            video.srcObject = stream;
            video.style.display = 'block';
            
            if (btnCapturar) {
                btnCapturar.style.display = 'inline-block';
            }
            
            this.ocultarOtrosElementos();
            
            // Reproducir el video
            video.play().catch(e => {
                console.error('Error al reproducir video:', e);
            });
            
            console.log('Cámara activada correctamente');
            
        } catch (error) {
            console.error('Error al acceder a la cámara:', error);
            let mensaje = 'No se pudo acceder a la cámara. ';
            
            if (error.name === 'NotAllowedError') {
                mensaje += 'Permisos denegados. Por favor, permite el acceso a la cámara.';
            } else if (error.name === 'NotFoundError') {
                mensaje += 'No se encontró ninguna cámara en el dispositivo.';
            } else if (error.name === 'NotSupportedError') {
                mensaje += 'El navegador no soporta el acceso a la cámara.';
            } else {
                mensaje += 'Error: ' + error.message;
            }
            
            alert(mensaje);
        }
    }

    capturarFoto() {
        try {
            console.log('Capturando foto...');
            const video = document.getElementById('my_camara');
            const canvas = document.getElementById('foto');
            
            if (!video || !canvas) {
                console.error('Elementos de video o canvas no encontrados');
                alert('Error: No se encontraron los elementos necesarios para capturar la foto');
                return;
            }

            // Capturar imagen del video al canvas
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Mostrar canvas y ocultar video
            canvas.style.display = 'block';
            video.style.display = 'none';
            document.getElementById('btn_capturar').style.display = 'none';

            // Obtener datos de la imagen
            this.fotoActual = canvas.toDataURL('image/jpeg', 0.8);
            this.tipoFoto = 'camara';

            console.log('Foto capturada, tamaño:', this.fotoActual.length);

            // Detener cámara
            this.detenerCamara();

            // Mostrar controles
            this.mostrarControles();
            
        } catch (error) {
            console.error('Error al capturar foto:', error);
            alert('Error al capturar la foto: ' + error.message);
        }
    }

    abrirSelectorArchivo() {
        console.log('Abriendo selector de archivo...');
        const inputArchivo = document.getElementById('inputArchivoFoto');
        if (inputArchivo) {
            inputArchivo.click();
        } else {
            console.error('Input de archivo no encontrado');
            alert('Error: No se encontró el selector de archivos');
        }
    }

    manejarArchivoSubido(event) {
        try {
            console.log('Manejando archivo subido...');
            const file = event.target.files[0];
            if (!file) {
                console.log('No se seleccionó ningún archivo');
                return;
            }

            console.log('Archivo seleccionado:', file.name, 'Tipo:', file.type, 'Tamaño:', file.size);

            // Validar que sea una imagen
            if (!file.type.startsWith('image/')) {
                alert('Por favor, seleccione un archivo de imagen válido (JPG, PNG, GIF, etc.).');
                return;
            }

            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('El archivo es demasiado grande. Máximo 5MB.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                console.log('Archivo leído correctamente');
                this.fotoActual = e.target.result;
                this.tipoFoto = 'archivo';
                this.mostrarPrevisualizacionArchivo(e.target.result);
                this.ocultarOtrosElementos();
                this.mostrarControles();
            };
            
            reader.onerror = (e) => {
                console.error('Error al leer archivo:', e);
                alert('Error al leer el archivo. Intente con otro archivo.');
            };
            
            reader.readAsDataURL(file);
            
        } catch (error) {
            console.error('Error al manejar archivo:', error);
            alert('Error al procesar el archivo: ' + error.message);
        }
    }

    mostrarPrevisualizacionArchivo(dataUrl) {
        const contenedor = document.getElementById('previsualizacionArchivo');
        const imagen = document.getElementById('imagenArchivo');
        
        if (contenedor && imagen) {
            imagen.src = dataUrl;
            contenedor.style.display = 'block';
            console.log('Previsualización de archivo mostrada');
        } else {
            console.error('Elementos de previsualización no encontrados');
        }
    }

    eliminarFoto() {
        console.log('Eliminando foto...');
        this.fotoActual = null;
        this.tipoFoto = null;
        this.ocultarTodosElementos();
        this.ocultarControles();
        this.detenerCamara();
        
        // Limpiar input de archivo
        const inputArchivo = document.getElementById('inputArchivoFoto');
        if (inputArchivo) {
            inputArchivo.value = '';
        }
    }

    nuevaFoto() {
        console.log('Tomando nueva foto...');
        this.eliminarFoto();
        // Reactivar la cámara
        setTimeout(() => this.activarCamara(), 100);
    }

    detenerCamara() {
        console.log('Deteniendo cámara...');
        if (this.streamActual) {
            const tracks = this.streamActual.getTracks();
            tracks.forEach(track => {
                track.stop();
                console.log('Track detenido:', track.kind);
            });
            this.streamActual = null;
        }
        
        const video = document.getElementById('my_camara');
        if (video) {
            video.srcObject = null;
        }
    }

    ocultarOtrosElementos() {
        const elementos = ['previsualizacionArchivo'];
        
        if (this.tipoFoto === 'archivo') {
            elementos.push('my_camara', 'foto', 'btn_capturar');
        } else if (this.tipoFoto === 'camara') {
            elementos.push('previsualizacionArchivo');
        }

        elementos.forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento && id !== (this.tipoFoto === 'archivo' ? 'previsualizacionArchivo' : 'foto')) {
                elemento.style.display = 'none';
            }
        });
    }

    ocultarTodosElementos() {
        const elementos = ['my_camara', 'foto', 'btn_capturar', 'previsualizacionArchivo'];
        elementos.forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.style.display = 'none';
            }
        });
    }

    mostrarControles() {
        const controles = document.getElementById('controlesFoto');
        if (controles) {
            controles.style.display = 'block';
        }
    }

    ocultarControles() {
        const controles = document.getElementById('controlesFoto');
        if (controles) {
            controles.style.display = 'none';
        }
    }

    // Método para obtener la foto actual (usado por gestionProductos.js)
    obtenerFoto() {
        return this.fotoActual;
    }

    // Método para cargar una foto existente (para editar)
    cargarFotoExistente(fotoUrl) {
        if (fotoUrl) {
            const imagenActual = document.getElementById('imagenActual');
            if (imagenActual) {
                imagenActual.src = fotoUrl;
                document.getElementById('fotoActual').style.display = 'block';
            }
        } else {
            const fotoActual = document.getElementById('fotoActual');
            if (fotoActual) {
                fotoActual.style.display = 'none';
            }
        }
    }

    // Método para limpiar todo
    limpiarTodo() {
        this.eliminarFoto();
        
        // En modo edición, mostrar foto actual si existe
        const imagenActual = document.getElementById('imagenActual');
        if (imagenActual && imagenActual.src) {
            const fotoActual = document.getElementById('fotoActual');
            if (fotoActual) {
                fotoActual.style.display = 'block';
            }
        }
    }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando FotoProductos...');
    // Solo inicializar si estamos en una página de productos
    if (document.getElementById('btnActivarCamara')) {
        console.log('Elementos de foto encontrados, creando instancia...');
        window.fotoProductos = new FotoProductos();
    } else {
        console.log('No se encontraron elementos de foto, esperando...');
        // Si no se encuentran los elementos, intentar de nuevo en un momento
        setTimeout(() => {
            if (document.getElementById('btnActivarCamara')) {
                console.log('Elementos encontrados en segundo intento, creando instancia...');
                window.fotoProductos = new FotoProductos();
            }
        }, 1000);
    }
});

// También intentar cuando se carga la ventana por si acaso
window.addEventListener('load', function() {
    if (!window.fotoProductos && document.getElementById('btnActivarCamara')) {
        console.log('Creando instancia en window.load...');
        window.fotoProductos = new FotoProductos();
    }
});
