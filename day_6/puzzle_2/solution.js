const fs = require('node:fs');
const path = require('node:path');

const INPUT_PATH = path.resolve(__dirname, 'input.txt');

function collectGroups(rows) {
    const height = rows.length;
    const width = Math.max(...rows.map((row) => row.length));
    const padded = rows.map((row) => row.padEnd(width, ' '));

    const isBlank = [];
    for (let col = 0; col < width; col += 1) {
        let blank = true;
        for (let row = 0; row < height; row += 1) {
            if (padded[row][col] !== ' ') {
                blank = false;
                break;
            }
        }
        isBlank[col] = blank;
    }

    const groups = [];
    let col = 0;
    while (col < width) {
        while (col < width && isBlank[col]) {
            col += 1;
        }
        if (col >= width) {
            break;
        }

        const start = col;
        while (col < width && !isBlank[col]) {
            col += 1;
        }
        const end = col;
        groups.push({ start, end, padded });
    }

    return groups;
}

function digitsFromColumn(padded, column, numberRows) {
    let digits = '';
    for (let row = 0; row < numberRows; row += 1) {
        const char = padded[row][column];
        if (char && char !== ' ') {
            digits += char;
        }
    }
    return digits;
}

function computeCephalopodUnknown(input) {
    const rawLines = input.replace(/\r/g, '').split('\n');
    const lines = rawLines.filter((line) => line.length > 0);
    if (lines.length < 2) {
        return 0n;
    }

    const numberRows = lines.slice(0, -1);
    const operatorRow = lines[lines.length - 1];
    const allRows = [...numberRows, operatorRow];
    const groups = collectGroups(allRows);
    let total = 0n;

    for (const group of groups.reverse()) {
        const { start, end, padded } = group;
        const operatorChars = [];
        for (let col = start; col < end; col += 1) {
            const char = padded[padded.length - 1][col];
            if (char && char !== ' ') {
                operatorChars.push(char);
            }
        }
        if (operatorChars.length === 0) {
            continue;
        }

        const operator = operatorChars[0];
        const numbers = [];
        for (let col = end - 1; col >= start; col -= 1) {
            const digits = digitsFromColumn(padded, col, numberRows.length);
            if (digits.length === 0) {
                continue;
            }
            numbers.push(BigInt(digits));
        }

        if (numbers.length === 0) {
            continue;
        }

        let result = numbers[0];
        if (operator === '+') {
            for (let i = 1; i < numbers.length; i += 1) {
                result += numbers[i];
            }
        } else if (operator === '*') {
            for (let i = 1; i < numbers.length; i += 1) {
                result *= numbers[i];
            }
        } else {
            continue;
        }

        total += result;
    }

    return total;
}

if (require.main === module) {
    const input = fs.readFileSync(INPUT_PATH, 'utf8');
    console.log('Grand total (cephalopod):', computeCephalopodUnknown(input).toString());
}

module.exports = {
    computeCephalopodUnknown,
};
