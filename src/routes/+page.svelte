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

	function handleNextSong() {
		const nextSong = currentSong + 1;

		if (nextSong === songs.length) {
			isGameOver = true;
			return;
		}

		currentSong = nextSong;
	}
</script>

<h1>Tune Twisters</h1>
<h2>Songs in reverse. Guess the song name as fast as you can.</h2>

<section class="flex flex-col gap-32 pt-36">
	{#if isGameOver}
		<h2>Game Over</h2>
	{:else}
		<Song song={songs[currentSong]} {handleNextSong} />
	{/if}
</section>
