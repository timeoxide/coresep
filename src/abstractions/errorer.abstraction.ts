/** 
 * 
 * The _not-so-graceful_ error manager.
 * used to lookup errors by code, add context and throw them.
 * The error codes could be looked up through `ERRORS` constants.
 * 
 * ---
 * ## **Example Usage:**
 * ```
 * ...
 * 
 * errorer
 *      .select("0x0404")
 *      .withContext('Command not found: myCommand')
 *      .throw();
 * ...
 * ```
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