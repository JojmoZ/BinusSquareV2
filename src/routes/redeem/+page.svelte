<script lang="ts">
	import Header from './../Header.svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
    let showModal = $state<boolean>(false);
    let selectedItem = $state<{ id: number; name: string; price: number } | null>(null);
    let feedback=  $state<string | null>(null);
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

		data.user.point -= selectedItem.price;
		const item = data.items.find((i) => i.id === selectedItem?.id);
		if (item) item.stock -= 1;
	}

	showModal = false;
	selectedItem = null;
}
    async function redeemItem(itemId: number, itemName: string, itemPrice: number) {
	const confirmed = confirm(`Are you sure you want to redeem "${itemName}" for ${itemPrice} points?`);
	if (!confirmed) return;

	const form = new FormData();
	form.append("itemId", itemId.toString());

	const res = await fetch("?/redeemItem", {
		method: "POST",
		body: form
	});

	const result = await res.json();

	if (result?.error) {
		alert(result.error);
	} else {
		alert(result.message);

		data.user.point -= itemPrice;
		const item = data.items.find((i) => i.id === itemId);
		if (item) {
			item.stock--;
		}
	}
}

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
            <div class="redeem-card {item.stock <= 0 ? 'sold-out' : ''}">
                <div class="image-wrapper">
                    <img src={item.preview_img} alt={item.name} class="redeem-image" />
                    {#if item.stock <= 0}
                        <div class="sold-out-banner">SOLD OUT</div>
                    {/if}
                </div>
                <h2>{item.name}</h2>
                <p>Price: {item.price} pts</p>
                <p>Stock: {item.stock}</p>
                <button
	onclick={() => openRedeemModal(item.id, item.name, item.price)}
	disabled={item.stock <= 0 || data.user.point < item.price}
>
	Redeem
</button>
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
{#if showModal && selectedItem}
<div class="modal-backdrop">
	<div class="modal">
		<h2>Confirm Redemption</h2>
		<p>Are you sure you want to redeem <strong>{selectedItem.name}</strong> for <strong>{selectedItem.price}</strong> points?</p>
		<div class="modal-buttons">
			<button onclick={confirmRedeem}>Yes, Redeem</button>
			<button onclick={() => { showModal = false; selectedItem = null }}>Cancel</button>
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
    .redeem-card.sold-out {
	opacity: 0.5;
	background-color: #ddd;
	position: relative;
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
