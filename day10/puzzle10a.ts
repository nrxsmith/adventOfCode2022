import fs from 'fs';
import readline from 'readline';
import path from 'path';

let cycles: number[] = []

const elfFile = path.join(__dirname, 'signal-program.txt');
const file = readline.createInterface({
  input: fs.createReadStream(elfFile),
  output: process.stdout,
  terminal: false,
});

const getRegisterValue = (cycleNumber: number, cycles: number[]) => {
  let cyclesToSum = cycles.slice(0, cycleNumber - 2)
  return cyclesToSum.reduce((prev, curr ) => {
    console.log(prev + curr)
    return prev + curr
  }, 1)
}

const getTotalSignalStrength = (cycleNumbers: number[], cycles: number[]) => {
  let sum = 0
  cycleNumbers.forEach((cycleNumber) => {
    let signalStrength = getRegisterValue(cycleNumber, cycles) * cycleNumber
    sum += signalStrength 
  })
  return sum
}

file.on('line', (line) => {
  if (line.slice(0,4) === 'addx') cycles.push(Number.parseInt(line.slice(4)))
  cycles.push(0)
});

file.on('close', () => {
  console.log(`Interesting value: ${getTotalSignalStrength([20, 60, 100, 140, 180, 220], cycles)}`)
});
