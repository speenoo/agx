import { invoke } from "@tauri-apps/api/tauri";

export async function exec(query: string) {
    try {
        const r: string = await invoke("query", {
            query,
            udfs: "", // @todo: add it to the config
        });
        return JSON.parse(r);
    } catch (e) {
        console.error(e);
        return {};
    }
}

export type CHResponse = {
    meta: [{ name: string; type: string }];
    data: Array<{ [key: string]: any }>;
} | undefined
