import { renderApp } from './modules/ui.js';
import { addInteraction } from './modules/cardEffects.js';

function main() {
    renderApp();
    
    const cardElement = document.querySelector('.card');
    if (cardElement) {
        addInteraction(cardElement);
    }
}

document.addEventListener('DOMContentLoaded', main);