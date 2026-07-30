const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu");
const playButton = document.getElementById("play-btn");

canvas.width = 600;
canvas.height = 600;

const CELL_SIZE = 20;

let snake = [
    { x: 100, y: 100 },
    { x: 80, y: 100 },
    { x: 60, y: 100 }
];

let food = {
    x: Math.floor(Math.random() * 30) * CELL_SIZE,
    y: Math.floor(Math.random() * 30) * CELL_SIZE
};

let dx = CELL_SIZE;
let dy = 0;
let gameOver = false;

let score = 0;
let bestScore = 0;

let paused = false;

// создание нового яблока
function createFood() {

    let validPosition = false;

    while (!validPosition) {

        food.x = Math.floor(Math.random() * 30) * CELL_SIZE;
        food.y = Math.floor(Math.random() * 30) * CELL_SIZE;

        validPosition = true;

        for (const segment of snake) {

            if (
                segment.x === food.x &&
                segment.y === food.y
            ) {
                validPosition = false;
                break;
            }

        }

    }

}

function draw() {

    // Фон
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Яблоко
    const centerX = food.x + CELL_SIZE / 2;
    const centerY = food.y + CELL_SIZE / 2;

    // Тень
    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.arc(centerX + 2, centerY + 3, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Само яблоко
    ctx.beginPath();
    ctx.fillStyle = "#e53935";
    ctx.arc(centerX, centerY, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Блик
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.arc(centerX - 4, centerY - 4, 3, 0, Math.PI * 2);
    ctx.fill();

    // Палочка
    ctx.beginPath();
    ctx.strokeStyle = "#6d4c41";
    ctx.lineWidth = 2;
    ctx.moveTo(centerX, centerY - 8);
    ctx.lineTo(centerX, centerY - 13);
    ctx.stroke();

    // Листик
    ctx.beginPath();
    ctx.fillStyle = "#43a047";
    ctx.ellipse(centerX + 4, centerY - 10, 4, 2, -0.5, 0, Math.PI * 2);
    ctx.fill();


    // Змейка
    for (let i = 0; i < snake.length; i++) {

        const segment = snake[i];

        // Голова
        if (i === 0) {

            ctx.fillStyle = "#32cd32";
            ctx.fillRect(
                segment.x,
                segment.y,
                CELL_SIZE,
                CELL_SIZE
            );

            // Белки глаз
            ctx.fillStyle = "white";

            ctx.beginPath();
            ctx.arc(segment.x + 6, segment.y + 6, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(segment.x + 14, segment.y + 6, 3, 0, Math.PI * 2);
            ctx.fill();

            // Зрачки
            ctx.fillStyle = "black";

            ctx.beginPath();
            ctx.arc(segment.x + 6, segment.y + 6, 1.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(segment.x + 14, segment.y + 6, 1.5, 0, Math.PI * 2);
            ctx.fill();

        }
        // Тело
        else {

            ctx.fillStyle = "lime";

            ctx.fillRect(
                segment.x,
                segment.y,
                CELL_SIZE,
                CELL_SIZE
            );

        }

    }


    // Счёт
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText(
        "Счёт: " + score,
        10,
        25
    );

    ctx.fillText(
    "Рекорд: " + bestScore,
    10,
    50
    );
    

    // Game Over
    if (gameOver) {

        ctx.fillStyle = "gray";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            "GAME OVER",
            canvas.width / 2,
            canvas.height / 2
        );

        ctx.font = "22px Arial";

        ctx.fillText(
            "Нажмите R для перезапуска",
            canvas.width / 2,
            canvas.height / 2 + 40
        );
    }

    if (paused) {

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "yellow";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "ПАУЗА",
        canvas.width / 2,
        canvas.height / 2
    );

    ctx.font = "22px Arial";

    ctx.fillText(
        "Нажмите P для продолжения",
        canvas.width / 2,
        canvas.height / 2 + 40
    );

    }
}


function update() {

    if (gameOver || paused) {
        return;
    }

    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };


    // стены
    if (
        head.x < 0 ||
        head.x >= canvas.width ||
        head.y < 0 ||
        head.y >= canvas.height
    ) {
        gameOver = true;
        return;
    }


    snake.unshift(head);

// проверка столкновения с собой
for (let i = 1; i < snake.length - 1; i++) {

    if (
        head.x === snake[i].x &&
        head.y === snake[i].y
    ) {
        gameOver = true;
        return;
    }

    }
    // съела яблоко
    if (
        head.x === food.x &&
        head.y === food.y
    ) {

        score++;
        if (score > bestScore) {

            bestScore = score;

            fetch("/save-record", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    bestScore: bestScore
                })
            });

        }

        if (score % 5 === 0 && gameSpeed > 60) {

            gameSpeed -= 20;
            startGameLoop();

        }

        createFood();

        // хвост не удаляем = рост
    }
    else {
        snake.pop();
    }
}


function restartGame() {

    paused = false;

    canvas.style.display = "block";

    snake = [
        { x: 100, y: 100 },
        { x: 80, y: 100 },
        { x: 60, y: 100 }
    ];

    dx = CELL_SIZE;
    dy = 0;

    score = 0;

    gameSpeed = 200;
    startGameLoop();

    createFood();

    gameOver = false;

    draw();
}


// Управление
document.addEventListener("keydown", function (event) {

    if (event.code === "KeyD" && dx !== -CELL_SIZE) {
        dx = CELL_SIZE;
        dy = 0;
    }

    if (event.code === "KeyA" && dx !== CELL_SIZE) {
        dx = -CELL_SIZE;
        dy = 0;
    }

    if (event.code === "KeyW" && dy !== CELL_SIZE) {
        dx = 0;
        dy = -CELL_SIZE;
    }

    if (event.code === "KeyS" && dy !== -CELL_SIZE) {
        dx = 0;
        dy = CELL_SIZE;
    }


    if (event.code === "KeyR" && gameOver) {
        restartGame();
    }

    if (event.code === "KeyP" && !gameOver) {
    paused = !paused;
    }
});

playButton.addEventListener("click", () => {

    menu.style.display = "none";
    canvas.style.display = "block";

    restartGame();

});

let gameSpeed = 200;
let gameLoop;

async function loadRecord() {

    const response = await fetch("/get-record");
    const data = await response.json();

    bestScore = data.bestScore;

    document.getElementById("menu-best-score").textContent = bestScore;

}

function startGameLoop() {

    clearInterval(gameLoop);

    gameLoop = setInterval(() => {
        update();
        draw();
    }, gameSpeed);

}

loadRecord();