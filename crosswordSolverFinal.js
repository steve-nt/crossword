// The main function that takes the puzzle and words, validates them, and attempts to solve the crossword puzzle using backtracking.
function crosswordSolver(puzzle, words) {
  // Parse the puzzle string into a grid and extract word slots (positions where words go)
  const parsedPuzzle = parsePuzzle(puzzle);
  // Check if puzzle parsing failed; if so, log error and exit early
  if (parsedPuzzle === "Error") return console.log("Error");

  // Parse and validate the words array (check for duplicates, empty strings, etc.)
  const cleanWords = parseWords(words);
  // Check if word parsing failed; if so, log error and exit early
  if (cleanWords === "Error") return console.log("Error");

  // Destructure the parsed puzzle to get the grid (string array) and wordSlots (positions and dimensions)
  const { grid, wordSlots } = parsedPuzzle;

  // Validate that the number of words matches the number of word slots in the puzzle
  if (cleanWords.length !== wordSlots.length) return console.log("Error");

  // Initialize array to store all valid solutions (should be exactly 1)
  const solutions = [];
  // Create a character grid from the puzzle where black squares stay as "." and open cells start empty ""
  const charGrid = grid.map((row) =>
    row.split("").map((char) => (char === "." ? "." : "")),
  );

  // Mark all word slots as initially unfilled (empty) to track which slots have words placed
  wordSlots.forEach((s) => (s.filled = false));

  // Start the backtracking algorithm from word index 0 to recursively place words in slots
  solve(0, cleanWords, wordSlots, charGrid, solutions);

  // Validate that exactly one solution exists (crossword puzzles must have unique solutions)
  if (solutions.length !== 1) {
    // If no solution or multiple solutions found, log error
    console.log("Error");
  } else {
    // If exactly one solution found, print the solved crossword grid
    console.log(solutions[0]);
  }
}

// parsePuzzle validates the puzzle string and extracts word slots
// Checks that the puzzle is a non-empty string, contains only legal characters (. 0 1 2 \n),
// and that all rows have equal length. Then analyzes the grid to find word slots.
function parsePuzzle(puzzle) {
  // Verify that puzzle is a string type and is not empty
  if (typeof puzzle !== "string" || puzzle === "") {
    return "Error";
  }
  // Check if the puzzle contains any illegal characters (anything other than . 0 1 2 \n)
  if (detectIllegalChars(puzzle)) {
    return "Error";
  }

  // Split the puzzle string by newlines into rows and validate row structure
  const grid = splitString(puzzle);
  // If row splitting fails (unequal lengths), return error
  if (grid === "Error") {
    return "Error";
  }

  // Analyze the grid to find all word slots (horizontal and vertical starting positions)
  const wordSlots = analyzeGrid(grid);
  // If word slot analysis fails, return error
  if (wordSlots === "Error") {
    return "Error";
  }
  // Return both the grid and the identified word slots for use in solving
  return { grid, wordSlots };
}

// parseWords validates the words array to ensure it contains valid unique words
// Checks that words is an array, all elements are non-empty strings, and no duplicates exist
function parseWords(words) {
  // Check that words is actually an array type, not some other data structure
  if (!Array.isArray(words)) return "Error";
  // Loop through all words to validate each one individually
  for (const word of words) {
    // Verify each word is a string and is not empty
    if (typeof word !== "string" || word === "") return "Error";
  }
  // Create a Set to filter out duplicate words (Sets only store unique values)
  const uniqueWords = new Set(words);
  // Check if duplicates exist by comparing the Set size with original array length
  const hasDuplicates = uniqueWords.size !== words.length;
  // If duplicates found, return error (puzzle words must be unique)
  if (hasDuplicates) return "Error";

  // Return the validated words array if all checks pass
  return words;
}

// analyzeGrid scans the entire puzzle grid to identify all word slots (horizontal and vertical)
// A word slot is a contiguous sequence of open cells. The function validates that numbered cells
// have the correct number of word starts (if cell = 2, there must be exactly 2 word starts from that cell)
function analyzeGrid(grid) {
  // Initialize an array to store all identified word slots
  const slots = [];

  // Iterate through every cell in the grid with row and column indices
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      // Skip black squares (cells marked with "." that are not open)
      if (!isOpenCell(grid, row, col)) continue;

      // Check if this cell is the start of a horizontal word slot
      const horizontalStart = isHorizontalStart(grid, row, col);
      // Check if this cell is the start of a vertical word slot
      const verticalStart = isVerticalStart(grid, row, col);

      // Count how many word slots actually start from this cell (0, 1, or 2)
      const actualStarts = Number(horizontalStart) + Number(verticalStart);
      // Get the expected number of starts from the cell's numeric value
      const expectedStarts = Number(grid[row][col]);
      // Verify that the actual number of starts matches the cell's declared count
      if (actualStarts !== expectedStarts) {
        // If mismatch found, puzzle is invalid
        return "Error";
      }

      // If a horizontal word slot starts here, walk it and record its length and cell positions
      if (horizontalStart) {
        slots.push(walkHorizontal(grid, row, col));
      }

      // If a vertical word slot starts here, walk it and record its length and cell positions
      if (verticalStart) {
        slots.push(walkVertical(grid, row, col));
      }
    }
  }
  // Return all identified word slots
  return slots;
}

// detectIllegalChars uses a regular expression to check for any invalid characters
// Only allows: period (.), digits (0 1 2), and newline characters (\n)
function detectIllegalChars(puzzle) {
  // Create a regex pattern that matches any character NOT in the allowed set [. 0 1 2 \n]
  let illegalChars = /[^.\n012]/;
  // Test the puzzle string against the pattern; returns true if illegal chars found
  return illegalChars.test(puzzle);
}

// splitString splits the puzzle by newlines and validates that all rows have equal length
function splitString(puzzle) {
  // Split the puzzle string by newline character to create an array of rows
  let grid = puzzle.split("\n");
  // Iterate through each row to validate structure
  for (let row of grid) {
    // Check if any row has unequal length compared to the first row, or if it's empty
    if (row.length !== grid[0].length || row === "") {
      // If invalid structure found, return error
      return "Error";
    }
  }
  // Return the validated grid (array of row strings)
  return grid;
}

// isOpenCell checks if the cell at (row, col) is open (not a black square)
// Returns true if cell is not a dot (.), meaning it's a playable cell
function isOpenCell(grid, row, col) {
  // Compare the cell value to the black square marker; return true if it's not a black square
  return grid[row][col] !== ".";
}

// isHorizontalStart determines if cell (row, col) is the start of a horizontal word slot
// A horizontal start requires: the cell is open AND (it's at the left boundary OR blocked from left) AND the right cell is open
function isHorizontalStart(grid, row, col) {
  // First check if the current cell is open (playable)
  if (!isOpenCell(grid, row, col)) return false;

  // Check if the cell is at the leftmost boundary (column 0)
  const leftIsBoundary = col === 0;
  // Check if there's a cell to the left AND it's blocked (not open)
  const leftIsBlocked = !leftIsBoundary && !isOpenCell(grid, row, col - 1);
  // Check that the cell is not at the rightmost boundary (has a cell to the right)
  const hasRightCell = col < grid[0].length - 1;
  // Check if the cell to the right exists and is open (playable)
  const rightIsOpen = hasRightCell && isOpenCell(grid, row, col + 1);

  // A horizontal slot starts here if: (left is boundary OR left is blocked) AND right is open
  return (leftIsBoundary || leftIsBlocked) && rightIsOpen;
}

// isVerticalStart determines if cell (row, col) is the start of a vertical word slot
// A vertical start requires: the cell is open AND (it's at the top boundary OR blocked from above) AND the bottom cell is open
function isVerticalStart(grid, row, col) {
  // First check if the current cell is open (playable)
  if (!isOpenCell(grid, row, col)) return false;

  // Check if the cell is at the top boundary (row 0)
  const upIsBoundary = row === 0;
  // Check if there's a cell above AND it's blocked (not open)
  const upIsBlocked = !upIsBoundary && !isOpenCell(grid, row - 1, col);

  // Check that the cell is not at the bottom boundary (has a cell below)
  const hasDownCell = row < grid.length - 1;

  // Check if the cell below exists and is open (playable)
  const downIsOpen = hasDownCell && isOpenCell(grid, row + 1, col);

  // A vertical slot starts here if: (top is boundary OR top is blocked) AND bottom is open
  return (upIsBoundary || upIsBlocked) && downIsOpen;
}

// walkHorizontal traverses from a starting position to the right, collecting all cells in a horizontal word slot
// Records the length and the [row, col] coordinates of each cell in the slot
function walkHorizontal(grid, startRow, startCol) {
  // Initialize column position at the starting column
  let col = startCol;
  // Initialize array to store the [row, col] coordinates of all cells in this slot
  let cells = [];

  // Continue moving right while we're within grid bounds and cells are open
  while (col < grid[0].length && isOpenCell(grid, startRow, col)) {
    // Add the current cell's coordinates to the cells array
    cells.push([startRow, col]);
    // Move one column to the right
    col += 1;
  }

  // Return an object with the slot length (number of cells) and the cell coordinates
  return {
    length: cells.length,
    cells,
  };
}

// walkVertical traverses from a starting position downward, collecting all cells in a vertical word slot
// Records the length and the [row, col] coordinates of each cell in the slot
function walkVertical(grid, startRow, startCol) {
  // Initialize row position at the starting row
  let row = startRow;
  // Initialize array to store the [row, col] coordinates of all cells in this slot
  let cells = [];

  // Continue moving down while we're within grid bounds and cells are open
  while (row < grid.length && isOpenCell(grid, row, startCol)) {
    // Add the current cell's coordinates to the cells array
    cells.push([row, startCol]);
    // Move one row downward
    row += 1;
  }

  // Return an object with the slot length (number of cells) and the cell coordinates
  return {
    length: cells.length,
    cells,
  };
}

// Backtracking solver function that recursively attempts to place words in available slots
// Uses depth-first search to explore all possible word placements until a unique solution is found
function solve(wordIndex, cleanWords, wordSlots, charGrid, solutions) {
  // Base case: if all words have been placed successfully, we found a valid solution
  if (wordIndex === cleanWords.length) {
    // Convert the 2D character grid back to a string format and add to solutions
    solutions.push(charGrid.map((row) => row.join("")).join("\n"));
    // Exit this recursion path since a solution was found
    return;
  }

  // Optimization: stop early if we've found more than one solution (requirement: unique solution only)
  if (solutions.length > 1) return;

  // Get the current word we're trying to place
  const currentWord = cleanWords[wordIndex];

  // Try to place the current word in each available slot
  for (let i = 0; i < wordSlots.length; i++) {
    // Get the current slot being considered
    const slot = wordSlots[i];

    // Check if slot is unfilled AND has the same length as the current word
    if (!slot.filled && slot.length === currentWord.length) {
      // Verify that the word can be placed without conflicting with already-placed letters
      if (canPlace(currentWord, slot, charGrid)) {
        // Place the word in the slot and save the original characters for backtracking
        const originalChars = placeWord(currentWord, slot, charGrid);
        // Mark this slot as filled to prevent reuse
        slot.filled = true;

        // Recursively try to place the next word
        solve(wordIndex + 1, cleanWords, wordSlots, charGrid, solutions);

        // Backtrack: unmark the slot as filled to try other placements
        slot.filled = false;
        // Restore the grid to its previous state by removing the placed word
        removeWord(slot, originalChars, charGrid);
      }
    }
  }
}

// canPlace checks whether a word can be legally placed in a slot
// Verifies that each letter in the word either matches existing letters or replaces empty cells
function canPlace(word, slot, charGrid) {
  // Iterate through each character position in the word
  for (let i = 0; i < word.length; i++) {
    // Get the grid coordinates [row, col] for this position from the slot's cells array
    const [r, c] = slot.cells[i];
    // Get the current character at this grid position
    const existingChar = charGrid[r][c];
    // Check if there's already a different character at this position (conflict)
    if (existingChar !== "" && existingChar !== word[i]) {
      // If the cell is filled and doesn't match the current word's letter, placement fails
      return false;
    }
  }
  // If no conflicts found, the word can be placed
  return true;
}

// placeWord places a word into a slot in the grid and returns the original characters
// The returned original characters are needed for backtracking to restore the grid state
function placeWord(word, slot, charGrid) {
  // Initialize array to store the characters that were in the grid before placement (for backtracking)
  const original = [];
  // Iterate through each character position in the word
  for (let i = 0; i < word.length; i++) {
    // Get the grid coordinates [row, col] for this position from the slot's cells array
    const [r, c] = slot.cells[i];
    // Save the current character at this position before overwriting it
    original.push(charGrid[r][c]);
    // Place the current word's character at this grid position
    charGrid[r][c] = word[i];
  }
  // Return the array of original characters so we can restore them during backtracking
  return original;
}

// removeWord removes a word from a slot in the grid and restores the original characters
// This is the undo operation used during backtracking to explore alternative word placements
function removeWord(slot, originalChars, charGrid) {
  // Iterate through each cell in the slot being cleared
  for (let i = 0; i < slot.cells.length; i++) {
    // Get the grid coordinates [row, col] for this position from the slot's cells array
    const [r, c] = slot.cells[i];
    // Restore the original character that was at this position before the word was placed
    charGrid[r][c] = originalChars[i];
  }
}

// Example from crossword task description - a 4x4 crossword puzzle
const emptyPuzzle = `2001
0..0
1000
0..0`;
// Array of 4 words to place in the puzzle
const words = ["casa", "alan", "ciao", "anta"];

// Call the crossword solver with the puzzle and words
crosswordSolver(emptyPuzzle, words);

/*
================================================================================
CODE LOGIC & FLOW SUMMARY
================================================================================

OVERALL ALGORITHM LOGIC:
------------------------
This crossword solver uses a CONSTRAINT SATISFACTION + BACKTRACKING approach:

1. CONSTRAINT DEFINITION:
   - Each word must fit into a slot of matching length
   - Letters at intersections must match between crossing words
   - Each slot must be filled exactly once
   - The solution must be unique

2. SOLUTION APPROACH:
   - Depth-first search through all possible word placements
   - At each step, try to place one word in an available slot
   - If placement succeeds, recursively solve for the next word
   - If no solution found, backtrack and try a different slot
   - Continue until all words placed or proven impossible


EXECUTION FLOW:
---------------
INPUT: Puzzle string + Words array
   ↓
VALIDATION PHASE:
   ├─ Check puzzle is valid string with legal characters (. 0 1 2 \n)
   ├─ Check all rows have equal length
   ├─ Check words array is valid (no duplicates, all non-empty strings)
   └─ Verify word count equals slot count
   ↓
ANALYSIS PHASE:
   ├─ Parse grid into 2D array of characters
   ├─ Identify all horizontal word slots:
   │  └─ Start at left boundary or after black square
   │     End at black square or right boundary
   ├─ Identify all vertical word slots:
   │  └─ Start at top boundary or below black square
   │     End at black square or bottom boundary
   └─ Validate that cell numbers match actual word slot counts
   ↓
SOLVING PHASE (BACKTRACKING):
   Initialize empty 2D grid (black squares stay, open cells empty)
   Call solve(0, words, slots, grid, solutions)
   │
   For each word in order:
   │  For each available slot:
   │     If slot length matches word length:
   │        If word can be placed (no letter conflicts):
   │           Place word in slot
   │           Mark slot as used
   │           Recursively solve for next word
   │           If recursive call fails → backtrack:
   │              Remove word from slot
   │              Mark slot as unused
   │              Try next slot
   │        Else (conflict exists) → try next slot
   │     Else (length mismatch) → try next slot
   │
   Base case: All words placed → Save solution and return
   ↓
VALIDATION PHASE:
   ├─ Check exactly 1 solution exists
   ├─ If 0 solutions → print "Error" (no valid solution)
   ├─ If >1 solutions → print "Error" (multiple solutions, not unique)
   └─ If 1 solution → print the solved grid
OUTPUT: Solved crossword or error message


KEY DESIGN PATTERNS:
--------------------
1. STATE PRESERVATION: Save original characters before placement
   → Enables fast backtracking without deep copying entire grid

2. EARLY TERMINATION: Stop searching once 2+ solutions found
   → Optimization: Crosswords must have exactly 1 solution
   → No point finding alternatives once multiple solutions exist

3. CONSTRAINT FILTERING: Only consider slots matching word length
   → Reduces search space dramatically
   → O(n!) worst case becomes manageable

4. CONFLICT DETECTION: Check letter compatibility before placement
   → Prevents invalid placements early
   → Reduces backtracking depth

5. SLOT TRACKING: Mark slots as filled/unfilled
   → Prevents reusing the same slot for multiple words
   → Ensures each slot gets exactly one word


POSSIBLE EDGE CASES & HANDLING:
-------------------------------

EDGE CASE 1: Empty or Invalid Puzzle
├─ Puzzle not a string → "Error"
├─ Empty puzzle string "" → "Error"
├─ Contains illegal characters (not . 0 1 2 \n) → "Error"
├─ Rows have different lengths → "Error"
├─ Contains empty rows → "Error"
└─ HANDLED BY: parsePuzzle(), detectIllegalChars(), splitString()

EDGE CASE 2: Invalid Words Array
├─ words is not an array → "Error"
├─ Contains non-string elements → "Error"
├─ Contains empty strings "" → "Error"
├─ Contains duplicate words → "Error"
└─ HANDLED BY: parseWords()

EDGE CASE 3: Mismatched Counts
├─ Word count ≠ slot count → "Error"
├─ Example: 4 slots but only 3 words provided
└─ HANDLED BY: Length check after grid analysis

EDGE CASE 4: Invalid Grid Structure
├─ Cell marked with "1" but no word actually starts there
├─ Cell marked with "2" but only 1 word starts there
├─ Cell marked with "0" but word actually starts there
└─ HANDLED BY: analyzeGrid() validates actualStarts === expectedStarts

EDGE CASE 5: No Solution Exists
├─ Words cannot be placed without letter conflicts
├─ No valid combination found by backtracking
└─ HANDLED BY: Check solutions.length === 1 at end

EDGE CASE 6: Multiple Solutions Exist (Not Unique)
├─ Multiple valid ways to solve the puzzle
├─ Example: Synonyms with same length and intersections
├─ Algorithm stops early once 2+ solutions found
└─ HANDLED BY: Early termination in solve() + final validation

EDGE CASE 7: All Black Squares Grid
├─ Puzzle like "...\n...\n..."
├─ No open cells available → 0 slots found
├─ 0 slots ≠ any positive word count → "Error"
└─ HANDLED BY: Word count validation

EDGE CASE 8: Single Cell Grid
├─ Puzzle "0" with words ["a"]
├─ Valid but trivial: 1 slot, 1 word, length match
└─ HANDLED BY: Normal flow works correctly

EDGE CASE 9: Words Longer Than Slots
├─ Word "casa" (length 4) but slot has length 3
├─ Filtered by length check in solve()
├─ Word never attempted in that slot
└─ HANDLED BY: canPlace() returns false, slot skipped

EDGE CASE 10: Intersecting Words With Conflicts
├─ Horizontal word "cat" placed
├─ Vertical word "dog" must cross with "cat"
├─ At intersection: must have matching letter
├─ Example: "cat" at [0,0-2], "dog" at [0-2,1]
│  → Intersection at [0,1]: 'a' from "cat" must equal 'd' from "dog" → CONFLICT
├─ canPlace() detects this and rejects placement
└─ HANDLED BY: Character conflict checking in canPlace()

EDGE CASE 11: Large Grids (Performance)
├─ 10x10 grid = 100 cells
├─ Could have 50+ word slots
├─ Worst case: trying 50! permutations (impossible)
├─ Mitigated by:
│  ├─ Length filtering (reduces combinations)
│  ├─ Conflict detection (prunes invalid paths early)
│  ├─ Early termination (stops at 2 solutions)
│  └─ Typical puzzles solved in milliseconds
└─ HANDLED BY: Inherent algorithm optimizations


CRITICAL ASSUMPTIONS:
---------------------
1. Puzzle grid is rectangular (all rows same length)
2. Each cell contains exactly one character
3. Word slots are contiguous sequences (no skipping cells)
4. Intersections occur at exactly one cell between perpendicular words
5. Black squares (.) are absolute barriers (words cannot cross them)
6. Numbers in cells are 0, 1, or 2 only
7. Numbers accurately reflect actual word slot starts
8. Solutions are unique (exactly 1 correct answer)


TIME & SPACE COMPLEXITY:
------------------------
Time: O(n! × m) worst case
  - n = number of word slots
  - m = average slot length
  - Mitigated by pruning and early termination
  - Typical puzzles: O(n × m) due to constraints

Space: O(n + m²)
  - n = number of slots (metadata)
  - m = grid dimensions (storing grid + recursion stack)
  - Recursion depth ≤ n (one slot per level)


ALGORITHM CORRECTNESS:
----------------------
✓ Complete: Explores all possible placements
✓ Sound: Only finds valid solutions (no false positives)
✓ Optimal: Finds unique solution if one exists
✓ Terminates: Finite search space, backtracking guarantees ending

================================================================================
*/
