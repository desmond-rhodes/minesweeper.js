function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

const d_game_width = document.getElementById('game-width')
const d_game_height = document.getElementById('game-height')
const d_mine_amount = document.getElementById('mine-amount')
const d_cell_width = document.getElementById('cell-width')
const d_cell_height = document.getElementById('cell-height')
const d_cell_padding = document.getElementById('cell-padding')

const d_reset = document.getElementById('reset')

const game = document.getElementById('game')
const announce = document.getElementById('announce')

let game_width
let game_height
let mine_amount
let cell_width
let cell_height
let cell_padding

let arena
let opened
let over

function numeric_only() {
	this.value = this.value.replace(/[^0-9]/g, '')
	if (Number(this.value) == 0)
		switch (this.id) {
		case 'game-width':
		case 'game-height':
		case 'mine-amount':
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

function add_mine(y, x) {
	if (arena[y][x] != -1)
		arena[y][x] += 1
}

function update_mine(y, x) {
	const r = (x < game_width-1)
	const l = (x > 0)
	const u = (y < game_height-1)
	const d = (y > 0)
	if (r) add_mine(y, x+1)
	if (l) add_mine(y, x-1)
	if (u) add_mine(y+1, x)
	if (d) add_mine(y-1, x)
	if (r && u) add_mine(y+1, x+1)
	if (r && d) add_mine(y-1, x+1)
	if (l && u) add_mine(y+1, x-1)
	if (l && d) add_mine(y-1, x-1)
}

function construct_data() {
	arena = []
	for (let i = 0; i < game_height; ++i) {
		arena[i] = []
		for (let j = 0; j < game_width; ++j)
			arena[i][j] = 0
	}

	for (let i = 0; i < mine_amount; ++i) {
		let x, y
		do {
			x = random(0, game_width-1)
			y = random(0, game_height-1)
		} while (arena[y][x] == -1)
		arena[y][x] = -1
		update_mine(y, x)
	}
}

function game_over(win) {
	over = true
	for (let i = 0; i < game_width * game_height; ++i) {
		const cell = game.children[i]
		if (cell.classList.contains('bomb'))
			cell.classList.add('opened')
	}
	const message = document.createElement('h1')
	if (win)
		message.innerHTML = 'YOU WIN'
	else
		message.innerHTML = 'YOU LOSE'
	announce.appendChild(message)
}

function open(event) {
	if (over)
		return

	const target = event.target
	const classList = target.classList
	const x = target.getAttribute('x')
	const y = target.getAttribute('y')

	if (classList.contains('opened'))
		return
	classList.add('opened')

	const symbol = document.createElement('p')
	symbol.style['font-size'] = `${Math.min(cell_width*.75, cell_height*.75)}px`

	switch (arena[y][x]) {
	case -1:
		game_over(false)
		symbol.innerHTML = 'X'
		target.appendChild(symbol)
		break
	case 0:
		break
	default:
		symbol.innerHTML = `${arena[y][x]}`
		target.appendChild(symbol)
		opened += 1
		if (opened == game_width * game_height - mine_amount)
			game_over(true)
		break
	}
}

function construct_html() {
	while (game.firstChild)
		game.removeChild(game.firstChild)

	game.style['grid-template-columns'] = `repeat(${game_width}, 1fr)`
	game.style['grid-template-rows'] = `repeat(${game_height}, 1fr)`
	game.style['gap'] = `${cell_padding}px`

	for (let i = 0; i < game_height; ++i)
		for (let j = 0; j < game_width; ++j) {
			const cell = document.createElement('div')
			cell.setAttribute('x', j)
			cell.setAttribute('y', i)
			cell.style['width'] = `${cell_width}px`
			cell.style['height'] = `${cell_height}px`
			cell.classList.add('cell')
			if (arena[i][j] == -1)
				cell.classList.add('bomb')
			cell.addEventListener('click', open)
			cell.addEventListener('mousedown', open)
			cell.addEventListener('touchstart', open)
			game.appendChild(cell)
		}
}

function reset() {
	game_width = Number(d_game_width.value)
	game_height = Number(d_game_height.value)
	mine_amount = Number(d_mine_amount.value)
	cell_width = Number(d_cell_width.value)
	cell_height = Number(d_cell_height.value)
	cell_padding = Number(d_cell_padding.value)

	opened = 0
	over = false
	while (announce.firstChild)
		announce.removeChild(announce.firstChild)

	construct_data()
	construct_html()
}

d_game_width.addEventListener('focusout', numeric_only)
d_game_height.addEventListener('focusout', numeric_only)
d_mine_amount.addEventListener('focusout', numeric_only)
d_cell_width.addEventListener('focusout', numeric_only)
d_cell_height.addEventListener('focusout', numeric_only)
d_cell_padding.addEventListener('focusout', numeric_only)

d_reset.addEventListener('click', reset)
reset()
