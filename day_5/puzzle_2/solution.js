const fs = require('node:fs');
const path = require('node:path');

const INPUT_PATH = path.resolve(__dirname, 'input.txt');

function parseRanges(section) {
    return section
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const [a, b] = line.split('-').map((value) => Number(value));
            return {
                start: Math.min(a, b),
                end: Math.max(a, b),
            };
        });
}

function mergeRanges(ranges) {
    if (ranges.length === 0) {
        return [];
    }

    const sorted = [...ranges].sort((lhs, rhs) => lhs.start - rhs.start);
    const merged = [];

    for (const { start, end } of sorted) {
        const last = merged[merged.length - 1];
        if (!last || start > last.end + 1) {
            merged.push({ start, end });
        } else {
            last.end = Math.max(last.end, end);
        }
    }

    return merged;
}

function countFreshRangeIds(input) {
    const sections = input.trim().split(/\r?\n\s*\r?\n/);
    if (sections.length === 0) {
        return 0;
    }

    const ranges = mergeRanges(parseRanges(sections[0]));
    return ranges.reduce((sum, range) => sum + (range.end - range.start + 1), 0);
}

if (require.main === module) {
    const input = fs.readFileSync(INPUT_PATH, 'utf8');
    console.log('Fresh IDs count:', countFreshRangeIds(input));
}

module.exports = {
    countFreshRangeIds,
};
