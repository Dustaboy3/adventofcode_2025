const fs = require('node:fs');
const path = require('node:path');

const INPUT_PATH = path.resolve(__dirname, 'input.txt');

function parseRanges(section) {
    return section
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const [min, max] = line.split('-').map((value) => Number(value));
            return {
                start: Math.min(min, max),
                end: Math.max(min, max),
            };
        });
}

function mergeRanges(ranges) {
    if (ranges.length === 0) {
        return [];
    }

    const sorted = [...ranges].sort((a, b) => a.start - b.start);
    const merged = [];

    for (const range of sorted) {
        const last = merged[merged.length - 1];
        if (!last || range.start > last.end + 1) {
            merged.push({ ...range });
        } else {
            last.end = Math.max(last.end, range.end);
        }
    }

    return merged;
}

function countFreshIngredients(input) {
    const sections = input.trim().split(/\r?\n\s*\r?\n/);
    if (sections.length < 2) {
        return 0;
    }

    const ranges = mergeRanges(parseRanges(sections[0]));
    const ids = sections[1]
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map(Number)
        .sort((a, b) => a - b);

    let freshCount = 0;
    let rangeIndex = 0;

    for (const id of ids) {
        while (rangeIndex < ranges.length && id > ranges[rangeIndex].end) {
            rangeIndex += 1;
        }

        if (rangeIndex === ranges.length) {
            break;
        }

        if (id >= ranges[rangeIndex].start && id <= ranges[rangeIndex].end) {
            freshCount += 1;
        }
    }

    return freshCount;
}

if (require.main === module) {
    const input = fs.readFileSync(INPUT_PATH, 'utf8');
    console.log('Fresh ingredient count:', countFreshIngredients(input));
}

module.exports = {
    countFreshIngredients,
};
