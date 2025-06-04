<script lang="ts">
	import Header from './../Header.svelte';
    import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
    let showModal = $state<boolean>(false);
    let selectedItem = $state<{ id: number; name: string; price: number } | null>(null);
    let feedback=  $state<string | null>(null);
    let redeemSearch = $state('');
    let ownedSearch = $state('');

    let redeemSort = $state<'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'>('name-asc');
    let ownedSort = $state<'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'>('name-asc');
    let availabilityFilter = $state<'all' | 'available' | 'sold-out'>('all');
    let filteredRedeemItems = $derived(() => {
	const list = [...data.items];

	let filtered = list.filter((item) =>
		item.name.toLowerCase().includes(redeemSearch.toLowerCase())
	);
	if (availabilityFilter === 'available') {
		filtered = filtered.filter(item => item.stock > 0);
	} else if (availabilityFilter === 'sold-out') {
		filtered = filtered.filter(item => item.stock <= 0);
	}
	switch (redeemSort) {
		case 'price-asc':
			filtered.sort((a, b) => a.price - b.price);
			break;
		case 'price-desc':
			filtered.sort((a, b) => b.price - a.price);
			break;
		case 'name-desc':
			filtered.sort((a, b) => b.name.localeCompare(a.name));
			break;
		default:
			filtered.sort((a, b) => a.name.localeCompare(b.name));
	}

	return filtered;
});
let groupedOwnedItems = $derived(() => {
	const grouped = Object.values(
		(data.ownedItems || []).reduce((acc: Record<number, OwnedItem & { quantity: number }>, item: OwnedItem) => {
			if (!acc[item.id]) acc[item.id] = { ...item, quantity: 1 };
			else acc[item.id].quantity++;
			return acc;
		}, {})
	);

	let filtered = grouped.filter((item) =>
		item.name.toLowerCase().includes(ownedSearch.toLowerCase())
	);

	switch (ownedSort) {
		case 'price-asc':
			filtered.sort((a, b) => a.price - b.price);
			break;
		case 'price-desc':
			filtered.sort((a, b) => b.price - a.price);
			break;
		case 'name-desc':
			filtered.sort((a, b) => b.name.localeCompare(a.name));
			break;
		default:
			filtered.sort((a, b) => a.name.localeCompare(b.name));
	}

	return filtered;
});

    function openRedeemModal(itemId: number, itemName: string, itemPrice: number) {
	selectedItem = { id: itemId, name: itemName, price: itemPrice };
	showModal = true;
}
async function confirmRedeem() {
    if (!selectedItem) return;

    const form = new FormData();
    form.append("itemId", selectedItem.id.toString());

    const res = await fetch("?/redeemItem", {
        method: "POST",
        body: form
    });
    const result = await res.json();

    if (result?.error) {
        feedback = result.error;
    } else {
        feedback = result.message; 
        await invalidateAll();
    }

    showModal = false;
    selectedItem = null;
}
type OwnedItem = { id: number; name: string; price: number; preview_img: string };


</script>
<div class="real-home">
	<div class="items-redeem">
        <div class="redeem-header">
            <h1>Items you Can Redeem</h1>
            <p class="point">{data.user.point} Points to spend</p>
        </div>
        <div class="filter-bar">
            <input class="search-bar" type="text" placeholder="Search items..." bind:value={redeemSearch} />
            <div>
                <select bind:value={redeemSort}>
                    <option value="name-asc">Name (A–Z)</option>
                    <option value="name-desc">Name (Z–A)</option>
                    <option value="price-asc">Price (Low–High)</option>
                    <option value="price-desc">Price (High–Low)</option>
                </select>
                <select bind:value={availabilityFilter}>
                    <option value="all">All</option>
                    <option value="available">Available</option>
                    <option value="sold-out">Sold Out</option>
                </select>
            </div>
        </div>
		<div class="redeem-container">
			{#if data.items.length > 0}
            {#each filteredRedeemItems() as item}
            <div class="redeem-card {item.stock <= 0 ? 'sold-out' : ''}">
                <div class="image-wrapper">
                    <img src={item.preview_img} alt={item.name} class="redeem-image" />
                    {#if item.stock <= 0}
                        <div class="sold-out-banner">SOLD OUT</div>
                    {/if}
                </div>
                <h2>{item.name}</h2>
                <p>Price: <b>{item.price} pts</b> </p>
                <p>Stock: <b>{item.stock}</b> </p>
                <button
	class="redeem-button {data.user.point < item.price && item.stock > 0  ? 'red-button' : ''}"
	onclick={() => openRedeemModal(item.id, item.name, item.price)}
	disabled={item.stock <= 0 || data.user.point < item.price}
>
	Redeem
</button>

            </div>
        {/each}
        
			{:else}
				<p class="nothing">No redeemable items available right now.</p>
			{/if}
		</div>
	</div>

	<div class="items-owned">
      
        <h1>Items you Redeemed</h1>
        <div class="filter-bar">
            <input class="search-bar" type="text" placeholder="Search owned..." bind:value={ownedSearch} />
            <select bind:value={ownedSort}>
                <option value="name-asc">Name (A–Z)</option>
                <option value="name-desc">Name (Z–A)</option>
                <option value="price-asc">Price (Low–High)</option>
                <option value="price-desc">Price (High–Low)</option>
            </select>
        </div>
        <div class="owned-container">
            {#if data.ownedItems.length > 0}
            {#each groupedOwnedItems() as item}
                    <div class="redeem-card owned-card">
                        <img src={item.preview_img} alt={item.name} class="redeem-image" />
                        <h2>{item.quantity > 1 ? `${item.quantity}x ${item.name}` : item.name}</h2>
                        <p>Price: <b>{item.price} pts</b> </p>
                    </div>
                {/each}
            {:else}
                <p class="nothing">You have not redeemed any items yet.</p>
            {/if}
        </div>
    </div>
    
</div>
{#if showModal && selectedItem}
<div class="modal-backdrop">
	<div class="modal">
		<h2>Confirm Redemption</h2>
		<p>Are you sure you want to redeem <strong>{selectedItem.name}</strong> for <strong>{selectedItem.price}</strong> points?</p>
		<div class="modal-buttons">
			<button class="yes-redeem" onclick={confirmRedeem}>Yes, Redeem</button>
			<button class="no-reject" onclick={() => { showModal = false; selectedItem = null }}>Cancel</button>
		</div>
	</div>
</div>
{/if}

{#if feedback}
<div class="feedback-banner">
	<p>{feedback}</p>
	<button onclick={() => feedback = null}>×</button>
</div>
{/if}
<style>
    .owned-container {
	/* display: grid; */
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	/* grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); */
	gap: 1rem;
	padding: 1rem;
}

.owned-card {
	background: #eef6f9;
}
    .yes-redeem {
        background-color: #4caf50;
        color: white;
    }
    .yes-redeem:hover {
        background-color: #45a049;
        cursor: pointer;
    }
    .no-reject {
        background-color: #f44336;
        color: white;
    }
	.nothing{
		text-align: center;
		font-size: 1.2rem;
		color: #666;
	}
    .no-reject:hover {
        background-color: #e53935;
        cursor: pointer;
    }
    .redeem-button:hover{
        background-color: #3c413c;
        color: white;
        cursor: pointer;
    }
    .red-button:hover{
        background-color: red;
    }
    .redeem-card.sold-out {
	opacity: 0.5;
	background-color: #ddd;
	position: relative;
}
.search-bar{
    width:auto;
}
.image-wrapper {
	position: relative;
}

.sold-out-banner {
	position: absolute;
	top: 10px;
	left: -40px;
	transform: rotate(-45deg);
	background: red;
	color: white;
	padding: 5px 40px;
	font-weight: bold;
	font-size: 0.9rem;
	z-index: 1;
	pointer-events: none;
	box-shadow: 0 0 5px rgba(0,0,0,0.2);
}
.modal-backdrop {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.4);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.modal {
	background: white;
	padding: 2rem;
	border-radius: 1rem;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	max-width: 400px;
	width: 100%;
	text-align: center;
}

.modal-buttons {
	display: flex;
	justify-content: center;
	gap: 1rem;
	margin-top: 1rem;
}

.modal-buttons button {
	padding: 0.5rem 1rem;
	border-radius: 0.5rem;
	cursor: pointer;
}

.feedback-banner {
	position: fixed;
	top: 1rem;
	right: 1rem;
	background: #4caf50;
	color: white;
	padding: 1rem;
	border-radius: 0.5rem;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	display: flex;
	align-items: center;
	gap: 1rem;
	z-index: 1001;
}

.feedback-banner button {
	background: none;
	color: white;
	border: none;
	font-size: 1.25rem;
	cursor: pointer;
}

    .redeem-header{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
    }
    .point{
        margin-left:4rem ;
        font-size: 1.9rem;
        position: absolute;
        font-weight: bold;
        right:2rem;
    }
.redeem-container {
	/* display: grid; */
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	/* grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); */
	gap: 1rem;
	padding: 1rem;
}
.redeem-card h2 {
	font-size: 1.4rem;
	font-weight: bold;
	margin: 0.5rem 0;
	color: #333;
}

.redeem-card {
	width: 240px;
	background: #f9f9f9;
	padding: 1rem;
	border-radius: 1rem;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
	text-align: center;
}
.filter-bar {
	display: flex;
	gap: 1rem;
	margin: 1rem;
	justify-content: space-between;
	flex-wrap: wrap;
}

.filter-bar input,
.filter-bar select {
    padding: 0.5rem;
	font-size: 1rem;
    background-color: white;
	border-radius: 0.5rem;
	border: 1px solid #ccc;
}

.redeem-image {
	width: 100%;
	height: 150px;
	object-fit: cover;
	border-radius: 0.5rem;
	margin-bottom: 0.5rem;
}
.redeem-button {
	background-color: #4caf50;
	color: white;
	padding: 0.6rem 1rem;
	border: none;
	border-radius: 0.5rem;
	font-size: 1rem;
	font-weight: 600;
	transition: background-color 0.3s ease, transform 0.2s ease;
}

.redeem-button:hover:not(:disabled),
.redeem-button:focus-visible {
	background-color: #388e3c;
	transform: scale(1.05);
	cursor: pointer;
}

.red-button {
	background-color: #ff9800;
}

.red-button:hover:not(:disabled),
.red-button:focus-visible {
	background-color: #f57c00;
	transform: scale(1.05);
	cursor: pointer;
}
.redeem-card p {
	margin: 0.25rem 0;
	color: #555;
}
</style>
