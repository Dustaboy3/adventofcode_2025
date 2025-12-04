const fs = require('node:fs');
const path = require('node:path');

const INPUT_PATH = path.resolve(__dirname, 'input.txt');

function parseGrid(input) {
    return input.trim().split(/\r?\n/).map((line) => line.split(''));
}

function countAdjacentRocks(grid, r, c) {
    const rows = grid.length;
    const cols = grid[0]?.length || 0;
    const deltas = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
    ];

    let count = 0;
    for (const [dr, dc] of deltas) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
            continue;
        }

        if (grid[nr][nc] === '@') {
            count += 1;
            if (count >= 4) {
                break;
            }
        }
    }

    return count;
}

function countRemovableRolls(input) {
    const grid = parseGrid(input);
    const rows = grid.length;
    const cols = grid[0]?.length || 0;
    let removed = 0;

    while (true) {
        const toRemove = [];

        for (let r = 0; r < rows; r += 1) {
            for (let c = 0; c < cols; c += 1) {
                if (grid[r][c] !== '@') {
                    continue;
                }

                if (countAdjacentRocks(grid, r, c) < 4) {
                    toRemove.push([r, c]);
                }
            }
        }

        if (toRemove.length === 0) {
            break;
        }

        for (const [r, c] of toRemove) {
            grid[r][c] = '.';
            removed += 1;
        }
    }

    return removed;
}

if (require.main === module) {
    const input = fs.readFileSync(INPUT_PATH, 'utf8');
    console.log('Removable rolls of paper:', countRemovableRolls(input));
}

module.exports = {
    countRemovableRolls,
};
