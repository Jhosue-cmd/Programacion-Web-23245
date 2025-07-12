// gestionProductos.js - Manejo de productos con localStorage y cámara

class GestionProductos {
    constructor() {
        console.log('=== INICIALIZANDO GESTIÓN DE PRODUCTOS ===');
        this.productos = this.cargarProductos();
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

            console.log('Producto creado y guardado exitosamente');

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
                alert('Producto guardado exitosamente');
                
                // Limpiar formulario
                document.getElementById('formCrearProducto').reset();
                if (window.fotoProductos) {
                    window.fotoProductos.limpiarTodo();
                }
                
                // Redirigir
                if (typeof cargarPaginasAdmin === 'function') {
                    cargarPaginasAdmin('gestionProductos');
                } else if (typeof window.cargarPaginasAdmin === 'function') {
                    window.cargarPaginasAdmin('gestionProductos');
                }
            }
            
        } catch (error) {
            console.error('Error al crear producto:', error);
            alert('Error al guardar el producto: ' + error.message);
        }
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

            console.log('Producto actualizado exitosamente:', this.productos[index]);

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
                alert('Producto actualizado exitosamente');
                
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
        this.verificarLocalStorage();
        this.cargarTablaProductos();
        this.actualizarEstadisticas();
        this.configurarFiltros();
        
        // Event listeners
        const btnActualizar = document.getElementById('btnActualizar');
        if (btnActualizar) {
            btnActualizar.addEventListener('click', () => {
                console.log('Botón actualizar clickeado');
                this.verificarLocalStorage();
                this.cargarTablaProductos();
                this.actualizarEstadisticas();
            });
        }
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
            contadorResultados.innerHTML = `<i class="fas fa-list me-1"></i>Mostrando todos los productos (${this.productos.length})`;
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

        // Debounce para la búsqueda (esperar 300ms después de que el usuario deje de escribir)
        let timeoutBusqueda;
        if (buscar) {
            buscar.addEventListener('input', () => {
                clearTimeout(timeoutBusqueda);
                timeoutBusqueda = setTimeout(() => {
                    console.log('🔍 Búsqueda activada:', buscar.value);
                    this.filtrarProductos();
                }, 300);
            });
            
            // También filtrar cuando presione Enter
            buscar.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    clearTimeout(timeoutBusqueda);
                    console.log('🔍 Búsqueda por Enter:', buscar.value);
                    this.filtrarProductos();
                }
            });
        }
        
        if (filtroStock) {
            filtroStock.addEventListener('change', () => {
                console.log('📊 Filtro de stock cambiado:', filtroStock.value);
                this.filtrarProductos();
            });
        }
        
        if (ordenar) {
            ordenar.addEventListener('change', () => {
                console.log('🔄 Orden cambiado:', ordenar.value);
                this.filtrarProductos();
            });
        }
        
        // Botón para limpiar filtros
        const btnLimpiarFiltros = document.getElementById('btnLimpiarFiltros');
        if (btnLimpiarFiltros) {
            btnLimpiarFiltros.addEventListener('click', () => {
                console.log('🧹 Limpiando filtros...');
                this.limpiarFiltros();
            });
        }
        
        console.log('✅ Filtros configurados correctamente');
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
        
        // Iniciar con todos los productos
        let productosFiltrados = [...this.productos];
        
        // Filtrar por texto de búsqueda (buscar en nombre)
        if (textoBusqueda) {
            productosFiltrados = productosFiltrados.filter(producto => 
                producto.nombre.toLowerCase().includes(textoBusqueda)
            );
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
                contadorResultados.innerHTML = `<i class="fas fa-list me-1"></i>Mostrando todos los productos (${total})`;
            } else {
                contadorResultados.innerHTML = `<i class="fas fa-filter me-1"></i>Mostrando ${productosFiltrados.length} de ${total} productos`;
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
                        No se encontraron productos que coincidan con los filtros aplicados.
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
        this.cargarTablaProductos();
        this.actualizarEstadisticas();
    }

}

// Inicializar cuando se carga la página
const gestionProductos = new GestionProductos();

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
