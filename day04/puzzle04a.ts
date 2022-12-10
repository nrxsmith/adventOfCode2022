import fs from 'fs'
import readline from 'readline'
import path from 'path'

const elfFile = path.join(__dirname, 'elf-pairs.txt')
const file = readline.createInterface({
    input: fs.createReadStream(elfFile),
    output: process.stdout,
    terminal: false,
})

let totalContainedPairs = 0

const parseLineToNumPairs = (line: string) => {
    const stringPairs = line.split(',')
    let numberPairs: number[][] = []

    for (let pair of stringPairs) {
        let stringNums = pair.split('-')
        const num1 = Number.parseInt(stringNums[0])
        const num2 = Number.parseInt(stringNums[1])
        numberPairs.push([num1, num2])
    }
    return numberPairs
}

const isPairContained = (pair1: number[], pair2: number[]) => {
    if (pair1[0] >= pair2[0] && pair1[1] <= pair2[1]) return true
    if (pair2[0] >= pair1[0] && pair2[1] <= pair1[1]) return true
    return false
}


file.on('line', (line) => {
    const numPairs = parseLineToNumPairs(line)
    if (isPairContained(numPairs[0], numPairs[1])) totalContainedPairs++
})

file.on('close', () => {
    console.log(`Total priority sum: ${totalContainedPairs}`)
})

