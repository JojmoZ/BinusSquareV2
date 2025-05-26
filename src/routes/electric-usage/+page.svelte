<script lang="ts">
	import Header from './../Header.svelte';
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import type { PageData } from './$types';

	const { data } = $props() as { data: PageData };

	let filter = $state<'year' | 'month'>('year');
	let selectedYear = $state<string>(data.byYear[0]?.year.toString() ?? '');
	let selectedMonth = $state<string>(data.byMonth[0]?.label ?? '');

	let chartCanvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	const updateChart = () => {
		if (chart) chart.destroy();

		if (filter === 'year') {
			const yearData = data.byYear.find((y) => y.year.toString() === selectedYear);
			if (!yearData) return;

			chart = new Chart(chartCanvas, {
				type: 'bar',
				data: {
					labels: yearData.months.map((m) => m.label),
					datasets: [{
						label: 'Total KWh',
						data: yearData.months.map((m) => m.kwh),
						backgroundColor: '#4caf50'
					}]
				},
				options: {
					responsive: true,
					scales: {
						y: { beginAtZero: true }
					}
				}
			});
		} else {
			const monthData = data.byMonth.find((m) => m.label === selectedMonth);
			if (!monthData) return;

			const daysWithData = monthData.days.filter((d) => d.kwh > 0);
			chart = new Chart(chartCanvas, {
				type: 'bar',
				data: {
					labels: daysWithData.map((d) => d.label),
					datasets: [{
						label: 'Daily Wattage',
						data: daysWithData.map((d) => d.kwh),
						backgroundColor: '#2196f3'
					}]
				},
				options: {
					responsive: true,
					scales: {
						y: { beginAtZero: true }
					}
				}
			});
		}
	};

	$effect(() => {
	updateChart();
});
</script>

<div class="real-home">
	<div class="controls">
		<select bind:value={filter}>
			<option value="year">Year</option>
			<option value="month">Month</option>
		</select>

		{#if filter === 'year'}
			<select bind:value={selectedYear}>
				{#each data.byYear as y}
					<option value={y.year}>{y.year}</option>
				{/each}
			</select>
		{:else}
			<select bind:value={selectedMonth}>
				{#each data.byMonth as m}
					<option value={m.label}>{m.label}</option>
				{/each}
			</select>
		{/if}
	</div>

	<canvas bind:this={chartCanvas}></canvas>
</div>

<style>
.controls {
	display: flex;
	gap: 1rem;
	padding: 1rem;
	margin-bottom: 2rem;
}
canvas {
	max-width: 100%;
	max-height: 400px;
}
</style>
