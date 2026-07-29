document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowRight" && dx !== -CELL_SIZE) {
        dx = CELL_SIZE;
        dy = 0;
    }

    if (event.key === "ArrowLeft" && dx !== CELL_SIZE) {
        dx = -CELL_SIZE;
        dy = 0;
    }

    if (event.key === "ArrowUp" && dy !== CELL_SIZE) {
        dx = 0;
        dy = -CELL_SIZE;
    }

    if (event.key === "ArrowDown" && dy !== -CELL_SIZE) {
        dx = 0;
        dy = CELL_SIZE;
    }
    
})