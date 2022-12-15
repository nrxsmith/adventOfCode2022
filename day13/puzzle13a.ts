import fs from 'fs';
import readline from 'readline';
import path from 'path';

const elfFile = path.join(__dirname, 'pairs.txt');
const file = readline.createInterface({
  input: fs.createReadStream(elfFile),
  output: process.stdout,
  terminal: false,
});

const compareArrays = (left: any[], right: any[])=> {  
  if (Array.isArray(left) && Array.isArray(right) && right.length === 0 && left.length === 0) return 1

  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    if (left[i] === undefined) return 1
    if (right[i] === undefined) return -1

    if (!Array.isArray(left[i]) && !Array.isArray(right[i])) {
      if (left[i] < right[i]) return 1
      if (left[i] > right[i]) return -1
      continue
    }
    
    else if (Array.isArray(left[i]) && Array.isArray(right[i])) {
      if (compareArrays(left[i], right[i]) === 1) return 1
      if (compareArrays(left[i], right[i]) === -1) return -1
      continue
    }
    
    else if ((!Array.isArray(left[i])) && Array.isArray(right[i])) {
      let f: number[] = []
      f.push(left[i])
      if (compareArrays(f, right[i]) === 1) return 1
      if (compareArrays(f, right[i]) === -1) return -1
      continue
    }
    
    else if (Array.isArray(left[i]) && !Array.isArray(right[i])) {
      let s: number[] = []
      s.push(right[i])
      if (compareArrays(left[i], s) === 1) return 1
      if (compareArrays(left[i], s) === -1) return -1
      continue
    }
  }
  // If it ends up here, that's the two lists being the same size with the same values
  return 0
}

let pairs: [any, any][] = []
let pairToAdd: [any, any] = [null, null]

file.on('line', (line) => {
  if (line === "") return

  const parsedLine = JSON.parse(line)

  if (!pairToAdd[0]) {
    pairToAdd[0] = parsedLine
  }
  else {
    pairToAdd[1] = parsedLine
    pairs.push(pairToAdd)
    pairToAdd = [null, null]
  }
});

file.on('close', () => {
  let oneIndexedIndices: number[] = []

  for (let i = 0; i < pairs.length; i++) {
    if (compareArrays(pairs[i][0], pairs[i][1])) {
      oneIndexedIndices.push(i + 1)
    }
  }

  let sum = oneIndexedIndices.reduce((prev, curr) => prev + curr, 0)
  console.log(`Result: ${sum}`)
});
