const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

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
    ctx.fillStyle = "red";
    ctx.fillRect(
        food.x,
        food.y,
        CELL_SIZE,
        CELL_SIZE
    );


    // Змейка
    ctx.fillStyle = "lime";

    for (const segment of snake) {
        ctx.fillRect(
            segment.x,
            segment.y,
            CELL_SIZE,
            CELL_SIZE
        );
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
}


function update() {

    if (gameOver) {
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

});

let gameSpeed = 200;
let gameLoop;

async function loadRecord() {

    const response = await fetch("/get-record");
    const data = await response.json();

    bestScore = data.bestScore;

}

function startGameLoop() {

    clearInterval(gameLoop);

    gameLoop = setInterval(() => {
        update();
        draw();
    }, gameSpeed);

}

loadRecord().then(() => {
    draw();
    startGameLoop();
});