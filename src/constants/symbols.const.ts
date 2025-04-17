/**
 * A collection of unique symbols used across the application for dependency injection
 * or other purposes requiring globally unique identifiers.
 */
export const SYMBOLS = {
    /**
     * Symbol used to identify the singleton container in the core separation module.
     */
    SingltonContainer: Symbol.for("symbol.singleton.coresep"),
};