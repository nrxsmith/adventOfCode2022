import fs from 'fs';
import readline from 'readline';
import path from 'path'

let maxCalories = 0
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
        if (currentElfTotal > maxCalories) {
            maxCalories = currentElfTotal
            console.log(`New max is: ${maxCalories}`)
        } 
        currentElfTotal = 0
    }
});

