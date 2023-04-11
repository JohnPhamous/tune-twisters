<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	export let message: string;

	const faces = [
		'♪(๑ᴖ◡ᴖ๑)♪',
		'♪(๑ಠ_ಠ๑)♪',
		'♪♪♪ ヽ( ᐖゞ)',
		'♪(๑ᴖ◡ᴖ๑)♪♫',
		'♪(๑ᴖ◡ᴖ๑)♫',
		'♫(๑ᴖ◡ᴖ๑)♫',
		'♫(๑ᴖ◡ᴖ๑)♪'
	];
	let intervalId;
	let face = faces[0];

	const setNewString = () => {
		const newIndex = Math.floor(Math.random() * faces.length);
		face = faces[newIndex];
	};

	onMount(() => {
		intervalId = setInterval(setNewString, 1000);
	});

	onDestroy(() => {
		clearInterval(intervalId);
	});
</script>

<p class="container">
	<span class="face">{face}</span>
	{#if message}
		<div class="message-container">
			<span class="message">{message}</span>
		</div>
	{/if}
</p>

<style>
	.container {
		margin-top: 8px;
		height: 72px;
		display: block;
	}

	.face {
		display: inline-block;
		transform: translateY(64px);
	}

	.message-container {
		position: absolute;
		height: 64px;
		width: 360px;
		top: 115px;
		display: flex;
		align-items: flex-end;
	}

	.message {
		display: inline-block;
		position: absolute;
		background: #eb20d9;
		border: 3px solid black;
		border-radius: 0.4em;
		color: black;
		padding: 4px 12px;
		max-width: 360px;
	}

	.message::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 38px;
		width: 0;
		height: 0;
		border: 11px solid transparent;
		border-top-color: #eb20d9;
		border-bottom: 0;
		border-left: 0;
		margin-bottom: -11px;
	}
</style>
