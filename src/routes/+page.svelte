<script lang="ts">
	import Song from '../lib/components/Song.svelte';
	import type { ISong } from '../lib/types';

	const songs: ISong[] = [
		{
			path: '/uptown-funk.mp3',
			title: 'Uptown Funk'
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
</script>

<h1>Tune Twisters</h1>
<h2>Songs in reverse. Guess the song name as fast as you can.</h2>

<section class="flex flex-col gap-32 pt-36">
	{#each songs as song}
		<Song {song} />
	{/each}
</section>
