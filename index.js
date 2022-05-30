const d_game_width = document.getElementById('game-width')
const d_game_height = document.getElementById('game-height')
const d_mine = document.getElementById('mine')
const d_cell_width = document.getElementById('cell-width')
const d_cell_height = document.getElementById('cell-height')
const d_cell_padding = document.getElementById('cell-padding')

const d_reset = document.getElementById('reset')

const game = document.getElementById('game')

let game_width
let game_height
let mine
let cell_width
let cell_height
let cell_padding

function numeric_only() {
	this.value = this.value.replace(/[^0-9]/g, '')
	if (Number(this.value) == 0)
		switch (this.id) {
		case 'game-width':
		case 'game-height':
		case 'mine':
			this.value = 10
			break
		case 'cell-width':
		case 'cell-height':
			this.value = 60
			break
		case 'cell-padding':
			this.value = 15
			break
		}
}

function open(event) {
	classList = event.target.classList
	if (classList.contains('cell-closed')) {
		classList.remove('cell-closed')
		classList.add('cell-opened')
	}
}

function construct() {
	while (game.firstChild)
		game.removeChild(game.firstChild)

	game.style['grid-template-columns'] = `repeat(${game_width}, 1fr)`
	game.style['grid-template-rows'] = `repeat(${game_height}, 1fr)`
	game.style['gap'] = `${cell_padding}px`

	for (let i = 0; i < game_height; ++i)
		for (let j = 0; j < game_width; ++j) {
			const cell = document.createElement('div')
			cell.style['width'] = `${cell_width}px`
			cell.style['height'] = `${cell_height}px`
			cell.classList.add('cell')
			cell.classList.add('cell-closed')
			cell.addEventListener('mousedown', open)
			cell.addEventListener('touchstart', open)
			game.appendChild(cell)
		}
}

function reset() {
	game_width = Number(d_game_width.value)
	game_height = Number(d_game_height.value)
	mine = Number(d_mine.value)
	cell_width = Number(d_cell_width.value)
	cell_height = Number(d_cell_height.value)
	cell_padding = Number(d_cell_padding.value)
	construct()

	console.log(`${game_width} ${game_height}`)
}

d_game_width.addEventListener('focusout', numeric_only)
d_game_height.addEventListener('focusout', numeric_only)
d_mine.addEventListener('focusout', numeric_only)
d_cell_width.addEventListener('focusout', numeric_only)
d_cell_height.addEventListener('focusout', numeric_only)
d_cell_padding.addEventListener('focusout', numeric_only)

d_reset.addEventListener('click', reset)
reset()

console.log('Hello, world!')
