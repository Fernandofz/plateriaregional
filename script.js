// ============================
// PLATERÍA REGIONAL - JavaScript
// Configurador de Mate
// ============================

// Estado del configurador
const state = {
    currentStep: 1,
    totalSteps: 4,
    selections: {
        modelo: { value: null, price: 0 },
        // Personalización (Paso 2)
        lazos: { value: 'simple', price: 0, text: '' },
        boca: { value: 'lisa', price: 0, text: '' },
        base: { value: 'lisa', price: 0, text: '' },
        // Bombilla (Paso 3)
        bombillaForma: { value: null, price: 0 },
        bombillaEsferas: { value: 'simple', price: 0 },
        bombillaTipo: { value: 'tradicional', price: 0 },
        bombillaLogo: { value: 'sin-logo', price: 0 }
    }
};

// Etiquetas para el resumen
const labels = {
    modelo: {
        clasico: 'Clásico',
        tradicional: 'Tradicional Correntino',
        premium: 'Premium Personalizado'
    },
    lazos: {
        simple: 'Simple',
        letras: '1 a 3 letras',
        nombre: 'Nombre',
        'nombre-logo': 'Nombre + logo'
    },
    boca: {
        lisa: 'Lisa',
        'lisa-nombre': 'Lisa con nombre',
        labrada: 'Labrada'
    },
    base: {
        lisa: 'Lisa',
        'lisa-nombre': 'Lisa con nombre',
        labrada: 'Labrada'
    },
    bombillaForma: {
        recta: 'Recta',
        curvada: 'Curvada'
    },
    bombillaEsferas: {
        simple: 'Sin esferas',
        '1-esfera': '1 esfera',
        '2-esferas': '2 esferas'
    },
    bombillaTipo: {
        tradicional: 'Tradicional',
        uruguaya: 'Uruguaya'
    },
    bombillaLogo: {
        'sin-logo': 'Sin logo',
        'con-logo': 'Con logo'
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initializeConfigurator();
    initializeForm();
    // Pre-select defaults for paso 2 & 3
    preselectDefaults();
});

function preselectDefaults() {
    // Paso 2 defaults
    const defaultsP2 = [
        { category: 'lazos', value: 'simple' },
        { category: 'boca', value: 'lisa' },
        { category: 'base', value: 'lisa' }
    ];
    defaultsP2.forEach(({ category, value }) => {
        const card = document.querySelector(`#step2 [data-category="${category}"][data-value="${value}"]`);
        if (card) {
            card.classList.add('selected');
        }
    });

    // Paso 3 defaults (esferas, tipo, logo — but NOT forma)
    const defaultsP3 = [
        { category: 'esferas', value: 'simple' },
        { category: 'tipo-bombilla', value: 'tradicional' },
        { category: 'logo-bombilla', value: 'sin-logo' }
    ];
    defaultsP3.forEach(({ category, value }) => {
        const card = document.querySelector(`#step3 [data-category="${category}"][data-value="${value}"]`);
        if (card) {
            card.classList.add('selected');
        }
    });
}

// Inicializar el configurador
function initializeConfigurator() {
    const allCards = document.querySelectorAll('.option-card-img, .option-card');
    allCards.forEach(card => {
        card.addEventListener('click', function () {
            handleOptionSelect(this);
        });
    });

    // Text inputs — sync to state
    const lazosTexto = document.getElementById('lazosTexto');
    if (lazosTexto) {
        lazosTexto.addEventListener('input', function () {
            state.selections.lazos.text = this.value;
        });
    }

    const bocaNombre = document.getElementById('bocaNombre');
    if (bocaNombre) {
        bocaNombre.addEventListener('input', function () {
            state.selections.boca.text = this.value;
        });
    }

    const baseNombre = document.getElementById('baseNombre');
    if (baseNombre) {
        baseNombre.addEventListener('input', function () {
            state.selections.base.text = this.value;
        });
    }
}

// Manejar selección de opciones
function handleOptionSelect(card) {
    const category = card.dataset.category;
    const value = card.dataset.value;
    const stepContainer = card.closest('.config-step');

    // --- PASO 1: Modelo ---
    if (stepContainer.id === 'step1') {
        document.querySelectorAll('#step1 .option-card-img').forEach(c => {
            c.classList.remove('selected');
        });
        card.classList.add('selected');

        const price = parseInt(card.dataset.price) || 0;
        state.selections.modelo = { value, price };

        // Update dynamic lazos-letras price label
        updateLazosLetrasLabel();

        document.querySelector('#step1 .btn-next').disabled = false;
        return;
    }

    // --- PASO 2: Personalización ---
    if (category === 'lazos') {
        document.querySelectorAll('#step2 [data-category="lazos"]').forEach(c => {
            c.classList.remove('selected');
        });
        card.classList.add('selected');

        // Dynamic price for "letras" based on modelo
        let price;
        if (value === 'letras') {
            price = state.selections.modelo.value === 'premium' ? 0 : 5000;
        } else {
            price = parseInt(card.dataset.price) || 0;
        }

        state.selections.lazos.value = value;
        state.selections.lazos.price = price;

        // Show/hide text input
        const lazosGroup = document.getElementById('lazosTextoGroup');
        if (value !== 'simple') {
            lazosGroup.classList.remove('hidden');
        } else {
            lazosGroup.classList.add('hidden');
            state.selections.lazos.text = '';
            document.getElementById('lazosTexto').value = '';
        }
    }

    else if (category === 'boca') {
        document.querySelectorAll('#step2 [data-category="boca"]').forEach(c => {
            c.classList.remove('selected');
        });
        card.classList.add('selected');

        const price = parseInt(card.dataset.price) || 0;
        state.selections.boca.value = value;
        state.selections.boca.price = price;

        const bocaGroup = document.getElementById('bocaNombreGroup');
        if (value === 'lisa-nombre') {
            bocaGroup.classList.remove('hidden');
        } else {
            bocaGroup.classList.add('hidden');
            state.selections.boca.text = '';
            document.getElementById('bocaNombre').value = '';
        }
    }

    else if (category === 'base') {
        document.querySelectorAll('#step2 [data-category="base"]').forEach(c => {
            c.classList.remove('selected');
        });
        card.classList.add('selected');

        const price = parseInt(card.dataset.price) || 0;
        state.selections.base.value = value;
        state.selections.base.price = price;

        const baseGroup = document.getElementById('baseNombreGroup');
        if (value === 'lisa-nombre') {
            baseGroup.classList.remove('hidden');
        } else {
            baseGroup.classList.add('hidden');
            state.selections.base.text = '';
            document.getElementById('baseNombre').value = '';
        }
    }

    // --- PASO 3: Bombilla ---
    else if (category === 'forma') {
        document.querySelectorAll('#step3 [data-category="forma"]').forEach(c => {
            c.classList.remove('selected');
        });
        card.classList.add('selected');

        const price = parseInt(card.dataset.price) || 0;
        state.selections.bombillaForma = { value, price };

        // Unlock "Ver Resumen"
        document.querySelector('#step3 .btn-next').disabled = false;
    }

    else if (category === 'esferas') {
        document.querySelectorAll('#step3 [data-category="esferas"]').forEach(c => {
            c.classList.remove('selected');
        });
        card.classList.add('selected');

        const price = parseInt(card.dataset.price) || 0;
        state.selections.bombillaEsferas = { value, price };
    }

    else if (category === 'tipo-bombilla') {
        document.querySelectorAll('#step3 [data-category="tipo-bombilla"]').forEach(c => {
            c.classList.remove('selected');
        });
        card.classList.add('selected');

        state.selections.bombillaTipo = { value, price: 0 };
    }

    else if (category === 'logo-bombilla') {
        document.querySelectorAll('#step3 [data-category="logo-bombilla"]').forEach(c => {
            c.classList.remove('selected');
        });
        card.classList.add('selected');

        const price = parseInt(card.dataset.price) || 0;
        state.selections.bombillaLogo = { value, price };
    }
}

// Actualizar label dinámico de "1 a 3 letras" en lazos
function updateLazosLetrasLabel() {
    const el = document.getElementById('precio-lazos-letras');
    if (!el) return;
    const isPremium = state.selections.modelo.value === 'premium';
    el.textContent = isPremium ? 'Incluido' : '+$5.000';
}

// Calcular precio total
function calculateTotal() {
    const s = state.selections;
    return (
        s.modelo.price +
        s.lazos.price +
        s.boca.price +
        s.base.price +
        (s.bombillaForma ? s.bombillaForma.price : 0) +
        (s.bombillaEsferas ? s.bombillaEsferas.price : 0) +
        (s.bombillaTipo ? s.bombillaTipo.price : 0) +
        (s.bombillaLogo ? s.bombillaLogo.price : 0)
    );
}

// Formatear precio
function formatPrice(price) {
    return '$' + price.toLocaleString('es-AR');
}

// Navegación entre pasos
function nextStep() {
    if (state.currentStep >= state.totalSteps) return;

    if (state.currentStep === 1 && !state.selections.modelo.value) return;
    if (state.currentStep === 3 && !state.selections.bombillaForma.value) return;

    if (state.currentStep === 3) {
        generateSummary();
    }

    document.getElementById(`step${state.currentStep}`).classList.remove('active');
    state.currentStep++;
    document.getElementById(`step${state.currentStep}`).classList.add('active');

    updateProgressBar();
    document.getElementById('configurador').scrollIntoView({ behavior: 'smooth' });
}

function prevStep() {
    if (state.currentStep <= 1) return;

    document.getElementById(`step${state.currentStep}`).classList.remove('active');
    state.currentStep--;
    document.getElementById(`step${state.currentStep}`).classList.add('active');

    updateProgressBar();
    document.getElementById('configurador').scrollIntoView({ behavior: 'smooth' });
}

// Actualizar barra de progreso
function updateProgressBar() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        if (stepNum === state.currentStep) step.classList.add('active');
        else if (stepNum < state.currentStep) step.classList.add('completed');
    });
}

// Generar resumen HTML
function generateSummary() {
    const s = state.selections;
    const summaryContent = document.getElementById('summaryContent');
    let html = '';

    // Modelo
    const modeloLabel = labels.modelo[s.modelo.value] || s.modelo.value;
    html += createSummaryItem('Modelo', modeloLabel, formatPrice(s.modelo.price));

    // Lazos
    let lazosDesc = labels.lazos[s.lazos.value] || s.lazos.value;
    if (s.lazos.value !== 'simple' && s.lazos.text) lazosDesc += ` (${s.lazos.text})`;
    const lazosPrice = s.lazos.price > 0 ? formatPrice(s.lazos.price) : 'Incluido';
    html += createSummaryItem('Lazos y hebilla', lazosDesc, lazosPrice);

    // Boca
    let bocaDesc = labels.boca[s.boca.value] || s.boca.value;
    if (s.boca.value === 'lisa-nombre' && s.boca.text) bocaDesc += ` (${s.boca.text})`;
    const bocaPrice = s.boca.price > 0 ? formatPrice(s.boca.price) : 'Incluido';
    html += createSummaryItem('Boca', bocaDesc, bocaPrice);

    // Base
    let baseDesc = labels.base[s.base.value] || s.base.value;
    if (s.base.value === 'lisa-nombre' && s.base.text) baseDesc += ` (${s.base.text})`;
    const basePrice = s.base.price > 0 ? formatPrice(s.base.price) : 'Incluido';
    html += createSummaryItem('Base', baseDesc, basePrice);

    // Bombilla - Forma
    if (s.bombillaForma && s.bombillaForma.value) {
        html += createSummaryItem('Bombilla', labels.bombillaForma[s.bombillaForma.value], formatPrice(s.bombillaForma.price));
    }

    // Bombilla - Esferas
    if (s.bombillaEsferas && s.bombillaEsferas.value !== 'simple') {
        const esfPrice = s.bombillaEsferas.price > 0 ? formatPrice(s.bombillaEsferas.price) : 'Incluido';
        html += createSummaryItem('Esferas', labels.bombillaEsferas[s.bombillaEsferas.value], esfPrice);
    }

    // Bombilla - Tipo
    if (s.bombillaTipo && s.bombillaTipo.value) {
        html += createSummaryItem('Tipo filtro', labels.bombillaTipo[s.bombillaTipo.value], 'Incluido');
    }

    // Bombilla - Logo
    if (s.bombillaLogo && s.bombillaLogo.value === 'con-logo') {
        html += createSummaryItem('Logo bombilla', 'Con logo', formatPrice(s.bombillaLogo.price));
    }

    summaryContent.innerHTML = html;

    // Update total
    const totalEl = document.getElementById('totalPrice');
    if (totalEl) {
        totalEl.textContent = formatPrice(calculateTotal());
    }
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

// Inicializar formulario (WhatsApp submit)
function initializeForm() {
    const form = document.getElementById('orderForm');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const s = state.selections;
        const nombre = document.getElementById('nombre').value;
        const telefono = document.getElementById('telefono').value;
        const email = document.getElementById('email').value;
        const direccion = document.getElementById('direccion').value;
        const ciudad = document.getElementById('ciudad').value;
        const comentarios = document.getElementById('comentarios').value;

        // Build details
        const modeloLabel = labels.modelo[s.modelo.value] || s.modelo.value;

        let lazosDesc = labels.lazos[s.lazos.value] || s.lazos.value;
        if (s.lazos.value !== 'simple' && s.lazos.text) lazosDesc += ` (${s.lazos.text})`;

        let bocaDesc = labels.boca[s.boca.value] || s.boca.value;
        if (s.boca.value === 'lisa-nombre' && s.boca.text) bocaDesc += ` (${s.boca.text})`;

        let baseDesc = labels.base[s.base.value] || s.base.value;
        if (s.base.value === 'lisa-nombre' && s.base.text) baseDesc += ` (${s.base.text})`;

        const formaLabel = s.bombillaForma ? (labels.bombillaForma[s.bombillaForma.value] || s.bombillaForma.value) : '-';
        const esfLabel = s.bombillaEsferas ? (labels.bombillaEsferas[s.bombillaEsferas.value] || s.bombillaEsferas.value) : 'Sin esferas';
        const tipoLabel = s.bombillaTipo ? (labels.bombillaTipo[s.bombillaTipo.value] || s.bombillaTipo.value) : 'Tradicional';
        const logoLabel = s.bombillaLogo && s.bombillaLogo.value === 'con-logo' ? 'Con logo (+$2.500)' : 'Sin logo';

        const ciudadLine = ciudad ? `\n📍 Ciudad: ${ciudad}` : '';
        const direccionLine = direccion ? `\n🏠 Dirección: ${direccion}` : '';
        const comentariosLine = comentarios ? `\n💬 Comentarios: ${comentarios}` : '';

        const mensaje =
`¡Hola! Quiero encargar un mate personalizado 🧉

👤 Nombre: ${nombre}
📱 Teléfono: ${telefono}
📧 Email: ${email}${ciudadLine}${direccionLine}

📦 *Detalle del pedido:*
• Modelo: ${modeloLabel} — ${formatPrice(s.modelo.price)}
• Lazos y hebilla: ${lazosDesc} — ${s.lazos.price > 0 ? formatPrice(s.lazos.price) : 'Incluido'}
• Boca: ${bocaDesc} — ${s.boca.price > 0 ? formatPrice(s.boca.price) : 'Incluido'}
• Base: ${baseDesc} — ${s.base.price > 0 ? formatPrice(s.base.price) : 'Incluido'}
• Bombilla (${formaLabel}) — ${s.bombillaForma ? formatPrice(s.bombillaForma.price) : '-'}
• Esferas: ${esfLabel} — ${s.bombillaEsferas && s.bombillaEsferas.price > 0 ? formatPrice(s.bombillaEsferas.price) : 'Incluido'}
• Tipo filtro: ${tipoLabel}
• Logo bombilla: ${logoLabel}

💰 *Total estimado: ${formatPrice(calculateTotal())}*${comentariosLine}`;

        form.reset();
        window.open(`https://wa.me/5493794143509?text=${encodeURIComponent(mensaje)}`, '_blank');
    });
}

// Modal
function showModal() {
    document.getElementById('confirmModal').classList.add('active');
}

function closeModal() {
    document.getElementById('confirmModal').classList.remove('active');
    resetConfigurator();
}

function resetConfigurator() {
    state.currentStep = 1;
    state.selections = {
        modelo: { value: null, price: 0 },
        lazos: { value: 'simple', price: 0, text: '' },
        boca: { value: 'lisa', price: 0, text: '' },
        base: { value: 'lisa', price: 0, text: '' },
        bombillaForma: { value: null, price: 0 },
        bombillaEsferas: { value: 'simple', price: 0 },
        bombillaTipo: { value: 'tradicional', price: 0 },
        bombillaLogo: { value: 'sin-logo', price: 0 }
    };

    document.querySelectorAll('.option-card-img, .option-card').forEach(c => {
        c.classList.remove('selected');
    });
    document.querySelectorAll('.config-step').forEach(c => {
        c.classList.remove('active');
    });
    document.getElementById('step1').classList.add('active');

    // Hide all text groups
    ['lazosTextoGroup', 'bocaNombreGroup', 'baseNombreGroup'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.add('hidden');
        }
    });
    // Clear text inputs
    ['lazosTexto', 'bocaNombre', 'baseNombre'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.value = '';
        }
    });

    // Disable required-selection buttons
    document.querySelector('#step1 .btn-next').disabled = true;
    document.querySelector('#step3 .btn-next').disabled = true;

    preselectDefaults();
    updateProgressBar();
    document.getElementById('inicio').scrollIntoView({ behavior: 'smooth' });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
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
