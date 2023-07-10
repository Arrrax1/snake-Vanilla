// init board
let canvas = document.querySelector('#board')
let block_size = 20
let number_rows = 20
let number_cols = 32
canvas.width = block_size * number_cols
canvas.height = block_size * number_rows

let directionX = 0
let directionY = 0

let ctx = canvas.getContext('2d')

let snakeBody = [[40, 40]]

let foodX = Math.floor(Math.random() * number_cols) * block_size
let foodY = Math.floor(Math.random() * number_rows) * block_size

let intervID
function drawSnake(snakeBody) {
    // we run it first with no interval to make sure it has no delay on first execution
    // especially when changing direction, to make it almost instant direction change
    // also it helps avoiding a 180turn bug
    // Redraw canvas
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    // Update Snake Moves
    // we just add the new head position then delete last position
    // we update the positions before redraw to make sure it updates oposition faster
    let nextPart = []
    let x = snakeBody[0][0] + directionX
    let y = snakeBody[0][1] + directionY
    nextPart.push(x)
    nextPart.push(y)
    snakeBody.unshift(nextPart)
    snakeBody.pop()
    // Redraw Snake
    ctx.fillStyle = 'green'
    for (let i = 0; i < snakeBody.length; i++) {
        ctx.fillRect(snakeBody[i][0], snakeBody[i][1], 20, 20)
    }
    // Food Redraw
    ctx.fillStyle = 'red'
    ctx.fillRect(foodX, foodY, 20, 20)
    eatFood()
    // to keep updating
    intervID = setInterval(() => {
        // Redraw canvas
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        // Update Snake Moves
        // we just add the new head position then delete last position
        // we update the positions before redraw to make sure it updates oposition faster
        let nextPart = []
        let x = snakeBody[0][0] + directionX
        let y = snakeBody[0][1] + directionY
        nextPart.push(x)
        nextPart.push(y)
        snakeBody.unshift(nextPart)
        snakeBody.pop()
        // Redraw Snake
        ctx.fillStyle = 'green'
        for (let i = 0; i < snakeBody.length; i++) {
            ctx.fillRect(snakeBody[i][0], snakeBody[i][1], 20, 20)
        }
        // Food Redraw
        ctx.fillStyle = 'red'
        ctx.fillRect(foodX, foodY, 20, 20)
        eatFood()
    }, 100);
}

function eatFood() {
    if (snakeBody[0][0] === foodX && snakeBody[0][1] === foodY) {
        let newPart = []
        newPart.push(foodX)
        newPart.push(foodY)
        snakeBody.unshift(newPart)
        // relocate food
        updateFood()
    }
}

drawSnake(snakeBody)
document.addEventListener('keydown', (event) => { //keydown better then keyup
    // we cancel the setInterval then restart the game to make sure it loads faster
    clearInterval(intervID)
    if (event.code === 'ArrowUp' && directionY != 20) {
        directionX = 0
        directionY = -20
    }
    if (event.code === 'ArrowDown' && directionY != -20) {
        directionX = 0
        directionY = 20
    }
    if (event.code === 'ArrowRight' && directionX != -20) {
        directionX = 20
        directionY = 0
    }
    if (event.code === 'ArrowLeft' && directionX != 20) {
        directionX = -20
        directionY = 0
    }
    drawSnake(snakeBody)
})

// food point
// (0 - 0.9)*number_rows to get a random row number then multiply by block size to get actual position on canvas
function updateFood() {
    foodX = Math.floor(Math.random() * number_cols) * block_size
    foodY = Math.floor(Math.random() * number_rows) * block_size
}

