// Precios de las categorías
const PRECIOS = {
    vip: 50.00,
    butacas: 30.00,
    general: 15.00
};

// Inicializar la página de resumen
document.addEventListener('DOMContentLoaded', function() {
    cargarResumen();
    
    // Manejar botón de limpiar datos
    document.getElementById('limpiarDatos').addEventListener('click', function() {
        mostrarModalConfirmacionLimpiar();
    });
});

// Mostrar modal de confirmación para limpiar datos
function mostrarModalConfirmacionLimpiar() {
    const ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    
    if (ventas.length === 0) {
        mostrarNotificacion('No hay datos para limpiar', 'error');
        return;
    }

    const modalHTML = `
        <div class="modal-overlay" id="clearDataModal">
            <div class="modal">
                <div class="modal-header error">
                    <h3><i class="fas fa-exclamation-triangle"></i> Confirmar Eliminación</h3>
                    <button class="modal-close" onclick="cerrarModalClear()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="confirmation-details">
                        <h4>¿Está seguro de que desea eliminar todos los datos?</h4>
                        <p style="text-align: center; color: #8BCE90; margin: 20px 0;">
                            Se eliminarán <strong>${ventas.length} registros</strong> de ventas.<br>
                            <small>Esta acción no se puede deshacer.</small>
                        </p>
                    </div>
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="cerrarModalClear()">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                        <button class="btn-primary error" onclick="limpiarDatosConfirmado()">
                            <i class="fas fa-trash"></i> Sí, Eliminar Todo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Agregar estilos del modal si no existen
    if (!document.querySelector('#modalStylesResumen')) {
        const modalStyles = `
            <style id="modalStylesResumen">
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
                
                .modal-header.error {
                    background: linear-gradient(135deg, #e74c3c, #c0392b);
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
                
                .confirmation-details p {
                    text-align: center;
                    color: #8BCE90;
                    margin: 20px 0;
                    line-height: 1.5;
                }
                
                .confirmation-details strong {
                    color: #84E488;
                }
                
                .confirmation-details small {
                    opacity: 0.8;
                }
                
                .modal-actions {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                }
                
                .modal-actions button {
                    flex: 1;
                }
                
                .btn-primary.error {
                    background: linear-gradient(135deg, #e74c3c, #c0392b);
                    border: none;
                }
                
                .btn-primary.error:hover {
                    background: linear-gradient(135deg, #ec7063, #e74c3c);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);
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

// Cerrar modal de limpiar datos
function cerrarModalClear() {
    const modal = document.getElementById('clearDataModal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Confirmar limpieza de datos
function limpiarDatosConfirmado() {
    localStorage.removeItem('ventas');
    cargarResumen();
    cerrarModalClear();
    mostrarNotificacion('Todos los datos han sido eliminados correctamente', 'success');
}

// Cargar y mostrar el resumen
function cargarResumen() {
    const ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    
    // Calcular estadísticas
    const estadisticas = calcularEstadisticas(ventas);
    
    // Actualizar interfaz
    actualizarResumen(estadisticas);
}

// Calcular estadísticas de ventas
function calcularEstadisticas(ventas) {
    const estadisticas = {
        total: {
            boletos: 0,
            dinero: 0,
            ventas: ventas.length
        },
        vip: {
            boletos: 0,
            dinero: 0
        },
        butacas: {
            boletos: 0,
            dinero: 0
        },
        general: {
            boletos: 0,
            dinero: 0
        }
    };
    
    ventas.forEach(venta => {
        estadisticas.total.boletos += venta.cantidad;
        estadisticas.total.dinero += venta.total;
        
        if (estadisticas[venta.categoria]) {
            estadisticas[venta.categoria].boletos += venta.cantidad;
            estadisticas[venta.categoria].dinero += venta.total;
        }
    });

    // Calcular porcentajes
    if (estadisticas.total.boletos > 0) {
        estadisticas.vip.porcentaje = (estadisticas.vip.boletos / estadisticas.total.boletos * 100).toFixed(1);
        estadisticas.butacas.porcentaje = (estadisticas.butacas.boletos / estadisticas.total.boletos * 100).toFixed(1);
        estadisticas.general.porcentaje = (estadisticas.general.boletos / estadisticas.total.boletos * 100).toFixed(1);
    } else {
        estadisticas.vip.porcentaje = 0;
        estadisticas.butacas.porcentaje = 0;
        estadisticas.general.porcentaje = 0;
    }
    
    return estadisticas;
}

// Actualizar la interfaz con las estadísticas
function actualizarResumen(estadisticas) {
    // Totales generales
    document.getElementById('totalBoletos').textContent = estadisticas.total.boletos.toLocaleString();
    document.getElementById('totalDinero').textContent = `$${estadisticas.total.dinero.toFixed(2)}`;
    document.getElementById('totalVentas').textContent = estadisticas.total.ventas.toLocaleString();
    
    // VIP
    document.getElementById('vipCantidad').textContent = estadisticas.vip.boletos.toLocaleString();
    document.getElementById('vipTotal').textContent = `$${estadisticas.vip.dinero.toFixed(2)}`;
    document.getElementById('vipPorcentaje').textContent = `${estadisticas.vip.porcentaje}%`;
    
    // Butacas
    document.getElementById('butacasCantidad').textContent = estadisticas.butacas.boletos.toLocaleString();
    document.getElementById('butacasTotal').textContent = `$${estadisticas.butacas.dinero.toFixed(2)}`;
    document.getElementById('butacasPorcentaje').textContent = `${estadisticas.butacas.porcentaje}%`;
    
    // General
    document.getElementById('generalCantidad').textContent = estadisticas.general.boletos.toLocaleString();
    document.getElementById('generalTotal').textContent = `$${estadisticas.general.dinero.toFixed(2)}`;
    document.getElementById('generalPorcentaje').textContent = `${estadisticas.general.porcentaje}%`;
    
    // Agregar animaciones a los números
    animarNumeros();
}

// Animación para los números del resumen
function animarNumeros() {
    const elementos = document.querySelectorAll('.summary-value, .stat-value');
    
    elementos.forEach(elemento => {
        elemento.style.opacity = '0';
        elemento.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            elemento.style.transition = 'all 0.5s ease';
            elemento.style.opacity = '1';
            elemento.style.transform = 'translateY(0)';
        }, 100);
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
    
    // Remover después de 4 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 400);
    }, 4000);
}