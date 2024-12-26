import { invoke } from "../src";

export async function callCommand() {
    const res1 = await invoke("myFirstCommand");
}