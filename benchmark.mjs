import { performMainSearch } from './src/utils/performMainSearch.js'; // first algorithm
import { performTrieBasedSearch } from './src/utils/trieSearch.js'; // second algorithm
import Benchmark from 'benchmark.js';

const suite = new Benchmark.Suite();

// Test Case 1: Benchmark the first algorithm
suite.add('Algorithm 1', () => {
    performMainSearch('coco'); //Single Word Query
    performMainSearch('limonade de coco'); // Multiple Words Query
    performMainSearch('cuill'); // Partial Word Query
    performMainSearch(''); // Empty Query
    performMainSearch('jus de citron vert avec le citron'); // omplex Query
    performMainSearch('xyz123luv'); // Non-Existent Query
});

// Test Case 2: Benchmark the second algorithm
suite.add('Algorithm 2', () => {
    performTrieBasedSearch('coco'); //Single Word Query
    performTrieBasedSearch('limonade de coco'); // Multiple Words Query
    performTrieBasedSearch('cuill'); // Partial Word Query
    performTrieBasedSearch(''); // Empty Query
    performTrieBasedSearch('jus de citron vert avec le citron'); // omplex Query
    performTrieBasedSearch('xyz123luv'); // Non-Existent Query
});


// Run the benchmark
suite
  .on('cycle', (event) => {
    console.log(String(event.target));
  })
  .on('complete', () => {
    console.log('Benchmark completed.');
  })
  .run({ async: true });
