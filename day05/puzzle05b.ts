import fs from 'fs';
import readline from 'readline';
import path from 'path';

const elfFile = path.join(__dirname, 'crate-stacks.txt');
const file = readline.createInterface({
  input: fs.createReadStream(elfFile),
  output: process.stdout,
  terminal: false,
});

let stackRows: string[] = [];
let moveRows: string[] = [];
let numberOfStacks = 0;

const getTopCrates = (stacks: string[][]) => {
  let topCrates = ''
  for (let stack of stacks) {
    let topCrate = stack.pop()
    topCrates = `${topCrates}${topCrate}`
  }
  return topCrates
};

const readSlot = (contents: string) => {
  if (contents.length !== 3)
    throw new Error('Slot contains more than three characters');
  if (contents.trim() === '') {
    return ' ';
  }
  if (contents[0] === '[') {
    return contents[1];
  }
  throw new Error('Unexpected character; failed to parse slot contents');
};

const readStackRow = (stacks: string[][], line: string) => {
  let stackIndex = 0;
  for (let lineCharIndex = 0; lineCharIndex < line.length; lineCharIndex += 4) {
    let slotContents = readSlot(line.slice(lineCharIndex, lineCharIndex + 3));

    if (slotContents.trim() === '') {
    } else {
      stacks[stackIndex].push(slotContents);
    }
    stackIndex++;
  }
};

const moveCrates = (stacks: string[][], instructions: number[]) => {
  if (instructions.length !== 3) {
    throw new Error('Invalid instruction set');
  }

  let numberOfCrates = instructions[0];
  let from = instructions[1] - 1;
  let to = instructions[2] - 1;

  let cratesToMove: string[] = []
  for (let i = 0; i < numberOfCrates; i++) {
    let crate = stacks[from].pop();
    if (!crate) throw new Error("Stack is empty; can't move");
    cratesToMove.push(crate);
  }
  cratesToMove.reverse()
  stacks[to].push(...cratesToMove)

};

const readMoveRow = (stacks: string[][], line: string) => {
  let rowInstructions: number[] = [];
  let ints = line.match(/\d+/g)
  if (!ints) throw new Error('No integers found')
  for (let i of ints) {
    let parsedChar = Number.parseInt(i);
    if (Number.isFinite(parsedChar)) {
      rowInstructions.push(parsedChar);
    }
  }
  moveCrates(stacks, rowInstructions);
};

const readStackLabelRow = (line: string) => {
  for (let c of line) {
    let parsedChar = Number.parseInt(c);
    if (Number.isFinite(parsedChar)) {
      numberOfStacks = Math.max(parsedChar, numberOfStacks);
    }
  }
};

file.on('line', (line) => {
  if (line[1] === '1') readStackLabelRow(line);
  else if (line.trim().length === 0) console.log('Blank line, skipping');
  else if (line.slice(0, 4) === 'move') moveRows.push(line);
  else stackRows.push(line);
});
1
file.on('close', () => {
  let stacks: string[][] = []
  for (let i = 0; i < numberOfStacks; i++) {
    stacks.push([])
  }

  while (stackRows.length > 0) {
    const row = stackRows.pop();
    if (!row) throw new Error('No row found');
    readStackRow(stacks, row);
  }

  let movesInOrder = moveRows.reverse();

  while (movesInOrder.length > 0) {
    let moveRow = movesInOrder.pop()
    if (!moveRow) throw new Error('No row found!')
    readMoveRow(stacks, moveRow)
  }

  const topCrates = getTopCrates(stacks)

  console.log(`Top crates: ${topCrates}`);
});
