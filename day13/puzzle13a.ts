import fs from 'fs';
import readline from 'readline';
import path from 'path';

const elfFile = path.join(__dirname, 'pairs.txt');
const file = readline.createInterface({
  input: fs.createReadStream(elfFile),
  output: process.stdout,
  terminal: false,
});

const compareArrays = (first: any[], second: any[]): boolean => {
  for (let i = 0; i < Math.max(first.length, second.length); i++) {
    if (!Array.isArray(first[i]) && !Array.isArray(second[i])) {
      if (!compareInts(first[i], second[i])) return false
    } else if (Array.isArray(first[i]) && Array.isArray(second[i])) {
      // If only the second array is empty, return false
      if (first[i].length > 0 && second[i].length === 0) return false
      if (!compareArrays(first[i], second[i])) return false
    } else if (!Array.isArray(first[i]) && Array.isArray(second[i])) {
      // Create an array and add the number to it
      let f: number[] = []
      f.push(first[i])
      if (!compareArrays(f, second[i])) return false
    } else if (Array.isArray(first[i] && !Array.isArray(second[i]))) {
      // Create an array and add the number to it
      let s: number[] = []
      s.push(second[i])
      if (!compareArrays(first[i], s)) return false
    }
  }
  return true
}

const compareInts = (first: number | undefined, second: number | undefined): boolean => {
  if (Number.isInteger(first) && second === undefined) return false
  if (Number.isInteger(first) && Number.isInteger(second) && first! > second!) return false

  return true
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

  console.log(oneIndexedIndices)
  let sum = oneIndexedIndices.reduce((prev, curr) => prev + curr, 0)
  console.log(`Result: ${sum}`)
});
