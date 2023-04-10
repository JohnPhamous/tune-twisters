<script>
	import '../app.css';

	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	inject({ mode: dev ? 'development' : 'production' });
</script>

<div class="max-w-lg mx-auto pt-6 px-4">
	<slot />
</div>
