import { CELL_SIZE } from "./config.js";
import { state } from "./state.js";


export function draw(ctx, canvas) {
    // Фон
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Яблоко
    const centerX = state.food.x + CELL_SIZE / 2;
    const centerY = state.food.y + CELL_SIZE / 2;


    // Размер карточки
    const boxWidth = 400;
    const boxHeight = 190;

    // Положение карточки
    const boxX = (canvas.width - boxWidth) / 2;
    const boxY = (canvas.height - boxHeight) / 2;


    // Тень
    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.arc(centerX + 2, centerY + 3, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Яблоко
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
    for (let i = 0; i < state.snake.length; i++) {
        const segment = state.snake[i];

        if (i === 0) {
            // Голова
            ctx.fillStyle = "#32cd32";
            ctx.fillRect(segment.x, segment.y, CELL_SIZE, CELL_SIZE);

            // Глаза
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(segment.x + 6, segment.y + 6, 3, 0, Math.PI * 2);
            ctx.arc(segment.x + 14, segment.y + 6, 3, 0, Math.PI * 2);
            ctx.fill();

            // Зрачки
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(segment.x + 6, segment.y + 6, 1.5, 0, Math.PI * 2);
            ctx.arc(segment.x + 14, segment.y + 6, 1.5, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Тело
            ctx.fillStyle = "lime";
            ctx.fillRect(segment.x, segment.y, CELL_SIZE, CELL_SIZE);
        }
    }


    // Счёт и рекорд
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Счёт: " + state.score, 10, 25);
    ctx.fillText("Рекорд: " + state.bestScore, 10, 50);

    // Game Over
    if (state.gameOver) {

        // Затемнение фона
        ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Карточка
        ctx.fillStyle = "#252526";
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        // Рамка
        ctx.strokeStyle = "#4d4d4d";
        ctx.lineWidth = 3;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // Настройки текста
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Заголовок
        ctx.font = "bold 46px Arial";
        ctx.fillStyle = "#ff6b6b";
        ctx.fillText("GAME OVER", canvas.width / 2, boxY + 45);

        // Счёт
        ctx.font = "26px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`Счёт: ${state.score}`, canvas.width / 2, boxY + 95);

        // Подсказка
        ctx.font = "22px Arial";
        ctx.fillStyle = "#a8a8a8";
        ctx.fillText("Нажмите R для перезапуска", canvas.width / 2, boxY + 145);
    }

    // Пауза
    if (state.paused) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "yellow";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText("ПАУЗА", canvas.width / 2, canvas.height / 2);

        ctx.font = "22px Arial";
        ctx.fillText("Нажмите P для продолжения", canvas.width / 2, canvas.height / 2 + 40);
    }
}