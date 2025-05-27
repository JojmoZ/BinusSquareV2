<script lang="ts">
    import Chart from 'chart.js/auto';
    import type { PageData } from './$types';
    const { data } = $props() as { data: PageData };
    
    let filter = $state<'year' | 'month'>('year');
    let totalWeight = $state<number>(0);
        let selectedYear = $state<string>('');
            $effect(() => {
                if (data.byYear.length && !selectedYear) {
                    const currentYear = new Date().getFullYear().toString();
                    const foundYear = data.byYear.find((y) => y.year.toString() === currentYear);
                    selectedYear = foundYear ? currentYear : data.byYear[0].year.toString();
                }
            });
            
    let chartCanvas: HTMLCanvasElement;
    let selectedMonth = $state<string>(data.byMonth[0]?.label ?? '');
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
                        label: 'Total Weight',
                        data: yearData.months.map((m) => m.kg),
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
            const yearData = data.byYear.find((y) => y.year.toString() === selectedYear.toString());
            totalWeight = yearData ? yearData.totalKg : 0;
        } else {
            const monthData = data.byMonth.find((m) => m.label === selectedMonth);
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
                            {#each data.byYear as year}
                                <option value={year.year.toString()}>{year.year}</option>
                            {/each}
                        </select>
                </div>    
                {:else}
                <div class="filter-group">
                    <label for="">Month</label>
                    <select bind:value={selectedMonth}>
                        {#each data.byMonth as month}
                            <option value={month.label}>{month.label}</option>
                        {/each}
                    </select>
                </div>
                {/if}
            </div>
        </div>
    </div>
            <canvas bind:this={chartCanvas}></canvas>
            <p class="total-weight">Total Weight: {totalWeight} kg</p>
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
    
    .total-weight {
        text-align: center;
        font-weight: bold;
        font-size: 1.2rem;
        margin-top: 1rem;
    }
    </style>
    