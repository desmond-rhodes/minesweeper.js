const d_width = document.getElementById('width' )
const d_height = document.getElementById('height')
const d_reset = document.getElementById('reset' )

const game = document.getElementById('game')
let width
let height

function numeric_only() {
	this.value = this.value.replace(/[^0-9]/g, '')
	if (this.value.length == 0)
		this.value = 10
}

function open() {
	if (this.classList.contains('cell-closed')) {
		this.classList.remove('cell-closed')
		this.classList.add('cell-opened')
	}
}

function construct() {
	while (game.firstChild)
		game.removeChild(game.firstChild)

	game.style['grid-template-columns'] = `repeat(${width}, 1fr)`
	game.style['grid-template-rows'] = `repeat(${height}, 1fr)`

	for (let i = 0; i < height; ++i)
		for (let j = 0; j < width; ++j) {
			const cell = document.createElement('div')
			cell.classList.add('cell');
			cell.classList.add('cell-closed');
			cell.addEventListener('click', open);
			game.appendChild(cell)
		}
}

function reset() {
	width = Number(d_width.value)
	height = Number(d_height.value)
	construct()

	console.log(`${width} ${height}`)
}

d_width.addEventListener('keyup', numeric_only)
d_height.addEventListener('keyup', numeric_only)
d_reset.addEventListener('click', reset)

reset()

console.log('Hello, world!')
