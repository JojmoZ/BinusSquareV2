<script lang="ts">
	import Header from './../Header.svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<div class="real-home">
    <Header />
    <div class="home">
        <div class="card">
            <div class="top-row">
                <div class="title">Pengeluaran</div>
                <select class="dropdown">
                    <option>Bulan Februari</option>
                    <!-- add more months -->
                </select>
            </div>

            <div class="info-row">
                <strong>xx Kwh</strong>
                <span class="badge">30%</span>
            </div>

            <div class="bar-chart">
                <div class="bar" style="height: 70%"></div>
                <div class="bar" style="height: 30%"></div>
                <div class="bar" style="height: 70%"></div>
                <div class="bar" style="height: 40%"></div>
                <div class="bar" style="height: 100%"></div>
            </div>

            <div class="bar-labels">
                <span>17</span>
                <span>18</span>
                <span>19</span>
                <span>20</span>
                <span>21</span>
            </div>
        </div>
    </div>
</div>

<style>
.home {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
}

.card {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    width: 300px;
}

.top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.title {
    font-weight: 500;
}

.dropdown {
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid #ccc;
    font-size: 0.85rem;
}

.info-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.25rem;
    margin-bottom: 1.25rem;
}

.badge {
    background-color: red;
    color: white;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
}

.bar-chart {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    height: 150px;
    margin-bottom: 0.5rem;
    gap: 0.25rem;
}

.bar {
    background-color: lightgray;
    width: 10px;
    border-radius: 4px;
}

.bar-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: #333;
}
</style>
