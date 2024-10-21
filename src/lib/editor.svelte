<script lang="ts">
    import { onMount } from "svelte";
    import { exec, type CHResponse } from "./query";

    let { response = $bindable() }: { response: CHResponse } = $props();
    let query = $state.raw("");

    onMount(() => {
        let handleKeyDown = async function (event: KeyboardEvent) {
            if (event.code === "Enter" && event.metaKey) {
                response = await exec(query);
                console.log(response);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    });
</script>

<textarea id="greet-input" placeholder="Enter a query..." bind:value={query}
></textarea>

<style>
    textarea {
        display: block;
        width: 100%;
        font-family: monospace;
        height: 50vh;
        background: black;
        border: none;
        resize: none;
        padding: 2px;
        color: white;
        outline: none;
        border: none;
    }
</style>
