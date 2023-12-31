// init board
let canvas = document.querySelector('#board')
let block_size = 20
let number_rows = 20
let number_cols = 32
canvas.width = block_size * number_cols
canvas.height = block_size * number_rows

let directionX = 0
let directionY = 0

let keyDown = false, keyUp = false, keyRight = false, keyLeft = false   //a check to prevent to the prolonged keypress

let ctx = canvas.getContext('2d')

let score = 0
let snakeBody = [[40, 40]]

let foodX = Math.floor(Math.random() * number_cols) * block_size
let foodY = Math.floor(Math.random() * number_rows) * block_size

let intervID
let inPlay = true

let speed = 200
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', (event) => {
        switch (event.target.id) {
            case 'easy':
                speed = 200
                break;
            case 'medium':
                speed = 100
                break;
            case 'hard':
                speed = 50
                break;
            default:
                break;
        }
    })
})

function drawSnake(snakeBody) {
    // we run it first with no interval to make sure it has no delay on first execution
    // especially when changing direction, to make it almost instant direction change
    // also it helps avoiding a 180turn bug
    // Redraw canvas
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    // Food Redraw
    ctx.fillStyle = 'red'
    ctx.fillRect(foodX, foodY, 20, 20)
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
    for (let i = 0; i < snakeBody.length; i++) {
        switch (i) {
            case 0:
                ctx.lineJoin = 'bevel'
                ctx.fillStyle = '#129406'
                ctx.fillRect(snakeBody[i][0], snakeBody[i][1], 20, 20)
                ctx.strokeStyle = '#10c100'
                ctx.lineWidth = 3
                ctx.lineJoin = 'bevel'
                ctx.strokeRect(snakeBody[i][0], snakeBody[i][1], 20, 20)
                break;
            case snakeBody.length - 1:
                ctx.fillStyle = '#129406'
                ctx.fillRect(snakeBody[i][0] + 5, snakeBody[i][1] + 5, 10, 10)
                ctx.strokeStyle = '#10c100'
                ctx.lineWidth = 3
                ctx.lineJoin = 'bevel'
                ctx.strokeRect(snakeBody[i][0] + 3, snakeBody[i][1] + 3, 14, 14)
                ctx.fillStyle = '#333'
                ctx.fillRect(snakeBody[i][0] + 8, snakeBody[i][1] + 8, 4, 4)
                break;
            default:
                ctx.fillStyle = '#129406'
                ctx.fillRect(snakeBody[i][0] + 2, snakeBody[i][1] + 2, 16, 16)
                ctx.strokeStyle = '#10c100'
                ctx.lineWidth = 3
                ctx.strokeRect(snakeBody[i][0] + 2, snakeBody[i][1] + 2, 16, 16)
                break;
        }
    }
    if (checkGameOver()) gameOver()
    eatFood()
    // certain overlaps call the function again which sets a new setInterval
    // check if still in play (this could also be called at the beginning of the function)
    if (inPlay) {

        // to keep updating
        intervID = setInterval(() => {
            // Redraw canvas
            ctx.fillStyle = 'black'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            // Food Redraw
            ctx.fillStyle = 'red'
            ctx.fillRect(foodX, foodY, 20, 20)
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
            for (let i = 0; i < snakeBody.length; i++) {
                switch (i) {
                    case 0:
                        ctx.lineJoin = 'bevel'
                        ctx.fillStyle = '#129406'
                        ctx.fillRect(snakeBody[i][0], snakeBody[i][1], 20, 20)
                        ctx.strokeStyle = '#10c100'
                        ctx.lineWidth = 3
                        ctx.lineJoin = 'bevel'
                        ctx.strokeRect(snakeBody[i][0], snakeBody[i][1], 20, 20)
                        break;
                    case snakeBody.length - 1:
                        ctx.fillStyle = '#129406'
                        ctx.fillRect(snakeBody[i][0] + 5, snakeBody[i][1] + 5, 10, 10)
                        ctx.strokeStyle = '#10c100'
                        ctx.lineWidth = 3
                        ctx.lineJoin = 'bevel'
                        ctx.strokeRect(snakeBody[i][0] + 3, snakeBody[i][1] + 3, 14, 14)
                        ctx.fillStyle = '#333'
                        ctx.fillRect(snakeBody[i][0] + 8, snakeBody[i][1] + 8, 4, 4)
                        break;
                    default:
                        ctx.fillStyle = '#129406'
                        ctx.fillRect(snakeBody[i][0] + 2, snakeBody[i][1] + 2, 16, 16)
                        ctx.strokeStyle = '#10c100'
                        ctx.lineWidth = 3
                        ctx.strokeRect(snakeBody[i][0] + 2, snakeBody[i][1] + 2, 16, 16)
                        break;
                }
            }
            if (checkGameOver()) gameOver()
            eatFood()
        }, speed);
    }
}

function eatFood() {
    if (snakeBody[0][0] === foodX && snakeBody[0][1] === foodY) {
        let newPart = []
        newPart.push(foodX)
        newPart.push(foodY)
        snakeBody.unshift(newPart)
        // relocate food
        updateFood()
        score += 10
        document.getElementById('score').textContent = `Score : ${score}`
    }
}

drawSnake(snakeBody)
document.addEventListener('keydown', (event) => { //keydown better then keyup to make turns faster, however if you hold it, it makes a speed glitch
    // we check if we still playing to avoid game restart when game is over
    // we cancel the setInterval then restart the game to make sure it loads faster
    if (inPlay) {
        if (event.code === 'ArrowUp' && directionY != 20 && keyUp == false) {
            clearInterval(intervID)
            directionX = 0
            directionY = -20
            keyDown = false
            keyRight = false
            keyLeft = false
            keyUp = true
            drawSnake(snakeBody)
        }
        if (event.code === 'ArrowDown' && directionY != -20 && keyDown == false) {
            clearInterval(intervID)
            directionX = 0
            directionY = 20
            keyUp = false
            keyRight = false
            keyLeft = false
            keyDown = true
            drawSnake(snakeBody)
        }
        if (event.code === 'ArrowRight' && directionX != -20 && keyRight == false) {
            clearInterval(intervID)
            directionX = 20
            directionY = 0
            keyUp = false
            keyDown = false
            keyLeft = false
            keyRight = true
            drawSnake(snakeBody)
        }
        if (event.code === 'ArrowLeft' && directionX != 20 && keyLeft == false) {
            clearInterval(intervID)
            directionX = -20
            directionY = 0
            keyUp = false
            keyRight = false
            keyDown = false
            keyLeft = true
            drawSnake(snakeBody)
        }
    }
})

// food point
// (0 - 0.9)*number_rows to get a random row number then multiply by block size to get actual position on canvas
function updateFood() {
    foodX = Math.floor(Math.random() * number_cols) * block_size
    foodY = Math.floor(Math.random() * number_rows) * block_size
}

function checkGameOver() {
    //if still inbounds
    if ((snakeBody[0][0] == 640) || (snakeBody[0][0] < 0) || (snakeBody[0][1] == 400) || (snakeBody[0][1] < 0)) return true
    // if overlap
    for (let i = 2; i < snakeBody.length; i++) {
        if ((snakeBody[0][0] == snakeBody[i][0]) && (snakeBody[0][1] == snakeBody[i][1])) {
            return true
        }
    }
    return false
}

function gameOver() {
    clearInterval(intervID)
    document.getElementById('gameOver').style.display = 'flex'
    document.getElementById('finalScore').textContent = `Your Score Was : ${score}`
    inPlay = false
}

document.getElementById('newGame').addEventListener('click', () => {
    document.getElementById('gameOver').style.display = 'none'
    document.getElementById('score').textContent = `Score : 0`
    // re-init
    inPlay = true
    snakeBody = [[40, 40]]
    score = 0
    directionX = 0
    directionY = 0
    drawSnake(snakeBody)

    keyUp = false
    keyRight = false
    keyDown = false
    keyLeft = false
})
// ADD SCORE --- ADDED
// SNAKE HEAD AND TAIL (make blocks get smaller as they reach tail) // Stroke gets bigger so that it stays centered

// ADD BOUNDS and GameOver on Overlap
// Food Must Not Spawn on body
// ADD difficulty = Speed --- ADDED
// ADD NEW GAME btn
// Consider adding third item to snakeBody 'orientation' and based off of it draw the part