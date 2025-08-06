let currentCard = null;

const eventHandlers = {
    mousemove: (e) => updatePointer(e),
    deviceorientation: (e) => updatePointer(e),
};

function updatePointer(event) {
    if (!currentCard) return;

    let x = 0.5, y = 0.5;

    if (event.type === 'mousemove') {
        const rect = currentCard.getBoundingClientRect();
        x = (event.clientX - rect.left) / rect.width;
        y = (event.clientY - rect.top) / rect.height;
    } else if (event.type === 'deviceorientation') {
        const beta = Math.max(-45, Math.min(45, event.beta));
        const gamma = Math.max(-45, Math.min(45, event.gamma));
        x = (gamma / 90) + 0.5;
        y = (beta / 90) + 0.5;
    }

    currentCard.style.setProperty('--pointer-x', x);
    currentCard.style.setProperty('--pointer-y', y);
    currentCard.style.setProperty('--pointer-from-center-x', x - 0.5);
    currentCard.style.setProperty('--pointer-from-center-y', y - 0.5);
}

export function addInteraction(cardElement) {
    currentCard = cardElement;
    window.addEventListener('mousemove', eventHandlers.mousemove);

    if (window.DeviceOrientationEvent) {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission().then(state => {
                if (state === 'granted') {
                    window.addEventListener('deviceorientation', eventHandlers.deviceorientation);
                }
            });
        } else {
            window.addEventListener('deviceorientation', eventHandlers.deviceorientation);
        }
    }
}

export function removeInteraction() {
    if (!currentCard) return;
    window.removeEventListener('mousemove', eventHandlers.mousemove);
    window.removeEventListener('deviceorientation', eventHandlers.deviceorientation);
    currentCard = null;
}