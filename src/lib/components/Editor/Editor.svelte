<script lang="ts">
	import type { ColumnDescriptor } from '$lib/ch-engine';
	import { sql } from '@codemirror/lang-sql';
	import { Compartment, EditorState } from '@codemirror/state';
	import { EditorView, keymap, placeholder } from '@codemirror/view';
	import { untrack } from 'svelte';
	import './codemirror.css';
	import { default_extensions, default_keymaps } from './extensions';
	import { ProxyDialect } from './SQLDialect';
	import { schema_to_completions } from './utils';

	type Props = {
		value: string;
		onExec?: () => unknown;
		schema?: { [table_name: string]: ColumnDescriptor[] };
	};

	let { value = $bindable(''), onExec, schema = {} }: Props = $props();

	let container: HTMLDivElement;
	let editor_view: EditorView;
	const dialect_compartment = new Compartment();
	const sql_schema = $derived(schema_to_completions(schema));

	$effect(() => {
		editor_view = new EditorView({ parent: container });

		const state = EditorState.create({
			doc: untrack(() => value),
			extensions: [
				...default_extensions,
				default_keymaps,
				EditorView.darkTheme.of(true),
				dialect_compartment.of(sql({ dialect: ProxyDialect, schema: untrack(() => sql_schema) })),
				EditorView.updateListener.of((update) => {
					if (update.docChanged) {
						value = update.state.doc.toString();
					}
				}),
				placeholder('Enter a query...'),
				keymap.of([
					{
						key: 'Mod-Enter',
						run: () => {
							onExec?.();
							return true;
						}
					}
				])
			]
		});

		editor_view.setState(state);

		return () => editor_view.destroy();
	});

	$effect(() => {
		if (editor_view && value !== editor_view.state.doc.toString()) {
			editor_view.dispatch({
				changes: { from: 0, to: editor_view.state.doc.length, insert: value }
			});
		}
	});

	$effect(() => {
		if (editor_view) {
			editor_view.dispatch({
				effects: dialect_compartment.reconfigure(sql({ dialect: ProxyDialect, schema: sql_schema }))
			});
		}
	});
</script>

<div bind:this={container}></div>

<style>
	div {
		width: 100%;
		height: 100%;
		padding: 7px 2px;
		background-color: hsl(0deg 0% 5%);
	}
</style>
