import { container } from "./container.fromWindow";

export async function invoke<TModel = any | undefined, TResult = any>(name: string, model?: TModel): Promise<TResult> {
    return await container().invoke(name, model);
}