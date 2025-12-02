const fs = require('node:fs');
const path = require('node:path');

const INPUT_PATH = path.resolve(__dirname, 'input.txt');

const pow10Cache = [1n];

function pow10(exp) {
    while (pow10Cache.length <= exp) {
        pow10Cache.push(pow10Cache[pow10Cache.length - 1] * 10n);
    }

    return pow10Cache[exp];
}

function ceilDiv(value, divisor) {
    if (value === 0n) {
        return 0n;
    }

    return (value + divisor - 1n) / divisor;
}

function parseRanges(input) {
    return input
        .trim()
        .split(',')
        .map((range) => range.trim())
        .filter(Boolean)
        .map((range) => {
            const [start, end] = range.split('-').map((part) => BigInt(part));
            return {
                start: start <= end ? start : end,
                end: start <= end ? end : start,
            };
        });
}

function sumInvalidProductIds(input) {
    const ranges = parseRanges(input);
    let total = 0n;

    const maxEnd = ranges.reduce((max, range) => (range.end > max ? range.end : max), 0n);
    const maxDigits = maxEnd.toString().length;

    for (const { start, end } of ranges) {
        if (start > end) {
            continue;
        }

        for (let digits = 2; digits <= maxDigits; digits += 2) {
            const half = digits / 2;
            const blockStart = pow10(half - 1);
            const blockEnd = pow10(half) - 1n;

            const blockMultiplier = pow10(half);
            const repeatedMultiplier = blockMultiplier + 1n;

            const minBlock = ceilDiv(start, repeatedMultiplier);
            const maxBlock = end / repeatedMultiplier;

            const blockLow = minBlock < blockStart ? blockStart : minBlock;
            const blockHigh = maxBlock > blockEnd ? blockEnd : maxBlock;

            if (blockLow > blockHigh) {
                continue;
            }

            const count = blockHigh - blockLow + 1n;
            const blockSum = (blockLow + blockHigh) * count / 2n;
            total += repeatedMultiplier * blockSum;
        }
    }

    return total;
}

if (require.main === module) {
    const input = fs.readFileSync(INPUT_PATH, 'utf8');
    const invalidSum = sumInvalidProductIds(input);
    console.log('Sum of invalid IDs:', invalidSum.toString());
}

module.exports = {
    sumInvalidProductIds,
};
