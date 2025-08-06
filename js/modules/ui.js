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
    if (!cardEl) return;

    const cardSelect = document.getElementById('card-select');
    const effectSelect = document.getElementById('effect-select');
    const textureSelect = document.getElementById('texture-select');

    const selectedCard = CARDS.find(c => c.id == cardSelect.value);
    const selectedTexture = TEXTURES.find(t => t.id == textureSelect.value);
    const selectedEffect = effectSelect.value;

    // 1. Cambiar la imagen de la tarjeta
    if (selectedCard) {
        cardEl.style.backgroundImage = `url('${selectedCard.image}')`;
    }

    // 2. Cambiar el efecto usando el atributo data-rarity
    cardEl.setAttribute('data-rarity', selectedEffect);

    // 3. Cambiar la textura (foil) y su tamaño para el tileado
    if (selectedTexture && selectedTexture.path !== 'none') {
        cardEl.style.setProperty('--foil', `url(../${selectedTexture.path})`);
        cardEl.style.setProperty('--imgsize', '25%'); // Tamaño para tileado
    } else {
        // Restaura el valor por defecto si no se selecciona ninguna textura
        cardEl.style.removeProperty('--foil');
        cardEl.style.removeProperty('--imgsize');
    }
}

export function renderApp() {
    // Definir el estado inicial
    const initialCardId = CARDS[0].id;
    const initialEffectId = 'v-star';
    const initialTextureId = 'none';

    // Renderizar la tarjeta inicial
    visualizerEl.innerHTML = `
        <div class="card-wrapper">
            <div class="card interactive ${initialEffectId}" data-rarity="${initialEffectId}"></div>
        </div>
    `;
    
    // Renderizar el panel de control con valores iniciales seleccionados
    controlPanelEl.innerHTML = `
        <h2>Centro de Control</h2>
        ${createDropdown('card-select', 'Elige una Carta:', CARDS, initialCardId)}
        ${createDropdown('effect-select', 'Elige un Efecto:', EFFECTS, initialEffectId)}
        ${createDropdown('texture-select', 'Elige una Textura (Foil):', TEXTURES, initialTextureId)}
    `;

    // Aplicar la configuración inicial a la tarjeta
    applyChanges();

    // Añadir event listeners a los controles
    document.getElementById('card-select').addEventListener('change', applyChanges);
    document.getElementById('effect-select').addEventListener('change', applyChanges);
    document.getElementById('texture-select').addEventListener('change', applyChanges);
}