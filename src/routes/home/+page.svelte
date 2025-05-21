<script lang="ts">
	export let data: { username: string };
</script>

<div class="home">
	<h1>Hello, {data.username}! 👋</h1>
	<p>Welcome to your home page.</p>
    <a href="/logout">Logout</a>
</div>

<style>
	.home {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: linear-gradient(to bottom right, #a8e6cf, #5ca0d3);
		color: #333;
		font-family: 'Segoe UI', sans-serif;
	}
</style>
