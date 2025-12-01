const fs = require('node:fs');
const path = require('node:path');

const INPUT_PATH = path.resolve(__dirname, 'input.txt');
const DIAL_SIZE = 100;

function countZeroClicks(rawInput, start = 50) {
    if (typeof rawInput !== 'string') {
        throw new TypeError('Input must be a string of newline-separated rotations');
    }

    const instructions = rawInput
        .trim()
        .split(/\r?\n/)
        .filter(Boolean);

    let position = start;
    let zeroCount = 0;

    for (const instruction of instructions) {
        const direction = instruction[0];
        const distance = Number(instruction.slice(1));

        if (!['L', 'R'].includes(direction) || Number.isNaN(distance)) {
            continue;
        }

        const step = direction === 'R' ? 1 : -1;

        for (let i = 0; i < distance; i += 1) {
            position = (position + step) % DIAL_SIZE;
            if (position < 0) {
                position += DIAL_SIZE;
            }

            if (position === 0) {
                zeroCount += 1;
            }
        }
    }

    return zeroCount;
}

if (require.main === module) {
    const input = fs.readFileSync(INPUT_PATH, 'utf8');
    const count = countZeroClicks(input);
    console.log('Password (method 0x434C49434B):', count);
}

module.exports = {
    countZeroClicks,
};
