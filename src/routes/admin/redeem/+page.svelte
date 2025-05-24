<script lang="ts">
	import Header from './../../Header.svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>
<div class="real-home">
    <Header/>
    <div class="home">
        
    </div>
</div>