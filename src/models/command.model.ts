import { Handler } from "./handler.model";

export interface Command<TModel = any, TResult = any, TMeta = any> {
    name: string,
    version?: string,
    meta?: TMeta,
    handler: (Handler<TModel, TResult>) | (() => Promise<Handler<TModel, TResult>>)
}