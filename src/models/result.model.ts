export interface Result<TResult> {
    success: boolean,
    errors?: Array<Error>,
    result?: TResult
}