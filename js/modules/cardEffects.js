//--- START OF FILE js/modules/cardEffects.js ---
let interactiveElement = null;

const eventHandlers = {
    mousemove: (e) => updatePointer(e),
    deviceorientation: (e) => updatePointer(e),
};

// Función para actualizar las variables CSS basadas en el movimiento
function updatePointer(event) {
    if (!interactiveElement) return;

    let x = 0.5, y = 0.5;

    if (event.type === 'mousemove') {
        const rect = interactiveElement.getBoundingClientRect();
        x = (event.clientX - rect.left) / rect.width;
        y = (event.clientY - rect.top) / rect.height;
    } else if (event.type === 'deviceorientation') {
        if (event.beta === null || event.gamma === null) return;
        const beta = Math.max(-45, Math.min(45, event.beta));
        const gamma = Math.max(-45, Math.min(45, event.gamma));
        x = (gamma / 90) + 0.5;
        y = (beta / 90) + 0.5;
    }

    // Actualiza todas las variables CSS que la librería de Simey espera
    const root = document.documentElement; // Es mejor práctica establecerlas en :root
    root.style.setProperty('--pointer-x', x);
    root.style.setProperty('--pointer-y', y);
    root.style.setProperty('--background-x', `${x * 100}%`);
    root.style.setProperty('--background-y', `${y * 100}%`);
    root.style.setProperty('--pointer-from-left', x);
    root.style.setProperty('--pointer-from-top', y);
    root.style.setProperty('--pointer-from-center', Math.abs(x - 0.5) + Math.abs(y - 0.5));
    
    // ¡LA CORRECCIÓN CLAVE! Establece las variables para la rotación 3D
    root.style.setProperty('--rotate-x', `${(x - 0.5) * 2 * 14}deg`); // Rotación en el eje Y
    root.style.setProperty('--rotate-y', `${(y - 0.5) * -2 * 14}deg`); // Rotación en el eje X
}

// Función para solicitar permiso para el giroscopio
function requestGyroscopePermission() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission().then(state => {
            if (state === 'granted') {
                window.addEventListener('deviceorientation', eventHandlers.deviceorientation);
                // Opcional: notificar al usuario
                // alert("Giroscopio activado."); 
            }
        }).catch(() => {
            // alert("No se pudo activar el giroscopio.");
        });
    } else {
        // Para Android y otros que no necesitan permiso
        window.addEventListener('deviceorientation', eventHandlers.deviceorientation);
    }
}

// Función para inicializar la interacción
export function addInteraction(element) {
    interactiveElement = element;
    
    // Crear dinámicamente las capas de brillo y reflejo, como en el proyecto original
    const shineElement = document.createElement('div');
    shineElement.className = 'card__shine';
    const glareElement = document.createElement('div');
    glareElement.className = 'card__glare';
    
    // Añadirlas dentro del .card__rotator
    interactiveElement.appendChild(shineElement);
    interactiveElement.appendChild(glareElement);

    // Añadir listeners
    window.addEventListener('mousemove', eventHandlers.mousemove);
    
    // Para el giroscopio, el permiso debe ser solicitado por una acción del usuario
    interactiveElement.addEventListener('click', requestGyroscopePermission, { once: true });
}
//--- END OF FILE js/modules/cardEffects.js ---