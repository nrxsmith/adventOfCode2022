import fs from 'fs'
import readline from 'readline'
import path from 'path'

const elfFile = path.join(__dirname, 'item-list.txt')
const file = readline.createInterface({
    input: fs.createReadStream(elfFile),
    output: process.stdout,
    terminal: false,
})

let totalPriority = 0
const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

const readFirstCompartment = (line: string) => {
    let firstCompartment = new Set<string>()
    for (let i = 0; i < line.length / 2; i++ ) {
        firstCompartment.add(line.charAt(i))
    }
    return firstCompartment
}

const findDuplicateChar = (line: string, firstCompartment: Set<string>) => {
    for (let i = line.length / 2; i < line.length; i++) {
        if (firstCompartment.has(line.charAt(i))) return line.charAt(i)
    }
    throw new Error('No duplicate found!')
}

file.on('line', (line) => {
    const firstCompartment = readFirstCompartment(line)
    const duplicate = findDuplicateChar(line, firstCompartment)
    const priority = characters.indexOf(duplicate) + 1
    totalPriority += priority
})

file.on('close', () => {
  console.log(`Total priority sum: ${totalPriority}`)
})

