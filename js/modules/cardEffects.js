let interactiveCard = null;

const eventHandlers = {
    mousemove: (e) => updatePointer(e),
    deviceorientation: (e) => updatePointer(e),
};

function updatePointer(event) {
    if (!interactiveCard) return;

    let x = 0.5, y = 0.5;

    if (event.type === 'mousemove') {
        const rect = interactiveCard.getBoundingClientRect();
        x = (event.clientX - rect.left) / rect.width;
        y = (event.clientY - rect.top) / rect.height;
    } else if (event.type === 'deviceorientation') {
        // Asegurarse de que los valores de beta y gamma existen
        if (event.beta === null || event.gamma === null) return;
        const beta = Math.max(-45, Math.min(45, event.beta));
        const gamma = Math.max(-45, Math.min(45, event.gamma));
        x = (gamma / 90) + 0.5;
        y = (beta / 90) + 0.5;
    }

    interactiveCard.style.setProperty('--pointer-x', `${x * 100}%`);
    interactiveCard.style.setProperty('--pointer-y', `${y * 100}%`);
    interactiveCard.style.setProperty('--background-x', `${x * 100}%`);
    interactiveCard.style.setProperty('--background-y', `${y * 100}%`);
    interactiveCard.style.setProperty('--pointer-from-left', x);
    interactiveCard.style.setProperty('--pointer-from-top', y);
    interactiveCard.style.setProperty('--pointer-from-center', Math.abs(x - 0.5) + Math.abs(y - 0.5));
    interactiveCard.style.setProperty('--rotate-x', `${(x - 0.5) * 2 * 18}deg`);
    interactiveCard.style.setProperty('--rotate-y', `${(y - 0.5) * -2 * 18}deg`);
}

export function addInteraction(cardElement) {
    interactiveCard = cardElement;
    window.addEventListener('mousemove', eventHandlers.mousemove);

    if (window.DeviceOrientationEvent) {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission().then(state => {
                if (state === 'granted') {
                    window.addEventListener('deviceorientation', eventHandlers.deviceorientation);
                }
            }).catch(console.error);
        } else {
            window.addEventListener('deviceorientation', eventHandlers.deviceorientation);
        }
    }
}