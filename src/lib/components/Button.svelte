<script lang="ts">
	export let disabled: boolean = false;
	export let variant: 'primary' | 'secondary' = 'primary';
	export let ariaLabel = '';
	export let onClick: (event: MouseEvent) => void = () => {};

	const handleClick = (event: MouseEvent) => {
		if (!disabled) {
			onClick(event);
		}
	};

	let className: string = `button ${variant}`;

	$: className += disabled ? ' disabled' : '';
</script>

<button class={className} on:click={handleClick} aria-label={ariaLabel}><slot /></button>

<style>
	.button {
		font-size: 1rem;
		padding: 0.5rem 1rem;
		cursor: pointer;
		transition: background-color 0.2s ease-out, color 0.2s ease-out;
		font-size: 24px;
	}

	.primary {
		border: 5px solid darkgray;
		background: black;
		color: yellow;
		border-radius: 50%;
		aspect-ratio: 1/1;
		height: 66px;
		width: 66px;
	}

	.secondary {
		font-size: 18px;
		color: white;
		font-weight: 800;
		text-transform: uppercase;
		border: 6px solid darkred;
		background: red;
		border-top-color: lightcoral;
		border-right-color: lightcoral;
	}

	.disabled {
		background-color: #e9ecef;
		color: #868e96;
		cursor: not-allowed;
	}
</style>
