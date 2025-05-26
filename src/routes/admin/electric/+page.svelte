<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	const { data, form } = $props<{
		data: { users: { id: string; username: string }[] };
		form: ActionData;
	}>();

	// Format today's date as YYYY-MM-DD
	const today = new Date().toISOString().split('T')[0];
</script>

<h1>Insert Electric Usage</h1>

<form method="POST" use:enhance>
	<label>
		User:
		<select name="userId" required>
			{#each data.users as user}
				<option value={user.id}>{user.username}</option>
			{/each}
		</select>
	</label>

	<label>
		Date:
		<input type="date" name="date" value={today} required />
	</label>

	<label>
		Watt Usage:
		<input type="number" name="watt" min="0" required />
	</label>

	<button type="submit">Insert</button>

	{#if form?.message}
		<p style="color: green">{form.message}</p>
	{/if}

	{#if form?.error}
		<p style="color: red">{form.error}</p>
	{/if}
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 400px;
		margin-top: 2rem;
	}
</style>
