function crosswordSolver(puzzle, words) {
    const parsedPuzzle = parsePuzzle(puzzle)
    if (parsedPuzzle === "Error") return console.log("Error")

    const cleanWords = parseWords(words)
    if (cleanWords === "Error") return console.log("Error")

    const { grid, wordSlots } = parsedPuzzle

    if (cleanWords.length !== wordSlots.length) return console.log("Error")
}

function parsePuzzle(puzzle) {
    if (typeof puzzle !== "string" || puzzle === "") {return "Error"}
    if (detectIllegalChars(puzzle)) {return "Error"}

    const grid = splitString(puzzle)
    if (grid === "Error") {return "Error"}

    const wordSlots = analyzeGrid(grid)
    if (wordSlots === "Error") {return "Error"}
    return {grid, wordSlots}
}

function parseWords(words) {
    // Check that words is actually an array
    if (!Array.isArray(words)) return "Error"
    // Check all words are strings and none are empty
    for (const word of words) {
        if (typeof word !== "string" || word === "") return "Error"
    }
    // This works since sets only include unique elements
    const uniqueWords = new Set(words)
    const hasDuplicates = uniqueWords.size !== words.length
    if (hasDuplicates) return "Error"

    return words
}

// analyzeGrid, takes the parsed grid, finds all word slots
// records them for their length and position and validates
// whether the ammount of starts is actually true to the number in the start cell
// so for cell === 2 there have to be 2 starts etc.
function analyzeGrid(grid) {
    const slots = []

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            if (!isOpenCell(grid, row, col)) continue

            const horizontalStart = isHorizontalStart(grid, row, col)
            const verticalStart = isVerticalStart(grid, row, col)

            const actualStarts = Number(horizontalStart) + Number(verticalStart)
            const expectedStarts = Number(grid[row][col])
            //Compare actualstarts with expected starts to check
            // if amount of starts is actually true to the number of the start cell
            if (actualStarts !== expectedStarts) {return "Error"}

            if (horizontalStart) {
                slots.push(walkHorizontal(grid, row, col))
            }

            if (verticalStart) {
                slots.push(walkVertical(grid, row, col))
            }
        }
    }
    return slots
}

// Uses regex to check for any illegal chars and allows only . 0 1 2 \n
function detectIllegalChars(puzzle) {
    let illegalChars = /[^.\n012]/
    return illegalChars.test(puzzle)
}

// Validates row structure
function splitString(puzzle) {
    let grid = puzzle.split("\n")
    for (let row of grid) {
        if (row.length !== grid[0].length || row === "") {
            return "Error"
        }
    }
    return grid
}

function isOpenCell(grid, row, col) {
    return grid[row][col] !== "."
}

function isHorizontalStart(grid, row, col) {
    if (!isOpenCell(grid, row, col)) return false

    const leftIsBoundary = col === 0
    const leftIsBlocked = !leftIsBoundary && !isOpenCell(grid, row, col - 1)
    // check that col is not the last column in the grid
    const hasRightCell = col < grid[0].length -1
    // check if right cell exists and its open
    const rightIsOpen = hasRightCell && isOpenCell(grid, row, col + 1)

    return (leftIsBoundary || leftIsBlocked) && rightIsOpen

}

function isVerticalStart(grid, row, col) {
    if (!isOpenCell(grid, row, col)) return false

    const upIsBoundary = row === 0
    const upIsBlocked = !upIsBoundary && !isOpenCell(grid, row -1, col)

    const hasDownCell = row < grid.length -1

    const downIsOpen = hasDownCell && isOpenCell(grid, row + 1, col)

    return (upIsBoundary || upIsBlocked) && downIsOpen
}

// walkHorizontal goes through a horizontal word slot and records its length and position
function walkHorizontal(grid, startRow, startCol) {
    let col = startCol
    let cells = []

    while (col < grid[0].length && isOpenCell(grid, startRow, col)) {
        cells.push([startRow, col])
        col += 1
    }

    return {
        direction: "across",
        startRow,
        startCol,
        length: cells.length,
        cells
    }
}

// walkVertical goes through a vertical word slot and records its length and position
function walkVertical(grid, startRow, startCol) {
    let row = startRow
    let cells = []

    while (row < grid.length && isOpenCell(grid, row, startCol)) {
        cells.push([row, startCol])
        row += 1
    }

    return {
        direction: "down",
        startRow,
        startCol,
        length: cells.length,
        cells
    }
}
