// gestionProductos.js - Manejo de productos con localStorage y cámara

class GestionProductos {
    constructor() {
        console.log('=== INICIALIZANDO GESTIÓN DE PRODUCTOS ===');
        this.productos = this.cargarProductos();
        this.ultimaVerificacion = null; // Para rastrear cambios en localStorage
        console.log('Constructor: productos cargados:', this.productos.length);
        this.inicializar();
        
        // Hacer disponible globalmente para debugging
        window.gestionProductos = this;
    }

    inicializar() {
        // Detectar qué página estamos cargando
        const url = window.location.pathname;
        
        // También revisar si hay elementos específicos de cada página
        const tieneFormCrear = document.getElementById('formCrearProducto');
        const tieneFormEditar = document.getElementById('formEditarProducto');
        const tieneTablaGestion = document.getElementById('tablaProductos');
        
        console.log('Inicializando gestión de productos...');
        console.log('URL:', url);
        console.log('Elementos encontrados:', {
            formCrear: !!tieneFormCrear,
            formEditar: !!tieneFormEditar,
            tablaGestion: !!tieneTablaGestion
        });
        
        if (url.includes('crearProducto.html') || tieneFormCrear) {
            console.log('Inicializando modo CREAR');
            this.inicializarCrear();
        } else if (url.includes('editarProducto.html') || tieneFormEditar) {
            console.log('Inicializando modo EDITAR');
            this.inicializarEditar();
        } else if (url.includes('gestionProductos.html') || tieneTablaGestion) {
            console.log('Inicializando modo GESTIÓN');
            this.inicializarGestion();
        } else {
            console.log('Modo no detectado, esperando...');
            // Intentar de nuevo después de un momento
            setTimeout(() => {
                const tieneFormCrear2 = document.getElementById('formCrearProducto');
                const tieneFormEditar2 = document.getElementById('formEditarProducto');
                const tieneTablaGestion2 = document.getElementById('tablaProductos');
                
                if (tieneFormCrear2) {
                    console.log('Inicializando modo CREAR (segundo intento)');
                    this.inicializarCrear();
                } else if (tieneFormEditar2) {
                    console.log('Inicializando modo EDITAR (segundo intento)');
                    this.inicializarEditar();
                } else if (tieneTablaGestion2) {
                    console.log('Inicializando modo GESTIÓN (segundo intento)');
                    this.inicializarGestion();
                }
            }, 1000);
        }
    }

    // FUNCIONES DE LOCALSTORAGE
    cargarProductos() {
        try {
            const productos = localStorage.getItem('productos');
            const productosParseados = productos ? JSON.parse(productos) : [];
            console.log('Productos cargados desde localStorage:', productosParseados.length, 'productos');
            console.log('Datos cargados:', productosParseados);
            return productosParseados;
        } catch (error) {
            console.error('Error al cargar productos desde localStorage:', error);
            return [];
        }
    }

    guardarProductos() {
        try {
            console.log('Guardando productos en localStorage:', this.productos.length, 'productos');
            console.log('Datos a guardar:', this.productos);
            localStorage.setItem('productos', JSON.stringify(this.productos));
            console.log('Productos guardados exitosamente');
            
            // Verificar que se guardó correctamente
            const verificacion = localStorage.getItem('productos');
            if (verificacion) {
                console.log('Verificación: datos guardados correctamente');
            } else {
                console.error('Error: no se pudieron guardar los datos');
            }
        } catch (error) {
            console.error('Error al guardar productos en localStorage:', error);
            alert('Error al guardar el producto. Por favor, intente de nuevo.');
        }
    }

    generarId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    // Función para verificar localStorage
    verificarLocalStorage() {
        console.log('=== VERIFICACIÓN DE LOCALSTORAGE ===');
        const datos = localStorage.getItem('productos');
        console.log('Datos en localStorage:', datos);
        
        if (datos) {
            try {
                const productos = JSON.parse(datos);
                console.log('Productos parseados:', productos);
                console.log('Cantidad de productos:', productos.length);
            } catch (error) {
                console.error('Error al parsear datos:', error);
            }
        } else {
            console.log('No hay datos en localStorage');
        }
        console.log('=== FIN VERIFICACIÓN ===');
    }

    // CREAR PRODUCTO
    inicializarCrear() {
        console.log('Inicializando modo crear producto');
        
        // Configurar el formulario para prevenir submit automático
        const form = document.getElementById('formCrearProducto');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Submit del formulario prevenido');
                this.crearProducto();
            });
        }
        
        // Configurar botón de guardar
        const btnGuardar = document.getElementById('btnGuardarProducto');
        if (btnGuardar) {
            btnGuardar.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Botón guardar clickeado desde GestionProductos');
                this.crearProducto();
            });
        }
    }

    crearProducto(e = null) {
        console.log('=== INICIANDO CREACIÓN DE PRODUCTO DESDE CLASE ===');
        
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        try {
            const nombre = document.getElementById('nombreProducto').value.trim();
            const precio = parseFloat(document.getElementById('precioProducto').value);
            const cantidad = parseInt(document.getElementById('cantidadProducto').value);
            const descripcion = document.getElementById('descripcionProducto').value.trim();
            
            console.log('Datos del formulario:', { nombre, precio, cantidad, descripcion });
            
            // Validaciones
            if (!nombre || precio <= 0 || cantidad <= 0) {
                alert('Por favor, complete todos los campos obligatorios correctamente.');
                return;
            }

            // Verificar si ya existe un producto con el mismo nombre
            if (this.productos.some(p => p.nombre.toLowerCase() === nombre.toLowerCase())) {
                alert('Ya existe un producto con ese nombre.');
                return;
            }

            // Obtener foto usando el nuevo sistema
            let foto = null;
            if (window.fotoProductos) {
                foto = window.fotoProductos.obtenerFoto();
                console.log('Foto obtenida:', foto ? 'Sí (' + foto.length + ' caracteres)' : 'No');
            } else {
                console.log('Sistema de fotos no disponible');
            }

            const nuevoProducto = {
                id: this.generarId(),
                nombre: nombre,
                precio: precio,
                cantidad: cantidad,
                descripcion: descripcion || '',
                foto: foto,
                fechaCreacion: new Date().toISOString(),
                fechaModificacion: new Date().toISOString()
            };

            console.log('Producto a crear:', nuevoProducto);
            
            this.productos.push(nuevoProducto);
            console.log('Lista de productos después de agregar:', this.productos.length);
            
            this.guardarProductos();

            console.log('Plato creado y guardado exitosamente');

            // Mostrar modal de éxito
            const modalElement = document.getElementById('modalExito');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                
                // Limpiar formulario
                document.getElementById('formCrearProducto').reset();
                if (window.fotoProductos) {
                    window.fotoProductos.limpiarTodo();
                }

                // Redirigir después de cerrar modal
                setTimeout(() => {
                    modal.hide();
                    setTimeout(() => {
                        // Notificar actualización antes de navegar
                        this.notificarActualizacion();
                        
                        // Forzar actualización global
                        window.forzarActualizacionGestion = true;
                        
                        if (typeof cargarPaginasAdmin === 'function') {
                            cargarPaginasAdmin('gestionProductos');
                        } else if (typeof window.cargarPaginasAdmin === 'function') {
                            window.cargarPaginasAdmin('gestionProductos');
                        } else {
                            console.log('Función cargarPaginasAdmin no encontrada');
                        }
                    }, 300);
                }, 1500);
            } else {
                // Usar modal de éxito global
                const modalExito = document.getElementById('modalExito');
                const modalMensaje = document.getElementById('mensajeExito');
                
                if (modalExito && modalMensaje) {
                    modalMensaje.textContent = '¡Plato guardado exitosamente!';
                    const modal = new bootstrap.Modal(modalExito);
                    modal.show();
                    
                    // Configurar botón del modal
                    const btnVolverGestion = document.getElementById('btnVolverGestionExito');
                    if (btnVolverGestion) {
                        btnVolverGestion.onclick = function() {
                            modal.hide();
                            setTimeout(() => {
                                // Limpiar formulario
                                document.getElementById('formCrearProducto').reset();
                                if (window.fotoProductos) {
                                    window.fotoProductos.limpiarTodo();
                                }
                                
                                // Notificar actualización antes de navegar
                                if (typeof this.notificarActualizacion === 'function') {
                                    this.notificarActualizacion();
                                }
                                
                                // Forzar actualización global
                                window.forzarActualizacionGestion = true;
                                
                                // Navegar
                                if (typeof cargarPaginasAdmin === 'function') {
                                    cargarPaginasAdmin('gestionProductos');
                                } else if (typeof window.cargarPaginasAdmin === 'function') {
                                    window.cargarPaginasAdmin('gestionProductos');
                                }
                            }, 300);
                        };
                    }
                } else {
                    // Fallback al alert si no hay modal
                    alert('Plato guardado exitosamente');
                    
                    // Limpiar formulario
                    document.getElementById('formCrearProducto').reset();
                    if (window.fotoProductos) {
                        window.fotoProductos.limpiarTodo();
                    }
                    
                    // Notificar actualización antes de navegar
                    this.notificarActualizacion();
                    
                    // Forzar actualización global
                    window.forzarActualizacionGestion = true;
                    
                    // Redirigir
                    if (typeof cargarPaginasAdmin === 'function') {
                        cargarPaginasAdmin('gestionProductos');
                    } else if (typeof window.cargarPaginasAdmin === 'function') {
                        window.cargarPaginasAdmin('gestionProductos');
                    }
                }
            }
            
        } catch (error) {
            console.error('Error al crear producto:', error);
            alert('Error al guardar el producto: ' + error.message);
        }
    }

    // Función para notificar que los datos se han actualizado
    notificarActualizacion() {
        console.log('📢 Notificando actualización de datos...');
        // Marcar que los datos han cambiado
        localStorage.setItem('productosActualizados', Date.now().toString());
        
        // Disparar evento personalizado
        window.dispatchEvent(new CustomEvent('productosActualizados', {
            detail: { 
                productos: this.productos,
                timestamp: Date.now()
            }
        }));
    }

    // EDITAR PRODUCTO
    inicializarEditar() {
        console.log('Inicializando modo editar producto');
        
        // Configurar el formulario para prevenir submit automático
        const form = document.getElementById('formEditarProducto');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Submit del formulario editar prevenido');
                this.actualizarProducto();
            });
        }
        
        // Configurar botón de actualizar
        const btnActualizar = document.getElementById('btnActualizarProducto');
        if (btnActualizar) {
            btnActualizar.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Botón actualizar clickeado desde GestionProductos');
                this.actualizarProducto();
            });
        }
        
        // Cargar producto para editar
        this.cargarProductoParaEditar();
    }

    cargarProductoParaEditar() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        
        if (!id) {
            console.error('No se especificó un producto para editar');
            const modalError = document.getElementById('modalError');
            if (modalError) {
                document.getElementById('mensajeError').textContent = 'No se especificó un producto para editar.';
                const modal = new bootstrap.Modal(modalError);
                modal.show();
            } else {
                alert('No se especificó un producto para editar.');
            }
            return;
        }

        const producto = this.productos.find(p => p.id === id);
        
        if (!producto) {
            console.error('Producto no encontrado');
            const modalError = document.getElementById('modalError');
            if (modalError) {
                document.getElementById('mensajeError').textContent = 'Producto no encontrado.';
                const modal = new bootstrap.Modal(modalError);
                modal.show();
            } else {
                alert('Producto no encontrado.');
            }
            return;
        }

        // Cargar datos en el formulario
        document.getElementById('idProducto').value = producto.id;
        document.getElementById('nombreProducto').value = producto.nombre;
        document.getElementById('precioProducto').value = producto.precio;
        document.getElementById('cantidadProducto').value = producto.cantidad;
        document.getElementById('descripcionProducto').value = producto.descripcion;
        document.getElementById('productoActual').textContent = producto.nombre;

        // Cargar foto actual
        const imagenActual = document.getElementById('imagenActual');
        const fotoActual = document.getElementById('fotoActual');
        if (producto.foto && imagenActual && fotoActual) {
            imagenActual.src = producto.foto;
            fotoActual.style.display = 'block';
        } else if (fotoActual) {
            fotoActual.style.display = 'none';
        }
    }

    actualizarProducto(e = null) {
        console.log('=== INICIANDO ACTUALIZACIÓN DE PRODUCTO DESDE CLASE ===');
        
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        try {
            const id = document.getElementById('idProducto').value;
            const nombre = document.getElementById('nombreProducto').value.trim();
            const precio = parseFloat(document.getElementById('precioProducto').value);
            const cantidad = parseInt(document.getElementById('cantidadProducto').value);
            const descripcion = document.getElementById('descripcionProducto').value.trim();

            console.log('Datos del formulario:', { id, nombre, precio, cantidad, descripcion });

            // Validaciones
            if (!nombre || precio <= 0 || cantidad <= 0) {
                alert('Por favor, complete todos los campos obligatorios correctamente.');
                return;
            }

            // Verificar si ya existe otro producto con el mismo nombre
            if (this.productos.some(p => p.id !== id && p.nombre.toLowerCase() === nombre.toLowerCase())) {
                alert('Ya existe otro producto con ese nombre.');
                return;
            }

            const index = this.productos.findIndex(p => p.id === id);
            if (index === -1) {
                alert('Producto no encontrado.');
                return;
            }

            // Obtener foto (nueva o existente)
            let fotoNueva = null;
            if (window.fotoProductos) {
                fotoNueva = window.fotoProductos.obtenerFoto();
                console.log('Foto nueva obtenida:', fotoNueva ? 'Sí (' + fotoNueva.length + ' caracteres)' : 'No');
            }
            const foto = fotoNueva || this.productos[index].foto;

            // Actualizar producto
            this.productos[index] = {
                ...this.productos[index],
                nombre: nombre,
                precio: precio,
                cantidad: cantidad,
                descripcion: descripcion,
                foto: foto,
                fechaModificacion: new Date().toISOString()
            };

            this.guardarProductos();

            console.log('Plato actualizado exitosamente:', this.productos[index]);

            // Notificar actualización
            this.notificarActualizacion();

            // Mostrar modal de éxito
            const modalElement = document.getElementById('modalExito');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();

                // Redirigir después de cerrar modal
                setTimeout(() => {
                    modal.hide();
                    setTimeout(() => {
                        if (typeof cargarPaginasAdmin === 'function') {
                            cargarPaginasAdmin('gestionProductos');
                        } else if (typeof window.cargarPaginasAdmin === 'function') {
                            window.cargarPaginasAdmin('gestionProductos');
                        } else {
                            console.log('Función cargarPaginasAdmin no encontrada');
                        }
                    }, 300);
                }, 1500);
            } else {
                alert('Plato actualizado exitosamente');
                
                // Redirigir
                if (typeof cargarPaginasAdmin === 'function') {
                    cargarPaginasAdmin('gestionProductos');
                } else if (typeof window.cargarPaginasAdmin === 'function') {
                    window.cargarPaginasAdmin('gestionProductos');
                }
            }
            
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            alert('Error al actualizar el producto: ' + error.message);
        }
    }

    // GESTIÓN DE PRODUCTOS
    inicializarGestion() {
        console.log('=== INICIALIZANDO GESTIÓN DE PRODUCTOS ===');
        
        // Verificar si hay una actualización forzada pendiente
        if (window.forzarActualizacionGestion) {
            console.log('🔥 Actualización forzada detectada - Recargando datos...');
            this.productos = this.cargarProductos();
            window.forzarActualizacionGestion = false;
        }
        
        this.verificarLocalStorage();
        this.cargarTablaProductos();
        this.actualizarEstadisticas();
        this.configurarFiltros();
        this.configurarEscuchadorActualizaciones();
        
        // Event listeners
        const btnActualizar = document.getElementById('btnActualizar');
        if (btnActualizar) {
            btnActualizar.addEventListener('click', () => {
                console.log('Botón actualizar clickeado');
                this.actualizarDatos();
                // También limpiar filtros al actualizar
                this.limpiarFiltros();
            });
        }
        
        // Configurar verificadores múltiples para asegurar que los eventos estén funcionando
        setTimeout(() => {
            this.verificarEventosFiltros();
        }, 500);
        
        setTimeout(() => {
            this.verificarEventosFiltros();
        }, 1500);
        
        setTimeout(() => {
            this.verificarEventosFiltros();
        }, 3000);
    }

    cargarTablaProductos() {
        console.log('Cargando tabla de productos...');
        console.log('Productos disponibles:', this.productos.length);
        console.log('Lista completa:', this.productos);
        
        const tbody = document.getElementById('tablaProductos');
        const sinProductos = document.getElementById('sinProductos');
        const contadorResultados = document.getElementById('contadorResultados');
        const ultimaActualizacion = document.getElementById('ultimaActualizacion');
        
        // Actualizar contador de resultados
        if (contadorResultados) {
            contadorResultados.innerHTML = `<i class="fas fa-list me-1"></i>Mostrando todos los platos (${this.productos.length})`;
        }
        
        // Actualizar hora de última actualización
        if (ultimaActualizacion) {
            ultimaActualizacion.textContent = new Date().toLocaleTimeString();
        }
        
        if (!tbody) {
            console.error('Error: No se encontró el elemento tablaProductos');
            return;
        }
        
        if (this.productos.length === 0) {
            console.log('No hay productos, mostrando mensaje');
            tbody.innerHTML = '';
            if (sinProductos) {
                sinProductos.style.display = 'block';
            }
            return;
        }

        console.log('Generando HTML para', this.productos.length, 'productos');
        if (sinProductos) {
            sinProductos.style.display = 'none';
        }
        
        let html = '';
        this.productos.forEach((producto, index) => {
            console.log(`Procesando producto ${index + 1}:`, producto.nombre);
            const estadoClass = producto.cantidad === 0 ? 'danger' : 
                              producto.cantidad <= 5 ? 'warning' : 'success';
            const estadoTexto = producto.cantidad === 0 ? 'Sin stock' :
                              producto.cantidad <= 5 ? 'Poco stock' : 'Disponible';
            
            html += `
                <tr>
                    <td>
                        <img src="${producto.foto || './assets/img/no-image.svg'}" 
                             alt="${producto.nombre}" 
                             class="img-thumbnail" 
                             style="width: 50px; height: 50px; object-fit: cover;"
                             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNSAyMEMyNi4zODA3IDIwIDI3LjUgMTguODgwNyAyNy41IDE3LjVDMjcuNSAxNi4xMTkzIDI2LjM4MDcgMTUgMjUgMTVDMjMuNjE5MyAxNSAyMi41IDE2LjExOTMgMjIuNSAxNy41QzIyLjUgMTguODgwNyAyMy42MTkzIDIwIDI1IDIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzUgMTJIMTVDMTMuMzQzMSAxMiAxMiAxMy4zNDMxIDEyIDE1VjM1QzEyIDM2LjY1NjkgMTMuMzQzMSAzOCAxNSAzOEgzNUMzNi42NTY5IDM4IDM4IDM2LjY1NjkgMzggMzVWMTVDMzggMTMuMzQzMSAzNi42NTY5IDEyIDM1IDEyWk0zNSAzMkwzMCAyN0wyNSAzMkwyMCAyN0wxNSAzMlYxNUgzNVYzMloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';">
                    </td>
                    <td><strong>${producto.nombre}</strong></td>
                    <td>$${producto.precio.toFixed(2)}</td>
                    <td>${producto.cantidad}</td>
                    <td><span class="badge bg-${estadoClass}">${estadoTexto}</span></td>
                    <td>${producto.descripcion ? producto.descripcion.substring(0, 50) + '...' : 'Sin descripción'}</td>
                    <td>${new Date(producto.fechaCreacion).toLocaleDateString()}</td>
                    <td>
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-info btn-sm" 
                                    onclick="gestionProductos.verDetalles('${producto.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button type="button" class="btn btn-warning btn-sm" 
                                    onclick="gestionProductos.editarProducto('${producto.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button type="button" class="btn btn-danger btn-sm" 
                                    onclick="gestionProductos.confirmarEliminar('${producto.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        console.log('HTML generado, insertando en tabla');
        tbody.innerHTML = html;
        console.log('Tabla de productos cargada exitosamente');
    }

    actualizarEstadisticas() {
        const total = this.productos.length;
        const conStock = this.productos.filter(p => p.cantidad > 5).length;
        const pocoStock = this.productos.filter(p => p.cantidad > 0 && p.cantidad <= 5).length;
        const sinStock = this.productos.filter(p => p.cantidad === 0).length;

        document.getElementById('totalProductos').textContent = total;
        document.getElementById('conStock').textContent = conStock;
        document.getElementById('pocoStock').textContent = pocoStock;
        document.getElementById('sinStock').textContent = sinStock;
    }

    configurarFiltros() {
        console.log('🔧 Configurando filtros y búsqueda...');
        
        const buscar = document.getElementById('buscarProducto');
        const filtroStock = document.getElementById('filtroStock');
        const ordenar = document.getElementById('ordenarPor');
        const btnLimpiarFiltros = document.getElementById('btnLimpiarFiltros');

        console.log('Elementos encontrados:', {
            buscar: !!buscar,
            filtroStock: !!filtroStock,
            ordenar: !!ordenar,
            btnLimpiarFiltros: !!btnLimpiarFiltros
        });

        // Configurar cada evento por separado
        if (buscar) {
            console.log('Configurando eventos para buscar input');
            this.configurarEventoBusqueda(buscar);
        } else {
            console.warn('⚠️ No se encontró el elemento buscarProducto');
        }
        
        if (filtroStock) {
            console.log('Configurando eventos para filtro de stock');
            this.configurarEventoFiltroStock(filtroStock);
        } else {
            console.warn('⚠️ No se encontró el elemento filtroStock');
        }
        
        if (ordenar) {
            console.log('Configurando eventos para orden');
            this.configurarEventoOrden(ordenar);
        } else {
            console.warn('⚠️ No se encontró el elemento ordenarPor');
        }
        
        if (btnLimpiarFiltros) {
            console.log('Configurando botón limpiar filtros');
            this.configurarEventoLimpiar(btnLimpiarFiltros);
        } else {
            console.warn('⚠️ No se encontró el botón btnLimpiarFiltros');
        }
        
        console.log('✅ Filtros configurados correctamente');
    }

    verificarEventosFiltros() {
        console.log('🔍 Verificando que los eventos de filtros estén funcionando...');
        
        const buscar = document.getElementById('buscarProducto');
        const filtroStock = document.getElementById('filtroStock');
        const ordenar = document.getElementById('ordenarPor');
        const btnLimpiar = document.getElementById('btnLimpiarFiltros');
        
        console.log('Elementos encontrados:', {
            buscar: !!buscar,
            filtroStock: !!filtroStock,
            ordenar: !!ordenar,
            btnLimpiar: !!btnLimpiar
        });
        
        // Configurar eventos solo si no están ya configurados
        if (buscar && !buscar.hasAttribute('data-eventos-configurados')) {
            console.log('🔧 Configurando eventos de búsqueda...');
            this.configurarEventoBusqueda(buscar);
        }
        
        if (filtroStock && !filtroStock.hasAttribute('data-eventos-configurados')) {
            console.log('🔧 Configurando eventos de filtro stock...');
            this.configurarEventoFiltroStock(filtroStock);
        }
        
        if (ordenar && !ordenar.hasAttribute('data-eventos-configurados')) {
            console.log('🔧 Configurando eventos de orden...');
            this.configurarEventoOrden(ordenar);
        }
        
        if (btnLimpiar && !btnLimpiar.hasAttribute('data-eventos-configurados')) {
            console.log('🔧 Configurando eventos de botón limpiar...');
            this.configurarEventoLimpiar(btnLimpiar);
        }
        
        console.log('✅ Verificación de eventos completada');
    }

    // Configurar escuchador para actualizaciones automáticas
    configurarEscuchadorActualizaciones() {
        console.log('🔔 Configurando escuchador de actualizaciones...');
        
        // Escuchar evento personalizado
        window.addEventListener('productosActualizados', (event) => {
            console.log('📢 Recibida notificación de actualización:', event.detail);
            this.actualizarDatos();
        });
        
        // Verificar cambios en localStorage cada 2 segundos
        setInterval(() => {
            this.verificarCambiosEnStorage();
        }, 2000);
        
        console.log('✅ Escuchador de actualizaciones configurado');
    }

    // Verificar si hubo cambios en localStorage
    verificarCambiosEnStorage() {
        const ultimaActualizacion = localStorage.getItem('productosActualizados');
        
        if (ultimaActualizacion && ultimaActualizacion !== this.ultimaVerificacion) {
            console.log('🔄 Detectados cambios en localStorage, actualizando...');
            this.ultimaVerificacion = ultimaActualizacion;
            this.actualizarDatos();
        }
    }

    // Función unificada para actualizar datos
    actualizarDatos() {
        console.log('🔄 Actualizando datos de gestión...');
        
        // Recargar productos desde localStorage
        this.productos = this.cargarProductos();
        
        // Actualizar interfaz
        this.cargarTablaProductos();
        this.actualizarEstadisticas();
        
        // Re-aplicar filtros si hay alguno activo
        const buscar = document.getElementById('buscarProducto');
        const filtroStock = document.getElementById('filtroStock');
        const ordenar = document.getElementById('ordenarPor');
        
        if ((buscar && buscar.value) || 
            (filtroStock && filtroStock.value !== 'todos') || 
            (ordenar && ordenar.value !== 'nombre')) {
            console.log('📊 Re-aplicando filtros después de actualización...');
            this.filtrarProductos();
        }
        
        console.log('✅ Datos actualizados correctamente');
    }

    configurarEventoBusqueda(buscar) {
        // Verificar si ya tiene eventos configurados
        if (buscar.hasAttribute('data-eventos-configurados')) {
            console.log('⚡ Eventos de búsqueda ya configurados, saltando...');
            return;
        }
        
        // Configurar nuevo evento
        let timeoutBusqueda;
        buscar.addEventListener('input', (e) => {
            clearTimeout(timeoutBusqueda);
            timeoutBusqueda = setTimeout(() => {
                console.log('🔍 Búsqueda activada:', e.target.value);
                this.filtrarProductos();
            }, 300);
        });
        
        buscar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                clearTimeout(timeoutBusqueda);
                console.log('🔍 Búsqueda por Enter:', buscar.value);
                this.filtrarProductos();
            }
        });
        
        buscar.setAttribute('data-eventos-configurados', 'true');
        console.log('✅ Eventos de búsqueda configurados correctamente');
    }

    configurarEventoFiltroStock(filtroStock) {
        // Verificar si ya tiene eventos configurados
        if (filtroStock.hasAttribute('data-eventos-configurados')) {
            console.log('⚡ Eventos de filtro stock ya configurados, saltando...');
            return;
        }
        
        filtroStock.addEventListener('change', (e) => {
            console.log('📊 Filtro de stock cambiado:', e.target.value);
            this.filtrarProductos();
        });
        filtroStock.setAttribute('data-eventos-configurados', 'true');
        console.log('✅ Eventos de filtro stock configurados correctamente');
    }

    configurarEventoOrden(ordenar) {
        // Verificar si ya tiene eventos configurados
        if (ordenar.hasAttribute('data-eventos-configurados')) {
            console.log('⚡ Eventos de orden ya configurados, saltando...');
            return;
        }
        
        ordenar.addEventListener('change', (e) => {
            console.log('🔄 Orden cambiado:', e.target.value);
            this.filtrarProductos();
        });
        ordenar.setAttribute('data-eventos-configurados', 'true');
        console.log('✅ Eventos de orden configurados correctamente');
    }

    configurarEventoLimpiar(btnLimpiar) {
        // Verificar si ya tiene eventos configurados
        if (btnLimpiar.hasAttribute('data-eventos-configurados')) {
            console.log('⚡ Eventos de limpiar ya configurados, saltando...');
            return;
        }
        
        btnLimpiar.addEventListener('click', () => {
            console.log('🧹 Limpiando filtros...');
            this.limpiarFiltros();
        });
        btnLimpiar.setAttribute('data-eventos-configurados', 'true');
        console.log('✅ Eventos de limpiar configurados correctamente');
    }

    limpiarFiltros() {
        console.log('🧹 Limpiando todos los filtros...');
        
        // Limpiar campo de búsqueda
        const buscar = document.getElementById('buscarProducto');
        if (buscar) buscar.value = '';
        
        // Resetear filtro de stock
        const filtroStock = document.getElementById('filtroStock');
        if (filtroStock) filtroStock.value = 'todos';
        
        // Resetear orden
        const ordenar = document.getElementById('ordenarPor');
        if (ordenar) ordenar.value = 'nombre';
        
        // Recargar tabla sin filtros
        this.cargarTablaProductos();
        
        console.log('✅ Filtros limpiados, mostrando todos los productos');
    }

    filtrarProductos() {
        console.log('🔍 Aplicando filtros y búsqueda...');
        
        // Obtener valores de los filtros
        const buscar = document.getElementById('buscarProducto');
        const filtroStock = document.getElementById('filtroStock');
        const ordenar = document.getElementById('ordenarPor');
        
        const textoBusqueda = buscar ? buscar.value.toLowerCase().trim() : '';
        const tipoStock = filtroStock ? filtroStock.value : 'todos';
        const criterioOrden = ordenar ? ordenar.value : 'nombre';
        
        console.log('Filtros aplicados:', { textoBusqueda, tipoStock, criterioOrden });
        console.log('Total productos disponibles:', this.productos.length);
        
        // Iniciar con todos los productos
        let productosFiltrados = [...this.productos];
        
        // Filtrar por texto de búsqueda (buscar en nombre y descripción)
        if (textoBusqueda) {
            productosFiltrados = productosFiltrados.filter(producto => {
                const nombre = producto.nombre.toLowerCase();
                const descripcion = (producto.descripcion || '').toLowerCase();
                return nombre.includes(textoBusqueda) || descripcion.includes(textoBusqueda);
            });
            console.log(`Después de búsqueda por "${textoBusqueda}":`, productosFiltrados.length, 'productos');
        }
        
        // Filtrar por tipo de stock
        if (tipoStock !== 'todos') {
            switch (tipoStock) {
                case 'disponible':
                    productosFiltrados = productosFiltrados.filter(p => p.cantidad > 5);
                    break;
                case 'agotado':
                    productosFiltrados = productosFiltrados.filter(p => p.cantidad === 0);
                    break;
                case 'poco':
                    productosFiltrados = productosFiltrados.filter(p => p.cantidad > 0 && p.cantidad <= 5);
                    break;
            }
            console.log(`Después de filtro de stock "${tipoStock}":`, productosFiltrados.length, 'productos');
        }
        
        // Ordenar productos
        switch (criterioOrden) {
            case 'nombre':
                productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
            case 'precio':
                productosFiltrados.sort((a, b) => a.precio - b.precio);
                break;
            case 'stock':
            case 'cantidad':
                productosFiltrados.sort((a, b) => b.cantidad - a.cantidad);
                break;
            case 'fecha':
                productosFiltrados.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
                break;
            default:
                productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        }
        
        console.log(`Después de ordenar por "${criterioOrden}":`, productosFiltrados.length, 'productos');
        
        // Mostrar productos filtrados
        this.mostrarProductosFiltrados(productosFiltrados);
    }

    mostrarProductosFiltrados(productosFiltrados) {
        console.log('📋 Mostrando productos filtrados:', productosFiltrados.length);
        
        const tbody = document.getElementById('tablaProductos');
        const sinProductos = document.getElementById('sinProductos');
        const contadorResultados = document.getElementById('contadorResultados');
        const ultimaActualizacion = document.getElementById('ultimaActualizacion');
        
        // Actualizar contador de resultados
        if (contadorResultados) {
            const total = this.productos.length;
            if (productosFiltrados.length === total) {
                contadorResultados.innerHTML = `<i class="fas fa-list me-1"></i>Mostrando todos los platos (${total})`;
            } else {
                contadorResultados.innerHTML = `<i class="fas fa-filter me-1"></i>Mostrando ${productosFiltrados.length} de ${total} platos`;
            }
        }
        
        // Actualizar hora de última actualización
        if (ultimaActualizacion) {
            ultimaActualizacion.textContent = new Date().toLocaleTimeString();
        }
        
        if (!tbody) {
            console.error('Error: No se encontró el elemento tablaProductos');
            return;
        }
        
        if (productosFiltrados.length === 0) {
            console.log('No hay productos que coincidan con los filtros');
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-muted py-4">
                        <i class="fas fa-search fa-2x mb-2"></i>
                        <br>
                        No se encontraron platos que coincidan con los filtros aplicados.
                        <br>
                        <small>Intenta cambiar los criterios de búsqueda.</small>
                    </td>
                </tr>
            `;
            return;
        }

        if (sinProductos) {
            sinProductos.style.display = 'none';
        }
        
        let html = '';
        productosFiltrados.forEach((producto, index) => {
            const estadoClass = producto.cantidad === 0 ? 'danger' : 
                              producto.cantidad <= 5 ? 'warning' : 'success';
            const estadoTexto = producto.cantidad === 0 ? 'Sin stock' :
                              producto.cantidad <= 5 ? 'Poco stock' : 'Disponible';
            
            html += `
                <tr>
                    <td>
                        <img src="${producto.foto || './assets/img/no-image.svg'}" 
                             alt="${producto.nombre}" 
                             class="img-thumbnail" 
                             style="width: 50px; height: 50px; object-fit: cover;"
                             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNSAyMEMyNi4zODA3IDIwIDI3LjUgMTguODgwNyAyNy41IDE3LjVDMjcuNSAxNi4xMTkzIDI2LjM4MDcgMTUgMjUgMTVDMjMuNjE5MyAxNSAyMi41IDE2LjExOTMgMjIuNSAxNy41QzIyLjUgMTguODgwNyAyMy42MTkzIDIwIDI1IDIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzUgMTJIMTVDMTMuMzQzMSAxMiAxMiAxMy4zNDMxIDEyIDE1VjM1QzEyIDM2LjY1NjkgMTMuMzQzMSAzOCAxNSAzOEgzNUMzNi42NTY5IDM4IDM4IDM2LjY1NjkgMzggMzVWMTVDMzggMTMuMzQzMSAzNi42NTY5IDEyIDM1IDEyWk0zNSAzMkwzMCAyN0wyNSAzMkwyMCAyN0wxNSAzMlYxNUgzNVYzMloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';">
                    </td>
                    <td><strong>${producto.nombre}</strong></td>
                    <td>$${producto.precio.toFixed(2)}</td>
                    <td>${producto.cantidad}</td>
                    <td><span class="badge bg-${estadoClass}">${estadoTexto}</span></td>
                    <td>${producto.descripcion ? producto.descripcion.substring(0, 50) + '...' : 'Sin descripción'}</td>
                    <td>${new Date(producto.fechaCreacion).toLocaleDateString()}</td>
                    <td>
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-info btn-sm" 
                                    onclick="gestionProductos.verDetalles('${producto.id}')" title="Ver detalles">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button type="button" class="btn btn-warning btn-sm" 
                                    onclick="gestionProductos.editarProducto('${producto.id}')" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button type="button" class="btn btn-danger btn-sm" 
                                    onclick="gestionProductos.confirmarEliminar('${producto.id}')" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
        console.log('✅ Tabla filtrada cargada exitosamente con', productosFiltrados.length, 'productos');
    }

    verDetalles(id) {
        const producto = this.productos.find(p => p.id === id);
        if (!producto) return;

        document.getElementById('nombreDetalle').textContent = producto.nombre;
        document.getElementById('precioDetalle').textContent = `$${producto.precio.toFixed(2)}`;
        document.getElementById('stockDetalle').textContent = producto.cantidad;
        document.getElementById('fechaDetalle').textContent = new Date(producto.fechaCreacion).toLocaleDateString();
        document.getElementById('descripcionDetalle').textContent = producto.descripcion || 'Sin descripción';
        document.getElementById('fotoDetalle').src = producto.foto || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTA1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5Q0EzQUYiPlNpbiBmb3RvPC90ZXh0Pgo8L3N2Zz4=';

        const estadoTexto = producto.cantidad === 0 ? 'Sin stock' :
                          producto.cantidad <= 5 ? 'Poco stock' : 'Disponible';
        document.getElementById('estadoDetalle').innerHTML = `<span class="badge bg-${producto.cantidad === 0 ? 'danger' : producto.cantidad <= 5 ? 'warning' : 'success'}">${estadoTexto}</span>`;

        const modal = new bootstrap.Modal(document.getElementById('modalDetalles'));
        modal.show();
    }

    editarProducto(id) {
        // Usar el sistema de navegación del admin
        if (typeof cargarPaginasAdmin === 'function') {
            cargarPaginasAdmin(`editarProducto?id=${id}`);
        } else {
            window.location.href = `editarProducto.html?id=${id}`;
        }
    }

    confirmarEliminar(id) {
        const producto = this.productos.find(p => p.id === id);
        if (!producto) return;

        document.getElementById('nombreProductoEliminar').textContent = producto.nombre;
        
        const modal = new bootstrap.Modal(document.getElementById('modalEliminar'));
        modal.show();

        // Configurar botón de confirmación
        document.getElementById('btnConfirmarEliminar').onclick = () => {
            this.eliminarProducto(id);
            modal.hide();
        };
    }

    eliminarProducto(id) {
        this.productos = this.productos.filter(p => p.id !== id);
        this.guardarProductos();
        
        // Notificar actualización
        this.notificarActualizacion();
        
        this.cargarTablaProductos();
        this.actualizarEstadisticas();
    }

}

// Inicializar cuando se carga la página
const gestionProductos = new GestionProductos();

// Variable para evitar bucles infinitos
let configurandoEventos = false;

// Observador para detectar cambios en el DOM y reconfigurar filtros
const observer = new MutationObserver((mutations) => {
    // Evitar bucles infinitos
    if (configurandoEventos) return;
    
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            // Verificar si se agregó la tabla de productos
            const tablaProductos = document.getElementById('tablaProductos');
            const buscarProducto = document.getElementById('buscarProducto');
            
            if (tablaProductos && buscarProducto && window.gestionProductos) {
                console.log('🔄 Detectado cambio en DOM - Reconfigurando filtros...');
                configurandoEventos = true;
                setTimeout(() => {
                    window.gestionProductos.verificarEventosFiltros();
                    configurandoEventos = false;
                }, 100);
            }
        }
    });
});

// Observar cambios en el elemento principal
const principal = document.getElementById('principal');
if (principal) {
    observer.observe(principal, {
        childList: true,
        subtree: true
    });
}

// Función global para forzar actualización inmediata
window.actualizarGestionProductos = function() {
    console.log('🔥 FORZANDO ACTUALIZACIÓN INMEDIATA...');
    
    if (window.gestionProductos) {
        console.log('📊 Actualizando datos de gestión...');
        window.gestionProductos.productos = window.gestionProductos.cargarProductos();
        window.gestionProductos.cargarTablaProductos();
        window.gestionProductos.actualizarEstadisticas();
        
        // Reconfigurar filtros después de actualizar
        setTimeout(() => {
            console.log('🔧 Reconfigurando filtros después de actualización...');
            window.gestionProductos.configurarFiltros();
            window.gestionProductos.verificarEventosFiltros();
        }, 500);
        
        console.log('✅ Gestión actualizada exitosamente');
    } else {
        console.error('❌ Instancia de gestión no encontrada');
    }
};

// Función global para guardar producto (versión simple)
window.guardarProductoSimple = function() {
    console.log('=== GUARDAR PRODUCTO SIMPLE ===');
    
    if (window.gestionProductos) {
        console.log('Usando instancia de gestionProductos...');
        window.gestionProductos.crearProducto();
    } else {
        console.error('❌ Instancia de gestionProductos no encontrada');
        alert('Error: Sistema de gestión no disponible');
    }
};

// Función global para verificar localStorage desde la consola
window.verificarProductos = function() {
    console.log('=== VERIFICACIÓN MANUAL ===');
    if (window.gestionProductos) {
        window.gestionProductos.verificarLocalStorage();
        console.log('Productos en instancia:', window.gestionProductos.productos);
    } else {
        console.log('Instancia de gestionProductos no encontrada');
    }
    
    // Verificación directa
    const datos = localStorage.getItem('productos');
    console.log('Datos directos de localStorage:', datos);
};

// Función global para limpiar localStorage (para testing)
window.limpiarProductos = function() {
    localStorage.removeItem('productos');
    console.log('localStorage limpiado');
    if (window.gestionProductos) {
        window.gestionProductos.productos = [];
        console.log('Lista de productos reiniciada');
    }
};

// Función global para probar filtros
window.probarFiltros = function() {
    console.log('=== PROBANDO FILTROS ===');
    if (window.gestionProductos) {
        // Probar búsqueda
        const buscar = document.getElementById('buscarProducto');
        if (buscar) {
            console.log('Elemento buscar encontrado, valor actual:', buscar.value);
            buscar.value = 'test';
            buscar.dispatchEvent(new Event('input'));
            console.log('Evento input disparado manualmente');
        }
        
        // Verificar eventos
        window.gestionProductos.verificarEventosFiltros();
    }
};
