import fs from 'fs';
import readline from 'readline';
import path from 'path';

const elfFile = path.join(__dirname, 'grove.txt');
const file = readline.createInterface({
  input: fs.createReadStream(elfFile),
  output: process.stdout,
  terminal: false,
});

let grove: number[][] = []
let totalVisibleTrees = 0

const isVisible = (row: number, column: number, grove: number[][]) => {

  const height = grove[row][column] 

  let left = 0
  while (left < column) {
    if (grove[row][left] >= height) {
      break
    }
    left++
  }
  if  (left === column) return true

  let right = grove[0].length - 1
  while (right > column) {
    if (grove[row][right] >= height) {
      break
    }
    right--
  }
  if  (right === column) return true



  let above = 0
  while (above < row) {
    if (grove[above][column] >= height) {
      break
    }
    above++
  }
  if  (above === row) return true


  let below = grove.length - 1
  while (below > row) {
    if (grove[below][column] >= height) {
      return false
    }
    below--
  }
  if  (below === row) return true

  return false
}

file.on('line', (line) => {
  let row: number[] = []
  for (let c of line) {
    row.push(Number.parseInt(c))
  }
  grove.push(row)
});

file.on('close', () => {
  for (let row = 0; row < grove.length; row++) {
    for (let column = 0; column < grove[row].length; column++) {
      if (isVisible(row, column, grove)) {
        totalVisibleTrees++
      }
    }
  }
  console.log(`The total number of visible trees: ${totalVisibleTrees}`)
});
