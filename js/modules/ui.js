import * as auth from './auth.js';
import { CARDS } from '../config.js';
import { addInteraction, removeInteraction } from './cardEffects.js';

const app = document.getElementById('app');
const overlay = document.getElementById('app-overlay');
let focusedCardElement = null;

export function renderLoginScreen() {
    app.innerHTML = `
        <div class="login-screen">
            <h1>Colección de Tarjetas Holográficas</h1>
            <p>Un proyecto interactivo con CSS y JavaScript.</p>
            <form id="login-form">
                <input type="text" id="username" name="username" placeholder="Prueba con: Juan, Maria, Admin..." required>
                <button type="submit">Ingresar a la Colección</button>
            </form>
        </div>
    `;
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        if (auth.login(username)) {
            window.location.reload();
        } else {
            alert('Usuario no encontrado.');
        }
    });
}

export function renderCollectionScreen(user) {
    const userCards = CARDS.filter(card => user.allowedCards.includes(card.id));

    const cardGridHTML = userCards.length > 0 
        ? userCards.map(card => {
            const effectClass = card.effectClass || 'basic';
            return `
                <div class="card card-item ${effectClass}" 
                     data-card-id="${card.id}" 
                     style="background-image: url('${card.image}');">
                </div>
            `;
        }).join('')
        : '<h2>Esta colección está vacía.</h2><p>El administrador necesita asignarte tarjetas.</p>';

    app.innerHTML = `
        <div class="collection-screen">
            <h1>Colección de ${user.username}</h1>
            <p>Haz clic en una tarjeta para verla en detalle e interactuar.</p>
            <div class="card-grid">${cardGridHTML}</div>
            <button class="logout-button">Cerrar Sesión</button>
        </div>
    `;

    document.querySelectorAll('.card-item').forEach(cardEl => {
        cardEl.addEventListener('click', () => focusCard(cardEl));
    });
    
    document.querySelector('.logout-button').addEventListener('click', () => {
        auth.logout();
        window.location.reload();
    });
}

function focusCard(cardElement) {
    if (focusedCardElement) return;

    focusedCardElement = cardElement;
    document.body.classList.add('is-modal-open');
    cardElement.classList.add('is-focused');

    setTimeout(() => {
        if (!focusedCardElement) return;
        cardElement.classList.add('is-interactive');
        addInteraction(cardElement);
    }, 500);
}

function unfocusCard() {
    if (!focusedCardElement) return;

    document.body.classList.remove('is-modal-open');
    focusedCardElement.classList.remove('is-interactive');
    focusedCardElement.classList.remove('is-focused');
    removeInteraction(focusedCardElement);

    focusedCardElement = null;
}

overlay.addEventListener('click', unfocusCard);