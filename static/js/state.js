import { CELL_SIZE, INITIAL_SPEED } from "./config.js";

export const state = {
    snake: [],
    food: { x: 0, y: 0 },
    dx: CELL_SIZE,
    dy: 0,
    gameOver: false,
    paused: false,
    score: 0,
    bestScore: 0,
    gameSpeed: INITIAL_SPEED,
    gameLoop: null
};

export function resetGameState() {
    state.snake = [
        { x: 100, y: 100 },
        { x: 80, y: 100 },
        { x: 60, y: 100 }
    ];
    state.dx = CELL_SIZE;
    state.dy = 0;
    state.score = 0;
    state.gameOver = false;
    state.paused = false;
    state.gameSpeed = INITIAL_SPEED;
}
