<script lang="ts">
	import { supabaseClient } from '$lib/supabase';
	import { getHint } from '$lib/utils';
	import type { ISong } from '../types';
	import ReverseSong from './ReverseSong.svelte';

	export let song: ISong;
	export let sessionId: string;
	export let handleNextSong: () => void;

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
		// inputElement.focus();
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

<article>
	{#if state === 'GUESSING'}
		<ReverseSong
			{song}
			onSongStart={() => {
				startCounter();
			}}
		/>

		{#if timerStarted}
			<h2>What song is this?</h2>
			<form on:submit={handleSubmit}>
				<input
					autofocus
					type="text"
					placeholder="Guess the song name..."
					value={songTitleGuess}
					on:input={handleChange}
					on:focus={startCounter}
					bind:this={inputElement}
				/>
				{#if hint}
					<p>{hint}</p>
				{/if}
			</form>
			<button on:click={handleGiveUp}>Give Up</button>
		{/if}
	{:else if state === 'GAVE UP'}
		<h2>Answer: {song.title} by {song.artist}</h2>
		<audio controls src={`/songs/${song.path}`} />
		<h2>You gave up??</h2>
		<button
			on:click={() => {
				handleNextSong();
			}}>Next Song</button
		>
	{:else}
		<h2>You guessed right! The song was {song.title} by {song.artist}</h2>
		<p>
			You guessed faster than {percentileRank}% ({totalSeconds}.{milliseconds} seconds) of others
		</p>
		<audio controls src={`/songs/${song.path}`} />
		<button
			on:click={() => {
				handleNextSong();
			}}>Next Song</button
		>
	{/if}

	{#if timerStarted && state !== 'GAVE UP'}
		<p>
			{#if state !== 'GUESSING'}
				<span> Score: </span>
			{/if}
			<span>{minutes.toString().padStart(2, '0')}: </span>
			<span>{seconds.toString().padStart(2, '0')}. </span>
			<span>{milliseconds.toString().padStart(3, '0')}</span>
		</p>
	{/if}
</article>
