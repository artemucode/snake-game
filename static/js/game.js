import { CANVAS_SIZE, MIN_SPEED } from "./config.js";
import { state, resetGameState } from "./state.js";
import { createFood } from "./food.js";
import { draw } from "./renderer.js";
import { setupInput } from "./input.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu");
const playButton = document.getElementById("play-btn");


canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;


function update() {
    if (state.gameOver || state.paused) return;

    const head = {
        x: state.snake[0].x + state.dx,
        y: state.snake[0].y + state.dy
    };

    if (
        head.x < 0 ||
        head.x >= canvas.width ||
        head.y < 0 ||
        head.y >= canvas.height
    ) {
        state.gameOver = true;
        return;
    }

    for (let i = 1; i < state.snake.length; i++) {
        if (head.x === state.snake[i].x && head.y === state.snake[i].y) {
            state.gameOver = true;
            return;
        }
    }

    state.snake.unshift(head);

    if (head.x === state.food.x && head.y === state.food.y) {
        state.score++;

        if (state.score > state.bestScore) {
            state.bestScore = state.score;
            saveRecord(state.bestScore);
        }

        if (state.score % 5 === 0 && state.gameSpeed > MIN_SPEED) {
            state.gameSpeed -= 20;
            startGameLoop();
        }

        createFood();
    } else {
        state.snake.pop();
    }
}

function startGameLoop() {
    clearInterval(state.gameLoop);
    state.gameLoop = setInterval(() => {
        update();
        draw(ctx, canvas);
    }, state.gameSpeed);
}

function restartGame() {
    resetGameState();
    canvas.style.display = "block";
    createFood();
    startGameLoop();
    draw(ctx, canvas);
}

async function loadRecord() {
    try {
        const response = await fetch("/get-record");
        const data = await response.json();
        state.bestScore = data.bestScore || 0;

        const menuBestScore = document.getElementById("menu-best-score");
        if (menuBestScore) {
            menuBestScore.textContent = state.bestScore;
        }
    } catch (err) {
        console.error("Ошибка загрузки рекорда:", err);
    }
}

async function saveRecord(score) {
    try {
        await fetch("/save-record", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bestScore: score })
        });
    } catch (err) {
        console.error("Ошибка сохранения рекорда:", err);
    }
}

// Инициализируем управление клавиатурой
setupInput(restartGame);

// Вешаем клик на кнопку меню
if (playButton) {
    playButton.addEventListener("click", () => {
        menu.style.display = "none";
        restartGame();
    });
}


// Загружаем рекорд
loadRecord();
