/**
 * crosswordSolver.js
 * A recursive backtracking solver for crossword puzzles.
 */

function crosswordSolver(puzzle, words) {
    // 1. Validation & Parsing (Your existing logic)
    const parsedPuzzle = parsePuzzle(puzzle);
    if (parsedPuzzle === "Error") return console.log("Error");

    const cleanWords = parseWords(words);
    if (cleanWords === "Error") return console.log("Error");

    const { grid, wordSlots } = parsedPuzzle;

    // Check if the number of words matches the number of slots found
    if (cleanWords.length !== wordSlots.length) return console.log("Error");

    // 2. The Solving Engine
    const solutions = [];
    const charGrid = grid.map(row => row.split('').map(char => (char === '.' ? '.' : '')));

    function solve(wordIdx) {
        // If we've placed all words, we found a solution!
        if (wordIdx === cleanWords.length) {
            solutions.push(charGrid.map(row => row.join('')).join('\n'));
            return;
        }

        // Stop early if we find more than one solution (requirement: unique solution)
        if (solutions.length > 1) return;

        const currentWord = cleanWords[wordIdx];

        for (let i = 0; i < wordSlots.length; i++) {
            const slot = wordSlots[i];

            if (!slot.filled && slot.length === currentWord.length) {
                if (canPlace(currentWord, slot)) {
                    const originalChars = placeWord(currentWord, slot);
                    slot.filled = true;

                    solve(wordIdx + 1);

                    // Backtrack: Undo the placement to try other combinations
                    slot.filled = false;
                    removeWord(slot, originalChars);
                }
            }
        }
    }

    function canPlace(word, slot) {
        for (let i = 0; i < word.length; i++) {
            const [r, c] = slot.cells[i];
            const existingChar = charGrid[r][c];
            if (existingChar !== '' && existingChar !== word[i]) {
                return false;
            }
        }
        return true;
    }

    function placeWord(word, slot) {
        const original = [];
        for (let i = 0; i < word.length; i++) {
            const [r, c] = slot.cells[i];
            original.push(charGrid[r][c]);
            charGrid[r][c] = word[i];
        }
        return original;
    }

    function removeWord(slot, originalChars) {
        for (let i = 0; i < slot.cells.length; i++) {
            const [r, c] = slot.cells[i];
            charGrid[r][c] = originalChars[i];
        }
    }

    // Initialize slot status
    wordSlots.forEach(s => s.filled = false);
    
    // Start solving
    solve(0);

    // 3. Final Output Validation
    if (solutions.length !== 1) {
        console.log("Error");
    } else {
        console.log(solutions[0]);
    }
}

// --- Helper Functions (From your original code) ---

function parsePuzzle(puzzle) {
    if (typeof puzzle !== "string" || puzzle === "") return "Error";
    if (/[^.\n012]/.test(puzzle)) return "Error";

    const grid = puzzle.split("\n");
    for (let row of grid) {
        if (row.length !== grid[0].length || row === "") return "Error";
    }

    const wordSlots = [];
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            if (grid[r][c] === ".") continue;

            const hStart = isHorizontalStart(grid, r, c);
            const vStart = isVerticalStart(grid, r, c);

            if ((Number(hStart) + Number(vStart)) !== Number(grid[r][c])) return "Error";

            if (hStart) wordSlots.push(walkHorizontal(grid, r, c));
            if (vStart) wordSlots.push(walkVertical(grid, r, c));
        }
    }
    return { grid, wordSlots };
}

function parseWords(words) {
    if (!Array.isArray(words) || new Set(words).size !== words.length) return "Error";
    for (const w of words) if (typeof w !== "string" || w === "") return "Error";
    return words;
}

function isHorizontalStart(grid, r, c) {
    const leftBlocked = (c === 0 || grid[r][c - 1] === ".");
    const hasRight = (c < grid[0].length - 1 && grid[r][c + 1] !== ".");
    return leftBlocked && hasRight;
}

function isVerticalStart(grid, r, c) {
    const upBlocked = (r === 0 || grid[r - 1][c] === ".");
    const hasDown = (r < grid.length - 1 && grid[r + 1][c] !== ".");
    return upBlocked && hasDown;
}

function walkHorizontal(grid, r, c) {
    const cells = [];
    while (c < grid[0].length && grid[r][c] !== ".") {
        cells.push([r, c]);
        c++;
    }
    return { length: cells.length, cells };
}

function walkVertical(grid, r, c) {
    const cells = [];
    while (r < grid.length && grid[r][c] !== ".") {
        cells.push([r, c]);
        r++;
    }
    return { length: cells.length, cells };
}

const puzzle = '2001\n0..0\n1000\n0..0'
const words = ['aaab', 'aaac', 'aaad', 'aaae']

crosswordSolver(puzzle, words)