const LEVEL_THRESHOLDS = [
	0, // Level 1
	200, // Level 2
	500, // Level 3
	1000, // Level 4
	1700, // Level 5
	2600, // Level 6
	3800, // Level 7
	5300, // Level 8
	7200, // Level 9
	9500, // Level 10
];

export function calculateLevel(xpTotal: number): number {
	let level = 1;
	for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
		if (xpTotal >= LEVEL_THRESHOLDS[i]) {
			level = i + 1;
			break;
		}
	}
	return level;
}
