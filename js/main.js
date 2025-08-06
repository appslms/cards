import { renderApp } from './modules/ui.js';
import { addInteraction } from './modules/cardEffects.js';

function main() {
    renderApp();
    
    // El elemento interactivo es el .card__rotator, no el .card principal
    const interactiveElement = document.querySelector('.card__rotator');
    if (interactiveElement) {
        addInteraction(interactiveElement);
    }
}

document.addEventListener('DOMContentLoaded', main);