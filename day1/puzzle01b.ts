import fs from 'fs';
import readline from 'readline';
import Heap from 'heap-js';
import path from 'path';

let topThreeElves = new Heap()
let currentElfTotal = 0

const elfFile = path.join(__dirname, 'elf-calories.txt')
const file = readline.createInterface({
    input: fs.createReadStream(elfFile),
    output: process.stdout,
    terminal: false
});

file.on('line', (line) => {
    if (line !== "") {
        currentElfTotal += Number.parseInt(line)
    } else {
        topThreeElves.push(currentElfTotal)
        while (topThreeElves.length > 3) {
            topThreeElves.pop()
        }
        currentElfTotal = 0
    }
});

file.on('close', () => {
    let total = 0
    for (const value of topThreeElves) {
        total += value as number
    }
    console.log(`Top three elves: ${total}`)
})



