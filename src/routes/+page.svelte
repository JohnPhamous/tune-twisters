<script lang="ts">
	import Song from '../lib/components/Song.svelte';
	import type { ISong } from '../lib/types';

	const songs: ISong[] = [
		{
			path: '/uptown-funk.mp3',
			title: 'Uptown Funk',
			artist: 'Mark Ronson ft. Bruno Mars'
		},
		{
			path: '/we-found-love.mp3',
			title: 'We Found Love',
			artist: 'Rihanna ft. Calvin Harris'
		},
		{
			path: '/blurred-lines.mp3',
			title: 'Blurred Lines',
			artist: 'Robin Thicke ft. Pharrell Williams'
		},
		{
			path: '/call-me-maybe.mp3',
			title: 'Call Me Maybe',
			artist: 'Carly Rae Jepsen'
		},
		{
			path: '/closer.mp3',
			title: 'Closer',
			artist: 'The Chainsmokers ft. Halsey'
		},
		{
			path: '/despacito.mp3',
			title: 'Despacito',
			artist: 'Luis Fonsi ft. Daddy Yankee'
		},
		{
			path: '/girls-like-you.mp3',
			title: 'Girls Like You',
			artist: 'Maroon 5 ft. Cardi B'
		},
		{
			path: '/old-town-road.mp3',
			title: 'Old Town Road',
			artist: 'Lil Nas X ft. Billy Ray Cyrus'
		},
		{
			path: '/party-rock-anthem.mp3',
			title: 'Party Rock Anthem',
			artist: 'LMFAO ft. Lauren Bennett & GoonRock'
		},
		{
			path: '/perfect.mp3',
			title: 'Perfect',
			artist: 'Ed Sheeran'
		},
		{
			path: '/rolling-in-deep.mp3',
			title: 'Rolling in the Deep',
			artist: 'Adele'
		},
		{
			path: '/shape-of-you.mp3',
			title: 'Shape of You',
			artist: 'Ed Sheeran'
		},
		{
			path: '/sicko-mode.mp3',
			title: 'Sicko Mode',
			artist: 'Travis Scott'
		},
		{
			path: '/somebody-that-i-used-to-know.mp3',
			title: 'Somebody That I Used to Know',
			artist: 'Gotye ft. Kimbra'
		},
		{
			path: '/sunflower.mp3',
			title: 'Sunflower',
			artist: 'Post Malone ft. Swae Lee'
		},
		{
			path: '/without-me.mp3',
			title: 'Without Me',
			artist: 'Halsey'
		}
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
<p>2010s Edition</p>

<section class="flex flex-col gap-32 pt-36">
	{#if isGameOver}
		<h2>Game Over</h2>
		<button on:click={restart}>Play Again</button>
	{:else}
		<Song song={songs[currentSong]} {handleNextSong} {sessionId} />
	{/if}
</section>
