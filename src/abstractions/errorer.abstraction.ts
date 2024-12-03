
/** 
 * 
 * The _not-so-gracefull_ error manager.
 * used to lookup errors by code, add context and throw them.
 */
export interface IErrorer {

    /**
     * throws the selected error.
     */
    throw(): void;

    /**
     * selects the error by code, can use the constans of `ERRORS` to look up the codes.
     * @param code code of the error.
     */
    select(code: string): IErrorer;

    /**
     * addes `message` to the error stack.
     * @param message the message to add to context.
     */
    withContext(message: string): IErrorer;
}