<script lang="ts">
	import Header from './Header.svelte';
	import '../app.css';
	import { page } from '$app/stores';
	let { data, children } = $props();
</script>

<div class="app">
	{#if $page.url.pathname !== '/login' && $page.url.pathname !== '/register' && $page.url.pathname !== '/forgot-password' }
	<Header username={data.username} />
{/if}

	<main>
		{@render children()}
	</main>

	<footer>

	</footer>
</div>

<style>
 
</style>
