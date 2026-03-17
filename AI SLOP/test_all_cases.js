// Load the crosswordSolver function
const crosswordSolver = require('./crosswordSolver.js');

console.log('='.repeat(80));
console.log('TEST 1: Basic 4x4 puzzle');
console.log('='.repeat(80));
const puzzle1 = '2001\n0..0\n1000\n0..0';
const words1 = ['casa', 'alan', 'ciao', 'anta'];
const result1 = crosswordSolver(puzzle1, words1);
console.log('Expected:');
console.log('casa\ni..l\nanta\no..n');
console.log('Got:');
console.log(result1);
console.log('');

console.log('='.repeat(80));
console.log('TEST 2: Beach vacation puzzle');
console.log('='.repeat(80));
const puzzle2 = `...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`;
const words2 = [
  'sun',
  'sunglasses',
  'suncream',
  'swimming',
  'bikini',
  'beach',
  'icecream',
  'tan',
  'deckchair',
  'sand',
  'seaside',
  'sandals',
];
const result2 = crosswordSolver(puzzle2, words2);
console.log('Expected:');
console.log(`...s...........
..sunglasses...
...n....u......
.s......n...s..
.w....deckchair
bikini..r...n..
.m.....seaside.
.m.b....a.a....
.icecream.n....
.n.a......d....
.g.c.....tan...
...h......l....
..........s....`);
console.log('Got:');
console.log(result2);
console.log('');

console.log('='.repeat(80));
console.log('TEST 3: Food puzzle');
console.log('='.repeat(80));
const puzzle3 = `..1.1..1...
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
const words3 = [
  'popcorn',
  'fruit',
  'flour',
  'chicken',
  'eggs',
  'vegetables',
  'pasta',
  'pork',
  'steak',
  'cheese',
];
const result3 = crosswordSolver(puzzle3, words3);
console.log('Expected:');
console.log(`..p.f..v...
flour..eggs
..p.u..g...
..chicken..
..o.t..t...
pork..pasta
..n.s..b...
....t..l...
..cheese...
....a..s...
....k......`);
console.log('Got:');
console.log(result3);
console.log('');

console.log('='.repeat(80));
console.log('TEST 4: Beach puzzle with reversed words array');
console.log('='.repeat(80));
const puzzle4 = `...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`;
const words4 = [
  'sun',
  'sunglasses',
  'suncream',
  'swimming',
  'bikini',
  'beach',
  'icecream',
  'tan',
  'deckchair',
  'sand',
  'seaside',
  'sandals',
].reverse();
const result4 = crosswordSolver(puzzle4, words4);
console.log('Expected:');
console.log(`...s...........
..sunglasses...
...n....u......
.s......n...s..
.w....deckchair
bikini..r...n..
.m.....seaside.
.m.b....a.a....
.icecream.n....
.n.a......d....
.g.c.....tan...
...h......l....
..........s....`);
console.log('Got:');
console.log(result4);
console.log('');

console.log('='.repeat(80));
console.log('TEST 5: Mismatch between number of input words and puzzle starting cells');
console.log('='.repeat(80));
const puzzle5 = '2001\n0..0\n2000\n0..0';
const words5 = ['casa', 'alan', 'ciao', 'anta'];
const result5 = crosswordSolver(puzzle5, words5);
console.log('Expected: Error');
console.log('Got:', result5);
console.log('');

console.log('='.repeat(80));
console.log('TEST 6: Starting words higher than 2');
console.log('='.repeat(80));
const puzzle6 = '0001\n0..0\n3000\n0..0';
const words6 = ['casa', 'alan', 'ciao', 'anta'];
const result6 = crosswordSolver(puzzle6, words6);
console.log('Expected: Error');
console.log('Got:', result6);
console.log('');

console.log('='.repeat(80));
console.log('TEST 7: Words repetition');
console.log('='.repeat(80));
const puzzle7 = '2001\n0..0\n1000\n0..0';
const words7 = ['casa', 'casa', 'ciao', 'anta'];
const result7 = crosswordSolver(puzzle7, words7);
console.log('Expected: Error');
console.log('Got:', result7);
console.log('');

console.log('='.repeat(80));
console.log('TEST 8: Empty puzzle');
console.log('='.repeat(80));
const puzzle8 = '';
const words8 = ['casa', 'alan', 'ciao', 'anta'];
const result8 = crosswordSolver(puzzle8, words8);
console.log('Expected: Error');
console.log('Got:', result8);
console.log('');

console.log('='.repeat(80));
console.log('TEST 9: Wrong format - puzzle not a string');
console.log('='.repeat(80));
const puzzle9 = 123;
const words9 = ['casa', 'alan', 'ciao', 'anta'];
const result9 = crosswordSolver(puzzle9, words9);
console.log('Expected: Error');
console.log('Got:', result9);
console.log('');

console.log('='.repeat(80));
console.log('TEST 10: Wrong format - words not an array');
console.log('='.repeat(80));
const puzzle10 = '';
const words10 = 123;
const result10 = crosswordSolver(puzzle10, words10);
console.log('Expected: Error');
console.log('Got:', result10);
console.log('');

console.log('='.repeat(80));
console.log('TEST 11: Multiple solutions');
console.log('='.repeat(80));
const puzzle11 = '2000\n0...\n0...\n0...';
const words11 = ['abba', 'assa'];
const result11 = crosswordSolver(puzzle11, words11);
console.log('Expected: Error');
console.log('Got:', result11);
console.log('');

console.log('='.repeat(80));
console.log('TEST 12: No solution');
console.log('='.repeat(80));
const puzzle12 = '2001\n0..0\n1000\n0..0';
const words12 = ['aaab', 'aaac', 'aaad', 'aaae'];
const result12 = crosswordSolver(puzzle12, words12);
console.log('Expected: Error');
console.log('Got:', result12);
console.log('');
