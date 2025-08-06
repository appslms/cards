let interactiveElement = null;
const root = document.documentElement;

const eventHandlers = {
    mousemove: (e) => updatePointer(e),
    deviceorientation: (e) => updatePointer(e),
};

function updatePointer(event) {
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

    // Establecer TODAS las variables en :root para que la librería las herede
    root.style.setProperty('--pointer-x', x);
    root.style.setProperty('--pointer-y', y);
    root.style.setProperty('--background-x', `${x * 100}%`);
    root.style.setProperty('--background-y', `${y * 100}%`);
    root.style.setProperty('--pointer-from-left', x);
    root.style.setProperty('--pointer-from-top', y);
    root.style.setProperty('--pointer-from-center', Math.abs(x - 0.5) + Math.abs(y - 0.5));
    root.style.setProperty('--rotate-x', `${(x - 0.5) * 2 * 14}deg`);
    root.style.setProperty('--rotate-y', `${(y - 0.5) * -2 * 14}deg`);
}

function requestGyroscopePermission() {
    if (typeof DeviceOrientationEvent.requestPermission !== 'function') {
        // Para Android, que no necesita permiso explícito
        window.addEventListener('deviceorientation', eventHandlers.deviceorientation);
        return;
    }
    // Para iOS 13+
    DeviceOrientationEvent.requestPermission().then(state => {
        if (state === 'granted') {
            window.addEventListener('deviceorientation', eventHandlers.deviceorientation);
            // Opcional: Feedback visual para el usuario
            // alert("Giroscopio activado.");
        }
    }).catch(console.error);
}

export function addInteraction(element) {
    interactiveElement = element;
    
    const card = element.closest('.card');
    if (!card) return;

    // Inyectar las capas de efecto si no existen
    if (!card.querySelector('.card__shine')) {
        const shine = document.createElement('div');
        shine.className = 'card__shine';
        card.querySelector('.card__rotator').appendChild(shine);
    }
    if (!card.querySelector('.card__glare')) {
        const glare = document.createElement('div');
        glare.className = 'card__glare';
        card.querySelector('.card__rotator').appendChild(glare);
    }
    
    // Listeners de movimiento
    window.addEventListener('mousemove', eventHandlers.mousemove);
    
    // El permiso del giroscopio debe ser solicitado por una acción del usuario.
    // Usamos el clic en la tarjeta, pero solo una vez.
    card.addEventListener('click', requestGyroscopePermission, { once: true });
}