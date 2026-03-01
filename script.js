// ============================
// MATES DEL IBERÁ - JavaScript
// Configurador de Mate
// ============================

// Estado del configurador
const state = {
    currentStep: 1,
    totalSteps: 5,
    selections: {
        tamano: { value: null, price: 0 },
        modelo: { value: null, price: 0 },
        letra: { value: 'sin', text: '', price: 0 },
        bombilla: { value: null, price: 0 }
    }
};

// Precios de referencia para el resumen (etiquetas)
const priceLabels = {
    tamano: {
        chico: 'Mate Chico',
        mediano: 'Mate Mediano',
        grande: 'Mate Grande'
    },
    modelo: {
        basico: 'Modelo Básico',
        clasico: 'Modelo Clásico',
        premium: 'Modelo Premium'
    },
    letra: {
        sin: 'Sin letras en ligas',
        con: 'Con letras en ligas'
    },
    bombilla: {
        recta: 'Bombilla Recta',
        curvada: 'Bombilla Curvada'
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initializeConfigurator();
    initializeForm();
    updatePrice();
});

// Inicializar el configurador
function initializeConfigurator() {
    // Event listeners para las tarjetas de opciones (con imagen y simples)
    const allCards = document.querySelectorAll('.option-card-img, .option-card');
    
    allCards.forEach(card => {
        card.addEventListener('click', function() {
            handleOptionSelect(this);
        });
    });

    // Event listener para el input de letras
    const letrasInput = document.getElementById('letrasTexto');
    if (letrasInput) {
        letrasInput.addEventListener('input', function() {
            state.selections.letra.text = this.value.toUpperCase();
            // Actualizar resumen si ya estamos en ese paso (opcional, pero buena UX)
        });
    }
}

// Manejar selección de opciones
function handleOptionSelect(card) {
    const value = card.dataset.value;
    const price = parseInt(card.dataset.price) || 0;
    
    // Identificar en qué paso estamos según el contenedor
    const stepContainer = card.closest('.config-step');
    const stepId = stepContainer.id;

    // Lógica por paso
    if (stepId === 'step1') {
        // Paso 1: Tamaño
        document.querySelectorAll('#step1 .option-card-img').forEach(c => { c.classList.remove('selected'); });
        card.classList.add('selected');
        
        state.selections.tamano = { value: value, price: price };
        
        // Habilitar siguiente
        document.querySelector('#step1 .btn-next').disabled = false;
    }
    else if (stepId === 'step2') {
        // Paso 2: Modelo
        document.querySelectorAll('#step2 .option-card-img').forEach(c => { c.classList.remove('selected'); });
        card.classList.add('selected');
        
        state.selections.modelo = { value: value, price: price };
        
        // Habilitar siguiente
        document.querySelector('#step2 .btn-next').disabled = false;
    }
    else if (stepId === 'step3') {
        // Paso 3: Letras
        document.querySelectorAll('#step3 .option-card').forEach(c => { c.classList.remove('selected'); });
        card.classList.add('selected');
        
        state.selections.letra.value = value;
        state.selections.letra.price = price;
        
        // Mostrar/ocultar input
        const inputContainer = document.getElementById('ligasLetraInput');
        if (value === 'con') {
            inputContainer.classList.remove('hidden');
        } else {
            inputContainer.classList.add('hidden');
            state.selections.letra.text = ''; // Limpiar texto si selecciona "sin"
            document.getElementById('letrasTexto').value = '';
        }
    }
    else if (stepId === 'step4') {
        // Paso 4: Bombilla
        document.querySelectorAll('#step4 .option-card-img').forEach(c => { c.classList.remove('selected'); });
        card.classList.add('selected');
        
        state.selections.bombilla = { value: value, price: price };
        
        // Habilitar botón para ir al resumen
        document.querySelector('#step4 .btn-next').disabled = false;
    }

    // Calcular precio total (aunque no se muestre hasta el final, es bueno tenerlo actualizado)
    // Nota: El diseño original no muestra precio flotante, solo en resumen.
}

// Calcular precio total
function calculateTotal() {
    let total = 0;
    
    // Sumar solo si hay selección (para evitar NaN o errores)
    if (state.selections.tamano.price) total += state.selections.tamano.price;
    if (state.selections.modelo.price) total += state.selections.modelo.price;
    if (state.selections.letra.price) total += state.selections.letra.price;
    if (state.selections.bombilla.price) total += state.selections.bombilla.price;
    
    return total;
}

// Actualizar visualización del precio (en el resumen)
function updatePrice() {
    const total = calculateTotal();
    const formattedPrice = formatPrice(total);
    
    const totalPriceEl = document.getElementById('totalPrice');
    if (totalPriceEl) {
        totalPriceEl.textContent = formattedPrice;
    }
}

// Formatear precio
function formatPrice(price) {
    return '$' + price.toLocaleString('es-AR');
}

// Navegación entre pasos
function nextStep() {
    if (state.currentStep < state.totalSteps) {
        // Validaciones
        if (state.currentStep === 1 && !state.selections.tamano.value) return;
        if (state.currentStep === 2 && !state.selections.modelo.value) return;
        if (state.currentStep === 3 && state.selections.letra.value === 'con' && document.getElementById('letrasTexto').value.trim() === '') {
            // Opcional: Validar que escriba algo si eligió "con letras"
            // Por ahora permitimos vacío o lo validamos al final
        }
        if (state.currentStep === 4 && !state.selections.bombilla.value) return;
        
        // Si vamos al paso 5 (Resumen), generar contenido
        if (state.currentStep === 4) {
            generateSummary();
            updatePrice();
        }

        // Cambio de paso UI
        document.getElementById(`step${state.currentStep}`).classList.remove('active');
        state.currentStep++;
        document.getElementById(`step${state.currentStep}`).classList.add('active');
        
        updateProgressBar();
        document.getElementById('configurador').scrollIntoView({ behavior: 'smooth' });
    }
}

function prevStep() {
    if (state.currentStep > 1) {
        document.getElementById(`step${state.currentStep}`).classList.remove('active');
        state.currentStep--;
        document.getElementById(`step${state.currentStep}`).classList.add('active');
        
        updateProgressBar();
        document.getElementById('configurador').scrollIntoView({ behavior: 'smooth' });
    }
}

// Actualizar barra de progreso
function updateProgressBar() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum === state.currentStep) {
            step.classList.add('active');
        } else if (stepNum < state.currentStep) {
            step.classList.add('completed');
        }
    });
}

// Generar resumen HTML
function generateSummary() {
    const summaryContent = document.getElementById('summaryContent');
    let html = '';

    // Precio del mate = tamaño + modelo + letra (agrupados como "Mate")
    const precioMate = state.selections.tamano.price
        + state.selections.modelo.price
        + state.selections.letra.price;

    const tamanoLabel = priceLabels.tamano[state.selections.tamano.value] || '';
    const modeloLabel = priceLabels.modelo[state.selections.modelo.value] || '';
    let mateDesc = `${tamanoLabel} · ${modeloLabel}`;
    if (state.selections.letra.value === 'con') {
        const letrasTexto = state.selections.letra.text
            ? ` (${state.selections.letra.text})`
            : '';
        mateDesc += ` · Con letras${letrasTexto}`;
    }

    html += createSummaryItem('Mate', mateDesc, formatPrice(precioMate));

    // Bombilla
    if (state.selections.bombilla.value) {
        html += createSummaryItem(
            'Bombilla',
            priceLabels.bombilla[state.selections.bombilla.value],
            formatPrice(state.selections.bombilla.price)
        );
    }

    summaryContent.innerHTML = html;
}

function createSummaryItem(label, description, value) {
    return `
        <div class="summary-item">
            <div>
                <span class="label">${label}</span>
                <span class="summary-desc">${description}</span>
            </div>
            <span class="value">${value}</span>
        </div>
    `;
}

// Inicializar formulario
function initializeForm() {
    const form = document.getElementById('orderForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Recopilar datos
        const formData = {
            cliente: {
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email').value,
                telefono: document.getElementById('telefono').value,
                direccion: document.getElementById('direccion').value,
                ciudad: document.getElementById('ciudad').value,
                comentarios: document.getElementById('comentarios').value
            },
            pedido: {
                tamano: state.selections.tamano.value,
                modelo: state.selections.modelo.value,
                letras: state.selections.letra.value === 'con' ? state.selections.letra.text : 'No',
                bombilla: state.selections.bombilla.value,
                total: calculateTotal()
            }
        };
        
        // Armar mensaje de WhatsApp
        const nombre = formData.cliente.nombre;
        const tamano = priceLabels.tamano[formData.pedido.tamano] || formData.pedido.tamano;
        const modelo = priceLabels.modelo[formData.pedido.modelo] || formData.pedido.modelo;
        const bombilla = priceLabels.bombilla[formData.pedido.bombilla] || formData.pedido.bombilla;
        const letras = state.selections.letra.value === 'con'
            ? `Con letras: ${state.selections.letra.text || '(a confirmar)'}`
            : 'Sin letras';
        const precioMate = state.selections.tamano.price + state.selections.modelo.price + state.selections.letra.price;
        const ciudad = formData.cliente.ciudad ? `\n📍 Ciudad: ${formData.cliente.ciudad}` : '';
        const direccion = formData.cliente.direccion ? `\n🏠 Dirección: ${formData.cliente.direccion}` : '';
        const comentarios = formData.cliente.comentarios ? `\n💬 Comentarios: ${formData.cliente.comentarios}` : '';

        const mensaje =
`¡Hola! Quiero encargar un mate personalizado 🧉

👤 Nombre: ${nombre}
📱 Teléfono: ${formData.cliente.telefono}
📧 Email: ${formData.cliente.email}${ciudad}${direccion}

📦 *Detalle del pedido:*
• Mate: ${tamano} · ${modelo} · ${letras} — ${formatPrice(precioMate)}
• Bombilla: ${bombilla} — ${formatPrice(state.selections.bombilla.price)}

💰 *Total estimado: ${formatPrice(calculateTotal())}*${comentarios}`;

        form.reset();

        const urlWhatsApp = `https://wa.me/5493794143509?text=${encodeURIComponent(mensaje)}`;
        window.open(urlWhatsApp, '_blank');
    });
}

// Modal functions
function showModal() {
    document.getElementById('confirmModal').classList.add('active');
}

function closeModal() {
    document.getElementById('confirmModal').classList.remove('active');
    resetConfigurator();
}

function resetConfigurator() {
    // Reset state
    state.currentStep = 1;
    state.selections = {
        tamano: { value: null, price: 0 },
        modelo: { value: null, price: 0 },
        letra: { value: 'sin', text: '', price: 0 },
        bombilla: { value: null, price: 0 }
    };
    
    // Reset UI Classes
    document.querySelectorAll('.option-card-img, .option-card').forEach(c => { c.classList.remove('selected'); });
    document.querySelectorAll('.config-step').forEach(c => { c.classList.remove('active'); });
    
    // Show step 1
    document.getElementById('step1').classList.add('active');
    
    // Hide letter input and clear text
    document.getElementById('ligasLetraInput').classList.add('hidden');
    document.getElementById('letrasTexto').value = '';
    
    // Disable required-selection next buttons; step 3 is optional so keep it enabled
    document.querySelectorAll('#step1 .btn-next, #step2 .btn-next, #step4 .btn-next').forEach(btn => { btn.disabled = true; });
    
    // Reset progress
    updateProgressBar();
    
    // Scroll to top
    document.getElementById('inicio').scrollIntoView({ behavior: 'smooth' });
}

// Smooth scroll (legacy support)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(26, 77, 46, 0.98)';
    } else {
        navbar.style.background = 'rgba(26, 77, 46, 0.95)';
    }
});