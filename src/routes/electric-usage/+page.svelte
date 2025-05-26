<script lang="ts">
	import Header from './../Header.svelte';
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import type { PageData } from './$types';
	const { data } = $props() as { data: PageData };

	let filter = $state<'year' | 'month'>('year');
    let totalKwh = $state<number>(0);
	let selectedYear = $state<string>('');
        $effect(() => {
	if (data.byYear.length && !selectedYear) {
		const currentYear = new Date().getFullYear().toString();
		const foundYear = data.byYear.find((y) => y.year.toString() === currentYear);
		selectedYear = foundYear ? currentYear : data.byYear[0].year.toString();
	}
});

	let selectedMonth = $state<string>(data.byMonth[0]?.label ?? '');

	let chartCanvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	const updateChart = () => {
		if (chart) chart.destroy();

		if (filter === 'year') {
			const yearData = data.byYear.find((y) => y.year.toString() === selectedYear.toString());
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
    if (filter === 'year') {
		const yearData = data.byYear.find((y) => y.year.toString() === selectedYear);
		totalKwh = yearData
			? yearData.months.reduce((sum, m) => sum + m.kwh, 0)
			: 0;
	} else {
		const monthData = data.byMonth.find((m) => m.label === selectedMonth);
		totalKwh = monthData
			? monthData.days.reduce((sum, d) => sum + d.kwh, 0)
			: 0;
	}
});
</script>

<div class="real-home">
    <div class="card-container">

        <div class="filter-card">
            <h2 class="title">Electricity Usage Filter</h2>
            <div class="filters">
                <div class="filter-group">
                    <label for="">View By</label>
                    <select bind:value={filter}>
                        <option value="year">Year</option>
                        <option value="month">Month</option>
                    </select>
                </div>
    
                {#if filter === 'year'}
                    <div class="filter-group">
                        <label for="">Year</label>
                        <select bind:value={selectedYear}>
                            {#each data.byYear as y}
                                <option value={y.year.toString()}>{y.year}</option>
                            {/each}
                        </select>
                    </div>
                {:else}
                    <div class="filter-group">
                        <label for="">Month</label>
                        <select bind:value={selectedMonth}>
                            {#each data.byMonth as m}
                                <option value={m.label}>{m.label}</option>
                            {/each}
                        </select>
                    </div>
                {/if}
            </div>
        </div>
    </div>

	<canvas bind:this={chartCanvas}></canvas>

	<p class="total-wattage">
		Total Wattage: {totalKwh} kWh
	</p>
</div>

<style>
    .real-home {
        max-width: 100vw;
        min-height: 100vh;
        margin: 0 auto;
        padding: 1.5rem;
    }
    .card-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2rem;
        flex-wrap: wrap;
    }
    .title{
        font-weight: bold;
    }
    .filter-card {
        background: white;
        width: 30%;
        padding: 1rem;
        border-radius: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
    }
    
    .filter-card h2 {
        margin-bottom: 1rem;
        text-align: center;
    }
    
    .filters {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .filter-group {
        display: flex;
        flex-direction: column;
        min-width: 120px;
    }
    
    .filter-group label {
        font-weight: bold;
        margin-bottom: 0.25rem;
    }
    
    select {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 0.5rem;
        font-size: 1rem;
    }
    
    canvas {
        max-width: 100%;
        background-color:white;
        padding:2rem;
        max-height: 400px;
    }
    
    .total-wattage {
        text-align: center;
        font-weight: bold;
        font-size: 1.2rem;
        margin-top: 1rem;
    }
    </style>
    