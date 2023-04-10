<script lang="ts">
	import Song from '../lib/components/Song.svelte';
	import type { ISong } from '../lib/types';

	const songs: ISong[] = [
		{
			path: '/uptown-funk.mp3',
			title: 'Uptown Funk'
		},
		{
			path: '/uptown-funk.mp3',
			title: 'Sandstorm'
		}
		// {
		// 	path: '',
		// 	title: 'Song B'
		// },
		// {
		// 	path: '',
		// 	title: 'Song C'
		// }
	];

	let currentSong = 0;
	let isGameOver = false;
	let sessionId = getSessionId();

	function getSessionId() {
		const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			const r = (Math.random() * 16) | 0;
			const v = c === 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});

		return uuid;
	}

	function handleNextSong() {
		const nextSong = currentSong + 1;

		if (nextSong === songs.length) {
			isGameOver = true;
			return;
		}

		currentSong = nextSong;
	}

	function restart() {
		currentSong = 0;
		isGameOver = false;
		sessionId = getSessionId();
	}
</script>

<h1>Tune Twisters</h1>
<h2>Songs in reverse. Guess the song name as fast as you can.</h2>

<section class="flex flex-col gap-32 pt-36">
	{#if isGameOver}
		<h2>Game Over</h2>
		<button on:click={restart}>Play Again</button>
	{:else}
		<Song song={songs[currentSong]} {handleNextSong} {sessionId} />
	{/if}
</section>
