//--- START OF FILE js/modules/ui.js ---
import { CARDS, EFFECTS, TEXTURES } from '../config.js';

const visualizerEl = document.getElementById('visualizer');
const controlPanelEl = document.getElementById('control-panel');
const root = document.documentElement;

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
    const cardFrontImg = document.querySelector('.card__front img');
    if (!cardEl || !cardFrontImg) return;

    const cardSelect = document.getElementById('card-select');
    const effectSelect = document.getElementById('effect-select');
    const textureSelect = document.getElementById('texture-select');

    const selectedCard = CARDS.find(c => c.id == cardSelect.value);
    const selectedTexture = TEXTURES.find(t => t.id == textureSelect.value);
    const selectedEffect = effectSelect.value;

    // 1. Cambiar la imagen de la tarjeta
    if (selectedCard) {
        cardFrontImg.src = selectedCard.image;
        cardFrontImg.alt = selectedCard.name;
    }

    // 2. Cambiar el efecto (el atributo data-rarity es la única fuente de verdad)
    cardEl.setAttribute('data-rarity', selectedEffect);
    
    // 3. Cambiar la textura (foil)
    if (selectedTexture && selectedTexture.path !== 'none') {
        root.style.setProperty('--foil', `url(${selectedTexture.path})`);
        root.style.setProperty('--imgsize', '25%'); // Tamaño para tileado
    } else {
        root.style.removeProperty('--foil');
        root.style.removeProperty('--imgsize');
    }
}

export function renderApp() {
    const initialCard = CARDS[0];
    const initialEffect = 'rare holo vstar'; // Usamos el ID correcto desde el principio

    visualizerEl.innerHTML = `
        <div class="card-wrapper">
            <div class="card interactive" data-rarity="${initialEffect}">
                <div class="card__translater">
                    <div class="card__rotator">
                        <div class="card__front">
                            <img src="${initialCard.image}" alt="${initialCard.name}">
                        </div>
                        <div class="card__back"></div>
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

    applyChanges();

    document.getElementById('card-select').addEventListener('change', applyChanges);
    document.getElementById('effect-select').addEventListener('change', applyChanges);
    document.getElementById('texture-select').addEventListener('change', applyChanges);
}
//--- END OF FILE js/modules/ui.js ---