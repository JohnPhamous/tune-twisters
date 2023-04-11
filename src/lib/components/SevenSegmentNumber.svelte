<script>
	export let number = 0;

	const segments = [
		{ a: true, b: true, c: true, d: true, e: true, f: true, g: false }, // 0
		{ a: false, b: true, c: true, d: false, e: false, f: false, g: false }, // 1
		{ a: true, b: true, c: false, d: true, e: true, f: false, g: true }, // 2
		{ a: true, b: true, c: true, d: true, e: false, f: false, g: true }, // 3
		{ a: false, b: true, c: true, d: false, e: false, f: true, g: true }, // 4
		{ a: true, b: false, c: true, d: true, e: false, f: true, g: true }, // 5
		{ a: true, b: false, c: true, d: true, e: true, f: true, g: true }, // 6
		{ a: true, b: true, c: true, d: false, e: false, f: false, g: false }, // 7
		{ a: true, b: true, c: true, d: true, e: true, f: true, g: true }, // 8
		{ a: true, b: true, c: true, d: true, e: false, f: true, g: true } // 9
	];

	$: segment = segments[number];
</script>

<div class="segment-display">
	<div class="segmentWrap">
		<div class="segment sA {segment['a'] ? 'active' : ''}" />
		<div class="segment sB {segment['b'] ? 'active' : ''}" />
		<div class="segment sC {segment['c'] ? 'active' : ''}" />
		<div class="segment sD {segment['d'] ? 'active' : ''}" />
		<div class="segment sE {segment['e'] ? 'active' : ''}" />
		<div class="segment sF {segment['f'] ? 'active' : ''}" />
		<div class="segment sG {segment['g'] ? 'active' : ''}" />
	</div>
</div>

<style>
	.segment-display {
		--width: 18px;
		/* 16px */
		--height: calc(var(--width) / 5);
		--border-size: 2px;

		background-color: var(--background);
		height: calc(var(--height) * 16.25);
		width: calc(var(--width) * 2.25);
		position: relative;
		display: inline-block;
	}
	.segment {
		background-color: var(--off-color);
		height: var(--height);
		width: var(--width);
		position: absolute;
		display: inline-block;
	}
	.segment:after {
		content: '';
		border-top: var(--border-size) transparent solid;
		border-bottom: var(--border-size) transparent solid;
		border-left: var(--border-size) var(--off-color) solid;
		position: absolute;
		margin-left: var(--width);
	}

	.segment:before {
		content: '';
		border-top: var(--border-size) transparent solid;
		border-bottom: var(--border-size) transparent solid;
		border-right: var(--border-size) var(--off-color) solid;
		position: absolute;
		margin-left: calc(var(--border-size) * -1);
	}
	.sA {
		left: calc(var(--width) / 2);
		top: 4px;
	}

	.sB {
		transform: rotate(90deg);
		top: 16px;
		left: 21px;
	}

	.sC {
		transform: rotate(90deg);
		top: 38px;
		left: 21px;
	}

	.sD {
		left: 10px;
		top: 50px;
	}

	.sE {
		transform: rotate(90deg);
		top: 39px;
		left: -2px;
	}

	.sF {
		transform: rotate(90deg);
		top: 16px;
		left: -2px;
	}

	.sG {
		top: 27px;
		left: 9px;
	}

	/* Skews the segment display for realism */
	.segmentWrap {
		transform: skew(-5deg);
		margin-left: 4px;
	}

	/* Styling for the active segments */
	.active {
		background-color: var(--on-color);
	}

	.active:after,
	.active:before {
		border-right-color: var(--on-color);
		border-left-color: var(--on-color);
	}
</style>
