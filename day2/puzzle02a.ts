import fs from 'fs'
import readline from 'readline'
import path from 'path'

let totalScore = 0

const elfFile = path.join(__dirname, 'elf-strategy.txt')
const file = readline.createInterface({
    input: fs.createReadStream(elfFile),
    output: process.stdout,
    terminal: false,
})

file.on('line', (line) => {
    totalScore += getScoreForRound(line)
})

file.on('close', () => {
  console.log(`Total score for strategy: ${totalScore}`)
})

const getScoreForRound = (round: string) => {
    switch (round) {
        case 'A X':
            return 4
        case 'A Y':
            return 8
        case 'A Z':
            return 3
        case 'B X':
            return 1
        case 'B Y':
            return 5
        case 'B Z':
            return 9
        case 'C X':
            return 7
        case 'C Y':
            return 2
        case 'C Z':
            return 6
        default:
            throw new Error('Invalid round!')
    }
}
