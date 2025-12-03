const fs = require('node:fs');
const path = require('node:path');

const INPUT_PATH = path.resolve(__dirname, 'input.txt');
const OUTPUT_DIGITS = 12;

function maxSubsequence(digits, length) {
    const result = [];
    const drop = digits.length - length;
    let toRemove = drop > 0 ? drop : 0;

    for (const digit of digits) {
        while (toRemove > 0 && result.length > 0 && result[result.length - 1] < digit) {
            result.pop();
            toRemove -= 1;
        }
        result.push(digit);
    }

    return result.slice(0, length).join('');
}

function maxJoltageFromBank(line) {
    const digits = line.trim();
    if (digits.length === 0) {
        return 0n;
    }

    const target = Math.min(OUTPUT_DIGITS, digits.length);
    const best = maxSubsequence(digits, target);
    return BigInt(best);
}

function totalJoltage(input) {
    return input
        .trim()
        .split(/\r?\n/)
        .map((line) => maxJoltageFromBank(line))
        .reduce((sum, value) => sum + value, 0n);
}

if (require.main === module) {
    const input = fs.readFileSync(INPUT_PATH, 'utf8');
    console.log('Total output joltage:', totalJoltage(input).toString());
}

module.exports = {
    totalJoltage,
};
