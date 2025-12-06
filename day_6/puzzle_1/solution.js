const fs = require('node:fs');
const path = require('node:path');

const INPUT_PATH = path.resolve(__dirname, 'input.txt');

function calculateProblem(numbers, operator) {
    if (numbers.length === 0) {
        return 0n;
    }

    const bigNumbers = numbers.map((value) => BigInt(value));
    if (operator === '+') {
        return bigNumbers.reduce((sum, value) => sum + value, 0n);
    }

    if (operator === '*') {
        return bigNumbers.reduce((prod, value) => prod * value, 1n);
    }

    throw new Error(`Unknown operator: ${operator}`);
}

function collectColumns(numberRows, operationsLine) {
    const combined = [...numberRows, operationsLine];
    const maxWidth = combined.reduce((max, line) => Math.max(max, line.length), 0);

    const padded = combined.map((line) => line.padEnd(maxWidth, ' '));
    const separator = Array(maxWidth).fill(false);
    for (let col = 0; col < maxWidth; col += 1) {
        let isSeparator = true;
        for (const row of padded) {
            if (row[col] !== ' ') {
                isSeparator = false;
                break;
            }
        }
        separator[col] = isSeparator;
    }

    const columns = [];
    let col = 0;
    while (col < maxWidth) {
        while (col < maxWidth && separator[col]) {
            col += 1;
        }
        if (col >= maxWidth) {
            break;
        }
        const start = col;
        while (col < maxWidth && !separator[col]) {
            col += 1;
        }
        const end = col;
        columns.push({ start, end });
    }

    return columns;
}

function grandTotal(input) {
    const rawLines = input.replace(/\r/g, '').split('\n');
    const lines = rawLines.filter((line) => line.trim().length > 0);
    if (lines.length < 2) {
        return 0n;
    }

    const operationsLine = lines.pop();
    const numberRows = lines;
    const columns = collectColumns(numberRows, operationsLine);

    let total = 0n;
    for (const { start, end } of columns) {
        const operator = operationsLine.slice(start, end).trim();
        if (!operator) {
            continue;
        }

        const numbers = [];
        for (const row of numberRows) {
            const segment = row.slice(start, end).trim();
            if (segment.length === 0) {
                continue;
            }

            const parsed = Number(segment);
            if (Number.isNaN(parsed)) {
                continue;
            }

            numbers.push(parsed);
        }

        total += calculateProblem(numbers, operator);
    }

    return total;
}

if (require.main === module) {
    const input = fs.readFileSync(INPUT_PATH, 'utf8');
    console.log('Grand total:', grandTotal(input).toString());
}

module.exports = {
    grandTotal,
};
