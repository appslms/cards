import * as auth from './modules/auth.js';
import { renderLoginScreen, renderCollectionScreen } from './modules/ui.js';

function main() {
    const currentUser = auth.getCurrentUser();

    if (currentUser) {
        renderCollectionScreen(currentUser);
    } else {
        renderLoginScreen();
    }
}

document.addEventListener('DOMContentLoaded', main);