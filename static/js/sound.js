const eatSound = new Audio("/static/sounds/eat.wav");
const gameOverSound = new Audio("/static/sounds/game_over.wav");
const startSound = new Audio("/static/sounds/start.wav");

// Громкость
eatSound.volume = 0.4;
gameOverSound.volume = 0.6;
startSound.volume = 0.5;

export function playEat() {
    eatSound.currentTime = 0;
    eatSound.play();
}

export function playGameOver() {
    gameOverSound.currentTime = 0;
    gameOverSound.play();
}

export function playStart() {
    startSound.currentTime = 0;
    startSound.play();
}
