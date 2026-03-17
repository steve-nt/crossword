const crosswordSolver = require('./crosswordSolver.js');
const puzzle = '2001\n0..0\n1000\n0..0';
const words = ['casa', 'alan', 'ciao', 'anta'];

// Let's manually trace what should happen
const grid = puzzle.split('\n').map(row => row.split(''));
console.log('Grid:');
grid.forEach((row, i) => console.log(i, row));
console.log('');

// Find slots
const height = grid.length;
const width = grid[0].length;
const slots = [];
const seenPositions = new Set();

for (let row = 0; row < height; row++) {
  for (let col = 0; col < width; col++) {
    const cell = grid[row][col];
    // Check if this is a starting position
    if (cell !== '.' && cell !== '0' && !isNaN(cell) && cell !== '') {
      const posKey = `${row},${col}`;
      if (seenPositions.has(posKey)) continue;
      seenPositions.add(posKey);
      
      console.log(`Found starting position '${cell}' at (${row},${col})`);
      
      // Check horizontal
      if (col === 0 || grid[row][col - 1] === '.') {
        let length = 0;
        let c = col;
        while (c < width && grid[row][c] !== '.') {
          length++;
          c++;
        }
        if (length > 1) {
          slots.push({ row, col, horizontal: true, length });
          console.log(`  -> Horizontal slot: length ${length}`);
        }
      }
      
      // Check vertical
      if (row === 0 || grid[row - 1][col] === '.') {
        let length = 0;
        let r = row;
        while (r < height && grid[r][col] !== '.') {
          length++;
          r++;
        }
        if (length > 1) {
          slots.push({ row, col, horizontal: false, length });
          console.log(`  -> Vertical slot: length ${length}`);
        }
      }
    }
  }
}

console.log('');
console.log('Total slots found:', slots.length);
console.log('Total words:', words.length);
console.log('Seen positions:', seenPositions.size);
console.log('Validation:', seenPositions.size === slots.length, 'and', words.length === slots.length);
