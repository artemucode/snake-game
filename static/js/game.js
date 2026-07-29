const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");


canvas.width = 600;
canvas.height = 600;

const CELL_SIZE = 20;

// Массив
const snake = [
    { x: 100, y: 100 },
    { x: 80, y: 100 },
    { x: 60, y: 100 }
];

let dx = CELL_SIZE;
let dy = 0;

function draw() {

    // Рисуем фон
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Меняем цвет кисти на зелёный
    ctx.fillStyle = "lime";
    // ctx.fillRect(100, 100, CELL_SIZE, CELL_SIZE);


    // Рисуем каждую часть змейки
    for (const segment of snake) {
        ctx.fillRect(segment.x, segment.y, CELL_SIZE, CELL_SIZE);
    }

}

function update() {
    const head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy
};
    snake.unshift(head);
    snake.pop();
}

// Запускаем все вместе
draw();

setInterval(() => {
    update();
    draw();
}, 200);
