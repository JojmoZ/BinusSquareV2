<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData, PageData } from './$types';
    import type { ActionResult } from '@sveltejs/kit'; 

    let selectedFile = $state<File | null>(null);
    let fileURL = $state<string | null>(null);

    function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input?.files && input.files.length > 0) {
            selectedFile = input.files[0];
            if (fileURL) URL.revokeObjectURL(fileURL); 
            fileURL = URL.createObjectURL(selectedFile);
        } else {
            selectedFile = null;
            if (fileURL) URL.revokeObjectURL(fileURL);
            fileURL = null;
        }
    }

    
    type CreationDetailItem = {
        id: number;
        date: string | Date; 
        category: string;
        file: string;
        title: string;
    };

    const { data, form: actionResultForm } 
        = $props<{
            data: PageData & { creationDetail?: CreationDetailItem[] }; 
            form: ActionData; 
        }>();

    const today = new Date().toISOString().split('T')[0];

    
    let creations = $state<CreationDetailItem[]>(data.creationDetail || []);
    let searchTerm = $state('');

    
    let filteredCreations = $derived(
        creations.filter((creation: CreationDetailItem) => {
            const matchesSearchTerm = creation.title.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearchTerm;
        })
    );

    
    const handleInsertSubmit = () => {
        return async ({ result, formElement }: { result: ActionResult; formElement: HTMLFormElement }) => {
            
            if (result.type === 'success' && result.data?.creationDetail) {
                
                const newCreationItem = result.data.creationDetail as CreationDetailItem;

                
                creations.push(newCreationItem);
                

                
                formElement.reset();
                
                selectedFile = null;
                if (fileURL) URL.revokeObjectURL(fileURL);
                fileURL = null;

                
                
            }
            
        };
    };

</script>

<div class="real-home">
    <div class="home">
        <h1 class="creation-title">Insert Border Creation</h1>
        <form method="post" action="?/insertCreation" enctype="multipart/form-data" use:enhance={handleInsertSubmit} class="creation-form">
            <div class="form-group">
                <label for="userId">User</label>
                <select name="userId" id="userId" required>
                    {#if data.users && data.users.length > 0}
                        {#each data.users as user}
                            <option value={user.id}>{user.username}</option>
                        {/each}
                    {:else}
                        <option value="" disabled>No users available</option>
                    {/if}
                </select>
            </div>
            <div class="form-group">
                <label for="date">Date</label>
                <input type="date" name="date" id="date" required value={today} />
            </div>
            <div class="form-group">
                <label for="title">Title</label>
                <input type="text" name="title" id="title" required />
            </div>
            <div class="form-group">
                <label for="category">Category</label>
                <input type="text" name="category" id="category" required />
            </div>
            <div class="form-group">
                <label for="file">Upload File:</label>
                <input
                    type="file"
                    name="file"
                    id="file"
                    accept=".pdf,.doc,.docx,.txt,image/*" required
                    onchange={handleFileChange}
                />

                {#if selectedFile}
                    <p class="file-preview">
                        Selected: <strong>{selectedFile.name}</strong> ({selectedFile.type || 'unknown type'})
                    </p>

                    {#if selectedFile.type === 'application/pdf' && fileURL}
                        <iframe title="PDF Preview" src={fileURL} width="100%" height="400px" class="file-frame"></iframe>
                    {:else if selectedFile.type.startsWith('image/') && fileURL}
                        <img src={fileURL} alt="Image Preview" class="file-image-preview" />
                    {:else if fileURL}
                        <p class="file-preview-note">Preview not available for this file type. <a href={fileURL} target="_blank" rel="noopener noreferrer">Download Link</a></p>
                    {/if}
                {/if}
            </div>
            <button type="submit" class="submit-button">Insert</button>

            {#if actionResultForm?.message}
                <p class="success-message">{actionResultForm.message}</p>
            {/if}
            {#if actionResultForm?.error}
                <p class="error-message">{actionResultForm.error}</p>
            {/if}
        </form>
    </div>
    <hr class="section-divider">
    <h2 class="items-heading">Creation Collections</h2>

    <div class="item-filters">
        <div class="form-group">
            <label for="searchInput">Search by Title</label>
            <input type="text" id="searchInput" bind:value={searchTerm} placeholder="Enter Creation Title..." />
        </div>
    </div>
    <div class="creation-list">
        {#if filteredCreations.length > 0}
            {#each filteredCreations as creation (creation.id)} <div class="creation-card">
                    <h3>{creation.title}</h3>
                    <p><strong>Category:</strong> {creation.category}</p>
                    <p><strong>Date:</strong> {new Date(creation.date).toLocaleDateString()}</p>
                    <a
                        class="view-file"
                        href={creation.file.startsWith('/') ? creation.file : `/${creation.file}`}
                        target="_blank"
                        rel="noopener noreferrer" >
                        📄 View File
                    </a>
                </div>
            {/each}
        {:else}
            <p class="no-items-message">No border creations found matching your search, or none exist yet.</p>
        {/if}
    </div>
</div>

<style>
    /* ... your existing styles ... */
    .file-image-preview {
        max-width: 100%;
        max-height: 300px;
        margin-top: 10px;
        border: 1px solid #eee;
        border-radius: 4px;
    }
    .file-frame {
        margin-top: 10px;
        border: 1px solid #ccc;
    }
    .no-items-message {
        text-align: center;
        padding: 1rem;
        color: #777;
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
    .creation-title {
        text-align: center;
        margin-bottom: 1.5rem;
        font-size: 1.75rem;
        color: #333;
    }
    .real-home {
        min-height: 100vh;
        display: flex;
        flex-direction: column; /* Changed to column for overall layout */
        /* justify-content: center;  Removed for top-to-bottom flow */
        /* align-items: center; Removed for top-to-bottom flow */
        padding: 1rem; /* Added padding for overall real-home */
    }
    .home { /* Added to wrap the form part */
        width: 100%;
        max-width: 520px; /* Max width for the form area */
        margin: 0 auto; /* Center the form area */
    }
    .creation-form {
        background: linear-gradient(135deg, #f5f7fa, #e8edf3);
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        /* max-width is handled by .home parent now */
        /* margin: 2rem auto; */
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
        transition: border-color 0.2s;
        box-sizing: border-box; /* Good for layout */
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
        margin-top: 0.5rem;
    }
    .error-message {
        color: #c62828;
        text-align: center;
        font-weight: 500;
        margin-top: 0.5rem;
    }
    .creation-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Slightly wider cards */
        gap: 1.5rem;
        padding: 1rem;
        max-width: 1200px; /* Wider list container */
        margin: 0 auto;
    }
    .creation-card {
        background: #fff;
        border-radius: 0.75rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        padding: 1.25rem; /* Increased padding */
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .creation-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
    }
    .creation-card h3 {
        margin-top: 0; /* Remove default top margin */
        margin-bottom: 0.75rem; /* Spacing after title */
        color: #2c3e50;
        font-size: 1.15rem; /* Slightly larger title */
    }
    .creation-card p {
        margin: 0.3rem 0;
        font-size: 0.9rem; /* Slightly smaller paragraph text */
        color: #555; /* Softer text color */
        line-height: 1.5;
    }
    .view-file {
        margin-top: 0.75rem; /* More space above link */
        padding: 0.5rem 0; /* Make clickable area slightly larger */
        color: #1976d2;
        font-weight: 600;
        text-decoration: none;
        display: inline-block; /* For padding to take effect nicely */
        border-radius: 4px;
        transition: background-color 0.2s;
    }
    .view-file:hover {
        text-decoration: underline;
        /* background-color: #e3f2fd; Light blue background on hover */
    }
    .file-preview {
        font-size: 0.9rem;
        margin-top: 0.75rem;
        color: #333;
        /* font-style: italic; */
    }
    .section-divider {
        border: 0;
        height: 1px;
        background-color: #e0e0e0;
        margin: 2.5rem 0; /* More spacing around divider */
    }
    .items-heading {
        text-align: center;
        margin-bottom: 1.5rem; /* Space after heading */
        font-size: 1.6rem; /* Slightly larger */
        color: #333;
    }
</style>