import { CELL_SIZE } from "./config.js";
import { state } from "./state.js";


export function setupInput(onRestart) {
    document.addEventListener("keydown", (event) => {
        if (event.code === "KeyD" && state.dx !== -CELL_SIZE) {
            state.dx = CELL_SIZE;
            state.dy = 0;
        }


        if (event.code === "KeyA" && state.dx !== CELL_SIZE) {
            state.dx = -CELL_SIZE;
            state.dy = 0;
        }


        if (event.code === "KeyW" && state.dy !== CELL_SIZE) {
            state.dx = 0;
            state.dy = -CELL_SIZE;
        }


        if (event.code === "KeyS" && state.dy !== -CELL_SIZE) {
            state.dx = 0;
            state.dy = CELL_SIZE;
        }


        if (event.code === "KeyR" && state.gameOver) {
            onRestart();
        }


        if (event.code === "KeyP" && !state.gameOver) {
            state.paused = !state.paused;
        }
    });
}
