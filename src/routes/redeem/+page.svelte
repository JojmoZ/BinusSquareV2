<script lang="ts">
	import Header from './../Header.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
    console.log(data.user)
</script>

<div class="real-home">
	<div class="items-redeem">
        <div class="redeem-header">
            <h1>Items you Can Redeem</h1>
            <p class="point">{data.user.point} Points to spend</p>
        </div>
		<div class="redeem-container">
			{#if data.items.length > 0}
				{#each data.items as item}
					<div class="redeem-card">
						<img src={item.preview_img} alt={item.name} class="redeem-image" />
						<h2>{item.name}</h2>
						<p>Price: {item.price} pts</p>
						<p>Stock: {item.stock}</p>
						<button disabled={item.stock <= 0}>Redeem</button>
					</div>
				{/each}
			{:else}
				<p>No redeemable items available right now.</p>
			{/if}
		</div>
	</div>

	<div class="items-owned">
		<h1>Items you Own</h1>
		<div class="owned-container">
			<p>(Coming soon)</p>
		</div>
	</div>
</div>

<style>
    .redeem-header{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        /* background-color: #f0f0f0; */
        /* border-radius: 1rem; */
        /* margin-bottom: 1rem; */
    }
    .point{
        margin-left:4rem ;
        font-size: 1.9rem;
        position: absolute;
        font-weight: bold;
        right:2rem;
    }
.redeem-container {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1rem;
	padding: 1rem;
}

.redeem-card {
	background: #f9f9f9;
	padding: 1rem;
	border-radius: 1rem;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
	text-align: center;
}

.redeem-image {
	width: 100%;
	height: 150px;
	object-fit: cover;
	border-radius: 0.5rem;
	margin-bottom: 0.5rem;
}
</style>
