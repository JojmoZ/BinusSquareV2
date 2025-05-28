<script lang="ts">
	import Chart from 'chart.js/auto';
	import type { PageData } from './$types'; 
	const { data } = $props() as { data: PageData }; 
	
	let filter = $state<'year' | 'month'>('year');
	let totalWeight = $state<number>(0);
	let selectedYear = $state<string>('');
	
    
    
    
	$effect(() => {
		if (data.byYear && data.byYear.length && !selectedYear) {
			const currentYear = new Date().getFullYear().toString();
			const foundYear = data.byYear.find((y) => y.year.toString() === currentYear);
			selectedYear = foundYear ? currentYear : data.byYear[0].year.toString();
		} else if ((!data.byYear || data.byYear.length === 0) && selectedYear !== '') {
            
            selectedYear = '';
        }
	});

    
	let selectedMonth = $state<string>(data.byMonth?.[0]?.label ?? '');

	let chartCanvas: HTMLCanvasElement;
	let chart: Chart | null = null;

    
	const updateChart = () => {
        
		if (!chartCanvas || !data.byYear || data.byYear.length === 0) {
            if(chart) chart.destroy(); 
            chart = null;
            return;
        }

		if (chart) chart.destroy(); 

		if (filter === 'year') {
			const yearData = data.byYear.find((y) => y.year.toString() === selectedYear.toString());
			if (!yearData) return; 

			chart = new Chart(chartCanvas, {
				type: 'bar',
				data: {
					labels: yearData.months.map((m) => m.label),
					datasets: [{
						label: 'Total Weight',
						data: yearData.months.map((m) => m.kg), 
						backgroundColor: '#4caf50'
					}]
				},
				options: {
					responsive: true,
                    maintainAspectRatio: false,
					scales: {
						y: { beginAtZero: true }
					}
				}
			});
		} else { 
			const monthData = data.byMonth.find((m) => m.label === selectedMonth);
			if (!monthData) return; 

			const daysWithData = monthData.days.filter((d) => d.kg > 0); 
			chart = new Chart(chartCanvas, {
				type: 'bar',
				data: {
					labels: daysWithData.map((d) => d.label),
					datasets: [{
						label: 'Daily Weight',
						data: daysWithData.map((d) => d.kg), 
						backgroundColor: '#2196f3'
					}]
				},
				options: {
					responsive: true,
                    maintainAspectRatio: false,
					scales: {
						y: { beginAtZero: true }
					}
				}
			});
		}
	};
	
    
	$effect(() => {
        
        if (data.byYear && data.byYear.length > 0) {
		    updateChart();
        } else {
            
            if (chart) {
                chart.destroy();
                chart = null;
            }
        }

		if (filter === 'year') {
			const yearData = data.byYear?.find((y) => y.year.toString() === selectedYear);
			
			totalWeight = yearData ? yearData.totalKg : 0; 
		} else { 
			const monthData = data.byMonth?.find((m) => m.label === selectedMonth);
            
			totalWeight = monthData ? monthData.totalKg : 0;
		}
	});
</script>

<div class="real-home">
	<div class="card-container">
		<div class="filter-card">
			<h2 class="title">Laundry History</h2>
			<div class="filters">
				<div class="filter-group">
					<label for="laundryViewBySelect">View By</label> 
					<select id="laundryViewBySelect" bind:value={filter}>
						<option value="year">Year</option>
						<option value="month">Month</option>
					</select>
				</div>

                {#if filter === 'year'}
					{#if data.byYear && data.byYear.length > 0}
						<div class="filter-group">
							<label for="laundryYearSelect">Year</label>
							<select id="laundryYearSelect" bind:value={selectedYear}>
								{#each data.byYear as y}
									<option value={y.year.toString()}>{y.year}</option>
								{/each}
							</select>
						</div>
					{:else}
                        <div class="filter-group">
                            <label for="laundryYearSelect">Year</label>
                            <select id="laundryYearSelect" disabled><option>N/A</option></select>
                        </div>
                    {/if}
				{:else}
                    {#if data.byMonth && data.byMonth.length > 0}
                        <div class="filter-group">
                            <label for="laundryMonthSelect">Month</label>
                            <select id="laundryMonthSelect" bind:value={selectedMonth}>
                                {#each data.byMonth as m}
                                    <option value={m.label}>{m.label}</option>
                                {/each}
                            </select>
                        </div>
                    {:else}
                         <div class="filter-group">
                            <label for="laundryMonthSelect">Month</label>
                            <select id="laundryMonthSelect" disabled><option>N/A</option></select>
                        </div>
                    {/if}
				{/if}
			</div>
		</div>
	</div>

    {#if data.byYear && data.byYear.length > 0}
		<div class="chart-wrapper">
			<canvas bind:this={chartCanvas}></canvas>
		</div>
		<p class="total-weight"> 
			Total Weight: {totalWeight.toFixed(2)} kg
		</p>
	{:else}
		<p class="no-data-message">There is no data to show yet.</p>
	{/if}
</div>

<style>
	.real-home {
		max-width: 100vw;
		min-height: 100vh;
		margin: 0 auto;
		padding: 1.5rem;
		box-sizing: border-box; 
	}
	.card-container {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 2rem;
		flex-wrap: wrap;
		margin-bottom: 1.5rem; 
	}
	.title {
		font-weight: bold;
        font-size: 1.25rem; 
	}
	.filter-card {
		background: white;
        min-width: 300px; 
        max-width: 500px; 
        width: auto; 
		padding: 1.5rem; 
		border-radius: 1rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); 
	}
	
	.filter-card h2 {
		margin-top: 0; 
		margin-bottom: 1.5rem; 
		text-align: center;
	}
	
	.filters {
		display: flex;
		gap: 1.5rem; 
		flex-wrap: wrap;
		justify-content: center;
	}
	
	.filter-group {
		display: flex;
		flex-direction: column;
		min-width: 150px; 
	}
	
	.filter-group label {
		font-weight: bold;
		margin-bottom: 0.5rem; 
		font-size: 0.9rem; 
		color: #333; 
	}
	
	select {
		padding: 0.75rem; 
		border: 1px solid #ccc;
		border-radius: 0.5rem;
		font-size: 1rem;
		background-color: #f9f9f9; 
		cursor: pointer;
	}

    select:disabled {
        background-color: #e9ecef;
        cursor: not-allowed;
    }
	
	.chart-wrapper {
		width: 100%;
		max-width: 800px; 
		height: 400px; 
		margin: 0 auto 1rem auto; 
		background-color:white;
		padding:1rem; 
		border-radius: 0.75rem; 
		box-shadow: 0 2px 8px rgba(0,0,0,0.05); 
	}

	canvas {
		width: 100% !important; 
		height: 100% !important;
	}
	
	.total-weight { 
		text-align: center;
		font-weight: bold;
		font-size: 1.25rem; 
		margin-top: 1rem;
		color: #333; 
	}

    .no-data-message {
        text-align: center;
        font-size: 1.1rem;
        color: #555;
        padding: 2rem;
        background-color: #f9f9f9;
        border-radius: 0.75rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        margin: 2rem auto;
        max-width: 400px;
    }
</style>
