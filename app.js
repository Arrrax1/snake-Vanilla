// init board
let canvas = document.querySelector('#board')
let block_size = 20
let number_rows = 20
let number_cols = 32
canvas.width = block_size*number_cols
canvas.height = block_size*number_rows

let ctx = canvas.getContext('2d')

// food point
// (0 - 0.9)*number_rows to get a random row number then multiply by block size to get actual position on canvas
let foodX = Math.floor(Math.random()*number_cols)*block_size
let foodY = Math.floor(Math.random()*number_rows)*block_size
ctx.fillStyle = 'red'
ctx.fillRect(foodX,foodY,20,20)
