<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	let { form }: { form: ActionData } = $props();
    import logo from '$lib/images/binussquarelogo.svg';
</script>

<div class="bg">
	<div class="card">
        <img src={logo} alt="Binus Square" class="logo" />
		<h1 class="title">Forgot Password</h1>

		<form method="POST" use:enhance class="form">
			<label>
				<span>Username</span>
				<input name="username" required />
			</label>

			<label>
				<span>New Password</span>
				<input type="password" name="newPassword" required />
			</label>

			<label>
				<span>Confirm New Password</span>
				<input type="password" name="confirmPassword" required />
			</label>

			<button class="submit-btn">Reset Password</button>
            <div style="justify-content: center; display: flex; margin-top: 1rem;">
                <p>Remembered your password? <a href="/login">Login</a></p>
            </div>
			{#if form?.message}
				<p class="error">{form.message}</p>
			{/if}
		</form>
	</div>
</div>

<style>
    .logo {
        width: 150px;
        margin-bottom: 1rem;
	}
	.bg {
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background: linear-gradient(180deg, #a8e6cf 0%, #87d3e5 50%, #5ca0d3 100%);
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
	}
	input {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 6px;
	}
	.submit-btn {
		padding: 0.5rem;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
	}
    .submit-btn {
		background: #4caf50;
	}

	.submit-btn:hover {
		background: #43a047;
	}
	.error {
		color: red;
		text-align: center;
	}
</style>
