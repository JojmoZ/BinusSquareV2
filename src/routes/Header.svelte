<script lang="ts">
	import { page } from '$app/stores';
	import logo from '$lib/images/binussquarelogo.svg';
	export let username: string | null;
</script>

<header>
	<div class="corner">
		<a href="/home">
			<img src={logo} alt="Binus Square" class="logo"/>
		</a>
	</div>
	<nav>
		<ul>
			{#if username === 'admin'}
			<li aria-current={$page.url.pathname === '/admin/electric' ? 'page' : undefined}>
				<a href="/admin/electric">Add Electric Usage</a>
			</li>
		{:else}
			<li aria-current={$page.url.pathname === '/electric-usage' ? 'page' : undefined}>
				<a href="/electric-usage">Electric Usage</a>
			</li>
		{/if}
		{#if username === 'admin'}
		<li aria-current={$page.url.pathname === '/admin/redeem' ? 'page' : undefined}>
			<a href="/admin/redeem">Add Redeem Item</a>
		</li>
		{:else}
		<li aria-current={$page.url.pathname === '/redeem' ? 'page' : undefined}>
			<a href="/redeem">Redeem</a>
		</li>
		{/if}
		{#if username === 'admin'}
		<li aria-current={$page.url.pathname === '/admin/laundry' ? 'page' : undefined}>
			<a href="/admin/laundry">Add Laundry History</a>
		</li>
		{:else}
		<li aria-current={$page.url.pathname === '/laundry-history' ? 'page' : undefined}>
			<a href="/laundry-history">Laundry History</a>
		</li>
		{/if}
		{#if username === 'admin'}
		<li aria-current={$page.url.pathname === '/admin/border' ? 'page' : undefined}>
			<a href="/admin/border">Add Border Creation </a>
		</li>
		{:else}
		<li aria-current={$page.url.pathname === '/border-history' ? 'page' : undefined}>
			<a href="/border-history">Border History</a>
		</li>

		{/if}
			<li>
				<a href="/logout">Logout</a>
			</li>
		</ul>
	</nav>
</header>

<style>
	.logo {
		height: 2.5rem;
		width: auto;
	}
header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 1rem;
	min-height: 3.5rem;
	height:auto;
	background: linear-gradient(to right,#35c98b, #56c596);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

	nav ul {
		display: flex;
		gap: 1.5rem;
		list-style: none;
		padding: 0;
		margin: 0;
		align-items: center;
	}

	nav li {
		position: relative;
	}

	nav li[aria-current='page']::after {
		content: '';
		position: absolute;
		bottom: -6px;
		left: 0;
		right: 0;
		height: 3px;
		background: var(--color-theme-1, #2196f3);
		border-radius: 2px;
	}

	nav a {
		text-decoration: none;
		color: var(--color-text, #333);
		font-weight: 600;
		transition: color 0.2s;
	}

	nav a:hover {
		color: var(--color-theme-1, #2196f3);
	}
</style>
