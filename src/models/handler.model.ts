export type Handler<TModel, TResult> = ((model: TModel) => TResult) | (() => TResult);
