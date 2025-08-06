//--- START OF FILE js/modules/ui.js ---
import { CARDS, EFFECTS, TEXTURES } from '../config.js';

const visualizerEl = document.getElementById('visualizer');
const controlPanelEl = document.getElementById('control-panel');

function createDropdown(id, label, options, selectedValue) {
    const optionsHTML = options.map(opt => 
        `<option value="${opt.id}" ${opt.id == selectedValue ? 'selected' : ''}>${opt.name}</option>`
    ).join('');
    return `
        <div class="control-group">
            <label for="${id}">${label}</label>
            <select id="${id}">${optionsHTML}</select>
        </div>
    `;
}

function applyChanges() {
    const cardEl = document.querySelector('.card');
    const cardFrontEl = document.querySelector('.card__front img');
    if (!cardEl || !cardFrontEl) return;

    const cardSelect = document.getElementById('card-select');
    const effectSelect = document.getElementById('effect-select');
    const textureSelect = document.getElementById('texture-select');

    const selectedCard = CARDS.find(c => c.id == cardSelect.value);
    const selectedTexture = TEXTURES.find(t => t.id == textureSelect.value);
    const selectedEffect = effectSelect.value;

    // 1. Cambiar la imagen de la tarjeta
    if (selectedCard) {
        cardFrontEl.src = selectedCard.image;
    }

    // 2. Cambiar el efecto usando el atributo data-rarity y las clases
    cardEl.setAttribute('data-rarity', selectedEffect);
    // Removemos todas las clases de efecto anteriores y añadimos la nueva
    cardEl.className = 'card interactive'; // Reset a clases base
    cardEl.classList.add(selectedEffect);


    // 3. Cambiar la textura (foil) y su tamaño para el tileado
    if (selectedTexture && selectedTexture.path !== 'none') {
        // ¡CORRECCIÓN DE RUTA! No se necesita '../'
        cardEl.style.setProperty('--foil', `url(${selectedTexture.path})`);
        cardEl.style.setProperty('--imgsize', '25%'); // Tamaño para tileado
    } else {
        // Restaura los valores por defecto si no se selecciona ninguna textura
        cardEl.style.removeProperty('--foil');
        cardEl.style.removeProperty('--imgsize');
    }
}

export function renderApp() {
    const initialCard = CARDS[0];
    const initialEffect = 'v-star';

    // ¡NUEVA ESTRUCTURA HTML CORRECTA!
    // Esto coincide con lo que la librería CSS de Simey espera.
    visualizerEl.innerHTML = `
        <div class="card-wrapper">
            <div class="card interactive ${initialEffect}" data-rarity="${initialEffect}">
                <div class="card__translater">
                    <div class="card__rotator">
                        <div class="card__front">
                            <img src="${initialCard.image}" alt="${initialCard.name}">
                        </div>
                        <div class="card__back">
                             <!-- Podríamos poner una imagen del reverso de la carta aquí -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    controlPanelEl.innerHTML = `
        <h2>Centro de Control</h2>
        ${createDropdown('card-select', 'Elige una Carta:', CARDS, initialCard.id)}
        ${createDropdown('effect-select', 'Elige un Efecto:', EFFECTS, initialEffect)}
        ${createDropdown('texture-select', 'Elige una Textura (Foil):', TEXTURES, 'none')}
    `;

    // Añadir event listeners a los controles
    document.getElementById('card-select').addEventListener('change', applyChanges);
    document.getElementById('effect-select').addEventListener('change', applyChanges);
    document.getElementById('texture-select').addEventListener('change', applyChanges);
}
//--- END OF FILE js/modules/ui.js ---