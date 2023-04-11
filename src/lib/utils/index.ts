interface HintResult {
	correct: boolean;
	hint: string;
}

export const getHint = (guess: string, answer: string): HintResult => {
	if (guess === answer) {
		return {
			correct: true,
			hint: ''
		};
	}

	const distance = levenshteinDistance(guess, answer);
	const startsWith = answer.startsWith(guess);

	let hint = '';
	const percentCorrect = 100 - Math.floor((distance / answer.length) * 100);

	if (guess !== '' && startsWith) {
		if (percentCorrect > 90) {
			hint = 'amazing! you are one step away from the answer!';
		} else if (percentCorrect > 80) {
			hint = 'great work, you are really close';
		} else if (percentCorrect > 70) {
			hint = 'keep it up!';
		} else if (percentCorrect > 60) {
			hint = 'almost there!!';
		} else if (percentCorrect > 50) {
			hint = 'you are really feeling the beat';
		} else if (percentCorrect > 40) {
			hint = 'keep going, the rhythm is flowing through you';
		} else if (percentCorrect > 30) {
			hint = 'you are on the right track';
		} else if (percentCorrect > 20) {
			hint = 'hmm, this melody is familiar...';
		} else if (percentCorrect > 10) {
			hint = 'have you heard this song before?';
		} else {
			hint = 'ding! ding! you are on the right track!';
		}
	} else {
		if (percentCorrect > 20) {
			hint = 'try squinting your eyes, you might hear better';
		} else if (percentCorrect > 10) {
			hint = 'not quite... do a double take';
		} else if (percentCorrect > 0) {
			hint = 'maybe...';
		} else if (percentCorrect > -5) {
			hint = 'ehhhh, that does not sound right at all';
		} else if (percentCorrect > -10) {
			hint = 'is that even a song??';
		} else if (percentCorrect > -20) {
			hint = 'you need to get better speakers';
		} else if (percentCorrect > -30) {
			hint = 'are your speakers working?';
		} else if (percentCorrect > -40) {
			hint = 'wow, you are really bad at this';
		} else if (percentCorrect > -50) {
			hint = 'this is not right in any way';
		} else if (percentCorrect > -80) {
			hint = 'are you even listening??';
		} else if (percentCorrect > -100) {
			hint = 'clean your ears!';
		}
	}

	return {
		correct: false,
		hint
	};
};

function levenshteinDistance(s1: string, s2: string): number {
	const m = s1.length;
	const n = s2.length;

	// Create a matrix to store the distances between substrings of s1 and s2
	const matrix: number[][] = Array.from({ length: m + 1 }, () =>
		Array.from({ length: n + 1 }, (_, j) => j)
	);

	for (let i = 1; i <= m; i++) {
		matrix[i][0] = i;
	}

	for (let j = 1; j <= n; j++) {
		matrix[0][j] = j;
	}

	// Fill in the rest of the matrix using dynamic programming
	for (let j = 1; j <= n; j++) {
		for (let i = 1; i <= m; i++) {
			if (s1[i - 1] === s2[j - 1]) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] = Math.min(
					matrix[i - 1][j] + 1, // deletion
					matrix[i][j - 1] + 1, // insertion
					matrix[i - 1][j - 1] + 1 // substitution
				);
			}
		}
	}

	// The Levenshtein distance is the value in the bottom-right corner of the matrix
	return matrix[m][n];
}
