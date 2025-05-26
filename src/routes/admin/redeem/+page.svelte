<script lang="ts">
    import Header from './../../Header.svelte';
    import { enhance } from '$app/forms';
    import type { PageData, ActionData } from './$types';
    import type { ActionResult } from '@sveltejs/kit'; // Import ActionResult

    // Use a different name for the prop to avoid conflict with HTMLFormElement in enhance callback
    const { data, form: actionResultForm } = $props<{
        data: PageData;
        form: ActionData; // This will hold the result of the last action (e.g., message, error, newItem)
    }>();

    let items = $state(data.items);

    async function updateStock(itemId: string, currentStock: number, change: number) {
        const newStock = currentStock + change;
        if (newStock < 0) return;

        const formData = new FormData(); // Renamed to avoid confusion
        formData.append("id", itemId);
        formData.append("stock", newStock.toString());

        try {
            const response = await fetch(`?/updateStock`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                // Handle server error if needed, e.g., show a toast
                console.error("Failed to update stock on server");
                return;
            }

            // Optimistically update local UI
            const item = items.find((i: any) => i.id === itemId);
            if (item) {
                item.stock = newStock;
                item.status = newStock === 0 ? "inactive" : "active";
            }
        } catch (error) {
            console.error("Error updating stock:", error);
        }
    }

    // Define the callback for the insertItem form's enhance
    const handleInsertItemSubmit = () => {
        return async ({ result, formElement }: { result: ActionResult; formElement: HTMLFormElement }) => {
            // `result` is the ActionResult from your server action.
            // `result.data` will be your ActionData if the action was successful.

            if (result.type === 'success' && result.data?.newItem) {
                const newItem = result.data.newItem as (typeof items)[0]; // Cast to your item's type

                // Add the new item to your local $state array
                // Svelte 5 $state arrays can be mutated directly, and Svelte will react.
                items.push(newItem);
                // Alternatively: items = [...items, newItem];

                // Reset the form fields
                formElement.reset();

                // The `actionResultForm` prop will be automatically updated by SvelteKit
                // with the result of the action. So, messages like `actionResultForm.message`
                // will be displayed by your existing template logic.
            }
            // If result.type === 'failure', actionResultForm.error will be set by SvelteKit
            // and displayed by your {#if actionResultForm?.error} block.
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

<h2 class="items-heading">Current Items</h2>
<div class="item-list">
    {#each items as item (item.id)} <div class="item-card">
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
</div>

<style>
    /* Your existing styles */
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
</style>