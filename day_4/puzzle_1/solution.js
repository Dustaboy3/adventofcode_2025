const fs = require('node:fs');
const path = require('node:path');

const INPUT_PATH = path.resolve(__dirname, 'input.txt');

function countAccessibleRolls(input) {
    const grid = input
        .trim()
        .split(/\r?\n/)
        .map((line) => line.split(''));

    const rows = grid.length;
    const cols = grid[0]?.length || 0;
    const directions = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
    ];

    let accessibleCount = 0;

    for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
            if (grid[r][c] !== '@') {
                continue;
            }

            let neighborRocks = 0;
            for (const [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
                    continue;
                }

                if (grid[nr][nc] === '@') {
                    neighborRocks += 1;
                    if (neighborRocks >= 4) {
                        break;
                    }
                }
            }

            if (neighborRocks < 4) {
                accessibleCount += 1;
            }
        }
    }

    return accessibleCount;
}

if (require.main === module) {
    const input = fs.readFileSync(INPUT_PATH, 'utf8');
    const accessible = countAccessibleRolls(input);
    console.log('Accessible rolls of paper:', accessible);
}

module.exports = {
    countAccessibleRolls,
};
