<script lang="ts">
	import type { ISong } from '../types';
	import ReverseSong from './ReverseSong.svelte';

	export let song: ISong;
</script>

<article>
	<h2>{song.title}</h2>
	<audio controls src={`/songs/${song.path}`} />
	<ReverseSong {song} />
	<input type="text" placeholder="Song Name" />
</article>
