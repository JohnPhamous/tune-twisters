<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import SevenSegmentNumber from '$lib/components/SevenSegmentNumber.svelte';
	import Tuny from '$lib/components/Tuny.svelte';
	import TunySmall from '$lib/components/TunySmall.svelte';
	import { supabaseClient } from '$lib/supabase';
	import { getHint } from '$lib/utils';
	import type { ISong } from '../types';
	import ReverseSong from './ReverseSong.svelte';

	export let song: ISong;
	export let sessionId: string;
	export let handleNextSong: () => void;
	export let onGameStart: () => void;

	let songTitleGuess: string = '';
	let hint: string = '';

	type State = 'GUESSING' | 'CORRECT' | 'GAVE UP';
	let state: State = 'GUESSING';
	let time = 0;
	let startTime: number | null = null;
	let timerStarted = false;
	let interval: number;
	let numGuesses = 0;
	let percentileRank = 0;
	let inputElement: HTMLInputElement;

	function handleSubmit(event?: Event) {
		numGuesses++;
		event?.preventDefault();
		const normalizedGuess = songTitleGuess.toLowerCase();
		const normalizedAnswer = song.title.toLowerCase();

		const hintResult = getHint(normalizedGuess, normalizedAnswer);

		if (hintResult.correct) {
			state = 'CORRECT';
			handleCorrectGuess();
		} else {
			hint = hintResult.hint;
		}
	}

	// @ts-ignore
	function handleChange(event) {
		const input = event.target as HTMLInputElement;
		songTitleGuess = input.value;

		handleSubmit();
	}

	async function handleCorrectGuess() {
		stopCounter();
		const { data, error } = await supabaseClient.from('tune_twisters').insert([
			{
				env: process.env.NODE_ENV,
				session_id: sessionId,
				song_id: song.title,
				score: time,
				num_guesses: numGuesses
			}
		]);
	}

	function startCounter() {
		if (!timerStarted) {
			startTime = Date.now();
			interval = setInterval(() => {
				time = Date.now() - (startTime ?? 0);
			}, 10);
			timerStarted = true;
		}
		onGameStart();
	}

	function stopCounter() {
		if (!timerStarted) {
			return;
		}

		timerStarted = false;
		clearInterval(interval);
	}

	function handleGiveUp() {
		state = 'GAVE UP';
		stopCounter();
	}

	$: {
		console.log('new song', song);
		state = 'GUESSING';
		songTitleGuess = '';
		hint = '';
		time = 0;
		numGuesses = 0;
	}

	$: totalSeconds = Math.floor(time / 1000);
	$: minutes = Math.floor(totalSeconds / 60);
	$: seconds = totalSeconds % 60;
	$: milliseconds = time % 1000;

	async function getScores(songId: string, score: number) {
		const { data, error } = await supabaseClient
			.rpc('get_percentile_rank', {
				song_param: songId,
				env_param: process.env.NODE_ENV,
				score_param: score
			})
			.single();

		percentileRank = (100 - data.percentile_rank).toFixed(0);
	}
	$: {
		if (state === 'CORRECT') {
			getScores(song.title, time);
		}
	}
</script>

<article class="container">
	{#if state === 'GUESSING'}
		<div class="controls">
			<ReverseSong
				{song}
				onSongStart={() => {
					startCounter();
				}}
			/>
		</div>
		{#if timerStarted}
			<div class="guessing">
				<h2 class="header" data-text="What song is this?">What song is this?</h2>
				<form on:submit={handleSubmit} class="form">
					<input
						autofocus
						bind:this={inputElement}
						class="input"
						autocorrect={'off'}
						type="text"
						placeholder="Guess the song name ♪(๑ᴖ◡ᴖ๑)♪"
						value={songTitleGuess}
						on:input={handleChange}
						on:focus={startCounter}
					/>
					<Tuny message={hint} />
				</form>
				<Button onClick={handleGiveUp} variant="secondary">Give Up</Button>
			</div>
		{/if}
	{:else if state === 'GAVE UP'}
		<div class="gave-up-container">
			<div class="answer">
				<h2 class="text"><span class="label">Answer:</span> {song.title} by {song.artist}</h2>
			</div>
			<audio controls src={`/songs/${song.path}`} />
			<TunySmall message={'You gave up??'} />
			<Button
				variant="secondary"
				onClick={() => {
					handleNextSong();
				}}>Next Song</Button
			>
		</div>
	{:else}
		<div class="answer">
			<h2 class="text"><span class="label">Answer:</span> {song.title} by {song.artist}</h2>
		</div>
		<audio controls src={`/songs/${song.path}`} />
		<TunySmall message={'Nice! You guessed correct.'} />
		<p>
			You guessed faster than <span class="rank-container"
				><span class="rank">{percentileRank}%</span></span
			>
			({totalSeconds}.{milliseconds} seconds) of others
		</p>
		<Button
			variant="secondary"
			onClick={() => {
				handleNextSong();
			}}>Next Song</Button
		>
	{/if}

	{#if timerStarted && state !== 'GAVE UP'}
		<p class="stopwatch">
			{#if state !== 'GUESSING'}
				<span> Score: </span>
			{/if}

			{#each minutes.toString().padStart(2, '0') as digit}
				<SevenSegmentNumber number={parseInt(digit, 10)} />
			{/each}

			<span class="colon {minutes > 0 ? 'on' : 'off'}">
				<span />
				<span />
			</span>

			{#each seconds.toString().padStart(2, '0') as digit}
				<SevenSegmentNumber number={parseInt(digit, 10)} />
			{/each}
			<span class="dot">
				<span />
			</span>
			{#each milliseconds.toString().padStart(3, '0') as digit}
				<SevenSegmentNumber number={parseInt(digit, 10)} />
			{/each}
		</p>
	{/if}
</article>

<style>
	.header {
		font-family: Arial, sans-serif;
		font-weight: bold;
		background: linear-gradient(to bottom, #fafacc 0%, #f3919b 100%);
		font-size: 32px;
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.header::before {
		content: attr(data-text);
		position: absolute;
		z-index: -1;
		text-shadow: -0.01em 0em 0 #081a33, 0em -0.01em 0 #114491, -0.02em -0.01em 0 #081a33,
			-0.01em -0.02em 0 #114491, -0.03em -0.02em 0 #081a33, -0.02em -0.03em 0 #114491,
			-0.04em -0.03em 0 #081a33, -0.03em -0.04em 0 #114491, -0.05em -0.04em 0 #081a33,
			-0.04em -0.05em 0 #114491, -0.06em -0.05em 0 #081a33, -0.05em -0.06em 0 #114491,
			-0.07em -0.06em 0 #081a33, -0.06em -0.07em 0 #114491, -0.08em -0.07em 0 #081a33,
			-0.07em -0.08em 0 #114491;
	}

	.container {
		position: relative;
	}

	.controls {
		position: absolute;
		right: 0;
		z-index: 1;
	}

	.guessing {
		z-index: 5;
		display: flex;
		flex-direction: column;
		gap: 27px;
	}

	.stopwatch {
		margin-top: 14px;
		--background: black;
		--on-color: #00ff00;
		--off-color: #464646;

		background: var(--background);
		width: fit-content;
		height: 62px;
	}

	.colon {
		background: var(--background);
		width: 0px;
		height: 50px;
		display: inline-flex;
		flex-direction: column;
		gap: 18px;
		transform: translateY(-40px) translateX(-4px);
	}

	.colon span {
		display: block;
		border-radius: 50%;
		height: 8px;
		width: 8px;
		background: var(--off-color);
	}

	.colon.on span {
		background: var(--on-color);
	}

	.dot {
		background: var(--background);
		width: 0px;
		height: 50px;
		display: inline-flex;
		flex-direction: column;
		gap: 18px;
		transform: translateY(-7px) translateX(-10px);
	}

	.dot span {
		display: block;
		border-radius: 50%;
		height: 8px;
		width: 8px;
		background: var(--on-color);
	}

	.input {
		border: 3px solid gray;
		padding: 0 4px;
		width: 100%;
		font-size: 20px;
	}

	.answer {
		transform: scale(1, 1.3);
	}

	.answer .text {
		letter-spacing: -0.01em;
		font-family: Arial, sans-serif;
		font-weight: bold;
		font-style: italic;
		color: #fff;
		-webkit-text-stroke: 0.01em #000;
		text-shadow: 0.03em 0.03em 0 #6d6d6d;
		font-size: 24px;
	}

	.answer .label {
		color: lightgray;
	}

	.rank-container {
		font-weight: bold;
		display: inline-block;
		transform: skew(0, -15deg) scale(1.5, 1.5);
	}

	.rank-container .rank {
		font-family: Impact;
		background: #fdea00;
		background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJod…EiIGhlaWdodD0iMSIgZmlsbD0idXJsKCNncmFkLXVjZ2ctZ2VuZXJhdGVkKSIgLz4KPC9zdmc+);
		background: linear-gradient(to bottom, #ff1818 0%, #ffb700 44%, #fc2700 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>
