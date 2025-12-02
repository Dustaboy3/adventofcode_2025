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

function floorDiv(value, divisor) {
    if (value < 0n) {
        return -ceilDiv(-value, divisor);
    }

    return value / divisor;
}

function repeatedMultiplier(patternLength, repeats) {
    const totalLength = patternLength * repeats;
    const numerator = pow10(totalLength) - 1n;
    const denominator = pow10(patternLength) - 1n;
    return numerator / denominator;
}

function computeMobius(maxValue) {
    const mu = Array(maxValue + 1).fill(1);
    const isComposite = Array(maxValue + 1).fill(false);
    const primes = [];
    mu[0] = 0;

    for (let i = 2; i <= maxValue; i += 1) {
        if (!isComposite[i]) {
            primes.push(i);
            mu[i] = -1;
        }

        for (const prime of primes) {
            const next = i * prime;
            if (next > maxValue) {
                break;
            }

            isComposite[next] = true;
            if (i % prime === 0) {
                mu[next] = 0;
                break;
            }

            mu[next] = -mu[i];
        }
    }

    return mu;
}

function getDivisors(n) {
    const divisors = [];
    for (let i = 1; i * i <= n; i += 1) {
        if (n % i === 0) {
            divisors.push(i);
            if (i !== n / i) {
                divisors.push(n / i);
            }
        }
    }

    return divisors;
}

function sumArithmetic(first, last) {
    const count = last - first + 1n;
    return (first + last) * count / 2n;
}

function sumRepeatedBlock(patternLength, totalLength, low, high) {
    const repeats = totalLength / patternLength;
    const multiplier = repeatedMultiplier(patternLength, repeats);
    const blockMin = pow10(patternLength - 1);
    const blockMax = pow10(patternLength) - 1n;

    const blockLow = ceilDiv(low, multiplier);
    const blockHigh = floorDiv(high, multiplier);

    const startBlock = blockLow < blockMin ? blockMin : blockLow;
    const endBlock = blockHigh > blockMax ? blockMax : blockHigh;

    if (startBlock > endBlock) {
        return 0n;
    }

    return multiplier * sumArithmetic(startBlock, endBlock);
}

function sumPrimitivePatterns(patternLength, low, high, mobius) {
    const divisors = getDivisors(patternLength);
    let total = 0n;

    for (const divisor of divisors) {
        const repeats = patternLength / divisor;
        const factor = mobius[repeats];
        if (factor === 0) {
            continue;
        }

        total += BigInt(factor) * sumRepeatedBlock(divisor, patternLength, low, high);
    }

    return total;
}

function parseRanges(input) {
    return input
        .trim()
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((entry) => {
            const [start, end] = entry.split('-').map((value) => BigInt(value));
            return {
                start: start <= end ? start : end,
                end: start <= end ? end : start,
            };
        });
}

function sumInvalidIds(input) {
    const ranges = parseRanges(input);
    if (ranges.length === 0) {
        return 0n;
    }

    const maxEnd = ranges.reduce((max, range) => (range.end > max ? range.end : max), 0n);
    const maxDigits = maxEnd.toString().length;
    const mobius = computeMobius(maxDigits);

    let total = 0n;

    for (const { start, end } of ranges) {
        const startDigits = start.toString().length;
        const endDigits = end.toString().length;

        for (let length = 2; length <= endDigits; length += 1) {
            const patternMax = Math.min(length - 1, maxDigits);
            for (let patternLength = 1; patternLength <= length - 1; patternLength += 1) {
                if (length % patternLength !== 0) {
                    continue;
                }

                const repeats = length / patternLength;
                if (repeats < 2) {
                    continue;
                }

                const multiplier = repeatedMultiplier(patternLength, repeats);

                const patternLow = ceilDiv(start, multiplier);
                const patternHigh = floorDiv(end, multiplier);

                const minPattern = pow10(patternLength - 1);
                const maxPattern = pow10(patternLength) - 1n;

                const lowBound = patternLow < minPattern ? minPattern : patternLow;
                const highBound = patternHigh > maxPattern ? maxPattern : patternHigh;

                if (lowBound > highBound) {
                    continue;
                }

                const primitiveSum = sumPrimitivePatterns(patternLength, lowBound, highBound, mobius);
                total += multiplier * primitiveSum;
            }
        }
    }

    return total;
}

if (require.main === module) {
    const input = fs.readFileSync(INPUT_PATH, 'utf8');
    const invalidSum = sumInvalidIds(input);
    console.log('Sum of invalid IDs (puzzle 2):', invalidSum.toString());
}

module.exports = {
    sumInvalidIds,
};
