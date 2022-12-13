import fs from 'fs';
import readline from 'readline';
import path from 'path';

const elfFile = path.join(__dirname, 'pairs.txt');
const file = readline.createInterface({
  input: fs.createReadStream(elfFile),
  output: process.stdout,
  terminal: false,
});

const compareArrays = (left: any[], right: any[]): boolean | void => {
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    if (left[i] === undefined) return true;
    if (right[i] === undefined) return false;

    if (!Array.isArray(left[i]) && !Array.isArray(right[i])) {
      if (left[i] < right[i]) return true;
      if (left[i] > right[i]) return false;
      continue;
    } else if (Array.isArray(left[i]) && Array.isArray(right[i])) {
      if (compareArrays(left[i], right[i]) === true) return true;
      if (compareArrays(left[i], right[i]) === false) return false;
      continue;
    } else if (!Array.isArray(left[i]) && Array.isArray(right[i])) {
      let f: number[] = [];
      f.push(left[i]);
      if (compareArrays(f, right[i]) === true) return true;
      if (compareArrays(f, right[i]) === false) return false;
      continue;
    } else if (Array.isArray(left[i]) && !Array.isArray(right[i])) {
      let s: number[] = [];
      s.push(right[i]);
      if (compareArrays(left[i], s) === true) return true;
      if (compareArrays(left[i], s) === false) return false;
      continue;
    }
  }
};

let pairs: [any, any][] = [];
let pairToAdd: [any, any] = [null, null];

file.on('line', (line) => {
  if (line === '') return;

  const parsedLine = JSON.parse(line);

  if (!pairToAdd[0]) {
    pairToAdd[0] = parsedLine;
  } else {
    pairToAdd[1] = parsedLine;
    pairs.push(pairToAdd);
    pairToAdd = [null, null];
  }
});

file.on('close', () => {
  let packets = pairs.flat();

  packets.push([[2]], [[6]]);
  packets.sort((a, b) => {
    if (compareArrays(b, a)) {
      return 1;
    } else {
      return -1;
    }
  });
  const firstDelimiter = packets.findIndex((packet) => packet.length === 1 && packet[0].length === 1 && packet[0][0] === 2) + 1
  const secondDelimiter = packets.findIndex((packet) => packet.length === 1 && packet[0].length === 1 && packet[0][0] === 6) + 1

  console.log(`Decoder key: ${firstDelimiter * secondDelimiter}`);
});
