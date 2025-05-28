<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';

	let { data }: { data: PageData } = $props();
	let search = $state<string>('');
	let beforeDate = $state<string>('');
	let afterDate = $state<string>('');
	let onlyMine = $state<boolean>(false); 
		let filtered = $derived(() => {
		return data.creations.filter((item) => {
			const matchSearch =
				item.title.toLowerCase().includes(search.toLowerCase()) ||
				item.username.toLowerCase().includes(search.toLowerCase());

			const date = dayjs(item.createdAt);
			const after = afterDate ? date.isAfter(dayjs(afterDate)) : true;
			const before = beforeDate ? date.isBefore(dayjs(beforeDate)) : true;
			const mine = onlyMine ? item.userId === data.user.id : true;

			return matchSearch && after && before && mine;
		});
	});
</script>

<div class="real-home">
	<div class="filters">
		<label>
			Search by User:
			<input type="text" bind:value={search} placeholder="Search by title or user..." />
		</label>
		<label>
			After:
			<input type="date" bind:value={afterDate} />
		</label>
		<label>
			Before:
			<input type="date" bind:value={beforeDate} />
		</label>
		<label class="checkbox-toggle">
			<input type="checkbox" bind:checked={onlyMine} />
			<span class="slider"></span>
			<span class="label-text">Only My Creations</span>
		</label>
		
	</div>
	

	<div class="card-container">
		{#each filtered() as item}
			<div class="card">
				<h3>{item.title}</h3>
				<p><strong>User:</strong> {item.username}</p>
				<p><strong>Category:</strong> {item.category}</p>
				<p><strong>Date:</strong> {new Date(item.createdAt).toLocaleDateString()}</p>
				{#if item.file}
					<a class="file-link" href={item.file} target="_blank">View File</a>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.filters {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 1rem;
		justify-content: center;
	}
	input[type="text"], input[type="date"] {
		padding: 0.5rem;
		border-radius: 6px;
		border: 1px solid #ccc;
		font-size: 1rem;
	}
	.card-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
		padding: 2rem;
	}
	.card {
		background: white;
		border-radius: 10px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		padding: 1rem;
		text-align: left;
	}
	.card h3 {
		margin-bottom: 0.5rem;
	}
	.file-link {
		display: inline-block;
		margin-top: 0.5rem;
		color: #007bff;
		text-decoration: underline;
	}
	.filters {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	gap: 1rem;
	background-color: #f9f9f9;
	padding: 1rem 2rem;
	border-radius: 12px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	margin: 2rem auto;
	max-width: 900px;
}

.filters label {
	display: flex;
	flex-direction: column;
	font-size: 0.9rem;
	color: #333;
	gap: 0.25rem;
}

.filters input[type="text"],
.filters input[type="date"] {
	padding: 0.5rem 0.75rem;
	border-radius: 8px;
	border: 1px solid #ccc;
	font-size: 1rem;
	min-width: 180px;
	box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
}

.filters input[type="checkbox"] {
	margin-right: 0.5rem;
}

.filters label:last-child {
	flex-direction: row;
	align-items: center;
	gap: 0.5rem;
	font-weight: bold;
}
.checkbox-toggle {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	position: relative;
	font-weight: bold;
	cursor: pointer;
	user-select: none;
}

.checkbox-toggle input[type="checkbox"] {
	opacity: 0;
	width: 0;
	height: 0;
	position: absolute;
}

.checkbox-toggle .slider {
	width: 40px;
	height: 20px;
	background-color: #ccc;
	border-radius: 20px;
	position: relative;
	transition: background-color 0.3s ease;
}

.checkbox-toggle .slider::before {
	content: "";
	position: absolute;
	width: 16px;
	height: 16px;
	left: 2px;
	top: 2px;
	background-color: white;
	border-radius: 50%;
	transition: transform 0.3s ease;
}

.checkbox-toggle input[type="checkbox"]:checked + .slider {
	background-color: #4caf50;
}

.checkbox-toggle input[type="checkbox"]:checked + .slider::before {
	transform: translateX(20px);
}

.checkbox-toggle .label-text {
	font-size: 0.95rem;
}

</style>
