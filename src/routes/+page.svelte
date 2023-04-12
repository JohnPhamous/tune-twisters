<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import TunySmall from '$lib/components/TunySmall.svelte';
	import Song from '../lib/components/Song.svelte';
	import type { IScore, ISong } from '../lib/types';

	const ALL_SONGS: ISong[] = [
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
			artist: 'Luis Fonsi ft. Justin Bieber'
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
	const scores: IScore[] = [];

	const songs = ALL_SONGS.sort(() => Math.random() - 0.5);

	let currentSong = 0;
	let gameState: 'Landing' | 'Playing' | 'GameOver' = 'Landing';
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
			gameState = 'GameOver';
			return;
		}

		currentSong = nextSong;
	}

	function restart() {
		currentSong = 0;
		gameState = 'Landing';
		sessionId = getSessionId();
	}

	function onGameStart() {
		gameState = 'Playing';
	}

	function addScore(score: IScore) {
		scores.push(score);
	}
</script>

{#if gameState !== 'Playing' && gameState !== 'GameOver'}
	<h1 class="header" data-content="Tune Twisters">Tune Twisters</h1>
	<div class="subtitle-container">
		<h2 class="subtitle">Songs in reverse. Guess the song name as fast as you can.</h2>
	</div>
	<p class="edition">2010s Edition ✩♬ ₊˚.🎧⋆☾⋆⁺</p>
	<TunySmall message="Make sure your phone is not on mute!" />
{/if}

<section class="flex flex-col gap-32 pt-4">
	{#if gameState === 'GameOver'}
		<div>
			<h1 class="header" data-content="Tune Twisters">Tune Twisters</h1>
			<h2 class="game-over">Game Over</h2>
		</div>
		<div>
			<h3 class="edition">Scores</h3>
			{#each scores as score}
				<p class="score">
					{score.songTitle}: {score.score}
				</p>
			{/each}
		</div>
		<Button onClick={restart} variant="secondary">Play Again</Button>
	{:else}
		<Song song={songs[currentSong]} {handleNextSong} {sessionId} {onGameStart} {addScore} />
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

	.game-over {
		animation-name: example;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		font-size: 71px;
		font-family: Impact, sans-serif;
	}

	@keyframes example {
		0% {
			color: lime;
			text-shadow: 0 0 20px green;
		}
		25% {
			color: green;
			text-shadow: 2px 2px 2px lime;
			transform: translate(-2px, 1px);
		}
		40% {
			color: lime;
			text-shadow: none;
			transform: translate(0, 0);
		}
		50% {
			color: green;
			text-shadow: 5px 5px 2px blue, -5px -5px 2px red;
			transform: translate(0px, 5px);
		}
		70% {
			color: lime;
			text-shadow: none;
			transform: translate(0, 0);
		}
		80% {
			color: lime;
			text-shadow: 0 0 20px green;
			transform: translate(-2px, 1px);
		}
		100% {
			color: lime;
			text-shadow: none;
		}
	}
</style>
