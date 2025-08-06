//--- START OF FILE js/modules/cardEffects.js ---
let interactiveElement = null;

const eventHandlers = {
    mousemove: (e) => updatePointer(e),
    deviceorientation: (e) => updatePointer(e),
};

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

    // Estas son las variables que la librería de Simey espera.
    // La nomenclatura y los valores son importantes.
    interactiveElement.style.setProperty('--pointer-x', `${x * 100}%`);
    interactiveElement.style.setProperty('--pointer-y', `${y * 100}%`);
    interactiveElement.style.setProperty('--background-x', `${x * 100}%`);
    interactiveElement.style.setProperty('--background-y', `${y * 100}%`);
    interactiveElement.style.setProperty('--pointer-from-left', x);
    interactiveElement.style.setProperty('--pointer-from-top', y);
    interactiveElement.style.setProperty('--pointer-from-center', Math.abs(x - 0.5) + Math.abs(y - 0.5));
    
    // Variables para la rotación 3D
    interactiveElement.style.setProperty('--rotate-x', `${(x - 0.5) * 2 * 14}deg`); // Eje Y
    interactiveElement.style.setProperty('--rotate-y', `${(y - 0.5) * -2 * 14}deg`); // Eje X (invertido para que sea natural)
}

function requestGyroscopePermission() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission().then(state => {
            if (state === 'granted') {
                window.addEventListener('deviceorientation', eventHandlers.deviceorientation);
                alert("Giroscopio activado. ¡Inclina tu teléfono!");
            }
        }).catch(() => {
            alert("No se pudo activar el giroscopio.");
        });
    } else {
        // Para dispositivos (como Android) que no requieren permiso explícito
        window.addEventListener('deviceorientation', eventHandlers.deviceorientation);
    }
}

export function addInteraction(element) {
    interactiveElement = element;
    window.addEventListener('mousemove', eventHandlers.mousemove);
    
    // El permiso del giroscopio en iOS DEBE ser solicitado por una acción del usuario.
    // Usamos el clic en la propia tarjeta para esto.
    interactiveElement.addEventListener('click', requestGyroscopePermission);
}
//- END OF FILE js/modules/cardEffects.js ---