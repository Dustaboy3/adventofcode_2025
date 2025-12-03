const fs = require('node:fs');
const path = require('node:path');

const INPUT_PATH = path.resolve(__dirname, 'input.txt');

function maxJoltageFromBank(line) {
    const digits = line.trim();
    if (digits.length < 2) {
        return 0;
    }

    let maxPair = 0;
    let suffixMax = -1;

    for (let i = digits.length - 1; i >= 0; i -= 1) {
        const digit = digits.charCodeAt(i) - 48;

        if (suffixMax >= 0) {
            const value = digit * 10 + suffixMax;
            if (value > maxPair) {
                maxPair = value;
            }
        }

        if (digit > suffixMax) {
            suffixMax = digit;
        }
    }

    return maxPair;
}

function totalJoltage(input) {
    return input
        .trim()
        .split(/\r?\n/)
        .map((line) => maxJoltageFromBank(line))
        .reduce((sum, value) => sum + value, 0);
}

if (require.main === module) {
    const input = fs.readFileSync(INPUT_PATH, 'utf8');
    console.log('Total output joltage:', totalJoltage(input));
}

module.exports = {
    totalJoltage,
};
