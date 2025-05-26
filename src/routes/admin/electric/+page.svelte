<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	const { data, form } = $props<{
		data: { users: { id: string; username: string }[] };
		form: ActionData;
	}>();

	const today = new Date().toISOString().split('T')[0];
</script>
<div class="real-home">
    <div class="container">

        <h1 class="form-title">Insert Electric Usage</h1>

    <form method="POST" use:enhance class="electric-form">
        <div class="form-group">
            <label for="userId">User</label>
            <select name="userId" id="userId" required>
                {#each data.users as user}
                    <option value={user.id}>{user.username}</option>
                {/each}
            </select>
        </div>
    
        <div class="form-group">
            <label for="date">Date</label>
            <input type="date" name="date" id="date" value={today} required />
        </div>
    
        <div class="form-group">
            <label for="watt">Watt Usage (kWh)</label>
            <input type="number" name="watt" id="watt" min="0" required />
        </div>
    
        <button type="submit" class="submit-button">Insert</button>
    
        {#if form?.message}
            <p class="success-message">{form.message}</p>
        {/if}
    
        {#if form?.error}
            <p class="error-message">{form.error}</p>
        {/if}
    </form>
    
    </div>
    
</div>


<style>
    .form-title {
        text-align: center;
        margin-bottom: 1.5rem;
        font-size: 1.75rem;
        color: #333;
    }
    .real-home{
        min-height:100vh;
        display: flex;
        justify-content: center;    
        align-items: center;
    }
    .electric-form {
        background: linear-gradient(135deg, #f5f7fa, #e8edf3);
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        max-width: 480px;
        margin: 2rem auto;
    }
    
    .form-group {
        display: flex;
        flex-direction: column;
    }
    
    label {
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #2c3e50;
    }
    
    input,
    select {
        padding: 0.6rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 0.5rem;
        transition: border-color 0.2s;
    }
    
    input:focus,
    select:focus {
        outline: none;
        border-color: #4a90e2;
    }
    
    .submit-button {
        padding: 0.75rem;
        font-size: 1rem;
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    
    .submit-button:hover {
        background-color: #43a047;
    }
    
    .success-message {
        color: #2e7d32;
        text-align: center;
        font-weight: 500;
    }
    
    .error-message {
        color: #c62828;
        text-align: center;
        font-weight: 500;
    }
    </style>