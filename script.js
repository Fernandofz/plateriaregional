// ============================
// MATES DEL IBERÁ - JavaScript
// Configurador de Mate
// ============================

// Estado del configurador
const state = {
    currentStep: 1,
    selections: {
        porongo: { size: null, price: 0 },
        cuero: { type: 'sin', price: 0 },
        borde: { type: 'sin', price: 0 },
        base: { type: 'sin', price: 0 },
        letras: { count: 'sin', text: '', price: 0 },
        bombillaTipo: { type: null, price: 0 },
        esferas: { count: 'sin', price: 0 },
        esferaLetra: { has: 'sin', text: '', price: 0 }
    }
};

// Precios de referencia para el resumen
const priceLabels = {
    porongo: {
        chico: 'Porongo Chico',
        mediano: 'Porongo Mediano',
        grande: 'Porongo Grande'
    },
    cuero: {
        sin: 'Sin cuero',
        marron: 'Cuero Marrón',
        negro: 'Cuero Negro',
        natural: 'Cuero Natural'
    },
    borde: {
        sin: 'Sin borde',
        simple: 'Borde Simple',
        labrado: 'Borde Labrado'
    },
    base: {
        sin: 'Sin base',
        simple: 'Base Simple',
        labrada: 'Base Labrada'
    },
    letras: {
        sin: 'Sin letras',
        1: '1 Letra',
        2: '2 Letras',
        3: '3 Letras'
    },
    bombillaTipo: {
        recta: 'Bombilla Recta',
        doblada: 'Bombilla Doblada'
    },
    esferas: {
        sin: 'Sin esferas',
        1: '1 Esfera',
        2: '2 Esferas'
    },
    esferaLetra: {
        sin: 'Sin letra en esfera',
        con: 'Letra en esfera'
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
    // Event listeners para las tarjetas de opciones
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', function() {
            handleOptionSelect(this);
        });
    });

    // Event listener para el input de letras del mate
    const letrasInput = document.getElementById('letrasTexto');
    if (letrasInput) {
        letrasInput.addEventListener('input', function() {
            state.selections.letras.text = this.value.toUpperCase();
        });
    }

    // Event listener para el input de letra de la esfera
    const esferaInput = document.getElementById('esferaLetraTexto');
    if (esferaInput) {
        esferaInput.addEventListener('input', function() {
            state.selections.esferaLetra.text = this.value.toUpperCase();
        });
    }
}

// Manejar selección de opciones
function handleOptionSelect(card) {
    const category = card.dataset.category;
    const value = card.dataset.value;
    const price = parseInt(card.dataset.price) || 0;

    // Si es una tarjeta de tamaño de porongo (paso 1)
    if (card.closest('.size-options')) {
        // Deseleccionar otras opciones de tamaño
        document.querySelectorAll('.size-options .option-card').forEach(c => {
            c.classList.remove('selected');
        });
        card.classList.add('selected');
        
        state.selections.porongo = { size: value, price: price };
        
        // Habilitar el botón siguiente
        document.querySelector('#step1 .btn-next').disabled = false;
    }
    // Si tiene categoría (pasos 2 y 3)
    else if (category) {
        // Deseleccionar otras opciones de la misma categoría
        document.querySelectorAll(`[data-category="${category}"]`).forEach(c => {
            c.classList.remove('selected');
        });
        card.classList.add('selected');

        // Actualizar estado según categoría
        switch(category) {
            case 'cuero':
                state.selections.cuero = { type: value, price: price };
                break;
            case 'borde':
                state.selections.borde = { type: value, price: price };
                break;
            case 'base':
                state.selections.base = { type: value, price: price };
                break;
            case 'letras': {
                state.selections.letras.count = value;
                state.selections.letras.price = price;
                // Mostrar/ocultar input de letras
                const letterInput = document.getElementById('letterInput');
                if (value !== 'sin') {
                    letterInput.classList.remove('hidden');
                    document.getElementById('letrasTexto').maxLength = parseInt(value);
                } else {
                    letterInput.classList.add('hidden');
                    state.selections.letras.text = '';
                }
                break;
            }
            case 'bombilla-tipo':
                state.selections.bombillaTipo = { type: value, price: price };
                break;
            case 'esferas': {
                state.selections.esferas = { count: value, price: price };
                // Mostrar/ocultar grupo de letra en esfera
                const esferaLetraGroup = document.getElementById('esferaLetraGroup');
                if (value !== 'sin') {
                    esferaLetraGroup.classList.remove('hidden');
                } else {
                    esferaLetraGroup.classList.add('hidden');
                    state.selections.esferaLetra = { has: 'sin', text: '', price: 0 };
                    // Deseleccionar opciones de letra en esfera
                    document.querySelectorAll('[data-category="esfera-letra"]').forEach(c => {
                        c.classList.remove('selected');
                    });
                }
                break;
            }
            case 'esfera-letra': {
                state.selections.esferaLetra.has = value;
                state.selections.esferaLetra.price = price;
                // Mostrar/ocultar input de letra
                const esferaLetraInput = document.getElementById('esferaLetraInput');
                if (value === 'con') {
                    esferaLetraInput.classList.remove('hidden');
                } else {
                    esferaLetraInput.classList.add('hidden');
                    state.selections.esferaLetra.text = '';
                }
                break;
            }
        }
    }

    updatePrice();
}

// Calcular precio total
function calculateTotal() {
    let total = 0;
    
    total += state.selections.porongo.price;
    total += state.selections.cuero.price;
    total += state.selections.borde.price;
    total += state.selections.base.price;
    total += state.selections.letras.price;
    total += state.selections.bombillaTipo.price;
    total += state.selections.esferas.price;
    total += state.selections.esferaLetra.price;
    
    return total;
}

// Actualizar visualización del precio
function updatePrice() {
    const total = calculateTotal();
    const formattedPrice = formatPrice(total);
    
    document.getElementById('currentPrice').textContent = formattedPrice;
    document.getElementById('totalPrice').textContent = formattedPrice;
}

// Formatear precio
function formatPrice(price) {
    return '$' + price.toLocaleString('es-AR');
}

// Navegación entre pasos
function nextStep() {
    if (state.currentStep < 4) {
        // Validaciones específicas por paso
        if (state.currentStep === 1 && !state.selections.porongo.size) {
            alert('Por favor, seleccioná un tamaño de porongo');
            return;
        }
        
        if (state.currentStep === 3 && !state.selections.bombillaTipo.type) {
            alert('Por favor, seleccioná un tipo de bombilla');
            return;
        }
        
        // Si vamos al paso 4, generar resumen
        if (state.currentStep === 3) {
            generateSummary();
        }
        
        // Cambiar paso
        document.getElementById(`step${state.currentStep}`).classList.remove('active');
        state.currentStep++;
        document.getElementById(`step${state.currentStep}`).classList.add('active');
        
        // Actualizar progress bar
        updateProgressBar();
        
        // Scroll al inicio del configurador
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

// Actualizar progress bar
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

// Generar resumen del pedido
function generateSummary() {
    const summaryContent = document.getElementById('summaryContent');
    let html = '';
    
    // Porongo
    if (state.selections.porongo.size) {
        html += createSummaryItem(
            priceLabels.porongo[state.selections.porongo.size],
            formatPrice(state.selections.porongo.price)
        );
    }
    
    // Cuero
    if (state.selections.cuero.type !== 'sin') {
        html += createSummaryItem(
            priceLabels.cuero[state.selections.cuero.type],
            '+' + formatPrice(state.selections.cuero.price)
        );
    }
    
    // Borde
    if (state.selections.borde.type !== 'sin') {
        html += createSummaryItem(
            priceLabels.borde[state.selections.borde.type],
            '+' + formatPrice(state.selections.borde.price)
        );
    }
    
    // Base
    if (state.selections.base.type !== 'sin') {
        html += createSummaryItem(
            priceLabels.base[state.selections.base.type],
            '+' + formatPrice(state.selections.base.price)
        );
    }
    
    // Letras
    if (state.selections.letras.count !== 'sin') {
        const letrasText = state.selections.letras.text 
            ? ` (${state.selections.letras.text})` 
            : '';
        html += createSummaryItem(
            priceLabels.letras[state.selections.letras.count] + letrasText,
            '+' + formatPrice(state.selections.letras.price)
        );
    }
    
    // Bombilla
    if (state.selections.bombillaTipo.type) {
        html += createSummaryItem(
            priceLabels.bombillaTipo[state.selections.bombillaTipo.type],
            formatPrice(state.selections.bombillaTipo.price)
        );
    }
    
    // Esferas
    if (state.selections.esferas.count !== 'sin') {
        html += createSummaryItem(
            priceLabels.esferas[state.selections.esferas.count],
            '+' + formatPrice(state.selections.esferas.price)
        );
    }
    
    // Letra en esfera
    if (state.selections.esferaLetra.has === 'con') {
        const esferaText = state.selections.esferaLetra.text 
            ? ` (${state.selections.esferaLetra.text})` 
            : '';
        html += createSummaryItem(
            priceLabels.esferaLetra.con + esferaText,
            '+' + formatPrice(state.selections.esferaLetra.price)
        );
    }
    
    summaryContent.innerHTML = html;
}

// Crear item del resumen
function createSummaryItem(label, value) {
    return `
        <div class="summary-item">
            <span class="label">${label}</span>
            <span class="value">${value}</span>
        </div>
    `;
}

// Inicializar formulario
function initializeForm() {
    const form = document.getElementById('orderForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Recopilar datos del formulario
        const formData = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            direccion: document.getElementById('direccion').value,
            ciudad: document.getElementById('ciudad').value,
            comentarios: document.getElementById('comentarios').value,
            pedido: state.selections,
            total: calculateTotal()
        };
        
        // Log para demo (en producción enviaría por email)
        console.log('Pedido enviado:', formData);
        console.log('Resumen del pedido:');
        console.log('- Porongo:', state.selections.porongo.size, '- $' + state.selections.porongo.price);
        console.log('- Cuero:', state.selections.cuero.type);
        console.log('- Borde:', state.selections.borde.type);
        console.log('- Base:', state.selections.base.type);
        console.log('- Letras:', state.selections.letras.count, state.selections.letras.text);
        console.log('- Bombilla:', state.selections.bombillaTipo.type);
        console.log('- Esferas:', state.selections.esferas.count);
        console.log('- Letra esfera:', state.selections.esferaLetra.has, state.selections.esferaLetra.text);
        console.log('- TOTAL: $' + calculateTotal());
        
        // Mostrar modal de confirmación
        showModal();
        
        // Resetear formulario
        form.reset();
    });
}

// Mostrar modal
function showModal() {
    document.getElementById('confirmModal').classList.add('active');
}

// Cerrar modal
function closeModal() {
    document.getElementById('confirmModal').classList.remove('active');
    
    // Resetear configurador
    resetConfigurator();
}

// Resetear configurador
function resetConfigurator() {
    // Resetear estado
    state.currentStep = 1;
    state.selections = {
        porongo: { size: null, price: 0 },
        cuero: { type: 'sin', price: 0 },
        borde: { type: 'sin', price: 0 },
        base: { type: 'sin', price: 0 },
        letras: { count: 'sin', text: '', price: 0 },
        bombillaTipo: { type: null, price: 0 },
        esferas: { count: 'sin', price: 0 },
        esferaLetra: { has: 'sin', text: '', price: 0 }
    };
    
    // Resetear UI
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    document.querySelectorAll('.config-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('step1').classList.add('active');
    
    document.getElementById('letterInput').classList.add('hidden');
    document.getElementById('esferaLetraGroup').classList.add('hidden');
    document.getElementById('esferaLetraInput').classList.add('hidden');
    
    document.getElementById('letrasTexto').value = '';
    document.getElementById('esferaLetraTexto').value = '';
    
    document.querySelector('#step1 .btn-next').disabled = true;
    
    updateProgressBar();
    updatePrice();
    
    // Scroll al inicio
    document.getElementById('inicio').scrollIntoView({ behavior: 'smooth' });
}

// Smooth scroll para navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Navbar efecto al scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(26, 77, 46, 0.98)';
    } else {
        navbar.style.background = 'rgba(26, 77, 46, 0.95)';
    }
});
