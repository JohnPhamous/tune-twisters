<!-- ReversedAudio.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { ISong } from '../types';

	export let song: ISong;
	export let onSongStart: () => void;

	let audioBuffer;
	let reversedBuffer;
	let isPlaying = false;
	let sourceNode: AudioBufferSourceNode;

	onMount(async () => {
		try {
			const response = await fetch(`/songs/${song.path}`);
			const arrayBuffer = await response.arrayBuffer();
			audioBuffer = await new AudioContext().decodeAudioData(arrayBuffer);
			const channels = audioBuffer.numberOfChannels;
			const length = audioBuffer.length;
			reversedBuffer = new AudioBuffer({
				numberOfChannels: channels,
				length: length,
				sampleRate: audioBuffer.sampleRate
			});

			for (let channel = 0; channel < channels; channel++) {
				const source = audioBuffer.getChannelData(channel);
				const destination = reversedBuffer.getChannelData(channel);

				for (let i = 0; i < length; i++) {
					destination[i] = source[length - i - 1];
				}
			}

			const audioContext = new AudioContext();
			sourceNode = audioContext.createBufferSource();
			sourceNode.buffer = reversedBuffer;
			sourceNode.loop = true;

			sourceNode.connect(audioContext.destination);
		} catch (err) {
			console.error(`Error loading audio: ${err}`);
		}
	});

	onDestroy(() => {
		pause();
	});

	function play() {
		if (!sourceNode) {
			return;
		}
		onSongStart();
		// Create a new audio buffer source node and set the buffer as its source
		const audioContext = new AudioContext();
		sourceNode = audioContext.createBufferSource();
		sourceNode.buffer = reversedBuffer;
		sourceNode.connect(audioContext.destination);
		sourceNode.loop = true;

		sourceNode.start();
		sourceNode.onended = () => {
			isPlaying = false;
		};
		isPlaying = true;
	}
	function pause() {
		if (!sourceNode || sourceNode.onended === null) {
			return;
		}

		sourceNode.stop();
		isPlaying = false;
	}
</script>

<div>
	{#if isPlaying}
		<button on:click={pause}>Stop</button>
	{:else}
		<button on:click={play}>Play</button>
	{/if}
</div>
