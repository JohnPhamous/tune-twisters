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

<h1 class="header" data-content="Tune Twisters">Tune Twisters</h1>
<div class="subtitle-container">
	<h2 class="subtitle">Songs in reverse. Guess the song name as fast as you can.</h2>
</div>
<p class="edition">2010s Edition ✩♬ ₊˚.🎧⋆☾⋆⁺</p>

<section class="flex flex-col gap-32 pt-12">
	{#if isGameOver}
		<h2>Game Over</h2>
		<button on:click={restart} class="button">Play Again</button>
	{:else}
		<Song song={songs[currentSong]} {handleNextSong} {sessionId} />
	{/if}
</section>

<style>
	.header {
		font-weight: 900;
		color: transparent;
		background: linear-gradient(
			to left,
			#a104ad,
			#0b2be0,
			#329941,
			#f7f658,
			#f16412,
			#e92153,
			#aa04a7
		);
		-webkit-text-fill-color: transparent;
		-webkit-text-stroke: 0.016em #eaeaea;
		-webkit-background-clip: text;
		background-clip: text;
		letter-spacing: 0.1rem;
		font-size: 42px;
		font-family: Impact, sans-serif;
	}

	.header::before {
		position: absolute;
		content: attr(data-content);
		z-index: -1;
		color: #cdcdcd;
		-webkit-text-fill-color: #777777;
		-webkit-text-stroke: transparent;
		transform: rotateX(63deg) skew(60deg) scaleY(0.65) translate3d(2em, -2.15em, -1em);
	}

	.subtitle {
		color: #24c0fd;
		-webkit-text-stroke: 0.01em #0000aa;
		text-shadow: 0.03em -0.13em 0.1px #0000aa;
		letter-spacing: -0.05em;
		font-size: 32px;
		font-family: Impact, sans-serif;
		font-weight: bold;
	}

	.edition {
		border: 3px dashed blue;
		width: fit-content;
		padding: 0 4px;
		color: blue;
		font-size: 24px;
	}
</style>
