import { CELL_SIZE, CANVAS_SIZE } from "./config.js";
import { state } from "./state.js";


export function createFood() {
    let validPosition = false;
    const maxGrid = CANVAS_SIZE / CELL_SIZE;

    while (!validPosition) {
        state.food.x = Math.floor(Math.random() * maxGrid) * CELL_SIZE;
        state.food.y = Math.floor(Math.random() * maxGrid) * CELL_SIZE;

        validPosition = !state.snake.some(
            (segment) => segment.x === state.food.x && segment.y === state.food.y
        );
    }
}
