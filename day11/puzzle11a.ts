import fs from 'fs';
import readline from 'readline';
import path from 'path';

const elfFile = path.join(__dirname, 'monkey-business.txt');
const file = readline.createInterface({
  input: fs.createReadStream(elfFile),
  output: process.stdout,
  terminal: false,
});

class Monkey {
  items: number[];
  operation: (item: number) => number;
  testDivisor: number;
  trueRecipient: number;
  falseRecipient: number;
  inspectionCounter: number;

  constructor(items: number[], operation: (item: number) => number, testDivisor: number, trueRecipient: number, falseRecipient: number) {
    this.inspectionCounter = 0
    this.items = items
    this.operation = operation
    this.testDivisor = testDivisor
    this.trueRecipient = trueRecipient
    this.falseRecipient = falseRecipient
  }

  inspectItems() {
    let updatedItems: number[] = []
    this.items.forEach((item) => {
      this.inspectionCounter++
      let newValue = this.operation(item)
      updatedItems.push(Math.floor(newValue / 3))
    })
    this.items = updatedItems
  }

  testItems() {
    this.items.forEach((item) => {
      if (item % this.testDivisor === 0) {
        monkeys[this.trueRecipient].receieveItem(item)
      } else {
        monkeys[this.falseRecipient].receieveItem(item)
      }
    })
    this.items = []
  }

  receieveItem(item: number) {
    this.items.push(item)
  }

  getCounter() {
    return this.inspectionCounter
  }
}

let monkeyInfo: string[] = []
let monkeys: Monkey[] = []

const buildMonkeys = () => {
  while (monkeyInfo.length > 0) {
    let itemsLine: string | undefined = monkeyInfo.shift()
    if (!itemsLine) throw new Error('No line found')
    let startingItems = itemsLine.match(/\d+/g)!.map((item) => Number.parseInt(item))

    let operationLine = monkeyInfo.shift()!.slice(19)
    let operation: (item: number) => number

    if (operationLine === 'old * old') {
      operation = ((item: number) => item * item)
    } else if (operationLine.match(/\*/)) {
      let operandString = operationLine.match(/\d+/g)![0]
      let operand = Number.parseInt(operandString)
      operation = ((item: number) => item * operand)
    } else if (operationLine.match(/\+/)) {
      let operandString = operationLine.match(/\d+/g)![0]
      let operand = Number.parseInt(operandString)
      operation = ((item: number) => item + operand)
    } else throw new Error('Unable to parse operation')

    let testLine = monkeyInfo.shift()
    if (!testLine) throw new Error('No test line found.')
    let divisorString = testLine.match(/\d+(\.\d+)?/)![0]
    let testDivisor = Number.parseInt(divisorString)

    let trueLine = monkeyInfo.shift()
    if (!trueLine) throw new Error('No true line found.')
    let trueString = trueLine.match(/\d+(\.\d+)?/)![0]
    let trueRecipient = Number.parseInt(trueString)

    let falseLine = monkeyInfo.shift()
    if (!falseLine) throw new Error('No false line found.')
    let falseString = falseLine.match(/\d+(\.\d+)?/)![0]
    let falseRecipient = Number.parseInt(falseString)

    monkeys.push(new Monkey(startingItems, operation, testDivisor, trueRecipient, falseRecipient))
  }

}

file.on('line', (line) => {
  if (line.match(/Monkey*/)) return
  if (line.match(/^$/)) return
  monkeyInfo.push(line)
});

file.on('close', () => {
  buildMonkeys()

  let rounds = 20
  for (let round = 0; round < rounds; round++) {
    monkeys.forEach((monkey) => {
      monkey.inspectItems()
      monkey.testItems()
    })
  }
  let counters: number[] = []
  monkeys.forEach((monkey) => {
    counters.push(monkey.getCounter())
  })
  counters.sort((a, b) => a - b)
  const first = counters.pop()!
  const second = counters.pop()!
  const monkeyBusiness = first * second
  console.log(`Total monkey business: ${monkeyBusiness}`)
});
