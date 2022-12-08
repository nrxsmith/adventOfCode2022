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
let bestScore = 0 

const getVisibleTrees = (row: number, column: number, grove: number[][]) => {

  const height = grove[row][column] 

  let leftTrees = 0
  let leftIndex = column - 1
  while (leftIndex >= 0) {
    leftTrees++
    if (grove[row][leftIndex] >= height) {
      break
    } 
    leftIndex--
  }

  let rightTrees = 0
  let rightIndex = column + 1
  while (rightIndex < grove.length) {
    rightTrees++
    if (grove[row][rightIndex] >= height) {
      break
    }
    rightIndex++
  }

  let aboveTrees = 0
  let aboveIndex = row - 1
  while (aboveIndex >= 0) {
    aboveTrees++
    if (grove[aboveIndex][column] >= height) {
      break
    }
    aboveIndex--
  }

  let belowTrees = 0
  let belowIndex = row + 1
  while (belowIndex < grove[0].length) {
    belowTrees++
    if (grove[belowIndex][column] >= height) {
      break
    }
    belowIndex++
  }

  return rightTrees * leftTrees * aboveTrees * belowTrees
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
      bestScore = Math.max(getVisibleTrees(row, column, grove), bestScore)
    }
  }
  console.log(`The best scenic score is: ${bestScore}`)
});
