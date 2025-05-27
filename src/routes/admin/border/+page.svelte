<script lang="ts">
  import { enhance } from '$app/forms';
    import type { ActionData, PageData } from './$types';

    const { data, form: actionResultForm } = $props<{
        data: PageData;
        form: ActionData;
    }>();
    const today = new Date().toISOString().split('T')[0];
    console.log('Page data:', data);    
</script>
<div class="real-home">
    <div class="home">
        <h1 class="creation-tit">Insert Border Creation</h1>
        <form method="post" use:enhance class="creation-form">
            <div class="form-group">
                <label for="userId">User</label>
                <select name="userId" id="userId">
                    {#each data.users as user}
                         <option value={user.id}>{user.username}</option>
                    {/each}
                </select>
            </div>
            <div class="form-group">
                <label for="date">Date</label>
                <input type="date" name="date" id="date" required value={today} />
            </div>
            <div class="form-group">
                <label for="title">Title</label>

            </div>
        </form>
    </div>
</div>

                                   