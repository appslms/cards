export const USERS = [
    { username: 'Juan', allowedCards: [1, 3] },
    { username: 'Maria', allowedCards: [2, 4] },
    { username: 'Admin', allowedCards: [1, 2, 3, 4] },
];

export const CARDS = [
    { 
        id: 1, 
        name: 'Bestia Cósmica', 
        effectClass: 'v-star',
        image: 'assets/cards/card1.png'
    },
    { 
        id: 2, 
        name: 'Guardián Estelar',
        effectClass: 'amazing-rare',
        image: 'assets/cards/card2.png'
    },
    { 
        id: 3, 
        name: 'Espectro Nebular',
        effectClass: 'cosmos-holo',
        image: 'assets/cards/card3.png'
    },
    { 
        id: 4, 
        name: 'Dragón del Vacío',
        effectClass: 'secret-rare',
        image: 'assets/cards/card4.png'
    },
];