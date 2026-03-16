/**
 * CROSSWORD SOLVER
 * 
 * This function solves an empty crossword puzzle by finding the unique placement
 * of all given words that satisfies all puzzle constraints.
 * 
 * @param {string} puzzle - The empty puzzle as a string with numbers (word starts),
 *                          dots (blocked spaces), and newlines (row separators)
 * @param {string[]} words - Array of words to fill in the puzzle (no duplicates)
 * @returns {string} The solved puzzle or 'Error' if no unique solution exists
 */
function crosswordSolver(puzzle, words) {
  // Parse the puzzle into a 2D grid
  const grid = puzzle.split('\n').map(row => row.split(''));
  const height = grid.length;
  const width = grid[0].length;

  // Find all word slots (horizontal and vertical)
  const slots = [];
  
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const cell = grid[row][col];
      
      // Check if this is a starting position (a number, but not '0' and not '.')
      if (cell !== '.' && cell !== '0' && !isNaN(cell) && cell !== '') {
        // Check for horizontal word starting from this position
        if (col === 0 || grid[row][col - 1] === '.') {
          let length = 0;
          let c = col;
          while (c < width && grid[row][c] !== '.') {
            length++;
            c++;
          }
          if (length > 1) {
            slots.push({ row, col, horizontal: true, length });
          }
        }
        
        // Check for vertical word starting from this position
        if (row === 0 || grid[row - 1][col] === '.') {
          let length = 0;
          let r = row;
          while (r < height && grid[r][col] !== '.') {
            length++;
            r++;
          }
          if (length > 1) {
            slots.push({ row, col, horizontal: false, length });
          }
        }
      }
    }
  }

  // Validate: correct number of words for slots
  if (words.length !== slots.length) {
    console.log('Error');
    return 'Error';
  }

  // Backtracking variables to track solutions
  const used = new Array(words.length).fill(false);
  let solutionCount = 0;
  let solution = null;

  /**
   * Backtracking function to try all possible word placements
   * 
   * @param {number} slotIndex - Current slot being filled
   * @returns {boolean} True to continue searching, False to stop (found 2+ solutions)
   */
  function backtrack(slotIndex) {
    // All slots filled - we found a complete solution!
    if (slotIndex === slots.length) {
      solutionCount++;
      if (solutionCount === 1) {
        // Save the first solution found
        solution = grid.map(row => [...row]);
      }
      // Return false to stop after finding 2 solutions (we only need to know if there's 1 unique solution)
      return solutionCount <= 1;
    }

    const slot = slots[slotIndex];
    
    // Try each unused word
    for (let i = 0; i < words.length; i++) {
      // Skip if word already used or length doesn't match
      if (used[i] || words[i].length !== slot.length) continue;

      const word = words[i];
      
      // Check if word can be placed in this slot
      if (canPlace(word, slot)) {
        // Place word on grid
        place(word, slot);
        used[i] = true;
        
        // Continue backtracking to next slot
        if (!backtrack(slotIndex + 1)) {
          // Found 2+ solutions, stop searching
          remove(word, slot);
          used[i] = false;
          return false;
        }
        
        // Backtrack: remove word and try next option
        remove(word, slot);
        used[i] = false;
      }
    }
    
    return true; // No solution found for this branch, continue searching
  }

  /**
   * Check if a word can be placed at a slot without conflicts
   * 
   * @param {string} word - The word to place
   * @param {object} slot - The slot object {row, col, horizontal, length}
   * @returns {boolean} True if word fits, False otherwise
   */
  function canPlace(word, slot) {
    const { row, col, horizontal, length } = slot;
    
    for (let i = 0; i < length; i++) {
      // Calculate position in grid (different for horizontal vs vertical)
      const r = horizontal ? row : row + i;
      const c = horizontal ? col + i : col;
      
      // Check bounds
      if (r >= height || c >= width) return false;
      
      const cell = grid[r][c];
      // Cell must be empty, a number (starting position), or match the letter from the word
      // Numbers are treated as empty slots (will be overwritten when placing words)
      if (cell === '.') return false; // Can't place on blocked spaces
      if (cell !== '0' && !isNaN(cell)) continue; // Number starting position is OK
      if (cell !== '0' && cell !== word[i]) return false; // Must match if already has a letter
    }
    
    return true;
  }

  /**
   * Place a word on the grid at the specified slot
   * 
   * @param {string} word - The word to place
   * @param {object} slot - The slot object {row, col, horizontal, length}
   */
  function place(word, slot) {
    const { row, col, horizontal, length } = slot;
    
    for (let i = 0; i < length; i++) {
      const r = horizontal ? row : row + i;
      const c = horizontal ? col + i : col;
      grid[r][c] = word[i];
    }
  }

  /**
   * Remove a word from the grid (used during backtracking)
   * 
   * @param {string} word - The word to remove
   * @param {object} slot - The slot object {row, col, horizontal, length}
   */
  function remove(word, slot) {
    const { row, col, horizontal, length } = slot;
    
    for (let i = 0; i < length; i++) {
      const r = horizontal ? row : row + i;
      const c = horizontal ? col + i : col;
      grid[r][c] = '0'; // Reset to empty marker
    }
  }

  // Start the backtracking algorithm
  backtrack(0);

  // Output result based on solution count
  if (solutionCount === 1) {
    // Exactly one solution found - convert grid back to string and print
    const result = solution.map(row => row.join('')).join('\n');
    console.log(result);
    return result;
  } else {
    // No solution or multiple solutions - print error
    console.log('Error');
    return 'Error';
  }
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = crosswordSolver;
}
