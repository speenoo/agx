<script lang="ts">
    import Table from "$lib/table.svelte";
    import Schema from "$lib/schema.svelte";
    import Editor from "$lib/editor.svelte";
    import type { CHResponse } from "$lib/query";

    let response: CHResponse = $state.raw(undefined);
</script>

<section class="screen">
    <Schema />
    <section class="right">
        <Editor bind:response />
        <Table {response} />
    </section>
</section>

<style>
    .screen {
        display: flex;
        height: 100vh;
    }

    .right {
        flex-grow: 1;
    }
</style>
