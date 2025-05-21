<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import logo from '$lib/images/binussquarelogo.svg';

	let { form }: { form: ActionData } = $props();
</script>

<div class="bg">
	<div class="card">
		<img src={logo} alt="Binus Square" class="logo" />
		<h1 class="title">Register</h1>

		<form method="post" use:enhance class="form">
			<label>
				<span>Username</span>
				<input name="username" required />
			</label>

			<label>
				<span>Password</span>
				<input type="password" name="password" required />
			</label>

			<div class="actions">
				<button class="register-btn">Register</button>
			</div>

			<div style="justify-content: center; display: flex; margin-top: 1rem;">
				<p>Already have an account? <a href="/login">Login</a></p>
			</div>

			{#if form?.message}
				<p class="error">{form.message}</p>
			{/if}
		</form>
	</div>
</div>
<style>
	.bg {
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background: linear-gradient(180deg, #a8e6cf 0%, #87d3e5 50%, #5ca0d3 100%);
		padding: 2rem;
	}

	.card {
		background: white;
		border-radius: 12px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
		padding: 2rem;
		width: 100%;
		max-width: 400px;
		text-align: center;
	}

	.logo {
		width: 150px;
		margin-bottom: 1rem;
	}

	.title {
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		text-align: left;
	}

	label {
		display: flex;
		flex-direction: column;
		font-size: 0.9rem;
	}

	input {
		margin-top: 0.25rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid #ccc;
		border-radius: 6px;
	}

	.actions {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.register-btn {
		flex: 1;
		padding: 0.5rem;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		color: white;
		font-weight: bold;
		transition: background 0.3s;
	}

	.register-btn {
		background: #4caf50;
	}

	.register-btn:hover {
		background: #43a047;
	}

	.error {
		color: red;
		text-align: center;
		margin-top: 0.5rem;
	}
</style>
