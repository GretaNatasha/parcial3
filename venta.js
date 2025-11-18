// Precios de las categorías
const PRECIOS = {
    vip: 50.00,
    butacas: 30.00,
    general: 15.00
};

// Nombres completos de las categorías
const CATEGORIAS = {
    vip: 'Puestos VIP',
    butacas: 'Puestos Butacas',
    general: 'Puestos Generales'
};

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('ventaForm');
    const categoriaSelect = document.getElementById('categoria');
    const cantidadInput = document.getElementById('cantidad');
    const nombreInput = document.getElementById('nombre');
    const telefonoInput = document.getElementById('telefono');
    const emailInput = document.getElementById('email');

    // Cargar ventas existentes
    cargarVentasRecientes();

    // Event listeners para actualizar precios en tiempo real
    categoriaSelect.addEventListener('change', actualizarResumenCompra);
    
    // Permitir entrada manual ilimitada
    cantidadInput.addEventListener('input', function() {
        // Solo validar que sea número positivo
        if (this.value < 1) {
            this.value = 1;
        }
        actualizarResumenCompra();
    });

    // Event listeners para validaciones en tiempo real
    nombreInput.addEventListener('input', function() {
        validarSoloLetras(this);
        formatearNombre(this);
        const error = validarNombreCompleto(this.value);
        mostrarErrorCampo(this, error);
    });

    telefonoInput.addEventListener('input', function() {
        validarSoloNumeros(this);
        formatearTelefono(this);
        const error = validarTelefono(this.value);
        mostrarErrorCampo(this, error);
    });

    emailInput.addEventListener('input', function() {
        const error = validarEmail(this.value);
        mostrarErrorCampo(this, error);
    });

    // Validar al perder el foco (blur)
    nombreInput.addEventListener('blur', function() {
        const error = validarNombreCompleto(this.value);
        mostrarErrorCampo(this, error);
    });

    telefonoInput.addEventListener('blur', function() {
        const error = validarTelefono(this.value);
        mostrarErrorCampo(this, error);
    });

    emailInput.addEventListener('blur', function() {
        const error = validarEmail(this.value);
        mostrarErrorCampo(this, error);
    });

    // Click en tarjetas de categoría
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const categoria = this.dataset.category;
            categoriaSelect.value = categoria;
            actualizarResumenCompra();
            
            // Efecto visual de selección
            document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Manejar envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validarFormulario()) {
            return;
        }

        // Mostrar modal de confirmación
        mostrarModalConfirmacion();
    });

    // Inicializar resumen
    actualizarResumenCompra();
});

// Función para validar solo letras en el nombre
function validarSoloLetras(input) {
    // Remover caracteres que no sean letras, espacios o acentos
    input.value = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    
    // Limitar a 50 caracteres
    if (input.value.length > 50) {
        input.value = input.value.substring(0, 50);
    }
}

// Función para validar solo números en el teléfono
function validarSoloNumeros(input) {
    // Remover caracteres que no sean números, +, espacios, guiones o paréntesis
    input.value = input.value.replace(/[^\d+\-\s()]/g, '');
    
    // Limitar a 15 caracteres (incluyendo formato)
    if (input.value.length > 15) {
        input.value = input.value.substring(0, 15);
    }
}

// Función para formatear teléfono mientras se escribe
function formatearTelefono(input) {
    let valor = input.value.replace(/\D/g, ''); // Remover todo excepto números
    
    // Aplicar formato panameño: +507 XXX-XXXX
    if (valor.length > 0) {
        if (valor.startsWith('507')) {
            valor = '+' + valor;
        } else if (!valor.startsWith('+507') && valor.length >= 3) {
            valor = '+507 ' + valor.substring(3);
        }
        
        // Aplicar formato: +507 XXX-XXXX
        if (valor.length > 4) {
            valor = valor.substring(0, 5) + ' ' + valor.substring(5);
        }
        if (valor.length > 9) {
            valor = valor.substring(0, 9) + '-' + valor.substring(9);
        }
    }
    
    input.value = valor;
}

// Función para formatear nombre (capitalizar)
function formatearNombre(input) {
    if (input.value.length > 0) {
        let palabras = input.value.split(' ');
        palabras = palabras.map(palabra => {
            if (palabra.length > 0) {
                return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
            }
            return palabra;
        });
        input.value = palabras.join(' ');
    }
}

// Función para mostrar mensaje de error en un campo
function mostrarErrorCampo(campo, mensaje) {
    // Remover error anterior
    const errorAnterior = campo.parentNode.querySelector('.error-message');
    if (errorAnterior) {
        errorAnterior.remove();
    }
    
    // Remover clase de error anterior
    campo.classList.remove('error-input');
    
    if (mensaje) {
        // Agregar clase de error
        campo.classList.add('error-input');
        
        // Crear elemento de error
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${mensaje}`;
        campo.parentNode.appendChild(errorElement);
    }
}

// Función para validar nombre completo
function validarNombreCompleto(nombre) {
    const nombreLimpio = nombre.trim();
    
    if (nombreLimpio.length === 0) {
        return 'El nombre completo es requerido';
    }
    
    if (nombreLimpio.length < 2) {
        return 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (nombreLimpio.length > 50) {
        return 'El nombre no puede exceder 50 caracteres';
    }
    
    // Validar que tenga al menos un espacio (nombre y apellido)
    if (!nombreLimpio.includes(' ')) {
        return 'Por favor ingrese nombre y apellido';
    }
    
    // Validar formato de nombre (solo letras y espacios)
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;
    if (!regex.test(nombreLimpio)) {
        return 'El nombre solo puede contener letras y espacios';
    }
    
    return null; // Sin errores
}

// Función para validar teléfono
function validarTelefono(telefono) {
    const telefonoLimpio = telefono.replace(/\D/g, ''); // Solo números
    
    if (telefonoLimpio.length === 0) {
        return 'El teléfono es requerido';
    }
    
    if (telefonoLimpio.length < 8) {
        return 'El teléfono debe tener al menos 8 dígitos';
    }
    
    if (telefonoLimpio.length > 12) {
        return 'El teléfono no puede exceder 12 dígitos';
    }
    
    // Validar que sea un número panameño válido (opcional)
    if (!telefonoLimpio.startsWith('507') && telefonoLimpio.length >= 8) {
        return 'Formato recomendado: +507 XXX-XXXX';
    }
    
    return null; // Sin errores
}

// Función para validar email
function validarEmail(email) {
    const emailLimpio = email.trim();
    
    if (emailLimpio.length === 0) {
        return 'El correo electrónico es requerido';
    }
    
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(emailLimpio)) {
        return 'Por favor ingrese un correo electrónico válido';
    }
    
    return null; // Sin errores
}

// Validar formulario
function validarFormulario() {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const categoria = document.getElementById('categoria').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);

    let formularioValido = true;

    // Validar nombre
    const errorNombre = validarNombreCompleto(nombre);
    mostrarErrorCampo(document.getElementById('nombre'), errorNombre);
    if (errorNombre) formularioValido = false;

    // Validar email
    const errorEmail = validarEmail(email);
    mostrarErrorCampo(document.getElementById('email'), errorEmail);
    if (errorEmail) formularioValido = false;

    // Validar teléfono
    const errorTelefono = validarTelefono(telefono);
    mostrarErrorCampo(document.getElementById('telefono'), errorTelefono);
    if (errorTelefono) formularioValido = false;

    // Validar categoría
    if (!categoria) {
        mostrarErrorCampo(document.getElementById('categoria'), 'Por favor seleccione una categoría');
        formularioValido = false;
    } else {
        mostrarErrorCampo(document.getElementById('categoria'), null);
    }

    // Validar cantidad
    if (!cantidad || cantidad < 1) {
        mostrarErrorCampo(document.getElementById('cantidad'), 'La cantidad debe ser al menos 1');
        formularioValido = false;
    } else {
        mostrarErrorCampo(document.getElementById('cantidad'), null);
    }

    if (!formularioValido) {
        mostrarNotificacion('Por favor corrija los errores en el formulario', 'error');
        return false;
    }

    return true;
}

// Ajustar cantidad - SIN LÍMITE
function adjustQuantity(change) {
    const cantidadInput = document.getElementById('cantidad');
    let cantidad = parseInt(cantidadInput.value) + change;
    
    // Solo limitar mínimo a 1, sin máximo
    cantidad = Math.max(1, cantidad);
    
    cantidadInput.value = cantidad;
    actualizarResumenCompra();
}

// Actualizar resumen de compra en tiempo real
function actualizarResumenCompra() {
    const categoria = document.getElementById('categoria').value;
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    
    if (!categoria) {
        // Resetear valores si no hay categoría seleccionada
        document.getElementById('precioUnitario').textContent = 'Precio unitario: $0.00';
        document.getElementById('precioTotal').textContent = 'Total: $0.00';
        
        document.getElementById('summaryCategoria').textContent = '-';
        document.getElementById('summaryCantidad').textContent = '0';
        document.getElementById('summaryPrecioUnitario').textContent = '$0.00';
        document.getElementById('summaryTotal').textContent = '$0.00';
        return;
    }

    const precioUnitario = PRECIOS[categoria];
    const total = precioUnitario * cantidad;

    // Actualizar información de precios
    document.getElementById('precioUnitario').textContent = `Precio unitario: $${precioUnitario.toFixed(2)}`;
    document.getElementById('precioTotal').textContent = `Total: $${total.toFixed(2)}`;

    // Actualizar resumen de compra
    document.getElementById('summaryCategoria').textContent = CATEGORIAS[categoria];
    document.getElementById('summaryCantidad').textContent = cantidad.toLocaleString();
    document.getElementById('summaryPrecioUnitario').textContent = `$${precioUnitario.toFixed(2)}`;
    document.getElementById('summaryTotal').textContent = `$${total.toFixed(2)}`;
}

// Mostrar modal de confirmación
function mostrarModalConfirmacion() {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const categoria = document.getElementById('categoria').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const total = PRECIOS[categoria] * cantidad;

    const modalHTML = `
        <div class="modal-overlay" id="confirmationModal">
            <div class="modal">
                <div class="modal-header">
                    <h3><i class="fas fa-check-circle"></i> Confirmar Compra</h3>
                    <button class="modal-close" onclick="cerrarModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="confirmation-details">
                        <h4>Resumen de su compra:</h4>
                        <div class="detail-item">
                            <span>Nombre:</span>
                            <span>${nombre}</span>
                        </div>
                        <div class="detail-item">
                            <span>Email:</span>
                            <span>${email}</span>
                        </div>
                        <div class="detail-item">
                            <span>Teléfono:</span>
                            <span>${telefono}</span>
                        </div>
                        <div class="detail-item">
                            <span>Categoría:</span>
                            <span>${CATEGORIAS[categoria]}</span>
                        </div>
                        <div class="detail-item">
                            <span>Cantidad:</span>
                            <span>${cantidad.toLocaleString()} boleto(s)</span>
                        </div>
                        <div class="detail-item total">
                            <span>Total a pagar:</span>
                            <span>$${total.toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="cerrarModal()">
                            <i class="fas fa-edit"></i> Corregir Datos
                        </button>
                        <button class="btn-primary" onclick="confirmarCompra()">
                            <i class="fas fa-check"></i> Confirmar y Pagar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Agregar estilos del modal si no existen
    if (!document.querySelector('#modalStyles')) {
        const modalStyles = `
            <style id="modalStyles">
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(23, 21, 94, 0.9);
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    padding: 20px;
                    animation: fadeIn 0.3s ease;
                }
                
                .modal {
                    background: linear-gradient(135deg, #213A75, #2F698B);
                    border-radius: 20px;
                    padding: 0;
                    max-width: 500px;
                    width: 100%;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                
                .modal-header {
                    background: linear-gradient(135deg, #54B79A, #409DA1);
                    padding: 25px 30px;
                    border-radius: 20px 20px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .modal-header h3 {
                    color: white;
                    margin: 0;
                    font-size: 1.4rem;
                }
                
                .modal-header h3 i {
                    margin-right: 10px;
                }
                
                .modal-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 5px;
                    border-radius: 50%;
                    width: 35px;
                    height: 35px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.3s ease;
                }
                
                .modal-close:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .modal-body {
                    padding: 30px;
                }
                
                .confirmation-details {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 25px;
                }
                
                .confirmation-details h4 {
                    color: #84E488;
                    margin-bottom: 20px;
                    text-align: center;
                    font-size: 1.2rem;
                }
                
                .detail-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .detail-item.total {
                    border-bottom: none;
                    border-top: 2px solid #84E488;
                    margin-top: 10px;
                    padding-top: 15px;
                    font-weight: 700;
                    font-size: 1.1rem;
                }
                
                .detail-item span:first-child {
                    color: #8BCE90;
                }
                
                .detail-item span:last-child {
                    color: #84E488;
                    font-weight: 600;
                }
                
                .modal-actions {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                }
                
                .modal-actions button {
                    flex: 1;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes scaleIn {
                    from { 
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to { 
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                @media (max-width: 768px) {
                    .modal-actions {
                        flex-direction: column;
                    }
                    
                    .modal-header {
                        padding: 20px;
                    }
                    
                    .modal-body {
                        padding: 20px;
                    }
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', modalStyles);
    }
}

// Cerrar modal
function cerrarModal() {
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Confirmar compra
function confirmarCompra() {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const categoria = document.getElementById('categoria').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);

    // Crear venta
    const venta = {
        id: Date.now(),
        nombre: nombre,
        email: email,
        telefono: telefono,
        categoria: categoria,
        cantidad: cantidad,
        precioUnitario: PRECIOS[categoria],
        total: cantidad * PRECIOS[categoria],
        fecha: new Date().toLocaleString('es-PA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    // Guardar venta
    guardarVenta(venta);
    
    // Actualizar interfaz
    agregarVentaALista(venta);
    
    // Limpiar formulario
    document.getElementById('ventaForm').reset();
    document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
    actualizarResumenCompra();
    
    // Cerrar modal
    cerrarModal();
    
    // Mostrar confirmación
    mostrarNotificacion(`
        <strong>¡Compra confirmada!</strong><br>
        Se ha enviado la confirmación a ${email}<br>
        Total: $${venta.total.toFixed(2)}
    `, 'success');
}

// Guardar venta en localStorage
function guardarVenta(venta) {
    let ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    ventas.push(venta);
    localStorage.setItem('ventas', JSON.stringify(ventas));
}

// Agregar venta a la lista visual
function agregarVentaALista(venta) {
    const ventasList = document.getElementById('ventasList');
    
    // Remover estado vacío si existe
    const emptyState = ventasList.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    const ventaElement = document.createElement('div');
    ventaElement.className = 'venta-item';
    ventaElement.innerHTML = `
        <div class="venta-info">
            <div>
                <div class="venta-cliente">${venta.nombre}</div>
                <div class="venta-detalles">
                    ${CATEGORIAS[venta.categoria]} • ${venta.cantidad.toLocaleString()} boleto(s) • $${venta.total.toFixed(2)}
                </div>
                <div class="venta-contacto">
                    <small>${venta.email} • ${venta.telefono}</small>
                </div>
            </div>
            <div class="venta-fecha">${venta.fecha}</div>
        </div>
    `;
    
    // Agregar al inicio de la lista
    ventasList.insertBefore(ventaElement, ventasList.firstChild);
    
    // Limitar a 8 ventas recientes
    if (ventasList.children.length > 8) {
        ventasList.removeChild(ventasList.lastChild);
    }
}

// Cargar ventas recientes
function cargarVentasRecientes() {
    const ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    const ventasRecientes = ventas.slice(-8).reverse(); // Últimas 8 ventas
    
    const ventasList = document.getElementById('ventasList');
    
    if (ventasRecientes.length === 0) {
        // Mostrar estado vacío
        ventasList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <p>No hay compras recientes</p>
                <small>Las compras aparecerán aquí</small>
            </div>
        `;
        return;
    }
    
    ventasRecientes.forEach(venta => {
        agregarVentaALista(venta);
    });
}

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'success') {
    // Remover notificación existente
    const notificacionExistente = document.querySelector('.notification');
    if (notificacionExistente) {
        notificacionExistente.remove();
    }
    
    const notificacion = document.createElement('div');
    notificacion.className = `notification ${tipo}`;
    notificacion.innerHTML = mensaje;
    
    document.body.appendChild(notificacion);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 400);
    }, 5000);
}