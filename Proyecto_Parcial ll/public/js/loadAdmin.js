fetch("menu_Admin.html")
  .then(res => res.text())
  .then(data => document.getElementById("header_admin").innerHTML = data);

fetch("footerAdmin.html")
  .then(res => res.text())
  .then(data => document.getElementById("footerAdmin").innerHTML = data);

// Función global para cargar páginas de administración
window.cargarPaginasAdmin = function cargarPaginasAdmin(url_pagina) {
    console.log(`🔄 Navegando a: ${url_pagina}`);
    
    fetch(`paginasAdmin/${url_pagina}.html`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Error HTTP: ${res.status}`);
            }
            return res.text();
        })
        .then(data => {
            console.log(`✅ Página ${url_pagina} cargada exitosamente`);
            
            // Reemplazar rutas relativas con rutas absolutas
            const contenidoModificado = data.replace(/src="\.\.\/img\//g, 'src="./img/');
            
            const principalElement = document.getElementById('principal');
            if (!principalElement) {
                console.error('❌ Elemento principal no encontrado');
                return;
            }
            
            principalElement.innerHTML = contenidoModificado;
            console.log(`📄 Contenido insertado en elemento principal`);
            
            // Cargar scripts específicos después de cargar el contenido
            if (url_pagina === "verPerfiles") {
                // Inicializar tabla de usuarios
                setTimeout(() => {
                    if (typeof window.inicializarTablaUsuarios === 'function') {
                        console.log('🔄 Inicializando tabla de usuarios...');
                        window.inicializarTablaUsuarios();
                    }
                }, 100);
                
                // Llama directamente a cargarGaleriaPerfiles si existe
                if (typeof window.cargarGaleriaPerfiles === 'function') {
                    window.cargarGaleriaPerfiles();
                } else {
                    // Si el script aún no está cargado, cárgalo y luego llama a la función
                    const script = document.createElement('script');
                    script.src = './public/js/recuperarTodo.js';
                    script.onload = () => window.cargarGaleriaPerfiles();
                    document.body.appendChild(script);
                }
            } else if (url_pagina === "gestionProductos") {
                // NO cargar el script problemático, usar solo nuestra función simple
                console.log('📦 Cargando gestión de productos (modo simple)...');
                
                // Limpiar cualquier timeout anterior
                if (window.timeoutGestion) {
                    clearTimeout(window.timeoutGestion);
                }

                // Forzar actualización de datos antes de cargar la página
                if (window.gestionProductos) {
                    console.log('🔄 Forzando actualización de datos...');
                    window.gestionProductos.productos = window.gestionProductos.cargarProductos();
                }
                
                // Usar solo función simple con mejor manejo de errores
                window.timeoutGestion = setTimeout(() => {
                    try {
                        console.log('🔍 Verificando elementos DOM...');
                        
                        // Verificar que los elementos existen
                        const tbody = document.getElementById('tablaProductos');
                        const totalElement = document.getElementById('totalProductos');
                        
                        console.log('Elementos encontrados:', {
                            tabla: !!tbody,
                            total: !!totalElement,
                            html: document.body.innerHTML.includes('gestionProductos') ? 'Página cargada' : 'Página no cargada'
                        });
                        
                        if (!tbody) {
                            console.error('❌ Tabla de productos no encontrada, reintentando...');
                            // Reintentar después de un momento
                            setTimeout(() => {
                                if (typeof window.cargarProductosSimple === 'function') {
                                    window.cargarProductosSimple();
                                }
                            }, 500);
                            return;
                        }

                        // Inicializar gestión de productos si está disponible
                        if (window.gestionProductos) {
                            console.log('🔄 Inicializando gestión de productos...');
                            window.gestionProductos.inicializarGestion();
                        }

                        // Forzar actualización inmediata
                        if (typeof window.actualizarGestionProductos === 'function') {
                            console.log('🔥 Forzando actualización inmediata...');
                            window.actualizarGestionProductos();
                        }
                        
                        if (typeof window.cargarProductosSimple === 'function') {
                            console.log('🔄 Cargando productos con función simple...');
                            const resultado = window.cargarProductosSimple();
                            console.log('Resultado de carga:', resultado);
                        } else {
                            console.error('❌ Función cargarProductosSimple no disponible');
                        }
                        
                    } catch (error) {
                        console.error('❌ Error al cargar productos:', error);
                        console.error('Stack:', error.stack);
                    }
                    
                    // Actualizar estadísticas automáticamente después de cargar
                    setTimeout(() => {
                        if (typeof window.actualizarEstadisticas === 'function') {
                            console.log('📊 Actualizando estadísticas automáticamente...');
                            window.actualizarEstadisticas();
                        }
                    }, 300);
                }, 500);
                
                // FORZAR funciones globales inmediatamente
                console.log('🔧 Configurando funciones globales...');
                window.editarProducto = function(id) {
                    console.log('📝 Editando producto (función SIMPLE):', id);
                    localStorage.setItem('productoEditando', id);
                    if (typeof window.cargarPaginasAdmin === 'function') {
                        window.cargarPaginasAdmin('editarProducto');
                    } else {
                        window.location.href = 'editarProducto.html';
                    }
                };
                
                window.eliminarProducto = function(id) {
                    console.log('🗑️ Eliminando producto (función SIMPLE):', id);
                    const productos = JSON.parse(localStorage.getItem('productos') || '[]');
                    const producto = productos.find(p => p.id === id);
                    
                    if (!producto) {
                        alert('Producto no encontrado');
                        return;
                    }
                    
                    if (confirm(`¿Estás seguro de que quieres eliminar "${producto.nombre}"?`)) {
                        const productosActualizados = productos.filter(p => p.id !== id);
                        localStorage.setItem('productos', JSON.stringify(productosActualizados));
                        
                        console.log('✅ Producto eliminado:', producto.nombre);
                        alert('Producto eliminado exitosamente');
                        
                        // Recargar la tabla
                        if (typeof window.cargarProductosSimple === 'function') {
                            window.cargarProductosSimple();
                        }
                    }
                };
                
                console.log('✅ Funciones globales configuradas correctamente');
            } else if (url_pagina === "crearProducto" || url_pagina === "editarProducto") {
                // Temporal: usar versión simplificada para debugging
                console.log('Cargando página de productos - modo debugging simple');
                
                // Si es editar producto, cargar los datos del producto
                if (url_pagina === "editarProducto") {
                    setTimeout(() => {
                        const idProducto = localStorage.getItem('productoEditando');
                        if (idProducto) {
                            console.log('🔄 Cargando datos para editar producto:', idProducto);
                            window.cargarDatosProductoParaEditar(idProducto);
                        }
                        
                        // Configurar botón de actualizar para usar nuestra función
                        const btnActualizar = document.getElementById('btnActualizarProducto');
                        if (btnActualizar) {
                            console.log('🔧 Configurando botón actualizar...');
                            // Remover eventos anteriores
                            btnActualizar.onclick = null;
                            
                            // Agregar nuestro evento
                            btnActualizar.addEventListener('click', function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('📝 BOTÓN ACTUALIZAR CLICKEADO - Usando guardarProductoSimple');
                                
                                if (typeof window.guardarProductoSimple === 'function') {
                                    window.guardarProductoSimple();
                                } else {
                                    console.error('guardarProductoSimple no disponible');
                                    alert('Error: Función de guardado no disponible');
                                }
                            });
                            console.log('✅ Botón actualizar configurado correctamente');
                        } else {
                            console.error('❌ Botón actualizar no encontrado');
                        }
                    }, 1000);
                }
                
                // Re-inicializar botones automáticamente después de cargar la página
                setTimeout(() => {
                    if (typeof window.reiniciarBotones === 'function') {
                        console.log('🔄 Auto-inicializando botones de productos...');
                        window.reiniciarBotones();
                    }
                }, 1000);
                
                // NO cargar scripts complejos por ahora
                /*
                const scripts = [
                    { src: './public/js/foto.js', loaded: false },
                    { src: './public/js/fotoProductos.js', loaded: false },
                    { src: './public/js/gestionProductos.js', loaded: false }
                ];
                */
            }       
            
        })
        .catch(error => {
            console.error('❌ Error al cargar la página:', error);
            console.error('URL solicitada:', `paginasAdmin/${url_pagina}.html`);
            console.error('Stack trace:', error.stack);
            
            // Mostrar mensaje de error al usuario
            const principalElement = document.getElementById('principal');
            if (principalElement) {
                principalElement.innerHTML = `
                    <div class="alert alert-danger m-4">
                        <h4><i class="fas fa-exclamation-triangle"></i> Error al cargar la página</h4>
                        <p><strong>Página:</strong> ${url_pagina}</p>
                        <p><strong>Error:</strong> ${error.message}</p>
                        <button class="btn btn-primary" onclick="window.location.reload()">
                            <i class="fas fa-refresh"></i> Recargar Página
                        </button>
                    </div>
                `;
            }
        });
};

// Función para cargar páginas desde cualquier directorio
window.cargarPaginaGeneral = function(ruta_pagina) {
    fetch(`${ruta_pagina}.html`)
        .then(res => res.text())
        .then(data => {
            // Reemplazar rutas relativas con rutas absolutas
            const contenidoModificado = data.replace(/src="\.\.\/img\//g, 'src="./img/');
            document.getElementById('principal').innerHTML = contenidoModificado;
        })
        .catch(error => {
            console.error('Error al cargar la página:', error);
        });
};

// Funciones de debugging globales para productos
window.debugSimple = function() {
    console.log('=== DEBUG SIMPLE ===');
    console.log('fotoProductoActual:', window.fotoProductoActual ? 'Existe (' + Math.round(window.fotoProductoActual.length/1024) + 'KB)' : 'No existe');
    console.log('localStorage productos:', localStorage.getItem('productos'));
    
    // Información del navegador y permisos
    console.log('Navigator.mediaDevices:', !!navigator.mediaDevices);
    console.log('getUserMedia support:', !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));
    console.log('HTTPS:', location.protocol === 'https:');
    console.log('Localhost:', location.hostname === 'localhost' || location.hostname === '127.0.0.1');
    
    const elementos = [
        'btnGuardarProducto', 'btnActivarCamara', 'btn_capturar', 
        'btnSubirArchivo', 'inputArchivoFoto', 'nombreProducto', 
        'precioProducto', 'cantidadProducto', 'my_camara', 'foto', 
        'imagenArchivo', 'previsualizacionArchivo'
    ];
    
    elementos.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            const info = {
                found: true,
                type: elemento.tagName,
                visible: elemento.style.display !== 'none',
                hasContent: elemento.value || elemento.src || elemento.textContent
            };
            console.log(`${id}:`, info);
        } else {
            console.log(`${id}: NO ENCONTRADO`);
        }
    });
    
    // Verificar permisos de cámara si es posible
    if (navigator.permissions) {
        navigator.permissions.query({ name: 'camera' }).then(result => {
            console.log('Permiso de cámara:', result.state);
        }).catch(err => {
            console.log('No se pudo verificar permiso de cámara:', err.message);
        });
    }
};

window.limpiarTodoSimple = function() {
    localStorage.removeItem('productos');
    window.fotoProductoActual = null;
    console.log('Todo limpiado');
};

window.probarFormulario = function() {
    const nombreEl = document.getElementById('nombreProducto');
    const precioEl = document.getElementById('precioProducto');
    const cantidadEl = document.getElementById('cantidadProducto');
    const descripcionEl = document.getElementById('descripcionProducto');
    
    if (nombreEl && precioEl && cantidadEl) {
        nombreEl.value = 'Producto Test ' + Date.now();
        precioEl.value = '15.99';
        cantidadEl.value = '10';
        if (descripcionEl) descripcionEl.value = 'Producto de prueba automática';
        console.log('Formulario llenado para prueba');
        
        // Actualizar estado si existe la función
        if (typeof actualizarEstado === 'function') {
            actualizarEstado('Formulario llenado para prueba');
        }
    } else {
        console.error('Elementos del formulario no encontrados');
        alert('Esta función solo funciona en las páginas de productos');
    }
};

// Función simple para guardar producto (disponible globalmente)
window.guardarProductoSimple = function() {
    console.log('=== GUARDAR PRODUCTO SIMPLE ===');
    
    try {
        // Verificar si estamos editando
        const idEditando = localStorage.getItem('productoEditando');
        const esEdicion = !!idEditando;
        console.log('Modo:', esEdicion ? 'EDICIÓN' : 'CREACIÓN');
        if (esEdicion) console.log('ID editando:', idEditando);
        
        // DEBUG: Verificar estado de localStorage
        console.log('🔍 DEBUG - Estado localStorage:');
        console.log('- productoEditando:', localStorage.getItem('productoEditando'));
        console.log('- productos count:', JSON.parse(localStorage.getItem('productos') || '[]').length);
        
        // Obtener valores del formulario
        const nombre = document.getElementById('nombreProducto')?.value?.trim();
        const precio = parseFloat(document.getElementById('precioProducto')?.value);
        const cantidad = parseInt(document.getElementById('cantidadProducto')?.value);
        const descripcion = document.getElementById('descripcionProducto')?.value?.trim();
        
        console.log('Datos formulario:', { nombre, precio, cantidad, descripcion });
        
        // Validaciones básicas
        if (!nombre) {
            alert('El nombre del producto es obligatorio');
            return false;
        }
        
        if (!precio || precio <= 0) {
            alert('El precio debe ser mayor a 0');
            return false;
        }
        
        if (!cantidad || cantidad <= 0) {
            alert('La cantidad debe ser mayor a 0');
            return false;
        }
        
        // Obtener foto actual
        let foto = null;
        if (window.fotoProductoActual) {
            foto = window.fotoProductoActual;
            console.log('Foto obtenida de variable global:', foto ? 'Sí' : 'No');
        }
        
        // Obtener productos existentes
        let productos = [];
        try {
            const productosStr = localStorage.getItem('productos');
            if (productosStr) {
                productos = JSON.parse(productosStr);
                console.log('Productos existentes cargados:', productos.length);
            }
        } catch (error) {
            console.error('Error al cargar productos existentes:', error);
            productos = [];
        }
        
        if (esEdicion) {
            // MODO EDICIÓN
            const indiceProducto = productos.findIndex(p => p.id === idEditando);
            if (indiceProducto === -1) {
                alert('Producto no encontrado para editar');
                return false;
            }
            
            const productoOriginal = productos[indiceProducto];
            
            // Verificar nombre duplicado (excepto el producto actual)
            const nombreExiste = productos.some(p => 
                p.id !== idEditando && 
                p.nombre.toLowerCase() === nombre.toLowerCase()
            );
            if (nombreExiste) {
                alert('Ya existe otro producto con ese nombre');
                return false;
            }
            
            // Actualizar producto existente
            productos[indiceProducto] = {
                ...productoOriginal,
                nombre: nombre,
                precio: precio,
                cantidad: cantidad,
                descripcion: descripcion,
                foto: foto || productoOriginal.foto,
                fechaModificacion: new Date().toISOString()
            };
            
            console.log('Producto actualizado:', productos[indiceProducto]);
            
        } else {
            // MODO CREACIÓN
            // Verificar nombre duplicado
            const nombreExiste = productos.some(p => p.nombre.toLowerCase() === nombre.toLowerCase());
            if (nombreExiste) {
                alert('Ya existe un producto con ese nombre');
                return false;
            }
            
            // Crear objeto producto nuevo
            const producto = {
                id: 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                nombre: nombre,
                precio: precio,
                cantidad: cantidad,
                descripcion: descripcion,
                foto: foto,
                fechaCreacion: new Date().toISOString()
            };
            
            console.log('Producto creado:', producto);
            productos.push(producto);
        }
        
        console.log('Lista actualizada:', productos.length, 'productos');
        
        // Guardar en localStorage
        try {
            localStorage.setItem('productos', JSON.stringify(productos));
            console.log('Productos guardados en localStorage');
            
            // Limpiar variable de edición
            if (esEdicion) {
                localStorage.removeItem('productoEditando');
            }
            
            // Verificar que se guardó
            const verificacion = localStorage.getItem('productos');
            if (verificacion) {
                const productosVerificados = JSON.parse(verificacion);
                console.log('Verificación exitosa:', productosVerificados.length, 'productos');
            }
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
            alert('Error al guardar el producto: ' + error.message);
            return false;
        }
        
        // Limpiar formulario
        try {
            const form = document.getElementById('formCrearProducto');
            if (form) {
                form.reset();
                console.log('Formulario limpiado');
            }
            
            // Limpiar foto
            window.fotoProductoActual = null;
            
        } catch (error) {
            console.error('Error al limpiar formulario:', error);
        }
        
        // Mostrar modal de éxito
        const modalExito = document.getElementById('modalExito');
        const modalMensaje = document.getElementById('modalExitoMensaje');
        
        if (modalExito && modalMensaje) {
            modalMensaje.textContent = esEdicion ? 
                'El producto ha sido actualizado exitosamente.' : 
                'El producto ha sido creado exitosamente.';
            const modal = new bootstrap.Modal(modalExito);
            modal.show();
            
            console.log('✅ Modal de éxito mostrado');
            
        } else {
            // Fallback si no está disponible el modal
            console.log('⚠️ Modal no disponible, usando alert');
            alert('Producto guardado exitosamente!');
            
            // Navegar inmediatamente si no hay modal
            setTimeout(() => {
                console.log('🔄 Navegando después de alert...');
                try {
                    if (typeof cargarPaginasAdmin === 'function') {
                        cargarPaginasAdmin('gestionProductos');
                    } else if (typeof window.cargarPaginasAdmin === 'function') {
                        window.cargarPaginasAdmin('gestionProductos');
                    } else {
                        console.error('❌ Función de navegación no encontrada');
                        window.location.reload();
                    }
                } catch (navError) {
                    console.error('❌ Error en navegación:', navError);
                    window.location.reload();
                }
            }, 500);
        }
        
        return true;
        
    } catch (error) {
        console.error('Error general al guardar producto:', error);
        alert('Error inesperado: ' + error.message);
        return false;
    }
};

// Funciones de test manual para la cámara (disponibles globalmente)
window.testCamara = async function() {
    console.log('🧪 TEST MANUAL DE CÁMARA');
    
    try {
        console.log('1. Verificando soporte...');
        if (!navigator.mediaDevices) {
            console.error('❌ navigator.mediaDevices no disponible');
            return false;
        }
        
        console.log('2. Solicitando stream...');
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 300 },
                height: { ideal: 200 }
            } 
        });
        console.log('✅ Stream obtenido:', stream);
        console.log('Tracks:', stream.getTracks().map(t => ({ kind: t.kind, label: t.label, enabled: t.enabled })));
        
        console.log('3. Buscando elemento video...');
        const video = document.getElementById('my_camara');
        if (!video) {
            console.error('❌ Elemento video no encontrado');
            stream.getTracks().forEach(track => track.stop());
            return false;
        }
        
        console.log('4. Configurando video...');
        video.srcObject = stream;
        video.style.display = 'block';
        
        // Esperar a que el video esté listo
        await new Promise((resolve) => {
            video.onloadedmetadata = () => {
                console.log('✅ Video metadata cargada');
                console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
                resolve();
            };
            setTimeout(() => resolve(), 3000); // timeout de seguridad
        });
        
        console.log('✅ TEST EXITOSO - Cámara funcionando');
        window.streamActual = stream;
        
        // Mostrar botón capturar
        const btnCapturar = document.getElementById('btn_capturar');
        if (btnCapturar) {
            btnCapturar.style.display = 'inline-block';
            console.log('✅ Botón capturar mostrado');
        }
        
        alert('🎬 ¡Cámara activada por TEST! Ahora puedes capturar una foto.');
        return true;
        
    } catch (error) {
        console.error('❌ TEST FALLIDO:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message
        });
        
        let mensaje = '❌ Test de cámara falló:\n\n';
        switch(error.name) {
            case 'NotAllowedError':
                mensaje += '🚫 Permiso denegado. Permite el acceso a la cámara y recarga la página.';
                break;
            case 'NotFoundError':
                mensaje += '📹 No se encontró cámara. Verifica que esté conectada.';
                break;
            case 'NotReadableError':
                mensaje += '🔒 Cámara ocupada por otra aplicación.';
                break;
            default:
                mensaje += error.message;
        }
        alert(mensaje);
        return false;
    }
};

// Función para test de captura
window.testCaptura = function() {
    console.log('🧪 TEST MANUAL DE CAPTURA');
    
    const video = document.getElementById('my_camara');
    const canvas = document.getElementById('foto');
    
    if (!video) {
        console.error('❌ Elemento video no encontrado');
        alert('❌ Elemento video no encontrado');
        return false;
    }
    
    if (!canvas) {
        console.error('❌ Elemento canvas no encontrado');
        alert('❌ Elemento canvas no encontrado');
        return false;
    }
    
    if (video.readyState < 2) {
        console.error('❌ Video no está listo, readyState:', video.readyState);
        alert('❌ Video no está listo. Primero ejecuta testCamara() y espera.');
        return false;
    }
    
    try {
        console.log('Capturando frame del video...');
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        console.log('Generando dataURL...');
        const dataURL = canvas.toDataURL('image/jpeg', 0.8);
        window.fotoProductoActual = dataURL;
        
        console.log('Configurando visualización...');
        canvas.style.display = 'block';
        video.style.display = 'none';
        
        // Detener stream
        if (window.streamActual) {
            console.log('Deteniendo stream...');
            window.streamActual.getTracks().forEach(track => track.stop());
            window.streamActual = null;
        }
        
        // Ocultar botón capturar
        const btnCapturar = document.getElementById('btn_capturar');
        if (btnCapturar) {
            btnCapturar.style.display = 'none';
        }
        
        console.log('✅ CAPTURA EXITOSA - Foto guardada');
        console.log('Tamaño de foto:', Math.round(dataURL.length/1024) + 'KB');
        console.log('Preview:', dataURL.substring(0, 100) + '...');
        
        alert('📸 ¡Foto capturada exitosamente! Tamaño: ' + Math.round(dataURL.length/1024) + 'KB');
        return true;
        
    } catch (error) {
        console.error('❌ ERROR EN CAPTURA:', error);
        alert('❌ Error en captura: ' + error.message);
        return false;
    }
};

// Función para test completo (cámara + captura)
window.testCompleto = async function() {
    console.log('🧪 TEST COMPLETO DE CÁMARA Y CAPTURA');
    
    try {
        console.log('Paso 1: Activando cámara...');
        const camaraOk = await window.testCamara();
        
        if (!camaraOk) {
            console.error('❌ Fallo en activación de cámara');
            return false;
        }
        
        console.log('Paso 2: Esperando 2 segundos...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('Paso 3: Capturando foto...');
        const capturaOk = window.testCaptura();
        
        if (!capturaOk) {
            console.error('❌ Fallo en captura');
            return false;
        }
        
        console.log('✅ TEST COMPLETO EXITOSO');
        return true;
        
    } catch (error) {
        console.error('❌ ERROR EN TEST COMPLETO:', error);
        return false;
    }
};

// Función para test de archivo
window.testArchivo = function() {
    console.log('🧪 TEST MANUAL DE SUBIDA DE ARCHIVO');
    
    const input = document.getElementById('inputArchivoFoto');
    if (!input) {
        console.error('❌ Input de archivo no encontrado');
        alert('❌ Input de archivo no encontrado');
        return false;
    }
    
    console.log('✅ Abriendo selector de archivo...');
    input.click();
    
    // Simular que el usuario selecciona un archivo
    console.log('💡 Selecciona una imagen para continuar el test');
    return true;
};

// Función para test de botones de la interfaz
window.testBotones = function() {
    console.log('🧪 TEST DE BOTONES DE INTERFAZ');
    
    const botones = [
        { id: 'btnActivarCamara', nombre: 'Activar Cámara' },
        { id: 'btn_capturar', nombre: 'Capturar Foto' },
        { id: 'btnSubirArchivo', nombre: 'Subir Archivo' },
        { id: 'btnGuardarProducto', nombre: 'Guardar Producto' }
    ];
    
    botones.forEach(boton => {
        const elemento = document.getElementById(boton.id);
        if (elemento) {
            console.log(`✅ ${boton.nombre}:`, {
                encontrado: true,
                visible: elemento.style.display !== 'none',
                habilitado: !elemento.disabled,
                tieneOnClick: elemento.onclick !== null,
                tieneEventListener: 'Revisar manualmente en DevTools'
            });
        } else {
            console.error(`❌ ${boton.nombre}: No encontrado`);
        }
    });
    
    // Test de funciones globales
    console.log('🔍 Verificando funciones globales...');
    const funciones = ['activarCamaraSimple', 'capturarFotoSimple', 'guardarProductoSimple'];
    funciones.forEach(fn => {
        if (typeof window[fn] === 'function') {
            console.log(`✅ ${fn}: Disponible`);
        } else {
            console.error(`❌ ${fn}: No disponible`);
        }
    });
    
    alert('🔍 Test de botones completado - revisa la consola para detalles');
    return true;
};

// Función para re-inicializar botones manualmente
window.reiniciarBotones = function() {
    console.log('🔄 RE-INICIALIZANDO BOTONES MANUALMENTE');
    
    // Configurar botón cámara
    const btnCamara = document.getElementById('btnActivarCamara');
    if (btnCamara) {
        btnCamara.onclick = function(e) {
            e.preventDefault();
            console.log('🎬 CLICK MANUAL EN CÁMARA');
            if (typeof window.activarCamaraSimple === 'function') {
                window.activarCamaraSimple();
            } else {
                console.error('activarCamaraSimple no disponible');
            }
        };
        console.log('✅ Botón cámara re-configurado');
    }
    
    // Configurar botón capturar
    const btnCapturar = document.getElementById('btn_capturar');
    if (btnCapturar) {
        btnCapturar.onclick = function(e) {
            e.preventDefault();
            console.log('📸 CLICK MANUAL EN CAPTURAR');
            if (typeof window.capturarFotoSimple === 'function') {
                window.capturarFotoSimple();
            } else {
                console.error('capturarFotoSimple no disponible');
            }
        };
        console.log('✅ Botón capturar re-configurado');
    }
    
    // Configurar botón archivo
    const btnArchivo = document.getElementById('btnSubirArchivo');
    if (btnArchivo) {
        btnArchivo.onclick = function(e) {
            e.preventDefault();
            console.log('📁 CLICK MANUAL EN ARCHIVO');
            if (typeof window.subirArchivoSimple === 'function') {
                window.subirArchivoSimple();
            } else {
                console.error('subirArchivoSimple no disponible');
            }
        };
        console.log('✅ Botón archivo re-configurado');
    }
    
    // Configurar input de archivo
    const inputArchivo = document.getElementById('inputArchivoFoto');
    if (inputArchivo) {
        inputArchivo.onchange = function(e) {
            console.log('📁 ARCHIVO SELECCIONADO');
            if (typeof window.manejarArchivoSimple === 'function') {
                window.manejarArchivoSimple(e);
            } else {
                console.error('manejarArchivoSimple no disponible');
            }
        };
        console.log('✅ Input archivo re-configurado');
    }
    
    // Ya no mostrar alert, solo log
    console.log('🔄 Botones re-inicializados! Ahora prueba hacer click en ellos.');
    return true;
};

// Función para verificar todo el sistema
window.verificarSistema = function() {
    console.log('🔍 VERIFICACIÓN COMPLETA DEL SISTEMA');
    
    // Verificar botones
    testBotones();
    
    // Verificar funciones críticas
    const funciones = ['testCamara', 'testCaptura', 'activarCamaraSimple', 'capturarFotoSimple', 'manejarArchivoSimple'];
    console.log('🔍 Estado de funciones críticas:');
    funciones.forEach(fn => {
        const disponible = typeof window[fn] === 'function';
        console.log(`${disponible ? '✅' : '❌'} ${fn}: ${disponible ? 'Disponible' : 'No disponible'}`);
    });
    
    // Verificar permisos
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.permissions.query({ name: 'camera' }).then(permission => {
            console.log('📹 Permiso de cámara:', permission.state);
        }).catch(() => {
            console.log('📹 No se puede consultar permisos de cámara');
        });
    }
    
    return true;
};

// Función simple para cargar productos en gestión (disponible globalmente)
window.cargarProductosSimple = function() {
    console.log('📦 CARGANDO PRODUCTOS SIMPLE');
    console.log('Timestamp:', new Date().toISOString());
    
    try {
        // Verificar que estamos en la página correcta
        const tbody = document.getElementById('tablaProductos');
        if (!tbody) {
            console.error('❌ Tabla de productos no encontrada - no estamos en la página correcta');
            console.log('Elementos disponibles con ID:');
            const elementsWithId = document.querySelectorAll('[id]');
            elementsWithId.forEach(el => console.log(' -', el.id));
            return false;
        }
        
        console.log('✅ Elemento tabla encontrado');
        
        const productos = JSON.parse(localStorage.getItem('productos') || '[]');
        console.log('Productos encontrados:', productos.length);
        console.log('Datos productos:', productos);
        
        if (productos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">No hay productos registrados</td></tr>';
            return true;
        }
        
        let html = '';
        productos.forEach((producto, index) => {
            const estadoClass = producto.cantidad === 0 ? 'danger' : 
                              producto.cantidad <= 5 ? 'warning' : 'success';
            const estadoTexto = producto.cantidad === 0 ? 'Sin stock' :
                              producto.cantidad <= 5 ? 'Poco stock' : 'Disponible';
            
            const fechaCreacion = new Date(producto.fechaCreacion).toLocaleDateString();
            const fotoSrc = producto.foto || './assets/img/no-image.svg';
            
            html += `
                <tr>
                    <td><img src="${fotoSrc}" alt="${producto.nombre}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;"></td>
                    <td>${producto.nombre}</td>
                    <td>$${producto.precio}</td>
                    <td>${producto.cantidad}</td>
                    <td><span class="badge bg-${estadoClass}">${estadoTexto}</span></td>
                    <td>${producto.descripcion || 'Sin descripción'}</td>
                    <td>${fechaCreacion}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="verDetallesProducto('${producto.id}')" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="editarProducto('${producto.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarProducto('${producto.id}')" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
        
        // Actualizar estadísticas
        const totalProductos = productos.length;
        const conStock = productos.filter(p => p.cantidad > 5).length;
        const pocoStock = productos.filter(p => p.cantidad > 0 && p.cantidad <= 5).length;
        const sinStock = productos.filter(p => p.cantidad === 0).length;
        
        // Actualizar elementos de estadísticas con los IDs correctos
        const elementoTotal = document.getElementById('totalProductos');
        const elementoConStock = document.getElementById('conStock');
        const elementoPocoStock = document.getElementById('pocoStock');
        const elementoSinStock = document.getElementById('sinStock');
        
        console.log('🔍 Elementos de estadísticas encontrados:', {
            totalProductos: !!elementoTotal,
            conStock: !!elementoConStock,
            pocoStock: !!elementoPocoStock,
            sinStock: !!elementoSinStock
        });
        
        if (elementoTotal) elementoTotal.textContent = totalProductos;
        if (elementoConStock) elementoConStock.textContent = conStock;
        if (elementoPocoStock) elementoPocoStock.textContent = pocoStock;
        if (elementoSinStock) elementoSinStock.textContent = sinStock;
        
        console.log('✅ Estadísticas actualizadas:', {
            totalProductos,
            conStock,
            pocoStock,
            sinStock
        });
        
        console.log('✅ Productos cargados correctamente');
        console.log('Estadísticas calculadas:', { totalProductos, conStock, pocoStock, sinStock });
        
        // Debug de elementos encontrados
        console.log('Elementos estadísticas:', {
            totalProductos: !!document.getElementById('totalProductos'),
            conStock: !!document.getElementById('conStock'),
            pocoStock: !!document.getElementById('pocoStock'),
            sinStock: !!document.getElementById('sinStock')
        });
        
        return true;
        
    } catch (error) {
        console.error('❌ Error al cargar productos:', error);
        return false;
    }
};

// Función para recargar productos y estadísticas juntos
window.recargarGestionProductos = function() {
    console.log('🔄 RECARGANDO GESTIÓN COMPLETA');
    
    // Cargar productos
    if (typeof window.cargarProductosSimple === 'function') {
        window.cargarProductosSimple();
    }
    
    // Actualizar estadísticas
    setTimeout(() => {
        if (typeof window.actualizarEstadisticas === 'function') {
            window.actualizarEstadisticas();
        }
    }, 200);
    
    return true;
};

// Función específica para actualizar estadísticas
window.actualizarEstadisticas = function() {
    console.log('📊 ACTUALIZANDO ESTADÍSTICAS');
    
    try {
        const productos = JSON.parse(localStorage.getItem('productos') || '[]');
        console.log('Productos para estadísticas:', productos.length);
        
        // Calcular estadísticas
        const totalProductos = productos.length;
        const conStock = productos.filter(p => p.cantidad > 5).length;
        const pocoStock = productos.filter(p => p.cantidad > 0 && p.cantidad <= 5).length;
        const sinStock = productos.filter(p => p.cantidad === 0).length;
        
        console.log('Estadísticas calculadas:', { totalProductos, conStock, pocoStock, sinStock });
        
        // Actualizar elementos
        const elementos = {
            totalProductos: document.getElementById('totalProductos'),
            conStock: document.getElementById('conStock'),
            pocoStock: document.getElementById('pocoStock'),
            sinStock: document.getElementById('sinStock')
        };
        
        // Debug de elementos
        Object.keys(elementos).forEach(key => {
            const elemento = elementos[key];
            console.log(`Elemento ${key}:`, elemento ? 'Encontrado' : 'NO encontrado');
            if (elemento) {
                const valor = key === 'totalProductos' ? totalProductos :
                             key === 'conStock' ? conStock :
                             key === 'pocoStock' ? pocoStock : sinStock;
                elemento.textContent = valor;
                console.log(`${key} actualizado a:`, valor);
            }
        });
        
        console.log('✅ Estadísticas actualizadas');
        return true;
        
    } catch (error) {
        console.error('❌ Error al actualizar estadísticas:', error);
        return false;
    }
};

// Funciones globales para gestión de productos
window.editarProducto = function(id) {
    console.log('📝 Editando producto:', id);
    
    // Guardar el ID del producto a editar en localStorage temporalmente
    localStorage.setItem('productoEditando', id);
    
    // Navegar a la página de editar
    if (typeof window.cargarPaginasAdmin === 'function') {
        window.cargarPaginasAdmin('editarProducto');
    } else {
        window.location.href = 'editarProducto.html';
    }
};

window.eliminarProducto = function(id) {
    console.log('🗑️ Eliminando producto:', id);
    
    const productos = JSON.parse(localStorage.getItem('productos') || '[]');
    const producto = productos.find(p => p.id === id);
    
    if (!producto) {
        alert('Producto no encontrado');
        return;
    }
    
    if (confirm(`¿Estás seguro de que quieres eliminar "${producto.nombre}"?`)) {
        const productosActualizados = productos.filter(p => p.id !== id);
        localStorage.setItem('productos', JSON.stringify(productosActualizados));
        
        console.log('✅ Producto eliminado:', producto.nombre);
        alert('Producto eliminado exitosamente');
        
        // Recargar la tabla
        if (typeof window.cargarProductosSimple === 'function') {
            window.cargarProductosSimple();
        }
    }
};

// Función para cargar datos en el formulario de edición
window.cargarDatosProductoParaEditar = function(id) {
    console.log('📝 Cargando datos para editar producto:', id);
    
    try {
        const productos = JSON.parse(localStorage.getItem('productos') || '[]');
        const producto = productos.find(p => p.id === id);
        
        if (!producto) {
            console.error('❌ Producto no encontrado:', id);
            alert('Producto no encontrado');
            return false;
        }
        
        console.log('✅ Producto encontrado:', producto);
        
        // Llenar formulario
        const nombreInput = document.getElementById('nombreProducto');
        const precioInput = document.getElementById('precioProducto');
        const cantidadInput = document.getElementById('cantidadProducto');
        const descripcionInput = document.getElementById('descripcionProducto');
        
        if (nombreInput) nombreInput.value = producto.nombre;
        if (precioInput) precioInput.value = producto.precio;
        if (cantidadInput) cantidadInput.value = producto.cantidad;
        if (descripcionInput) descripcionInput.value = producto.descripcion || '';
        
        // Cargar foto si existe
        if (producto.foto) {
            window.fotoProductoActual = producto.foto;
            
            // Mostrar la foto en el canvas o imagen
            const canvas = document.getElementById('foto');
            const imagenArchivo = document.getElementById('imagenArchivo');
            
            if (canvas) {
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.onload = function() {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    canvas.style.display = 'block';
                };
                img.src = producto.foto;
            }
            
            if (imagenArchivo) {
                imagenArchivo.src = producto.foto;
                imagenArchivo.style.display = 'block';
            }
        }
        
        // Cambiar título de la página
        const titulo = document.querySelector('h2, .card-header h3');
        if (titulo) {
            titulo.textContent = `Editar Producto: ${producto.nombre}`;
        }
        
        // Cambiar texto del botón de guardar
        const btnGuardar = document.getElementById('btnGuardarProducto');
        if (btnGuardar) {
            btnGuardar.textContent = 'Actualizar Producto';
        }
        
        console.log('✅ Formulario cargado para edición');
        return true;
        
    } catch (error) {
        console.error('❌ Error al cargar datos del producto:', error);
        alert('Error al cargar el producto: ' + error.message);
        return false;
    }
};

// Función para forzar sobrescritura de funciones problemáticas
window.arreglarFuncionesProductos = function() {
    console.log('🔧 FORZANDO SOBRESCRITURA DE FUNCIONES...');
    
    window.editarProducto = function(id) {
        console.log('📝 Editando producto (función FORZADA):', id);
        localStorage.setItem('productoEditando', id);
        if (typeof window.cargarPaginasAdmin === 'function') {
            window.cargarPaginasAdmin('editarProducto');
        } else {
            window.location.href = 'editarProducto.html';
        }
    };
    
    window.eliminarProducto = function(id) {
        console.log('🗑️ Eliminando producto (función FORZADA):', id);
        const productos = JSON.parse(localStorage.getItem('productos') || '[]');
        const producto = productos.find(p => p.id === id);
        
        if (!producto) {
            alert('Producto no encontrado');
            return;
        }
        
        if (confirm(`¿Estás seguro de que quieres eliminar "${producto.nombre}"?`)) {
            const productosActualizados = productos.filter(p => p.id !== id);
            localStorage.setItem('productos', JSON.stringify(productosActualizados));
            
            console.log('✅ Producto eliminado:', producto.nombre);
            alert('Producto eliminado exitosamente');
            
            // Recargar la tabla
            if (typeof window.cargarProductosSimple === 'function') {
                window.cargarProductosSimple();
            }
        }
    };
    
    console.log('✅ Funciones sobrescritas manualmente');
    alert('🔧 Funciones arregladas! Ahora prueba editar un producto.');
    return true;
};

// Función para verificar estado de edición
window.verificarEstadoEdicion = function() {
    console.log('🔍 VERIFICANDO ESTADO DE EDICIÓN');
    
    const idEditando = localStorage.getItem('productoEditando');
    console.log('ID en edición:', idEditando || 'Ninguno');
    
    if (idEditando) {
        const productos = JSON.parse(localStorage.getItem('productos') || '[]');
        const producto = productos.find(p => p.id === idEditando);
        console.log('Producto encontrado:', producto ? 'Sí' : 'No');
        if (producto) {
            console.log('Datos del producto:', producto);
        }
    }
    
    // Verificar botón
    const btnGuardar = document.getElementById('btnGuardarProducto') || document.getElementById('btnActualizarProducto');
    if (btnGuardar) {
        console.log('Botón guardar/actualizar:', {
            existe: true,
            id: btnGuardar.id,
            texto: btnGuardar.textContent.trim(),
            tieneOnClick: !!btnGuardar.onclick,
            disabled: btnGuardar.disabled
        });
    } else {
        console.log('❌ Botón guardar/actualizar NO encontrado');
        console.log('Botones disponibles:');
        const botones = document.querySelectorAll('button');
        botones.forEach(btn => {
            if (btn.id) {
                console.log('- ID:', btn.id, 'Texto:', btn.textContent.trim());
            }
        });
    }
    
    return true;
};

// Función para probar el guardado manualmente
window.probarGuardado = function() {
    console.log('🧪 PROBANDO GUARDADO MANUAL');
    
    if (typeof window.guardarProductoSimple === 'function') {
        const resultado = window.guardarProductoSimple();
        console.log('Resultado:', resultado);
    } else {
        console.error('❌ guardarProductoSimple no disponible');
    }
};

// Función para configurar manualmente el botón de actualizar
window.configurarBotonActualizar = function() {
    console.log('🔧 CONFIGURANDO BOTÓN ACTUALIZAR MANUALMENTE');
    
    const btnActualizar = document.getElementById('btnActualizarProducto');
    if (!btnActualizar) {
        console.error('❌ Botón actualizar no encontrado');
        alert('❌ Botón actualizar no encontrado');
        return false;
    }
    
    // Remover eventos anteriores
    btnActualizar.onclick = null;
    const newBtn = btnActualizar.cloneNode(true);
    btnActualizar.parentNode.replaceChild(newBtn, btnActualizar);
    
    // Agregar nuevo evento
    newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('📝 BOTÓN ACTUALIZAR MANUAL - Ejecutando guardarProductoSimple');
        
        if (typeof window.guardarProductoSimple === 'function') {
            window.guardarProductoSimple();
        } else {
            console.error('guardarProductoSimple no disponible');
            alert('Error: Función de guardado no disponible');
        }
    });
    
    console.log('✅ Botón actualizar configurado manualmente');
    alert('🔧 Botón configurado! Ahora prueba hacer click en "Actualizar Producto".');
    return true;
};

// Configurar funciones globales inmediatamente al cargar la página
console.log('🚀 Configurando funciones globales de productos...');
window.editarProducto = function(id) {
    console.log('📝 Editando producto (función GLOBAL):', id);
    localStorage.setItem('productoEditando', id);
    if (typeof window.cargarPaginasAdmin === 'function') {
        window.cargarPaginasAdmin('editarProducto');
    } else {
        window.location.href = 'editarProducto.html';
    }
};

window.eliminarProducto = function(id) {
    console.log('🗑️ Eliminando producto (función GLOBAL):', id);
    const productos = JSON.parse(localStorage.getItem('productos') || '[]');
    const producto = productos.find(p => p.id === id);
    
    if (!producto) {
        alert('Producto no encontrado');
        return;
    }
    
    if (confirm(`¿Estás seguro de que quieres eliminar "${producto.nombre}"?`)) {
        const productosActualizados = productos.filter(p => p.id !== id);
        localStorage.setItem('productos', JSON.stringify(productosActualizados));
        
        console.log('✅ Producto eliminado:', producto.nombre);
        alert('Producto eliminado exitosamente');
        
        // Recargar la tabla
        if (typeof window.cargarProductosSimple === 'function') {
            window.cargarProductosSimple();
        }
    }
};

window.verDetallesProducto = function(id) {
    console.log('👁️ Viendo detalles del producto (función GLOBAL):', id);
    const productos = JSON.parse(localStorage.getItem('productos') || '[]');
    const producto = productos.find(p => p.id === id);
    
    if (!producto) {
        alert('Producto no encontrado');
        return;
    }
    
    // Llenar los datos del modal
    document.getElementById('nombreDetalle').textContent = producto.nombre;
    document.getElementById('precioDetalle').textContent = `$${producto.precio}`;
    document.getElementById('stockDetalle').textContent = producto.cantidad;
    document.getElementById('fechaDetalle').textContent = new Date(producto.fechaCreacion).toLocaleDateString();
    document.getElementById('descripcionDetalle').textContent = producto.descripcion || 'Sin descripción';
    
    // Configurar la foto
    const fotoDetalle = document.getElementById('fotoDetalle');
    fotoDetalle.src = producto.foto || './assets/img/no-image.svg';
    fotoDetalle.alt = producto.nombre;
    
    // Configurar el estado
    const estadoDetalle = document.getElementById('estadoDetalle');
    if (producto.cantidad === 0) {
        estadoDetalle.innerHTML = '<span class="badge bg-danger">Sin stock</span>';
    } else if (producto.cantidad <= 5) {
        estadoDetalle.innerHTML = '<span class="badge bg-warning">Poco stock</span>';
    } else {
        estadoDetalle.innerHTML = '<span class="badge bg-success">Disponible</span>';
    }
    
    // Mostrar el modal
    const modalDetalles = new bootstrap.Modal(document.getElementById('modalDetalles'));
    modalDetalles.show();
    
    console.log('✅ Modal de detalles mostrado para:', producto.nombre);
};

// Confirmar que todas las funciones globales están configuradas
console.log('🎯 Funciones globales configuradas:', {
    editarProducto: typeof window.editarProducto,
    eliminarProducto: typeof window.eliminarProducto,
    verDetallesProducto: typeof window.verDetallesProducto,
    cargarProductosSimple: typeof window.cargarProductosSimple
});

window.onload = () => window.cargarPaginasAdmin("inicio");