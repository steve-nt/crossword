const crosswordSolver = require('./crosswordSolver.js');

console.log('🧩 CROSSWORD SOLVER - VERIFICATION TESTS\n');

console.log('=== Test 1: Basic Example ===');
const puzzle1 = `2001
0..0
1000
0..0`;
const words1 = ['casa', 'alan', 'ciao', 'anta'];
console.log('Input puzzle:');
console.log(puzzle1);
console.log('Words:', words1);
console.log('Output:');
crosswordSolver(puzzle1, words1);

console.log('\n=== Test 2: Two Words, Two Slots ===');
const puzzle2 = `200
0.0
000`;
const words2 = ['abc', 'abd'];
console.log('Input puzzle:');
console.log(puzzle2);
console.log('Words:', words2);
console.log('Output (expecting solved puzzle or Error):');
crosswordSolver(puzzle2, words2);

console.log('\n=== Test 3: Wrong Word Count (Should Error) ===');
const puzzle3 = `2001
0..0
1000
0..0`;
const words3 = ['casa', 'alan', 'ciao'];
console.log('Input puzzle:');
console.log(puzzle3);
console.log('Words:', words3);
console.log('Output (expecting Error):');
crosswordSolver(puzzle3, words3);

console.log('\n=== Test 4: No Valid Solution (Should Error) ===');
const puzzle4 = `2001
0..0
1000
0..0`;
const words4 = ['xxxx', 'yyyy', 'zzzz', 'wwww'];
console.log('Input puzzle:');
console.log(puzzle4);
console.log('Words:', words4);
console.log('Output (expecting Error):');
crosswordSolver(puzzle4, words4);

console.log('\n✓ All verification tests completed!');
