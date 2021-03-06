import { createBoard, updateBoard } from './board'
import { state, decodeCells, flipCell, updateKey, getSolution, randomizeCells, randomizeKey, updateRowSize } from './state'
import './browserTweaks'
import './styles/index.scss'
import { fitText } from './fitText'

const board = document.querySelector('.board')

const update = () => {
  const decodedIndex = decodeCells()

  updateBoard({
    board,
    cells: state.cells,
    decodedIndex,
    secretIndex: state.keyIndex,
    solutionIndex: getSolution(decodedIndex, state.keyIndex),
  })
}

const init = () => {
  randomizeKey()
  randomizeCells()

  createBoard({
    board,
    rowSize: state.rowSize,
    cells: state.cells,
    update,
    flipCell,
    updateKey,
  })

  update()
}

document.querySelector('#randomize').addEventListener('click', () => {
  randomizeKey()
  randomizeCells()
  update()
})

document.querySelector('#auto-solve').addEventListener('click', () => {
  randomizeKey()
  randomizeCells()
  flipCell(getSolution(decodeCells(), state.keyIndex))
  update()
})

// Populate grid select
const gridSizeSelect = document.querySelector('#grid-size')
const numGridOptions = 4
let rowSize = 2

for (let i = 0; i < numGridOptions; i++) {
  const option = document.createElement('option')
  option.value = rowSize
  option.selected = rowSize === state.rowSize
  option.textContent = Math.pow(rowSize, 2)

  gridSizeSelect.append(option)

  rowSize *= 2
}

gridSizeSelect.addEventListener('change', () => {
  updateRowSize(gridSizeSelect.value)
  init()
})

// Filter functionality
const filters = ['key', 'decoded', 'selected']

filters.forEach(filter => {
  const checkbox = document.querySelector(`#show-${filter}`)
  const toggle = () => board.classList.toggle(`show-${filter}`, checkbox.checked)
  checkbox.addEventListener('change', toggle)
  toggle()
})

// Style header
fitText(document.querySelector('.main-title'), 2)

init()
