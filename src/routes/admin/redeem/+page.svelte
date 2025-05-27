<script lang="ts">
    import Header from './../../Header.svelte';
    import { enhance } from '$app/forms';
    import type { PageData, ActionData } from './$types';
    import type { ActionResult } from '@sveltejs/kit';

    const { data, form: actionResultForm } = $props<{
        data: PageData;
        form: ActionData;
    }>();

    let items = $state(data.items);

    
    let searchTerm = $state('');
    let statusFilter = $state('all'); 

    
    let filteredItems = $derived(
        items.filter((item: any) => { 
            const matchesSearchTerm = item.itemname.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
            return matchesSearchTerm && matchesStatus;
        })
    );

    async function updateStock(itemId: string, currentStock: number, change: number) {
        const newStock = currentStock + change;
        if (newStock < 0) return;

        const formData = new FormData();
        formData.append("id", itemId);
        formData.append("stock", newStock.toString());

        try {
            const response = await fetch(`?/updateStock`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                console.error("Failed to update stock on server");
                return;
            }

            const item = items.find((i: any) => i.id === itemId);
            if (item) {
                item.stock = newStock;
                item.status = newStock === 0 ? "inactive" : "active";
            }
        } catch (error) {
            console.error("Error updating stock:", error);
        }
    }

    const handleInsertItemSubmit = () => {
        return async ({ result, formElement }: { result: ActionResult; formElement: HTMLFormElement }) => {
            if (result.type === 'success' && result.data?.newItem) {
                const newItem = result.data.newItem as (typeof items)[0];
                items.push(newItem); 
                formElement.reset();
            }
        };
    };
</script>

<h1 class="form-title">Insert New Redeemable Item</h1>

<form
    method="POST"
    action="?/insertItem"
    enctype="multipart/form-data"
    use:enhance={handleInsertItemSubmit}
    class="redeem-form"
>
    <div class="form-group">
        <label for="itemName">Item Name</label>
        <input type="text" name="itemName" id="itemName" required />
    </div>

    <div class="form-group">
        <label for="itemStock">Stock</label>
        <input type="number" name="itemStock" id="itemStock" min="0" required />
    </div>

    <div class="form-group">
        <label for="itemPrice">Price</label>
        <input type="number" name="itemPrice" id="itemPrice" min="0" required />
    </div>

    <div class="form-group">
        <label for="itemPreviewImg">Preview Image</label>
        <input type="file" name="itemPreviewImg" id="itemPreviewImg" accept="image/*" required />
    </div>

    <button type="submit" class="submit-button">Insert Item</button>

    {#if actionResultForm?.message}
        <p class="success-message">{actionResultForm.message}</p>
    {/if}
    {#if actionResultForm?.error}
        <p class="error-message">{actionResultForm.error}</p>
    {/if}
</form>

<hr class="section-divider" />

<h2 class="items-heading">Current Items</h2>

<div class="item-filters">
    <div class="form-group">
        <label for="searchInput">Search by Name</label>
        <input type="text" id="searchInput" bind:value={searchTerm} placeholder="Enter item name..." />
    </div>
    <div class="form-group">
        <label for="statusFilterInput">Filter by Status</label>
        <select id="statusFilterInput" bind:value={statusFilter}>
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
        </select>
    </div>
</div>

<div class="item-list">
    {#if filteredItems.length > 0}
        {#each filteredItems as item (item.id)}
            <div class="item-card">
                <img src={item.preview_img} alt={item.itemname} class="item-image" />
                <div class="item-info">
                    <h3>{item.itemname}</h3>
                    <p>Status: <strong>{item.status}</strong></p>
                    <p>Price: {item.price}</p>
                </div>
                <div class="counter">
                    <button
                        class="reduce"
                        onclick={() => updateStock(item.id, item.stock, -1)}
                        disabled={item.stock <= 0}
                    >
                        −
                    </button>
                    <p>Stock: {item.stock}</p>
                    <button
                        class="increase"
                        onclick={() => updateStock(item.id, item.stock, 1)}
                    >
                        +
                    </button>
                </div>
            </div>
        {/each}
    {:else}
        <p class="no-items-message">No items match your current search or filter criteria.</p>
    {/if}
</div>

<style>
    .reduce:hover{
        background-color: #5e5757;
        color: white;
        cursor:pointer;
    }
    .increase:hover{
        background-color: #5e5757;
        color: white;
        cursor:pointer;
    }
.counter {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    .form-title {
        text-align: center;
        margin-bottom: 1.5rem;
        font-size: 1.75rem;
        color: #333;
    }
    .redeem-form {
        background: linear-gradient(135deg, #f6f8fa, #e8edf3);
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        max-width: 500px;
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
        box-sizing: border-box; 
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
    .items-heading {
        text-align: center;
        margin: 2rem 0 1rem;
        font-size: 1.5rem;
        color: #444;
    }

    .section-divider {
        border: 0;
        height: 1px;
        background: #e0e0e0;
        margin: 2rem 0;
    }

    
    .item-filters {
        display: flex;
        gap: 1rem; 
        margin: 0 auto 1.5rem auto; 
        padding: 1rem;
        background-color: #f9f9f9;
        border-radius: 0.75rem;
        max-width: 700px; 
        flex-wrap: wrap; 
    }

    .item-filters .form-group {
        flex: 1; 
        min-width: 200px; 
    }

    .item-filters label {
        font-size: 0.9rem;
    }

    .item-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        padding: 1rem;
        max-width: 1000px;
        margin: 0 auto;
    }
    .item-card {
        background: #fff;
        border-radius: 0.75rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 1rem;
        transition: transform 0.2s ease;
    }
    .item-card:hover {
        transform: translateY(-4px);
    }
    .item-image {
        width: 100%;
        max-height: 160px;
        object-fit: cover;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
    }
    .item-info h3 {
        margin: 0.5rem 0;
        color: #2c3e50;
    }
    .item-info p {
        margin: 0.25rem 0;
        font-size: 0.95rem;
    }
    .no-items-message {
        text-align: center;
        grid-column: 1 / -1; 
        padding: 2rem;
        color: #555;
    }
</style>