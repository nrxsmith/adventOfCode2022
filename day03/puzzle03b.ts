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
let currentElfGroup: string[] = []
const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

const getFirstElfChars = (line: string) => {
    let firstElfChars = new Set<string>()
    for (let c of line) {
        firstElfChars.add(c)
    }
    return firstElfChars
}

const getDuplicateChars = (line: string, charSet: Set<string>) => {
    let duplicates = new Set<string>()
    for (let c of line) {
        if (charSet.has(c)) duplicates.add(c)
    }
    if (duplicates.size === 0) throw new Error('No duplicates found!')
    return duplicates
}

const findDuplicateInGroup = (group: string[]) => {
    const firstElfChars = getFirstElfChars(group[0])
    const secondElfDuplicates = getDuplicateChars(group[1], firstElfChars)
    const duplicateCharSet = getDuplicateChars(group[2], secondElfDuplicates)
    if (duplicateCharSet.size !== 1) throw new Error(`Found ${duplicateCharSet.size} duplicates! There should only have been one.`)
    return Array.from(duplicateCharSet)[0]
}


file.on('line', (line) => {
    currentElfGroup.push(line)
    if (currentElfGroup.length === 3) {
        const duplicate = findDuplicateInGroup(currentElfGroup)
        totalPriority += characters.indexOf(duplicate) + 1
        currentElfGroup = []
    }
}
)

file.on('close', () => {
    console.log(`Total priority sum: ${totalPriority}`)
})

