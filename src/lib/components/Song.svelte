<script lang="ts">
	import type { ISong } from '../types';
	import ReverseSong from './ReverseSong.svelte';

	export let song: ISong;
	export let handleNextSong: () => void;

	let songTitleGuess: string = '';
	let hint: string = '';
	let lastGuessDistance = Infinity;

	type State = 'GUESSING' | 'CORRECT' | 'GAVE UP';
	let state: State = 'GUESSING';

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

	function handleSubmit(event: Event) {
		event.preventDefault();
		const normalizedGuess = songTitleGuess.toLowerCase();
		const normalizedAnswer = song.title.toLowerCase();

		// TODO: make this more engaging.
		if (normalizedGuess === normalizedAnswer) {
			state = 'CORRECT';
		} else {
			const distance = levenshteinDistance(normalizedGuess, normalizedAnswer);

			if (distance > lastGuessDistance) {
				hint = `This guess is even worst than your last`;
			} else {
				if (distance <= 2) {
					hint = `Almost!`;
				} else if (distance <= 4) {
					hint = `You're on the right track. Nearly there!`;
				} else if (distance <= 6) {
					hint = `Hmm...kind of close??`;
				} else if (distance > normalizedAnswer.length) {
					hint = `You're way off. You should check your ears.`;
				} else {
					hint = `Idk..., doesn't seem right.`;
				}
			}

			lastGuessDistance = distance;
		}
	}

	// @ts-ignore
	function handleChange(event) {
		const input = event.target as HTMLInputElement;
		songTitleGuess = input.value;
	}

	function handleGiveUp() {
		state = 'GAVE UP';
	}

	$: {
		console.log('new song', song);
		state = 'GUESSING';
		songTitleGuess = '';
		hint = '';
	}
</script>

<article>
	{#if state === 'GUESSING'}
		<h2>What song is this?</h2>
		<button on:click={handleGiveUp}>Give Up</button>
		<ReverseSong {song} />

		<form on:submit={handleSubmit}>
			<input
				type="text"
				placeholder="Guess the song name..."
				value={songTitleGuess}
				on:input={handleChange}
			/>
			{#if hint}
				<p>{hint}</p>
			{/if}
		</form>
	{:else if state === 'GAVE UP'}
		<h2>Answer: {song.title}</h2>
		<audio controls src={`/songs/${song.path}`} />
		<h2>You gave up??</h2>
		<button
			on:click={() => {
				handleNextSong();
			}}>Next Song</button
		>
	{:else}
		<h2>You guessed right! The song was {song.title}</h2>
		<audio controls src={`/songs/${song.path}`} />
		<button
			on:click={() => {
				handleNextSong();
			}}>Next Song</button
		>
	{/if}
</article>
