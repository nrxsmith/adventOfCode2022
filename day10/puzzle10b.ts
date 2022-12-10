import fs from 'fs';
import readline from 'readline';
import path from 'path';

let cycles: number[] = []
let registerValues: number[] = [1, 1]
let crtScreen = ``

const elfFile = path.join(__dirname, 'signal-program.txt');
const file = readline.createInterface({
  input: fs.createReadStream(elfFile),
  output: process.stdout,
  terminal: false,
});

const recordRegisterValues = (cycles: number[]) => {
  let registerIndex = 2
  cycles.forEach((cycle) => {
    registerValues.push(cycle + registerValues[registerIndex - 1])
    registerIndex++
  })
}

const drawPixel = (cycleNumber: number) => {
  let position = cycleNumber % 40
  if (position === 0) crtScreen = `${crtScreen}
  `
  if (registerValues[cycleNumber] >= position - 1 && registerValues[cycleNumber] <= position + 1) {
    crtScreen = `${crtScreen}#`
  } else {
    crtScreen = `${crtScreen}.`
  }
}

file.on('line', (line) => {
  if (line.slice(0,4) === 'addx') cycles.push(Number.parseInt(line.slice(4)))
  cycles.push(0)
});

file.on('close', () => {
  recordRegisterValues(cycles)
  for (let i = 0; i < cycles.length; i++) {
    drawPixel(i)
  }
  console.log(crtScreen)
});
