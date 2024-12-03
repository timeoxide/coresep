import { Handler } from "./handler.model";

export interface Command<TModel = void, TResult = void, TMeta = any> {
    name: string,
    version?: string,
    meta: TMeta,
    handler: (Handler<TModel, TResult>) | (() => Promise<Handler<TModel, TResult>>)
}