const crosswordSolver = require('./crosswordSolver.js');

const testCases = [
  {
    name: 'Test mismatch between number of input words and puzzle starting cells',
    puzzle: '2001\n0..0\n2000\n0..0',
    words: ['casa', 'alan', 'ciao', 'anta'],
    expected: 'Error'
  },
  {
    name: 'Test starting words higher than 2',
    puzzle: '0001\n0..0\n3000\n0..0',
    words: ['casa', 'alan', 'ciao', 'anta'],
    expected: 'Error'
  },
  {
    name: 'Test words repetition',
    puzzle: '2001\n0..0\n1000\n0..0',
    words: ['casa', 'casa', 'ciao', 'anta'],
    expected: 'Error'
  },
  {
    name: 'Test empty puzzle',
    puzzle: '',
    words: ['casa', 'alan', 'ciao', 'anta'],
    expected: 'Error'
  },
  {
    name: 'Test wrong format checks - puzzle as number',
    puzzle: 123,
    words: ['casa', 'alan', 'ciao', 'anta'],
    expected: 'Error'
  },
  {
    name: 'Test wrong format checks - words as number',
    puzzle: '2001\n0..0\n1000\n0..0',
    words: 123,
    expected: 'Error'
  },
  {
    name: 'Test multiple solutions',
    puzzle: '2000\n0...\n0...\n0...',
    words: ['abba', 'assa'],
    expected: 'Error'
  },
  {
    name: 'Test no solution',
    puzzle: '2001\n0..0\n1000\n0..0',
    words: ['aaab', 'aaac', 'aaad', 'aaae'],
    expected: 'Error'
  }
];

console.log('EDGE CASE TESTING FOR crosswordSolver\n');
console.log('=' .repeat(70));

let passed = 0;
let failed = 0;

testCases.forEach((testCase, idx) => {
  console.log(`\nTest ${idx + 1}: ${testCase.name}`);
  console.log('-'.repeat(70));
  
  const result = crosswordSolver(testCase.puzzle, testCase.words);
  
  console.log(`Expected: ${testCase.expected}`);
  console.log(`Got:      ${result}`);
  
  if (result === testCase.expected) {
    console.log('✓ PASSED');
    passed++;
  } else {
    console.log('✗ FAILED');
    failed++;
  }
});

console.log('\n' + '='.repeat(70));
console.log(`\nRESULTS: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);

if (failed === 0) {
  console.log('✓ All edge case tests passed!');
} else {
  console.log(`✗ ${failed} test(s) failed`);
}
