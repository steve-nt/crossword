function crosswordSolverDebug(puzzle, words) {
  if (typeof puzzle !== 'string') {
    console.log('Error: puzzle not string');
    return 'Error';
  }
  
  if (!Array.isArray(words)) {
    console.log('Error: words not array');
    return 'Error';
  }
  
  if (puzzle === '') {
    console.log('Error: empty puzzle');
    return 'Error';
  }
  
  if (!words.every(word => typeof word === 'string')) {
    console.log('Error: not all words are strings');
    return 'Error';
  }
  
  const wordSet = new Set(words);
  if (wordSet.size !== words.length) {
    console.log('Error: duplicate words');
    return 'Error';
  }
  
  const grid = puzzle.split('\n').map(row => row.split(''));
  const height = grid.length;
  const width = grid[0].length;
  
  for (let i = 0; i < height; i++) {
    if (grid[i].length !== width) {
      console.log('Error: inconsistent grid width');
      return 'Error';
    }
  }
  
  const slots = [];
  const seenPositions = new Set();
  
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const cell = grid[row][col];
      
      if (cell !== '.' && cell !== '0' && !isNaN(cell) && cell !== '') {
        const num = parseInt(cell);
        if (num < 1 || num > 2) {
          console.log('Error: invalid number', num);
          return 'Error';
        }
        
        const posKey = `${row},${col}`;
        if (seenPositions.has(posKey)) continue;
        seenPositions.add(posKey);
        
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
  
  console.log('Validation passed. Slots:', slots.length, 'Words:', words.length);
  
  if (words.length !== slots.length) {
    console.log('Error: word count mismatch');
    return 'Error';
  }
  
  const used = new Array(words.length).fill(false);
  let solutionCount = 0;
  let solution = null;
  let attemptCount = 0;

  function canPlace(word, slot) {
    const { row, col, horizontal, length } = slot;
    
    for (let i = 0; i < length; i++) {
      const r = horizontal ? row : row + i;
      const c = horizontal ? col + i : col;
      
      if (r >= height || c >= width) return false;
      
      const cell = grid[r][c];
      if (cell === '.') return false;
      if (cell !== '0' && !isNaN(cell)) continue;
      if (cell !== '0' && cell !== word[i]) return false;
    }
    
    return true;
  }

  function place(word, slot) {
    const { row, col, horizontal, length } = slot;
    for (let i = 0; i < length; i++) {
      const r = horizontal ? row : row + i;
      const c = horizontal ? col + i : col;
      grid[r][c] = word[i];
    }
  }

  function remove(word, slot) {
    const { row, col, horizontal, length } = slot;
    for (let i = 0; i < length; i++) {
      const r = horizontal ? row : row + i;
      const c = horizontal ? col + i : col;
      grid[r][c] = '0';
    }
  }

  function backtrack(slotIndex) {
    attemptCount++;
    if (attemptCount % 100000 === 0) {
      console.log(`Attempt ${attemptCount}, slot ${slotIndex}, solutions: ${solutionCount}`);
    }
    
    if (slotIndex === slots.length) {
      solutionCount++;
      console.log('Found solution #' + solutionCount + ' at attempt ' + attemptCount);
      if (solutionCount === 1) {
        solution = grid.map(row => [...row]);
      }
      return solutionCount <= 1;
    }

    const slot = slots[slotIndex];
    
    for (let i = 0; i < words.length; i++) {
      if (used[i] || words[i].length !== slot.length) continue;

      const word = words[i];
      
      if (canPlace(word, slot)) {
        place(word, slot);
        used[i] = true;
        
        if (!backtrack(slotIndex + 1)) {
          remove(word, slot);
          used[i] = false;
          return false;
        }
        
        remove(word, slot);
        used[i] = false;
      }
    }
    
    return true;
  }

  backtrack(0);

  console.log('Total attempts:', attemptCount);
  console.log('Solutions found:', solutionCount);
  
  if (solutionCount === 1) {
    const result = solution.map(row => row.join('')).join('\n');
    console.log('Returning solution');
    return result;
  } else {
    console.log('Returning Error');
    return 'Error';
  }
}

const puzzle = `..1.1..1...
10000..1000
..0.0..0...
..1000000..
..0.0..0...
1000..10000
..0.1..0...
....0..0...
..100000...
....0..0...
....0......`;

const words = ['popcorn', 'fruit', 'flour', 'chicken', 'eggs', 'vegetables', 'pasta', 'pork', 'steak', 'cheese'];

const result = crosswordSolverDebug(puzzle, words);
console.log('\nResult:');
console.log(result);
