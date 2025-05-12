<script lang="ts">
	import * as monaco from 'monaco-editor';

	import { onDestroy } from 'svelte';
	import './language';
	import './theme';

	interface Props {
		value?: string;
		onCmdClick?: (word: string) => void;
		linkables?: string[];
	}

	let { value = $bindable(''), onCmdClick, linkables }: Props = $props();
	let editorElement: HTMLElement;
	let editor: monaco.editor.IStandaloneCodeEditor;

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
				minimap: { enabled: false },
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

			editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
				window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', metaKey: true }));
				return false;
			});

			editor.onMouseDown((e) => {
				const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
				const isMetaKey = isMac ? e.event.metaKey : e.event.ctrlKey;

				if (isMetaKey && e.target.type === monaco.editor.MouseTargetType.CONTENT_TEXT) {
					const position = e.target.position;
					const model = editor.getModel();
					const word = model?.getWordAtPosition(position);

					if (word) {
						const range = new monaco.Range(
							position.lineNumber,
							word.startColumn,
							position.lineNumber,
							word.endColumn
						);
						const text = model!.getValueInRange(range);
						if (linkables?.includes(text)) {
							onCmdClick?.(text);
							editor.setSelection(range);
						}
					}
				}
			});

			let ids: string[] = [];

			editor.onMouseMove((e) => {
				const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
				const isMetaKey = isMac ? e.event.metaKey : e.event.ctrlKey;
				if (e.target.type !== monaco.editor.MouseTargetType.CONTENT_TEXT) return;
				const model = editor.getModel();
				if (!model) return;
				const position = e.target.position;
				const word = model.getWordAtPosition(position);
				const decorations: monaco.editor.IModelDeltaDecoration[] = [];

				if (word && isMetaKey && linkables?.includes(word.word)) {
					const range = new monaco.Range(
						position.lineNumber,
						word.startColumn,
						position.lineNumber,
						word.endColumn
					);

					decorations.push({
						options: {
							inlineClassName: 'to-go-def',
							hoverMessage: { value: 'Command+Click to go to definition' }
						},
						range
					});
				}

				ids = model.deltaDecorations(ids, decorations);
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

	onDestroy(() => {
		if (editor) editor.dispose();
	});
</script>

<div bind:this={editorElement}></div>

<style>
	div {
		height: 100%;
		width: 100%;

		& :global(.to-go-def) {
			color: #007acc;
			text-decoration: underline;
			cursor: pointer;
		}
	}
</style>
