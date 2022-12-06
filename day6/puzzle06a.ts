import fs from 'fs';
import readline from 'readline';
import path from 'path';

const elfFile = path.join(__dirname, 'comm-stream.txt');
const file = readline.createInterface({
  input: fs.createReadStream(elfFile),
  output: process.stdout,
  terminal: false,
});

file.on('line', (line) => {
  let left = 0;
  let right = 0;
  let windowChars = new Map();
  windowChars.set(line[0], 0);

  while (windowChars.size < 4 && right <= line.length) {
    right++;
    if (windowChars.get(line[right])) {
      while (windowChars.get(line[right])) {
        windowChars.delete(line[left]);
        left++;
      }
    }
    windowChars.set(line[right], right);
  }

  console.log(`First start-of-packet character: ${right + 1}`);
});
