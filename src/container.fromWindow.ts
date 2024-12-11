import { ICrsContainer } from "./abstractions";

export function container(): ICrsContainer {
    return (window as any).crs;
}