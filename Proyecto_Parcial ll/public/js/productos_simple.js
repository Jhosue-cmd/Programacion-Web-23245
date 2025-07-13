// productos_simple.js - Versión simplificada para debugging

// Variable global para almacenar la foto
window.fotoProductoActual = null;

// Función simple para activar cámara
async function activarCamaraSimple() {
    console.log('=== ACTIVAR CÁMARA SIMPLE ===');
    
    // Verificar si el navegador soporta getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('getUserMedia no está soportado en este navegador');
        alert('Su navegador no soporta acceso a la cámara');
        return;
    }
    
    console.log('getUserMedia disponible, verificando permisos...');
    
    try {
        // Verificar y obtener permisos
        const stream = await verificarPermisosCamara();
        
        if (!stream) {
            console.error('No se pudieron obtener permisos de cámara');
            return;
        }
        
        console.log('✅ Stream obtenido exitosamente');
        console.log('Stream details:', {
            id: stream.id,
            active: stream.active,
            videoTracks: stream.getVideoTracks().length,
            audioTracks: stream.getAudioTracks().length
        });
        
        // Configurar video element
        const video = document.getElementById('my_camara');
        if (!video) {
            console.error('Elemento video no encontrado');
            alert('Error: elemento de video no encontrado');
            // Detener stream si no hay video
            stream.getTracks().forEach(track => track.stop());
            return;
        }
        
        console.log('Configurando video element...');
        video.srcObject = stream;
        
        // Esperar a que el video esté listo
        await new Promise((resolve, reject) => {
            video.onloadedmetadata = () => {
                console.log('✅ Metadata del video cargada');
                console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
                resolve();
            };
            
            video.onerror = (error) => {
                console.error('Error en video element:', error);
                reject(error);
            };
            
            // Timeout de seguridad
            setTimeout(() => {
                if (video.readyState < 2) {
                    console.warn('Timeout esperando metadata del video');
                    resolve(); // Continuar de todos modos
                }
            }, 5000);
        });
        
        // Mostrar video
        video.style.display = 'block';
        console.log('✅ Video mostrado');
        
        // Mostrar botón de captura
        const btnCapturar = document.getElementById('btn_capturar');
        if (btnCapturar) {
            btnCapturar.style.display = 'inline-block';
            console.log('✅ Botón capturar mostrado');
        } else {
            console.error('Botón capturar no encontrado');
        }
        
        // Guardar stream globalmente
        window.streamActual = stream;
        console.log('Stream guardado globalmente');
        
        alert('🎬 ¡Cámara activada exitosamente! Ahora puedes capturar una foto.');
        
    } catch (error) {
        console.error('❌ Error al activar cámara:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        
        let mensajeError = '❌ Error al acceder a la cámara:\n\n';
        switch(error.name) {
            case 'NotAllowedError':
                mensajeError += '🚫 Permiso denegado.\n\nPor favor:\n1. Haz clic en el ícono de cámara en la barra de direcciones\n2. Selecciona "Permitir"\n3. Recarga la página e intenta de nuevo';
                break;
            case 'NotFoundError':
                mensajeError += '📹 No se encontró ninguna cámara conectada.\n\nVerifica que:\n• Tu dispositivo tenga una cámara\n• La cámara esté conectada correctamente';
                break;
            case 'NotReadableError':
                mensajeError += '🔒 La cámara está siendo usada por otra aplicación.\n\nCierra otras aplicaciones que puedan estar usando la cámara e intenta de nuevo.';
                break;
            case 'OverconstrainedError':
                mensajeError += '⚙️ La configuración de cámara solicitada no es compatible.\n\nEsto es un error técnico, intenta recargar la página.';
                break;
            case 'SecurityError':
                mensajeError += '🔐 Error de seguridad.\n\nPara usar la cámara:\n• Usa HTTPS o localhost\n• Permite permisos de cámara en tu navegador';
                break;
            default:
                mensajeError += error.message;
        }
        alert(mensajeError);
    }
}

// Función simple para capturar foto
function capturarFotoSimple() {
    console.log('=== CAPTURAR FOTO SIMPLE ===');
    
    try {
        const video = document.getElementById('my_camara');
        const canvas = document.getElementById('foto');
        
        if (!video) {
            console.error('Elemento de video no encontrado');
            alert('Elemento de video no encontrado');
            return;
        }
        
        if (!canvas) {
            console.error('Elemento canvas no encontrado');
            alert('Elemento canvas no encontrado');
            return;
        }
        
        console.log('Elementos encontrados - Video:', video, 'Canvas:', canvas);
        console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
        console.log('Video readyState:', video.readyState);
        
        if (video.readyState < 2) {
            console.error('Video no está listo');
            alert('La cámara no está lista. Espera un momento e intenta de nuevo.');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        console.log('Contexto 2D obtenido:', ctx);
        
        // Dibujar el frame actual del video en el canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        console.log('Imagen dibujada en canvas');
        
        // Obtener datos de la imagen
        const dataURL = canvas.toDataURL('image/jpeg', 0.8);
        console.log('DataURL generado, tamaño:', dataURL.length, 'caracteres');
        console.log('DataURL preview:', dataURL.substring(0, 100) + '...');
        
        if (dataURL.length < 100) {
            console.error('DataURL muy pequeño, posible error');
            alert('Error al capturar la imagen. Intenta de nuevo.');
            return;
        }
        
        window.fotoProductoActual = dataURL;
        console.log('✅ Foto guardada en variable global');
        
        // Mostrar canvas
        canvas.style.display = 'block';
        console.log('Canvas mostrado');
        
        // Ocultar video y detener stream
        video.style.display = 'none';
        if (window.streamActual) {
            console.log('Deteniendo stream...');
            window.streamActual.getTracks().forEach(track => {
                track.stop();
                console.log('Track detenido:', track.kind, track.label);
            });
            window.streamActual = null;
            console.log('Stream detenido y limpiado');
        }
        
        // Ocultar botón capturar
        const btnCapturar = document.getElementById('btn_capturar');
        if (btnCapturar) {
            btnCapturar.style.display = 'none';
            console.log('Botón capturar ocultado');
        }
        
        alert('✅ Foto capturada exitosamente');
        console.log('=== CAPTURA COMPLETADA ===');
        
    } catch (error) {
        console.error('❌ Error al capturar foto:', error);
        console.error('Stack trace:', error.stack);
        alert('Error al capturar foto: ' + error.message);
    }
}

// Función simple para subir archivo
function subirArchivoSimple() {
    console.log('=== SUBIR ARCHIVO SIMPLE ===');
    
    const input = document.getElementById('inputArchivoFoto');
    if (!input) {
        alert('Input de archivo no encontrado');
        return;
    }
    
    input.click();
}

// Función para manejar archivo seleccionado
function manejarArchivoSimple(event) {
    console.log('=== MANEJAR ARCHIVO SIMPLE ===');
    
    const file = event.target.files[0];
    if (!file) {
        console.log('No se seleccionó archivo');
        return;
    }
    
    console.log('Archivo seleccionado:');
    console.log('- Nombre:', file.name);
    console.log('- Tamaño:', file.size, 'bytes');
    console.log('- Tipo:', file.type);
    console.log('- Última modificación:', new Date(file.lastModified));
    
    // Verificar que es imagen
    if (!file.type.startsWith('image/')) {
        console.error('Archivo no es una imagen:', file.type);
        alert('Por favor seleccione un archivo de imagen');
        event.target.value = ''; // Limpiar el input
        return;
    }
    
    // Verificar tamaño (límite de 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        console.error('Archivo muy grande:', file.size, 'bytes');
        alert('El archivo es muy grande. Por favor seleccione una imagen menor a 10MB');
        event.target.value = ''; // Limpiar el input
        return;
    }
    
    console.log('✅ Archivo válido, iniciando lectura...');
    
    const reader = new FileReader();
    
    reader.onloadstart = function() {
        console.log('Iniciando lectura del archivo...');
    };
    
    reader.onprogress = function(e) {
        if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            console.log('Progreso de lectura:', Math.round(percentComplete) + '%');
        }
    };
    
    reader.onload = function(e) {
        console.log('✅ Archivo leído exitosamente');
        console.log('Tamaño del resultado:', e.target.result.length, 'caracteres');
        console.log('Tipo de resultado:', typeof e.target.result);
        console.log('Preview:', e.target.result.substring(0, 100) + '...');
        
        window.fotoProductoActual = e.target.result;
        console.log('Foto guardada en variable global');
        
        // Mostrar previsualización
        const img = document.getElementById('imagenArchivo');
        const contenedor = document.getElementById('previsualizacionArchivo');
        
        if (img && contenedor) {
            img.src = e.target.result;
            contenedor.style.display = 'block';
            console.log('✅ Previsualización mostrada');
            
            // Agregar información de la imagen
            img.onload = function() {
                console.log('Imagen cargada en preview:');
                console.log('- Dimensiones naturales:', img.naturalWidth, 'x', img.naturalHeight);
                console.log('- Dimensiones mostradas:', img.width, 'x', img.height);
            };
        } else {
            console.error('Elementos de previsualización no encontrados');
            console.log('img element:', img);
            console.log('contenedor element:', contenedor);
        }
        
        alert('✅ Archivo cargado exitosamente');
        console.log('=== ARCHIVO PROCESADO ===');
    };
    
    reader.onerror = function(e) {
        console.error('❌ Error al leer archivo:', e);
        console.error('Error code:', e.target.error.code);
        console.error('Error name:', e.target.error.name);
        alert('Error al leer el archivo: ' + e.target.error.name);
        event.target.value = ''; // Limpiar el input
    };
    
    reader.onabort = function() {
        console.log('Lectura de archivo abortada');
    };
    
    console.log('Iniciando FileReader.readAsDataURL...');
    reader.readAsDataURL(file);
}

// Función para verificar y solicitar permisos de cámara
async function verificarPermisosCamara() {
    console.log('=== VERIFICANDO PERMISOS DE CÁMARA ===');
    
    try {
        // Intentar obtener permisos primero
        if (navigator.permissions) {
            const result = await navigator.permissions.query({ name: 'camera' });
            console.log('Estado de permisos:', result.state);
            
            if (result.state === 'denied') {
                alert('⚠️ Los permisos de cámara están denegados. Por favor:\n1. Haz clic en el ícono de candado en la barra de direcciones\n2. Permite el acceso a la cámara\n3. Recarga la página');
                return false;
            }
        }
        
        // Intentar acceso directo
        console.log('Solicitando acceso a la cámara...');
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 300 },
                height: { ideal: 200 }
            } 
        });
        
        console.log('✅ Permisos otorgados, stream obtenido');
        return stream;
        
    } catch (error) {
        console.error('❌ Error en permisos:', error);
        return false;
    }
}

// Función de test manual para la cámara
window.testCamara = async function() {
    console.log('🧪 TEST MANUAL DE CÁMARA');
    
    try {
        console.log('1. Verificando soporte...');
        if (!navigator.mediaDevices) {
            console.error('❌ navigator.mediaDevices no disponible');
            return;
        }
        
        console.log('2. Solicitando stream...');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log('✅ Stream obtenido:', stream);
        
        console.log('3. Buscando elemento video...');
        const video = document.getElementById('my_camara');
        if (!video) {
            console.error('❌ Elemento video no encontrado');
            stream.getTracks().forEach(track => track.stop());
            return;
        }
        
        console.log('4. Configurando video...');
        video.srcObject = stream;
        video.style.display = 'block';
        
        console.log('✅ TEST EXITOSO - Cámara funcionando');
        window.streamActual = stream;
        
        // Mostrar botón capturar
        const btnCapturar = document.getElementById('btn_capturar');
        if (btnCapturar) {
            btnCapturar.style.display = 'inline-block';
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ TEST FALLIDO:', error);
        return false;
    }
};

// Función para test de captura
window.testCaptura = function() {
    console.log('🧪 TEST MANUAL DE CAPTURA');
    
    const video = document.getElementById('my_camara');
    const canvas = document.getElementById('foto');
    
    if (!video || !canvas) {
        console.error('❌ Elementos no encontrados');
        return false;
    }
    
    if (video.readyState < 2) {
        console.error('❌ Video no está listo');
        return false;
    }
    
    try {
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataURL = canvas.toDataURL('image/jpeg', 0.8);
        window.fotoProductoActual = dataURL;
        
        canvas.style.display = 'block';
        video.style.display = 'none';
        
        if (window.streamActual) {
            window.streamActual.getTracks().forEach(track => track.stop());
        }
        
        console.log('✅ CAPTURA EXITOSA - Foto guardada');
        console.log('Tamaño de foto:', Math.round(dataURL.length/1024) + 'KB');
        
        return true;
        
    } catch (error) {
        console.error('❌ ERROR EN CAPTURA:', error);
        return false;
    }
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== INICIALIZACIÓN SIMPLE ===');
    
    setTimeout(() => {
        // Configurar botón guardar usando la función global
        const btnGuardar = document.getElementById('btnGuardarProducto');
        if (btnGuardar) {
            btnGuardar.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Botón guardar clickeado - usando función global');
                window.guardarProductoSimple();
            };
            console.log('Botón guardar configurado');
        } else {
            console.error('Botón guardar no encontrado');
        }
        
        // Configurar botón cámara
        const btnCamara = document.getElementById('btnActivarCamara');
        if (btnCamara) {
            // Remover eventos anteriores
            btnCamara.onclick = null;
            btnCamara.removeEventListener('click', activarCamaraSimple);
            
            // Agregar nuevo evento
            btnCamara.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎬 CLICK EN BOTÓN CÁMARA DETECTADO');
                activarCamaraSimple();
            });
            console.log('Botón cámara configurado con addEventListener');
        } else {
            console.error('Botón cámara no encontrado en configuración');
        }
        
        // Configurar botón capturar
        const btnCapturar = document.getElementById('btn_capturar');
        if (btnCapturar) {
            btnCapturar.onclick = function(e) {
                e.preventDefault();
                capturarFotoSimple();
            };
            console.log('Botón capturar configurado');
        }
        
        // Configurar botón archivo
        const btnArchivo = document.getElementById('btnSubirArchivo');
        if (btnArchivo) {
            btnArchivo.onclick = function(e) {
                e.preventDefault();
                subirArchivoSimple();
            };
            console.log('Botón archivo configurado');
        }
        
        // Configurar input archivo
        const inputArchivo = document.getElementById('inputArchivoFoto');
        if (inputArchivo) {
            inputArchivo.onchange = manejarArchivoSimple;
            console.log('Input archivo configurado');
        }
        
        console.log('Inicialización simple completada');
        
    }, 500);
});

// Exponer funciones globalmente para acceso desde cualquier contexto
console.log('Exponiendo funciones globalmente...');
window.activarCamaraSimple = activarCamaraSimple;
window.capturarFotoSimple = capturarFotoSimple;
window.manejarArchivoSimple = manejarArchivoSimple;
window.subirArchivoSimple = subirArchivoSimple;
console.log('✅ Funciones expuestas globalmente');
