<script lang="ts">
	import * as monaco from 'monaco-editor';

	import './theme.ts';
	import './completion';

	let { value = $bindable() } = $props();
	let editorElement: HTMLElement;
	let editor: any;
	let completionProvider: monaco.IDisposable;

	function initMonaco() {
		if (editorElement) {
			editor = monaco.editor.create(editorElement, {
				value: value,
				language: 'clickhouse',
				theme: 'agnostic',
				automaticLayout: true,
				scrollbar: {
					vertical: 'hidden',
					horizontal: 'hidden'
				},
				quickSuggestions: true,
				suggestOnTriggerCharacters: true,
				minimap: {
					enabled: false
				},
				lineNumbers: 'on',
				lineNumbersMinChars: 4,
				lineDecorationsWidth: 5,
				fontSize: 11,
				find: {
					addExtraSpaceOnTop: false,
					autoFindInSelection: 'never',
					seedSearchStringFromSelection: 'never'
				}
			});

			editor.onDidChangeModelContent(() => {
				value = editor.getValue();
			});
		}
	}

	$effect(() => {
		if (!editor && editorElement) {
			initMonaco();
		}
	});

	$effect(() => {
		if (editor && editor.getValue() !== value) {
			editor.setValue(value);
		}
	});
</script>

<div bind:this={editorElement}></div>

<style>
	div {
		height: 100%;
		width: 100%;
	}
</style>
